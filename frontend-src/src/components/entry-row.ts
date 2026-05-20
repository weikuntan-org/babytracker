// Shared single-entry row template used by both `recent-entries.ts` (last-
// 24h section) and `history-card.ts` (paginated day view). Keeps the row
// markup, label/time formatting, and the notes expand affordance in one
// place so the two surfaces stay visually consistent.
import { html, type TemplateResult } from "lit";

import { entryLabel, formatClock } from "../lib/entries";
import "./entry-thumbnail";

export type EntryRequester = (entry: any) => void;

const SESSION_TYPES = new Set(["sleep", "feeding", "tummy_time", "walk"]);

export function entryRowTemplate(
    hass: any,
    entry: any,
    requestEdit: EntryRequester,
    expandedNotes: ReadonlySet<string>,
    toggleNotes: (entryId: string) => void
): TemplateResult {
    return html`
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
            <div class="entry-row">
                <span aria-label="Entry type">${entryLabel(entry)}</span>
                ${_renderTime(entry)}
                ${entry.staff
                    ? html`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${entry.staff}</span
                      >`
                    : ""}
            </div>
            ${entry.notes
                ? html`<div
                      class="entry-notes muted ${expandedNotes.has(entry.id)
                          ? "expanded"
                          : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${expandedNotes.has(entry.id)
                          ? "true"
                          : "false"}
                      title=${entry.notes}
                      @click=${(e: Event) => {
                          e.stopPropagation();
                          toggleNotes(entry.id);
                      }}
                      @keydown=${(e: KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleNotes(entry.id);
                          }
                      }}
                  >${entry.notes}</div>`
                : ""}
            ${entry.photo_path
                ? html`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${hass}
                          .photoPath=${entry.photo_path}
                      ></bt-entry-thumbnail>
                  </div>`
                : ""}
        </li>
    `;
}

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
