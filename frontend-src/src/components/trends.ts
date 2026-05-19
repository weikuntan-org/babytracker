// 7-day daily-bucket bar charts: sleep, feedings (stacked by method),
// bottle volume, diapers (stacked by kind). Data source is the same
// `sensor.babytracker_<baby>_recent_entries` attribute the rest of the
// card reads. Caveat: the sensor caps at RECENT_ENTRIES_CAP (120)
// entries, so days at the far edge of the window can underreport if
// the baby has more than ~17 events/day. Acceptable for at-a-glance
// trends; a richer history would need a WS history command.
import { html, svg, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ML_PER_OZ = 29.5735;

type FeedingCategory = "bottle" | "breast" | "solids";
type DiaperCategory = "wet" | "dirty" | "both";

interface Segment<K extends string> {
    key: K;
    label: string;
    color: string;
}

// HA theme variables with concrete fallbacks so the chart still renders
// distinguishable colors on themes that don't define every accent.
const FEEDING_SEGMENTS: Segment<FeedingCategory>[] = [
    { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
    { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
    { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
];

const DIAPER_SEGMENTS: Segment<DiaperCategory>[] = [
    { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
    { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
    { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];

interface DayBucket {
    label: string; // e.g. "Mon"
    sleepMinutes: number;
    bottleMl: number;
    feedingByCategory: Record<FeedingCategory, number>;
    diaperByCategory: Record<DiaperCategory, number>;
}

function _emptyBucket(label: string): DayBucket {
    return {
        label,
        sleepMinutes: 0,
        bottleMl: 0,
        feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
        diaperByCategory: { wet: 0, dirty: 0, both: 0 }
    };
}

function _feedingCategory(method: string): FeedingCategory | null {
    if (method === "bottle") return "bottle";
    if (method === "breast_left" || method === "breast_right") return "breast";
    if (method === "solids") return "solids";
    return null;
}

function _diaperCategory(kind: string): DiaperCategory | null {
    if (kind === "wet" || kind === "dirty" || kind === "both") return kind;
    return null;
}

function _bucketTotals(b: DayBucket): { feedings: number; diapers: number } {
    return {
        feedings:
            b.feedingByCategory.bottle +
            b.feedingByCategory.breast +
            b.feedingByCategory.solids,
        diapers:
            b.diaperByCategory.wet +
            b.diaperByCategory.dirty +
            b.diaperByCategory.both
    };
}

export function trendsTemplate(
    hass: any,
    baby: string,
    days = 7
): TemplateResult | "" {
    const sensor = hass?.states?.[babyEntityId(baby, "recent_entries")];
    const entries: any[] = sensor?.attributes?.entries ?? [];

    const now = Date.now();
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);
    const buckets: DayBucket[] = [];
    const weekday = (d: Date) =>
        d.toLocaleDateString([], { weekday: "short" });
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(todayMidnight.getTime() - i * ONE_DAY_MS);
        buckets.push(_emptyBucket(weekday(d)));
    }

    const windowStart = todayMidnight.getTime() - (days - 1) * ONE_DAY_MS;
    for (const e of entries) {
        const ts = Date.parse(e?.timestamp);
        if (!Number.isFinite(ts)) continue;
        const idx = Math.floor((ts - windowStart) / ONE_DAY_MS);
        if (idx < 0 || idx >= days) continue;
        const b = buckets[idx];
        if (e.type === "feeding") {
            const category = _feedingCategory(String(e?.data?.method ?? ""));
            if (category) b.feedingByCategory[category] += 1;
            const amount = Number(e?.data?.amount ?? 0);
            const unit = String(e?.data?.unit ?? "");
            if (amount > 0 && unit === "oz") b.bottleMl += amount * ML_PER_OZ;
            else if (amount > 0 && unit === "ml") b.bottleMl += amount;
        } else if (e.type === "diaper") {
            const category = _diaperCategory(String(e?.data?.kind ?? ""));
            if (category) b.diaperByCategory[category] += 1;
        } else if (e.type === "sleep") {
            const end =
                e?.ended_at && e.ended_at !== ""
                    ? Date.parse(e.ended_at)
                    : now;
            if (Number.isFinite(end) && end > ts) {
                // Naive attribution: count the whole session against its
                // start-day bucket. Acceptable for trend visualization.
                b.sleepMinutes += (end - ts) / 60000;
            }
        }
    }

    const totals = buckets.map(_bucketTotals);
    if (
        buckets.every(
            (b, i) =>
                b.sleepMinutes === 0 &&
                totals[i].feedings === 0 &&
                totals[i].diapers === 0
        )
    ) {
        return ""; // nothing to show
    }

    return html`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${days} days</h2>
            ${barChart(
                buckets.map(b => ({ label: b.label, value: b.sleepMinutes })),
                "Sleep (min/day)",
                v => `${Math.round(v)}`
            )}
            ${stackedBarChart(
                buckets.map(b => ({
                    label: b.label,
                    parts: FEEDING_SEGMENTS.map(s => ({
                        ...s,
                        value: b.feedingByCategory[s.key]
                    }))
                })),
                "Feedings/day",
                FEEDING_SEGMENTS,
                v => `${v}`
            )}
            ${barChart(
                buckets.map(b => ({ label: b.label, value: b.bottleMl })),
                "Bottle (oz/day)",
                v => (v / ML_PER_OZ).toFixed(1)
            )}
            ${stackedBarChart(
                buckets.map(b => ({
                    label: b.label,
                    parts: DIAPER_SEGMENTS.map(s => ({
                        ...s,
                        value: b.diaperByCategory[s.key]
                    }))
                })),
                "Diapers/day",
                DIAPER_SEGMENTS,
                v => `${v}`
            )}
        </div>
    `;
}

interface Bar {
    label: string;
    value: number;
}

function barChart(
    bars: Bar[],
    title: string,
    fmt: (v: number) => string
): TemplateResult {
    const W = 320;
    const H = 90;
    const padX = 14;
    const padTopBottom = 24;
    const max = Math.max(1, ...bars.map(b => b.value));
    const barW = (W - padX * 2) / bars.length;
    return html`
        <div class="trend">
            <div class="label">${title}</div>
            <svg
                viewBox="0 0 ${W} ${H}"
                role="img"
                aria-label=${title}
                style="width:100%;height:${H}px;"
            >
                ${bars.map((b, i) => {
                    const x = padX + i * barW;
                    const barInner = barW * 0.7;
                    const barX = x + (barW - barInner) / 2;
                    const h = Math.max(
                        b.value > 0 ? 2 : 0,
                        (b.value / max) * (H - padTopBottom * 2)
                    );
                    const y = H - padTopBottom - h;
                    return svg`
                        <rect
                            x=${barX}
                            y=${y}
                            width=${barInner}
                            height=${h}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${barX + barInner / 2}
                            y=${y - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${b.value > 0 ? fmt(b.value) : ""}
                        </text>
                        <text
                            x=${barX + barInner / 2}
                            y=${H - 6}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${b.label}
                        </text>
                    `;
                })}
            </svg>
        </div>
    `;
}

interface StackedPart {
    key: string;
    label: string;
    color: string;
    value: number;
}

interface StackedBar {
    label: string;
    parts: StackedPart[];
}

function stackedBarChart<K extends string>(
    bars: StackedBar[],
    title: string,
    legend: Segment<K>[],
    fmtTotal: (v: number) => string
): TemplateResult {
    const W = 320;
    const H = 90;
    const padX = 14;
    const padTopBottom = 24;
    const totals = bars.map(b => b.parts.reduce((s, p) => s + p.value, 0));
    const max = Math.max(1, ...totals);
    const barW = (W - padX * 2) / bars.length;
    return html`
        <div class="trend">
            <div class="label-row">
                <div class="label">${title}</div>
                <div class="legend">
                    ${legend.map(
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
                aria-label=${title}
                style="width:100%;height:${H}px;"
            >
                ${bars.map((b, i) => {
                    const x = padX + i * barW;
                    const barInner = barW * 0.7;
                    const barX = x + (barW - barInner) / 2;
                    const total = totals[i];
                    const fullH = Math.max(
                        total > 0 ? 2 : 0,
                        (total / max) * (H - padTopBottom * 2)
                    );
                    const baseY = H - padTopBottom;
                    let runningY = baseY;
                    const rects = b.parts.map(p => {
                        if (p.value <= 0) return svg``;
                        const segH = (p.value / total) * fullH;
                        runningY -= segH;
                        return svg`
                            <rect
                                x=${barX}
                                y=${runningY}
                                width=${barInner}
                                height=${segH}
                                fill=${p.color}
                            >
                                <title>${p.label}: ${p.value}</title>
                            </rect>
                        `;
                    });
                    return svg`
                        ${rects}
                        <text
                            x=${barX + barInner / 2}
                            y=${baseY - fullH - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${total > 0 ? fmtTotal(total) : ""}
                        </text>
                        <text
                            x=${barX + barInner / 2}
                            y=${H - 6}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${b.label}
                        </text>
                    `;
                })}
            </svg>
        </div>
    `;
}
