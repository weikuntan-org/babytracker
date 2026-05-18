// Pure helpers shared by the card's "Last 24 hours" list and the summary
// chips above it. Kept side-effect free so they're trivially unit-testable.

export interface RawEntry {
    id?: string;
    type?: string;
    timestamp?: string;
    ended_at?: string | null;
    data?: Record<string, unknown> | null;
    [extra: string]: unknown;
}

export interface Summary {
    feedings: number;
    wetDiapers: number;
    dirtyDiapers: number;
    totalVolumeMl: number;
    sleepMinutes: number;
}

const ML_PER_OZ = 29.5735;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Parse an ISO8601 timestamp to ms-since-epoch; 0 if missing/invalid. */
export function parseTimestamp(iso?: string | null): number {
    if (!iso) return 0;
    const t = Date.parse(iso);
    return Number.isNaN(t) ? 0 : t;
}

/**
 * Filter `entries` to those whose timestamp falls within the last `windowMs`
 * relative to `now`, then sort newest-first.
 *
 * Defaults to a 24-hour window using the wall-clock now. `now` is parameterised
 * so tests can pin a deterministic clock.
 */
export function entriesInLastWindow(
    entries: readonly RawEntry[],
    windowMs: number = ONE_DAY_MS,
    now: number = Date.now()
): RawEntry[] {
    const cutoff = now - windowMs;
    return entries
        .filter((e) => parseTimestamp(e.timestamp) >= cutoff)
        .slice()
        .sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
}

/**
 * Compute the 24-hour summary chips from an entry list. Sleep minutes are
 * counted only for the portion of each session that falls inside the
 * window — an in-progress session uses `now` as the end. Volume normalises
 * any unit-bearing feeding entry to ml internally so chips can display
 * either unit consistently.
 */
export function summarize(
    entries: readonly RawEntry[],
    now: number = Date.now(),
    windowMs: number = ONE_DAY_MS
): Summary {
    const cutoff = now - windowMs;
    let feedings = 0;
    let wetDiapers = 0;
    let dirtyDiapers = 0;
    let totalVolumeMl = 0;
    let sleepMinutes = 0;

    for (const e of entries) {
        const ts = parseTimestamp(e.timestamp);

        if (e.type === "sleep") {
            // Sleep is a duration event — include it if ANY portion overlaps
            // the window (a session that started 30h ago and is still going
            // contributes its trailing 24h).
            const start = ts;
            const end =
                e.ended_at != null && e.ended_at !== ""
                    ? parseTimestamp(e.ended_at)
                    : now;
            if (start > 0 && end > start && end > cutoff) {
                const overlapStart = Math.max(start, cutoff);
                const overlapEnd = Math.min(end, now);
                if (overlapEnd > overlapStart) {
                    sleepMinutes += (overlapEnd - overlapStart) / 60000;
                }
            }
            continue;
        }

        // Point-in-time entries: skip if outside the window.
        if (ts < cutoff) continue;

        if (e.type === "feeding") {
            feedings += 1;
            const amount = Number((e.data as any)?.amount ?? 0);
            const unit = String((e.data as any)?.unit ?? "");
            if (amount > 0) {
                totalVolumeMl += unit === "oz" ? amount * ML_PER_OZ : amount;
            }
        } else if (e.type === "diaper") {
            const kind = String((e.data as any)?.kind ?? "");
            if (kind === "wet") wetDiapers += 1;
            else if (kind === "dirty") dirtyDiapers += 1;
            else if (kind === "both") {
                wetDiapers += 1;
                dirtyDiapers += 1;
            }
        }
    }

    return { feedings, wetDiapers, dirtyDiapers, totalVolumeMl, sleepMinutes };
}

/** Format minutes as "Xm", "Xh", or "Xh Ym". 0 or NaN renders as "0m". */
export function formatMinutes(mins: number): string {
    if (!Number.isFinite(mins) || mins <= 0) return "0m";
    if (mins < 60) return `${Math.round(mins)}m`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Format ml as user-facing volume. Prefers oz once the amount reaches 1 oz;
 * very small amounts (< 1 oz) render as ml so they're not misleadingly 0.0 oz.
 */
export function formatVolume(ml: number): string {
    if (!Number.isFinite(ml) || ml <= 0) return "0 oz";
    const oz = ml / ML_PER_OZ;
    if (oz >= 1) return `${oz.toFixed(1)} oz`;
    return `${Math.round(ml)} ml`;
}

/**
 * Format an ISO timestamp as a local HH:MM clock string for compact list rows.
 * Returns "" for missing/invalid input.
 */
export function formatClock(iso?: string | null): string {
    const t = parseTimestamp(iso);
    if (t === 0) return "";
    return new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}
