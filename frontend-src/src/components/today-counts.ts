// Today's count chips — gives users instant "yes, your tap landed" feedback
// by surfacing the per-activity counter sensors.
import { html, type TemplateResult } from "lit";

export function todayCountsTemplate(
    hass: any,
    baby: string,
    babyConfig: any | undefined
): TemplateResult {
    const enabled: string[] = babyConfig?.enabled_activities ?? [
        "feeding",
        "sleep",
        "tummy_time",
        "diaper",
        "walk"
    ];
    const state = (suffix: string) =>
        hass.states?.[`sensor.${baby}_${suffix}`]?.state;

    const chips: TemplateResult[] = [];
    if (enabled.includes("feeding")) {
        const n = state("feedings_today") ?? "0";
        chips.push(html`<div class="chip" role="listitem">${n} feedings</div>`);
    }
    if (enabled.includes("diaper")) {
        const n = state("diapers_today") ?? "0";
        chips.push(html`<div class="chip" role="listitem">${n} diapers</div>`);
    }
    if (enabled.includes("sleep")) {
        const mins = Number(state("total_sleep_today") ?? 0);
        chips.push(
            html`<div class="chip" role="listitem">
                ${_fmtMinutes(mins)} sleep
            </div>`
        );
    }
    if (enabled.includes("tummy_time")) {
        const mins = Number(state("total_tummy_time_today") ?? 0);
        chips.push(
            html`<div class="chip" role="listitem">
                ${_fmtMinutes(mins)} tummy
            </div>`
        );
    }
    if (enabled.includes("walk")) {
        const n = state("walks_today") ?? "0";
        chips.push(html`<div class="chip" role="listitem">${n} walks</div>`);
    }

    return html`
        <div class="chips" role="list" aria-label="Today's counts">${chips}</div>
    `;
}

function _fmtMinutes(mins: number): string {
    if (!Number.isFinite(mins) || mins <= 0) return "0m";
    if (mins < 60) return `${Math.round(mins)}m`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
