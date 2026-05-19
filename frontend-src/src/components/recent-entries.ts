// Last-24-hours activity list — pulls from sensor.babytracker_<baby>_recent_entries
// (which the coordinator keeps capped at RECENT_ENTRIES_CAP) and filters
// to the trailing 24-hour window.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";
import { entriesInLastWindow } from "../lib/entries";
import { entryRowTemplate, type EntryRequester } from "./entry-row";

export type { EntryRequester };

export function recentEntriesTemplate(
    hass: any,
    baby: string,
    requestEdit: EntryRequester,
    limit: number,
    expandedNotes: ReadonlySet<string> = new Set(),
    toggleNotes: (entryId: string) => void = () => {}
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
                          ${entries.map((entry: any) =>
                              entryRowTemplate(
                                  entry,
                                  requestEdit,
                                  expandedNotes,
                                  toggleNotes
                              )
                          )}
                      </ul>
                  `}
        </div>
    `;
}
