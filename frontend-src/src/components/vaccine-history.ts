// Vaccination history list for the summary card. Renders below the
// "vaccines due" chip with one row per past vaccine, newest-first.
//
// Entries come from `babytracker/list_vaccines` (subscribe-aware) so
// edits/deletes elsewhere reflect immediately.
import { html, type TemplateResult } from "lit";

/** Format an ISO timestamp as a local short date (e.g. "May 12, 2026"). */
function _formatDate(iso?: string | null): string {
    if (!iso) return "—";
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return "—";
    return new Date(t).toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function _label(entry: any): string {
    const name = String(entry?.data?.name ?? "vaccine");
    const dose = entry?.data?.dose_number;
    return dose != null ? `${name} dose ${dose}` : name;
}

export function vaccineHistoryTemplate(
    entries: any[],
    requestEdit?: (entry: any) => void
): TemplateResult | "" {
    if (!entries || entries.length === 0) return "";
    return html`
        <div
            class="section vaccine-history"
            role="region"
            aria-label="Vaccine history"
        >
            <h3>Vaccine history</h3>
            <ul class="vh-list">
                ${entries.map(
                    (e: any) => html`<li
                        class=${requestEdit ? "clickable" : ""}
                        role=${requestEdit ? "button" : "listitem"}
                        tabindex=${requestEdit ? "0" : "-1"}
                        aria-label=${requestEdit
                            ? `Edit ${_label(e)}`
                            : _label(e)}
                        @click=${requestEdit
                            ? () => requestEdit(e)
                            : undefined}
                        @keydown=${requestEdit
                            ? (ev: KeyboardEvent) => {
                                  if (
                                      ev.key === "Enter" ||
                                      ev.key === " "
                                  ) {
                                      ev.preventDefault();
                                      requestEdit(e);
                                  }
                              }
                            : undefined}
                    >
                        <span class="vh-date muted"
                            >${_formatDate(e.timestamp)}</span
                        >
                        <span class="vh-name">${_label(e)}</span>
                        ${e?.data?.site
                            ? html`<span class="muted">${String(
                                  e.data.site
                              ).replace("_", " ")}</span>`
                            : ""}
                    </li>`
                )}
            </ul>
        </div>
    `;
}
