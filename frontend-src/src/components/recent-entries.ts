// Last-24-hours activity list — pulls from sensor.babytracker_<baby>_recent_entries
// (which the coordinator keeps capped at RECENT_ENTRIES_CAP) and filters
// to the trailing 24-hour window.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";
import { entriesInLastWindow, formatClock } from "../lib/entries";

export type EntryRequester = (entry: any) => void;

const SESSION_TYPES = new Set([
    "sleep",
    "feeding",
    "tummy_time",
    "walk"
]);

function _renderTime(entry: any): TemplateResult {
    const start = formatClock(entry.timestamp);
    // Show the closing time for completed session-shaped entries (sleep,
    // feeding, tummy time, walk) so the user can see how long it lasted
    // without opening the row. Bottle feedings have started_at == ended_at;
    // omit the range to avoid noise like "1:39 PM – 1:39 PM".
    if (
        SESSION_TYPES.has(String(entry.type ?? "")) &&
        entry.ended_at &&
        entry.ended_at !== entry.timestamp
    ) {
        return html`<span class="muted"
            >${start} – ${formatClock(entry.ended_at)}</span
        >`;
    }
    return html`<span class="muted">${start}</span>`;
}

export function recentEntriesTemplate(
    hass: any,
    baby: string,
    requestEdit: EntryRequester,
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
                                  <li
                                      class="clickable"
                                      role="button"
                                      tabindex="0"
                                      aria-label="Edit entry"
                                      @click=${() => requestEdit(entry)}
                                      @keydown=${(e: KeyboardEvent) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                              e.preventDefault();
                                              requestEdit(entry);
                                          }
                                      }}
                                  >
                                      <span aria-label="Entry type"
                                          >${_label(entry)}</span
                                      >
                                      ${_renderTime(entry)}
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
