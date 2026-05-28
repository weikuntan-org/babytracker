// Last-24-hours summary chips — computed from the recent_entries sensor
// attribute so the totals match the 24h activity list directly underneath.
// Returns inline chip fragments (no wrapping container) so the card can
// flow these in the same `.chips` flex row as the status chips above
// without an awkward line break between the two groups.
import { html, type TemplateResult } from "lit";

import { chip } from "./chip";
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
    const diaperDetail: string[] = [];
    if (s.wetDiapers) diaperDetail.push(`${s.wetDiapers}W`);
    if (s.dirtyDiapers) diaperDetail.push(`${s.dirtyDiapers}D`);
    return html`
        ${chip({
            icon: "mdi:baby-bottle-outline",
            label: "Consumed (last 24h)",
            value: formatVolume(s.totalVolumeMl)
        })}
        ${chip({
            icon: "mdi:human-baby-changing-table",
            label: "Diapers (last 24h)",
            value: String(s.wetDiapers + s.dirtyDiapers),
            detail:
                diaperDetail.length > 0
                    ? `(${diaperDetail.join(" · ")})`
                    : undefined
        })}
    `;
}
