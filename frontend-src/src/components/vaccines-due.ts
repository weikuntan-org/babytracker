// Vaccines chip + overdue badge (§4.8 / SPECS §12).
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";

export function vaccinesDueTemplate(hass: any, baby: string): TemplateResult | "" {
    const due = hass.states[babyEntityId(baby, "vaccines_due")];
    if (!due || due.state === "unknown") return "";
    const overdue =
        hass.states[babyEntityId(baby, "vaccines_overdue", "binary_sensor")]
            ?.state === "on";
    return html`
        <div
            class="section chip ${overdue ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
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
