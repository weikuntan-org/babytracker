// Active-session banner — shows when a timed session is open and gives a
// one-tap end button.
import { html, type TemplateResult } from "lit";

import { formatClock, formatMinutes, sessionDurationMinutes } from "../lib/entries";
import { babyEntityId } from "../lib/ha-helpers";

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
    const sleeping =
        hass.states[babyEntityId(baby, "sleeping", "binary_sensor")]?.state ===
        "on";
    const feeding =
        hass.states[babyEntityId(baby, "feeding", "binary_sensor")]?.state ===
        "on";
    const tummy =
        hass.states[babyEntityId(baby, "tummy_time", "binary_sensor")]?.state ===
        "on";
    const walking =
        hass.states[babyEntityId(baby, "walking", "binary_sensor")]?.state ===
        "on";
    if (!sleeping && !feeding && !tummy && !walking) return "";

    const banners: TemplateResult[] = [];
    if (sleeping) {
        const started = hass.states[babyEntityId(baby, "last_sleep_start")]?.state;
        const mins = started ? sessionDurationMinutes(started, null) : 0;
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Sleeping${started
                        ? html` · started ${formatClock(started)} ·
                          ${formatMinutes(mins)}`
                        : ""}
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
        const started = hass.states[babyEntityId(baby, "last_walk_start")]?.state;
        banners.push(
            html`
                <div class="chip warning" role="status">
                    Walking ${started ? html`· started ${formatClock(started)}` : ""}
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
