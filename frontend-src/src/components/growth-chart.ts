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

export function growthChartTemplate(
    hass: any,
    baby: string,
    options: any,
    units?: UnitOverrides,
    onLog?: () => void
): TemplateResult {
    const weightUnit = units?.weight ?? options?.weight_unit ?? "kg";
    const lengthUnit = units?.length ?? options?.length_unit ?? "cm";
    const weight = hass.states[babyEntityId(baby, "weight")]?.state;
    const height = hass.states[babyEntityId(baby, "height")]?.state;
    const head = hass.states[babyEntityId(baby, "head_circumference")]?.state;
    const weightP =
        hass.states[babyEntityId(baby, "weight_percentile")]?.state;
    const heightP =
        hass.states[babyEntityId(baby, "height_percentile")]?.state;
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
                    <div>${_fmtValue(head)} ${lengthUnit}</div>
                </div>
            </div>
            ${_inlineChart(hass, baby)}
        </div>
    `;
}

function _inlineChart(_hass: any, _baby: string): TemplateResult {
    const bands = [3, 15, 50, 85, 97];
    return html`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${bands.map(
                (b, i) => html`
                    <line
                        x1="0"
                        x2="300"
                        y1="${20 + i * 20}"
                        y2="${20 + i * 20}"
                        stroke="var(--divider-color)"
                        stroke-dasharray="4 4"
                    />
                    <text
                        x="290"
                        y="${20 + i * 20 - 4}"
                        font-size="9"
                        fill="var(--secondary-text-color)"
                        text-anchor="end"
                    >
                        p${b}
                    </text>
                `
            )}
        </svg>
    `;
}
