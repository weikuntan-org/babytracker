// Last-24-hours activity list — pulls from sensor.babytracker_<baby>_recent_entries
// (which the coordinator keeps capped at RECENT_ENTRIES_CAP) and filters
// to the trailing 24-hour window.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";
import { entriesInLastWindow, formatClock } from "../lib/entries";

export type DeleteRequester = (entry: {
    id: string;
    type?: string;
    source?: string;
    staff?: string | null;
}) => void;

export function recentEntriesTemplate(
    hass: any,
    baby: string,
    requestDelete: DeleteRequester,
    limit: number
): TemplateResult {
    const sensor = hass.states[babyEntityId(baby, "recent_entries")];
    const all: any[] = sensor?.attributes?.entries ?? [];
    const entries = entriesInLastWindow(all).slice(0, Math.min(limit, 50));

    return html`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${entries.length === 0
                ? html`<p>Nothing logged yet.</p>`
                : html`
                      <ul class="entries">
                          ${entries.map(
                              (entry: any) => html`
                                  <li>
                                      <span aria-label="Entry type"
                                          >${_label(entry)}</span
                                      >
                                      <span class="muted"
                                          >${formatClock(entry.timestamp)}</span
                                      >
                                      ${entry.photo_path
                                          ? html`<span aria-label="Has photo"
                                                >📷</span
                                            >`
                                          : ""}
                                      ${entry.staff
                                          ? html`<span
                                                class="muted"
                                                aria-label="Logged by Procare staff"
                                                >via ${entry.staff}</span
                                            >`
                                          : ""}
                                      <span class="spacer"></span>
                                      <button
                                          class="icon"
                                          title="Delete entry"
                                          aria-label="Delete entry"
                                          @click=${() =>
                                              requestDelete({
                                                  id: entry.id,
                                                  type: entry.type,
                                                  source: entry.source,
                                                  staff: entry.staff
                                              })}
                                      >
                                          ×
                                      </button>
                                  </li>
                              `
                          )}
                      </ul>
                  `}
        </div>
    `;
}

function _label(entry: any): string {
    const t = String(entry.type ?? "");
    // "other" entries carry their description in data.name; everything else
    // is differentiated by method (feeding) or kind (diaper). Feeding rows
    // also surface the amount+unit so bottles show "feeding (bottle, 4 oz)".
    const d = entry?.data ?? {};
    const detail = d.name ?? d.method ?? d.kind;
    if (!detail) return t;
    if (
        t === "feeding" &&
        d.amount != null &&
        d.amount !== "" &&
        d.unit
    ) {
        return `${t} (${detail}, ${d.amount} ${d.unit})`;
    }
    return `${t} (${detail})`;
}
