// Vaccines chip + overdue badge (§4.8 / SPECS §12).
import { html, type TemplateResult } from "lit";

export function vaccinesDueTemplate(hass: any, baby: string): TemplateResult | "" {
    const due = hass.states[`sensor.${baby}_vaccines_due`];
    if (!due || due.state === "unknown") return "";
    const overdue =
        hass.states[`binary_sensor.${baby}_vaccines_overdue`]?.state === "on";
    return html`
        <div
            class="section chip ${overdue ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
            style="display:flex;align-items:center;gap:8px;"
        >
            <span>Vaccines due:</span>
            <strong>${due.state}</strong>
            ${due.attributes?.due_on
                ? html`<span>(${due.attributes.due_on})</span>`
                : ""}
            ${overdue ? html`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
