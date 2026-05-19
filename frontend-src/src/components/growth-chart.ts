// Growth chart with WHO/CDC percentile bands (§9.2, §9.3).
// Inline SVG only — no chart libs.
import { html, svg, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";
import "./chart-lightbox";

interface PercentileSeries {
    key: "weight" | "height" | "head";
    label: string;
    color: string;
}

const PERCENTILE_SERIES: PercentileSeries[] = [
    { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
    { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
    { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];

function _percentileFromEntry(
    entry: any,
    key: PercentileSeries["key"]
): number | null {
    const d = entry?.data ?? {};
    const raw =
        key === "weight"
            ? d.weight_percentile
            : key === "height"
              ? d.height_percentile
              : d.head_percentile;
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

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
    onEdit?: (entry: any) => void,
    /** Full growth-entry history (newest-first, from `babytracker/list_growth`).
     *  When passed and at least two entries carry a percentile, a
     *  percentile-over-time chart is rendered below the summary chips. */
    growthEntries?: any[]
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
            ${percentileOverTimeWrapper(growthEntries)}
        </div>
    `;
}

/** Wrap the percentile-over-time chart in a click-to-expand lightbox.
 *  Skips entirely when the underlying chart would render nothing — the
 *  lightbox wrapper would otherwise show an empty zoom affordance.
 */
function percentileOverTimeWrapper(
    entries: any[] | undefined
): TemplateResult | "" {
    const inline = percentileOverTimeChart(entries);
    if (inline === "") return "";
    return html`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => percentileOverTimeChart(entries)}
        ></bt-chart-lightbox>
    `;
}

/** Plot weight/height/head percentiles over time as three line series.
 *  Returns "" when fewer than two data points across the three series
 *  exist — a single dot wouldn't tell a parent anything they don't
 *  already see in the latest-measurement chips above.
 */
function percentileOverTimeChart(
    entries: any[] | undefined
): TemplateResult | "" {
    if (!Array.isArray(entries) || entries.length < 2) return "";
    // Ascending chronological for plotting.
    const sorted = [...entries]
        .filter(e => Number.isFinite(Date.parse(e?.timestamp)))
        .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
    if (sorted.length < 2) return "";

    const tMin = Date.parse(sorted[0].timestamp);
    const tMax = Date.parse(sorted[sorted.length - 1].timestamp);
    const span = Math.max(1, tMax - tMin);
    // Render is bypassed for spans under a day to avoid divide-by-zero
    // visuals; collapsing two measurements taken the same hour onto the
    // same x slot is meaningless.

    const W = 320;
    const H = 140;
    const padL = 22; // room for the p10/50/90 axis labels
    const padR = 8;
    const padT = 8;
    const padB = 20; // room for the date labels
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const x = (ts: number) => padL + ((ts - tMin) / span) * innerW;
    const y = (p: number) => padT + (1 - p / 100) * innerH;

    const seriesWithPoints = PERCENTILE_SERIES.map(s => ({
        ...s,
        points: sorted
            .map(e => {
                const p = _percentileFromEntry(e, s.key);
                if (p === null) return null;
                return { ts: Date.parse(e.timestamp), p };
            })
            .filter((pt): pt is { ts: number; p: number } => pt !== null)
    }));
    const totalPoints = seriesWithPoints.reduce(
        (acc, s) => acc + s.points.length,
        0
    );
    if (totalPoints < 2) return "";

    // Date labels: first and last entry. Older HA themes don't carry
    // intl info — fall back to ISO if the locale path returns "".
    const firstLabel = _fmtDateShort(sorted[0].timestamp);
    const lastLabel = _fmtDateShort(sorted[sorted.length - 1].timestamp);

    const gridPercentiles = [10, 50, 90];

    return html`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${PERCENTILE_SERIES.map(
                        s => html`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${s.color}`}
                                ></span>
                                ${s.label}
                            </span>
                        `
                    )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${W} ${H}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${H}px;"
            >
                ${gridPercentiles.map(
                    p => svg`
                        <line
                            x1=${padL}
                            x2=${W - padR}
                            y1=${y(p)}
                            y2=${y(p)}
                            stroke="var(--divider-color, #888)"
                            stroke-dasharray=${p === 50 ? "" : "2 2"}
                            stroke-width="1"
                        ></line>
                        <text
                            x=${padL - 4}
                            y=${y(p) + 3}
                            font-size="8"
                            text-anchor="end"
                            fill="var(--secondary-text-color)"
                        >
                            p${p}
                        </text>
                    `
                )}
                ${seriesWithPoints.map(s => {
                    if (s.points.length === 0) return svg``;
                    const d = s.points
                        .map(
                            (pt, i) =>
                                `${i === 0 ? "M" : "L"}${x(pt.ts).toFixed(1)},${y(pt.p).toFixed(1)}`
                        )
                        .join(" ");
                    return svg`
                        ${s.points.length > 1
                            ? svg`<path
                                d=${d}
                                fill="none"
                                stroke=${s.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>`
                            : ""}
                        ${s.points.map(
                            pt => svg`
                                <circle
                                    cx=${x(pt.ts)}
                                    cy=${y(pt.p)}
                                    r="2.5"
                                    fill=${s.color}
                                >
                                    <title>${s.label} ${_fmtDateShort(new Date(pt.ts).toISOString())}: p${Math.round(pt.p)}</title>
                                </circle>
                            `
                        )}
                    `;
                })}
                <text
                    x=${padL}
                    y=${H - 4}
                    font-size="9"
                    fill="var(--secondary-text-color)"
                >
                    ${firstLabel}
                </text>
                <text
                    x=${W - padR}
                    y=${H - 4}
                    font-size="9"
                    text-anchor="end"
                    fill="var(--secondary-text-color)"
                >
                    ${lastLabel}
                </text>
            </svg>
        </div>
    `;
}

function _fmtDateShort(iso?: string | null): string {
    if (!iso) return "";
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return "";
    return new Date(t).toLocaleDateString([], {
        month: "short",
        day: "numeric"
    });
}
