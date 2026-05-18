// Last-24-hours activity list — pulls from sensor.<baby>_recent_entries
// (which the coordinator keeps capped at RECENT_ENTRIES_CAP) and filters
// to the trailing 24-hour window.
import { html, type TemplateResult } from "lit";

type ServiceCaller = (
    service: string,
    data: Record<string, unknown>,
    sourceBtn?: EventTarget | null
) => Promise<unknown>;

export function recentEntriesTemplate(
    hass: any,
    baby: string,
    call: ServiceCaller,
    limit: number
): TemplateResult {
    const sensor = hass.states[`sensor.${baby}_recent_entries`];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const all: any[] = sensor?.attributes?.entries ?? [];
    const entries = all
        .filter((e) => _parse(e.timestamp) >= cutoff)
        .slice(0, Math.min(limit, 50));

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
                                          >${_clock(entry.timestamp)}</span
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
                                          aria-label="Delete entry"
                                          @click=${(e: Event) =>
                                              call(
                                                  "delete_entry",
                                                  { entry_id: entry.id },
                                                  e.currentTarget
                                              )}
                                      >
                                          Delete
                                      </button>
                                  </li>
                              `
                          )}
                      </ul>
                  `}
        </div>
    `;
}

function _parse(iso?: string): number {
    if (!iso) return 0;
    const t = Date.parse(iso);
    return Number.isNaN(t) ? 0 : t;
}

function _clock(iso?: string): string {
    if (!iso) return "";
    const t = _parse(iso);
    if (t === 0) return "";
    return new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function _label(entry: any): string {
    const t = String(entry.type ?? "");
    const method = entry?.data?.method ?? entry?.data?.kind;
    return method ? `${t} (${method})` : t;
}
