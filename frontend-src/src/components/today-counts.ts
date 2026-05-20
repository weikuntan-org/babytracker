// Last-24-hours summary chips — computed from the recent_entries sensor
// attribute so the totals match the 24h activity list directly underneath.
//
// Includes an "awake for" chip ticking off the time since the last nap
// ended. Hidden while a sleep session is open (the session tile already
// shows that) and when no completed sleep is in the recent_entries
// window — better silence than a stale or wrong number.
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
    const sleeping =
        hass.states?.[babyEntityId(baby, "sleeping", "binary_sensor")]
            ?.state === "on";
    const awakeChip = sleeping ? "" : _awakeForChip(entries);
    return html`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${s.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${formatVolume(s.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${s.wetDiapers} wet</div>
            <div class="chip" role="listitem">${s.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${formatMinutes(s.sleepMinutes)} sleep
            </div>
            ${awakeChip}
        </div>
    `;
}

/** Render an "Awake for: …" chip showing time elapsed since the
 *  latest completed sleep ended. The recent_entries sensor sorts by
 *  start time, so we scan and take the max `ended_at` rather than
 *  trusting iteration order — sleeps shouldn't overlap, but defending
 *  against a future bug is cheaper than chasing it later. Returns
 *  `""` when no completed sleep is in the window. */
function _awakeForChip(entries: any[]): TemplateResult | "" {
    let latestEnd: number | null = null;
    for (const e of entries) {
        if (e?.type !== "sleep" || !e?.ended_at) continue;
        const t = Date.parse(e.ended_at);
        if (!Number.isFinite(t)) continue;
        if (latestEnd === null || t > latestEnd) latestEnd = t;
    }
    if (latestEnd === null) return "";
    // Clock skew between HA and the browser can flip the sign for a
    // freshly-ended session; treat anything <= 0 as "just now".
    const minutes = Math.max(0, (Date.now() - latestEnd) / 60000);
    return html`<div
        class="chip"
        role="listitem"
        title="Last wake: ${new Date(latestEnd).toLocaleString()}"
    >
        Awake for: ${formatMinutes(minutes)}
    </div>`;
}
