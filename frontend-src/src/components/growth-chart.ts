// Growth chart with WHO/CDC percentile bands (§9.2, §9.3).
// Inline SVG only — no chart libs.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";

interface UnitOverrides {
    volume?: string;
    weight?: string;
    length?: string;
}

/** Round a numeric sensor state to ≤2 decimals, trimming trailing zeros
 *  (e.g. "8.500" → "8.5", "8.456" → "8.46", "8" → "8"). Non-numeric input
 *  is returned as-is so dashes / "unavailable" pass through.
 */
function _fmtValue(state: string | number | null | undefined): string {
    if (state == null) return "—";
    const n = typeof state === "number" ? state : Number(state);
    if (!Number.isFinite(n)) return String(state);
    return String(Math.round(n * 100) / 100);
}

/** Render a percentile as `p{N}` (e.g. "p65") to match clinical convention.
 *  Falls back to "—" when the percentile sensor is unknown.
 */
function _fmtPercentile(state: string | number | null | undefined): string {
    if (state == null || state === "—") return "—";
    const n = typeof state === "number" ? state : Number(state);
    if (!Number.isFinite(n)) return String(state);
    return `p${Math.round(n)}`;
}

/** Format an ISO timestamp as a local short date ("May 12, 2026"). */
function _fmtDate(iso?: string | null): string {
    if (!iso) return "";
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return "";
    return new Date(t).toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

export function growthChartTemplate(
    hass: any,
    baby: string,
    options: any,
    units?: UnitOverrides,
    onLog?: () => void,
    latestEntry?: any,
    onEdit?: (entry: any) => void
): TemplateResult {
    // Prefer the entry's stored value + unit pair so the chip shows what
    // the user actually logged. Falling back to the sensor state would
    // mean displaying the value converted into the integration's global
    // unit while labelling it differently — "60 cm logged" rendering as
    // "23.6 cm" because the global default is inches.
    const entryData = latestEntry?.data ?? {};
    const fallbackWeightUnit =
        units?.weight ?? options?.weight_unit ?? "kg";
    const fallbackLengthUnit =
        units?.length ?? options?.length_unit ?? "cm";
    const weightUnit = entryData.weight_unit ?? fallbackWeightUnit;
    const lengthUnit = entryData.length_unit ?? fallbackLengthUnit;
    const weight =
        entryData.weight ??
        hass.states[babyEntityId(baby, "weight")]?.state;
    const height =
        entryData.height ??
        hass.states[babyEntityId(baby, "height")]?.state;
    const head =
        entryData.head_circumference ??
        hass.states[babyEntityId(baby, "head_circumference")]?.state;
    const weightP =
        entryData.weight_percentile ??
        hass.states[babyEntityId(baby, "weight_percentile")]?.state;
    const heightP =
        entryData.height_percentile ??
        hass.states[babyEntityId(baby, "height_percentile")]?.state;
    // The entry data key is `head_percentile` (see `percentiles.py`); the
    // sensor's suffix is `head_circumference_percentile`. Read from
    // whichever resolves first.
    const headP =
        entryData.head_percentile ??
        hass.states[babyEntityId(baby, "head_circumference_percentile")]?.state;
    const measuredOn = _fmtDate(latestEntry?.timestamp);
    const clickable = !!(latestEntry && onEdit);
    const triggerEdit = clickable
        ? () => onEdit!(latestEntry)
        : undefined;
    return html`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${onLog
                    ? html`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${onLog}
                      >
                          Log measurement
                      </button>`
                    : ""}
            </div>
            <div
                class=${clickable ? "growth-summary clickable" : "growth-summary"}
                role=${clickable ? "button" : "group"}
                tabindex=${clickable ? "0" : "-1"}
                aria-label=${clickable
                    ? "Edit latest growth measurement"
                    : "Latest growth measurement"}
                @click=${triggerEdit}
                @keydown=${clickable
                    ? (e: KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              triggerEdit?.();
                          }
                      }
                    : undefined}
            >
                ${measuredOn
                    ? html`<div class="growth-date muted">
                          Measured ${measuredOn}
                      </div>`
                    : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${_fmtValue(weight)} ${weightUnit} · ${_fmtPercentile(weightP)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${_fmtValue(height)} ${lengthUnit} · ${_fmtPercentile(heightP)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${_fmtValue(head)} ${lengthUnit} · ${_fmtPercentile(headP)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
