// Shared chip helper. Used by both the per-baby card (status + last-24h
// summary) and the history card (per-day summary) so the icon-led chip
// markup stays in one place.
//
// The chip leads with an `<ha-icon>` glyph; the full word moves to
// `title=` + `aria-label=` so hover and screen-reader users still get
// the label. Optional `value` and `detail` slots flow to the right of
// the icon.
//
// `warning=true` flips to the warning-color background (used for
// in-progress state chips like "Sleeping" / "At daycare"); in that
// mode the chip typically passes `value` rather than a number so the
// state name still reads inline.
import { html, type TemplateResult } from "lit";

export function chip(opts: {
    icon: string;
    label: string;
    value?: string;
    detail?: string;
    warning?: boolean;
}): TemplateResult {
    const cls = opts.warning ? "chip warning" : "chip";
    return html`
        <span
            class=${cls}
            role="listitem"
            title=${opts.label}
            aria-label=${opts.label}
        >
            <ha-icon class="chip-icon" icon=${opts.icon}></ha-icon>
            ${opts.value
                ? html`<span class="chip-value">${opts.value}</span>`
                : ""}
            ${opts.detail
                ? html`<span class="chip-detail">${opts.detail}</span>`
                : ""}
        </span>
    `;
}
