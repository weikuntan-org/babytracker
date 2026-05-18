// Recent-entries list with edit / delete and photo thumbnails.
import { html, type TemplateResult } from "lit";

type ServiceCaller = (service: string, data: Record<string, unknown>) => Promise<unknown>;

export function recentEntriesTemplate(
    hass: any,
    baby: string,
    call: ServiceCaller,
    limit: number
): TemplateResult {
    const sensor = hass.states[`sensor.${baby}_recent_entries`];
    const entries = (sensor?.attributes?.entries ?? []).slice(0, Math.min(limit, 50));
    return html`
        <div class="section" role="region" aria-label="Recent entries">
            <h2>Recent</h2>
            ${entries.length === 0
                ? html`<p>No entries yet.</p>`
                : html`
                      <ul class="entries">
                          ${entries.map(
                              (entry: any) => html`
                                  <li>
                                      <span aria-label="Entry type">${entry.type}</span>
                                      <span class="muted">${entry.timestamp}</span>
                                      ${entry.photo_path
                                          ? html`<span aria-label="Has photo">📷</span>`
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
                                          @click=${() =>
                                              call("delete_entry", { entry_id: entry.id })}
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
