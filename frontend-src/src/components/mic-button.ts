// Mic button that transcribes speech into the adjacent `<input name="notes">`.
//
// Tries `SpeechRecognition` first (browser-side, no HA STT needed). Falls back
// to HA's assist_pipeline STT (`lib/stt.ts`) so it works in the HA Companion
// app on Android (whose WebView lacks SpeechRecognition) and in Firefox.
// Hides itself if neither path is available.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
    canUseAssistStt,
    canUseWebSpeech,
    startAssistStt,
    startWebSpeech,
    type SttController
} from "../lib/stt";

@customElement("bt-mic-button")
export class MicButton extends LitElement {
    @property({ attribute: false }) hass?: any;

    @state() private _state: "idle" | "listening" | "transcribing" = "idle";

    private _controller?: SttController;

    private get _supported(): boolean {
        return canUseWebSpeech() || canUseAssistStt(this.hass);
    }

    private _findNotesInput(): HTMLInputElement | null {
        const form = this.closest("form");
        return form?.querySelector<HTMLInputElement>('input[name="notes"]') ?? null;
    }

    private _appendTranscript(text: string): void {
        const t = text.trim();
        if (!t) return;
        const input = this._findNotesInput();
        if (!input) return;
        const existing = input.value.trim();
        input.value = existing ? `${existing} ${t}` : t;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    private async _start(): Promise<void> {
        this._state = "listening";
        try {
            this._controller = canUseWebSpeech()
                ? await startWebSpeech()
                : await startAssistStt(this.hass);
        } catch (err) {
            console.warn("babytracker: mic start failed", err);
            this._controller = undefined;
            this._state = "idle";
        }
    }

    private async _stop(): Promise<void> {
        const controller = this._controller;
        this._controller = undefined;
        if (!controller) {
            this._state = "idle";
            return;
        }
        this._state = "transcribing";
        try {
            const { text } = await controller.stop();
            this._appendTranscript(text);
        } catch (err) {
            console.warn("babytracker: mic stop failed", err);
        }
        this._state = "idle";
    }

    private _onClick = async (e: MouseEvent): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();
        if (this._state === "idle") {
            await this._start();
        } else if (this._state === "listening") {
            await this._stop();
        }
    };

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this._controller?.abort();
        this._controller = undefined;
    }

    render(): TemplateResult {
        if (!this._supported) return html``;
        const labels = {
            idle: "Voice input",
            listening: "Stop recording",
            transcribing: "Transcribing"
        } as const;
        const icons = {
            idle: "🎤",
            listening: "■",
            transcribing: "…"
        } as const;
        return html`
            <button
                type="button"
                class="mic ${this._state}"
                aria-label=${labels[this._state]}
                title=${labels[this._state]}
                ?disabled=${this._state === "transcribing"}
                @click=${this._onClick}
            >
                ${icons[this._state]}
            </button>
        `;
    }

    static styles = css`
        :host {
            display: inline-flex;
        }
        .mic {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 1rem;
            cursor: pointer;
            min-width: 36px;
        }
        .mic.listening {
            background: var(--error-color, #d33);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            animation: bt-mic-pulse 1s ease-in-out infinite;
        }
        .mic.transcribing {
            opacity: 0.7;
            cursor: progress;
        }
        @keyframes bt-mic-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "bt-mic-button": MicButton;
    }
}
