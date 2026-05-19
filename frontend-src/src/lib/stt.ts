// Dual-path speech-to-text for the notes mic button.
//
// Primary path: browser Web Speech API (`SpeechRecognition`). Works on
// desktop Chromium/Safari without any HA-side configuration.
// Fallback path: HA's `assist_pipeline/run` WS API (STT-only stage).
// Required for the HA Companion app on Android (WebView has no
// SpeechRecognition) and for Firefox. Assumes the user has an STT engine
// configured in their preferred Assist pipeline.

export interface SttController {
    /** Signal end of audio and resolve with the final transcript. */
    stop(): Promise<{ text: string }>;
    /** Tear down without waiting for a result. */
    abort(): void;
}

export function canUseWebSpeech(): boolean {
    const w = window as any;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function canUseAssistStt(hass: any): boolean {
    return Boolean(
        hass?.connection &&
            typeof navigator !== "undefined" &&
            (navigator as any).mediaDevices?.getUserMedia &&
            (window as any).AudioWorkletNode
    );
}

export async function startWebSpeech(): Promise<SttController> {
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) throw new Error("SpeechRecognition not supported");

    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = navigator.language || "en-US";

    let resolveFn: (r: { text: string }) => void = () => {};
    let rejectFn: (err: any) => void = () => {};
    const done = new Promise<{ text: string }>((res, rej) => {
        resolveFn = res;
        rejectFn = rej;
    });

    let finished = false;
    rec.onresult = (e: any) => {
        if (finished) return;
        finished = true;
        const text = Array.from(e.results as any[])
            .map((r) => r[0]?.transcript ?? "")
            .join(" ")
            .trim();
        resolveFn({ text });
    };
    rec.onerror = (e: any) => {
        if (finished) return;
        finished = true;
        rejectFn(new Error(e?.error ?? "speech-recognition error"));
    };
    rec.onend = () => {
        if (finished) return;
        finished = true;
        resolveFn({ text: "" });
    };

    rec.start();

    return {
        stop: async () => {
            try {
                rec.stop();
            } catch {
                // ignore — already stopped or never started
            }
            return done;
        },
        abort: () => {
            try {
                rec.abort();
            } catch {
                // ignore
            }
        }
    };
}

const PCM_WORKLET_SRC = `
class PcmWorklet extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && input[0].length) {
      const samples = input[0];
      const pcm = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
    }
    return true;
  }
}
registerProcessor("bt-pcm-worklet", PcmWorklet);
`;

export async function startAssistStt(hass: any): Promise<SttController> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const AudioCtor: typeof AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtor({ sampleRate: 16000 });

    const blobUrl = URL.createObjectURL(
        new Blob([PCM_WORKLET_SRC], { type: "text/javascript" })
    );
    try {
        await ctx.audioWorklet.addModule(blobUrl);
    } finally {
        URL.revokeObjectURL(blobUrl);
    }

    const source = ctx.createMediaStreamSource(stream);
    const worklet = new AudioWorkletNode(ctx, "bt-pcm-worklet");
    source.connect(worklet);

    let handlerId: number | undefined;
    let unsub: (() => void) | undefined;
    let resolveFn: (r: { text: string }) => void = () => {};
    let rejectFn: (err: any) => void = () => {};
    const done = new Promise<{ text: string }>((res, rej) => {
        resolveFn = res;
        rejectFn = rej;
    });
    let finished = false;

    const cleanup = () => {
        try {
            worklet.port.onmessage = null as any;
        } catch {
            // ignore
        }
        try {
            worklet.disconnect();
        } catch {
            // ignore
        }
        try {
            source.disconnect();
        } catch {
            // ignore
        }
        try {
            stream.getTracks().forEach((t) => t.stop());
        } catch {
            // ignore
        }
        try {
            ctx.close();
        } catch {
            // ignore
        }
        try {
            unsub?.();
        } catch {
            // ignore
        }
    };

    const finish = (text: string) => {
        if (finished) return;
        finished = true;
        cleanup();
        resolveFn({ text });
    };
    const fail = (err: any) => {
        if (finished) return;
        finished = true;
        cleanup();
        rejectFn(err);
    };

    try {
        unsub = await hass.connection.subscribeMessage(
            (event: any) => {
                const type = event?.type;
                if (type === "run-start") {
                    handlerId =
                        event?.data?.runner_data?.stt_binary_handler_id;
                    worklet.port.onmessage = (msg: MessageEvent) => {
                        if (handlerId == null || finished) return;
                        const bytes = new Uint8Array(msg.data as ArrayBuffer);
                        const frame = new Uint8Array(bytes.length + 1);
                        frame[0] = handlerId;
                        frame.set(bytes, 1);
                        try {
                            hass.connection.socket?.send(frame);
                        } catch {
                            // ignore
                        }
                    };
                } else if (type === "stt-end") {
                    const text = event?.data?.stt_output?.text ?? "";
                    finish(text);
                } else if (type === "error") {
                    fail(
                        new Error(
                            event?.data?.message ?? "assist_pipeline error"
                        )
                    );
                }
            },
            {
                type: "assist_pipeline/run",
                start_stage: "stt",
                end_stage: "stt",
                input: { sample_rate: 16000 }
            }
        );
    } catch (err) {
        cleanup();
        throw err;
    }

    return {
        stop: async () => {
            // Race: user stopped before `run-start` delivered the handler id.
            // No way to send EOF, so the pipeline will never emit `stt-end`
            // and `done` would hang. Tear down and resolve with empty text.
            if (handlerId == null && !finished) {
                finish("");
                return done;
            }
            if (handlerId != null && !finished) {
                try {
                    hass.connection.socket?.send(new Uint8Array([handlerId]));
                } catch {
                    // ignore
                }
            }
            try {
                worklet.port.onmessage = null as any;
            } catch {
                // ignore
            }
            try {
                stream.getTracks().forEach((t) => t.stop());
            } catch {
                // ignore
            }
            return done;
        },
        abort: () => {
            if (finished) return;
            finished = true;
            cleanup();
            resolveFn({ text: "" });
        }
    };
}
