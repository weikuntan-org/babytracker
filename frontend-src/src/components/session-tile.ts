// Active-session banner — shows when a timed session is open and gives a
// one-tap end button.
import { html, type TemplateResult } from "lit";

type ServiceCaller = (
    service: string,
    data: Record<string, unknown>,
    sourceBtn?: EventTarget | null
) => Promise<unknown>;

export function sessionTileTemplate(
    hass: any,
    baby: string,
    call: ServiceCaller
): TemplateResult | "" {
    const sleeping = hass.states[`binary_sensor.${baby}_sleeping`]?.state === "on";
    const feeding = hass.states[`binary_sensor.${baby}_feeding`]?.state === "on";
    const tummy = hass.states[`binary_sensor.${baby}_tummy_time`]?.state === "on";
    const walking = hass.states[`binary_sensor.${baby}_walking`]?.state === "on";
    if (!sleeping && !feeding && !tummy && !walking) return "";

    const banners: TemplateResult[] = [];
    if (sleeping) {
        const started = hass.states[`sensor.${baby}_last_sleep_start`]?.state;
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Sleeping ${started ? html`· started ${_clock(started)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(e: Event) =>
                            call("end_sleep", { baby }, e.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
        );
    }
    if (feeding) {
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(e: Event) =>
                            call("end_feeding", { baby }, e.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
        );
    }
    if (tummy) {
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(e: Event) =>
                            call("end_tummy_time", { baby }, e.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
        );
    }
    if (walking) {
        const started = hass.states[`sensor.${baby}_last_walk_start`]?.state;
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Walking ${started ? html`· started ${_clock(started)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(e: Event) =>
                            call("end_walk", { baby }, e.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
        );
    }

    return html`<div class="section">${banners}</div>`;
}

function _clock(iso?: string): string {
    if (!iso) return "";
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return "";
    return new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}
