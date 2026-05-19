// 7-day daily-bucket bar charts: sleep, feedings, bottle volume, diapers.
// Data source is the same `sensor.babytracker_<baby>_recent_entries`
// attribute the rest of the card reads. Caveat: the sensor caps at
// RECENT_ENTRIES_CAP (120) entries, so days at the far edge of the window
// can underreport if the baby has more than ~17 events/day. Acceptable for
// at-a-glance trends; a richer history would need a WS history command.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ML_PER_OZ = 29.5735;

interface DayBucket {
    label: string; // e.g. "Mon"
    sleepMinutes: number;
    feedings: number;
    bottleMl: number;
    diapers: number;
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
        buckets.push({
            label: weekday(d),
            sleepMinutes: 0,
            feedings: 0,
            bottleMl: 0,
            diapers: 0
        });
    }

    const windowStart = todayMidnight.getTime() - (days - 1) * ONE_DAY_MS;
    for (const e of entries) {
        const ts = Date.parse(e?.timestamp);
        if (!Number.isFinite(ts)) continue;
        const idx = Math.floor((ts - windowStart) / ONE_DAY_MS);
        if (idx < 0 || idx >= days) continue;
        const b = buckets[idx];
        if (e.type === "feeding") {
            b.feedings += 1;
            const amount = Number(e?.data?.amount ?? 0);
            const unit = String(e?.data?.unit ?? "");
            if (amount > 0 && unit === "oz") b.bottleMl += amount * ML_PER_OZ;
            else if (amount > 0 && unit === "ml") b.bottleMl += amount;
        } else if (e.type === "diaper") {
            b.diapers += 1;
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

    if (buckets.every(b => b.sleepMinutes === 0 && b.feedings === 0 && b.diapers === 0)) {
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
            ${barChart(
                buckets.map(b => ({ label: b.label, value: b.feedings })),
                "Feedings/day",
                v => `${v}`
            )}
            ${barChart(
                buckets.map(b => ({ label: b.label, value: b.bottleMl })),
                "Bottle (oz/day)",
                v => (v / ML_PER_OZ).toFixed(1)
            )}
            ${barChart(
                buckets.map(b => ({ label: b.label, value: b.diapers })),
                "Diapers/day",
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
                    return html`
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
