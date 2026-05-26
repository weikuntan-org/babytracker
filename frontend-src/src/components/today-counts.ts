// Last-24-hours summary chips — computed from the recent_entries sensor
// attribute so the totals match the 24h activity list directly underneath.
// Returns inline chip fragments (no wrapping container) so the card can
// flow these in the same `.chips` flex row as the status chips above
// without an awkward line break between the two groups.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";
import { formatVolume, summarize } from "../lib/entries";

export function todayCountsTemplate(
    hass: any,
    baby: string,
    _babyConfig: any | undefined
): TemplateResult {
    const sensor = hass.states?.[babyEntityId(baby, "recent_entries")];
    const entries = sensor?.attributes?.entries ?? [];
    const s = summarize(entries);
    return html`
        <div class="chip" role="listitem">
            ${formatVolume(s.totalVolumeMl)} consumed
        </div>
        <div class="chip" role="listitem">
            ${s.wetDiapers} wet and ${s.dirtyDiapers} dirty
        </div>
    `;
}
