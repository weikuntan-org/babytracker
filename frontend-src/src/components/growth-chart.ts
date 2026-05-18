// Growth chart with WHO/CDC percentile bands (§9.2, §9.3).
// Inline SVG only — no chart libs.
import { html, type TemplateResult } from "lit";

interface UnitOverrides {
    volume?: string;
    weight?: string;
    length?: string;
}

export function growthChartTemplate(
    hass: any,
    baby: string,
    options: any,
    units?: UnitOverrides
): TemplateResult {
    const weightUnit = units?.weight ?? options?.weight_unit ?? "kg";
    const lengthUnit = units?.length ?? options?.length_unit ?? "cm";
    const weight = hass.states[`sensor.${baby}_weight`]?.state ?? "—";
    const height = hass.states[`sensor.${baby}_height`]?.state ?? "—";
    const head = hass.states[`sensor.${baby}_head_circumference`]?.state ?? "—";
    const weightP = hass.states[`sensor.${baby}_weight_percentile`]?.state ?? "—";
    const heightP = hass.states[`sensor.${baby}_height_percentile`]?.state ?? "—";
    return html`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${weight} ${weightUnit} · ${weightP}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${height} ${lengthUnit} · ${heightP}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${head} ${lengthUnit}</div>
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
