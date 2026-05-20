// Last-24-hours summary chips — computed from the recent_entries sensor
// attribute so the totals match the 24h activity list directly underneath.
// The status row above carries the "Awake for / Last feed / Last diaper"
// chips; this row is just the 24 h totals.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";
import { formatMinutes, formatVolume, summarize } from "../lib/entries";

export function todayCountsTemplate(
    hass: any,
    baby: string,
    _babyConfig: any | undefined
): TemplateResult {
    const sensor = hass.states?.[babyEntityId(baby, "recent_entries")];
    const entries = sensor?.attributes?.entries ?? [];
    const s = summarize(entries);
    return html`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">
                ${formatVolume(s.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">
                ${s.wetDiapers} wet and ${s.dirtyDiapers} dirty
            </div>
            <div class="chip" role="listitem">
                ${formatMinutes(s.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
