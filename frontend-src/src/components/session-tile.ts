// Active-session banner — shows elapsed time when a timed session is open.
import { html, type TemplateResult } from "lit";

type ServiceCaller = (service: string, data: Record<string, unknown>) => Promise<unknown>;

export function sessionTileTemplate(
    hass: any,
    baby: string,
    call: ServiceCaller
): TemplateResult | "" {
    const sleeping = hass.states[`binary_sensor.${baby}_sleeping`]?.state === "on";
    const feeding = hass.states[`binary_sensor.${baby}_feeding`]?.state === "on";
    const tummy = hass.states[`binary_sensor.${baby}_tummy_time`]?.state === "on";
    if (!sleeping && !feeding && !tummy) return "";

    const banners: TemplateResult[] = [];
    if (sleeping) {
        const started = hass.states[`sensor.${baby}_last_sleep_start`]?.state;
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Sleeping · started ${started}
                    <button
                        aria-label="End sleep"
                        @click=${() => call("end_sleep", { baby })}
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
                        @click=${() => call("end_feeding", { baby })}
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
                        @click=${() => call("end_tummy_time", { baby })}
                    >
                        End
                    </button>
                </div>
            `
        );
    }

    return html`<div class="section">${banners}</div>`;
}
