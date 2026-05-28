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
    solidsCount: number;
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
    let solidsCount = 0;

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
            if (String((e.data as any)?.method ?? "") === "solids") {
                solidsCount += 1;
            }
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

    return {
        feedings,
        wetDiapers,
        dirtyDiapers,
        totalVolumeMl,
        sleepMinutes,
        solidsCount
    };
}

export interface DaySummary {
    // Core — always rendered
    diapers: number;
    wet: number;
    dirty: number;
    sleepMinutes: number;
    longestSleepMinutes: number;
    // Conditional — only render chip when non-zero
    bottleFeeds: number;
    bottleVolumeMl: number;
    nursingMinutes: number;
    nursingLeftMinutes: number;
    nursingRightMinutes: number;
    pumpingMl: number;
    solidsCount: number;
    tummyMinutes: number;
    walkCount: number;
    walkMinutes: number;
    medCount: number;
    vaccineCount: number;
}

function _durationMinutes(
    start: number,
    endedAt: string | null | undefined,
    now: number
): number {
    if (start <= 0) return 0;
    const end =
        endedAt != null && endedAt !== "" ? parseTimestamp(endedAt) : now;
    if (end <= start) return 0;
    return (end - start) / 60000;
}

/**
 * Public wrapper around `_durationMinutes` for ISO-string inputs. When
 * `endedAt` is null/undefined/empty the session is treated as still open
 * and `now` is used as the end. Returns 0 when the start is missing or
 * non-positive (i.e. the entry has no usable timestamp).
 */
export function sessionDurationMinutes(
    timestamp: string | null | undefined,
    endedAt: string | null | undefined,
    now: number = Date.now()
): number {
    return _durationMinutes(parseTimestamp(timestamp), endedAt, now);
}

/**
 * Compute summary chips for a single calendar day. Entries are assumed to be
 * already day-bounded by the caller (the WS subscription filters by timestamp
 * falling inside the local-day window) — duration-bearing entries (sleep,
 * tummy time, walks, nursing) are counted in full on the day they *start*,
 * even if they extend past midnight, since that's what the user sees in the
 * day's entry list.
 *
 * For in-progress sessions (no `ended_at`) `now` is used as the end. This is
 * intentional for today's view; on past days an unclosed session is unusual
 * but treated the same way to keep the function pure.
 */
export function summarizeDay(
    entries: readonly RawEntry[],
    now: number = Date.now()
): DaySummary {
    const s: DaySummary = {
        diapers: 0,
        wet: 0,
        dirty: 0,
        sleepMinutes: 0,
        longestSleepMinutes: 0,
        bottleFeeds: 0,
        bottleVolumeMl: 0,
        nursingMinutes: 0,
        nursingLeftMinutes: 0,
        nursingRightMinutes: 0,
        pumpingMl: 0,
        solidsCount: 0,
        tummyMinutes: 0,
        walkCount: 0,
        walkMinutes: 0,
        medCount: 0,
        vaccineCount: 0
    };

    for (const e of entries) {
        const ts = parseTimestamp(e.timestamp);
        const data = (e.data ?? {}) as Record<string, unknown>;

        switch (e.type) {
            case "diaper": {
                const kind = String(data.kind ?? "");
                if (kind === "wet") {
                    s.diapers += 1;
                    s.wet += 1;
                } else if (kind === "dirty") {
                    s.diapers += 1;
                    s.dirty += 1;
                } else if (kind === "both") {
                    s.diapers += 1;
                    s.wet += 1;
                    s.dirty += 1;
                }
                break;
            }
            case "sleep": {
                const mins = _durationMinutes(ts, e.ended_at, now);
                s.sleepMinutes += mins;
                if (mins > s.longestSleepMinutes) s.longestSleepMinutes = mins;
                break;
            }
            case "feeding": {
                const method = String(data.method ?? "");
                if (method === "bottle") {
                    s.bottleFeeds += 1;
                    const amount = Number(data.amount ?? 0);
                    const unit = String(data.unit ?? "");
                    if (amount > 0) {
                        s.bottleVolumeMl +=
                            unit === "oz" ? amount * ML_PER_OZ : amount;
                    }
                } else if (
                    method === "breast_left" ||
                    method === "breast_right"
                ) {
                    const mins = _durationMinutes(ts, e.ended_at, now);
                    s.nursingMinutes += mins;
                    if (method === "breast_left")
                        s.nursingLeftMinutes += mins;
                    else s.nursingRightMinutes += mins;
                } else if (method === "solids") {
                    s.solidsCount += 1;
                }
                break;
            }
            case "pumping": {
                const volume = Number(data.volume ?? 0);
                const unit = String(data.unit ?? "");
                if (volume > 0) {
                    s.pumpingMl += unit === "oz" ? volume * ML_PER_OZ : volume;
                }
                break;
            }
            case "tummy_time": {
                s.tummyMinutes += _durationMinutes(ts, e.ended_at, now);
                break;
            }
            case "walk": {
                s.walkCount += 1;
                s.walkMinutes += _durationMinutes(ts, e.ended_at, now);
                break;
            }
            case "medication": {
                s.medCount += 1;
                break;
            }
            case "vaccine": {
                s.vaccineCount += 1;
                break;
            }
        }
    }

    return s;
}

/** Minutes elapsed since the most-recently-ended sleep, or null when no
 *  completed sleep is present. Iterates and takes the max `ended_at`
 *  rather than relying on iteration order — recent_entries is sorted by
 *  start time, so the latest-start isn't necessarily the latest-end if a
 *  future change ever introduces overlap.
 */
export function timeSinceLastWakeMinutes(
    entries: any[],
    now: number = Date.now()
): number | null {
    let latestEnd: number | null = null;
    for (const e of entries) {
        if (e?.type !== "sleep" || !e?.ended_at) continue;
        const t = Date.parse(e.ended_at);
        if (!Number.isFinite(t)) continue;
        if (latestEnd === null || t > latestEnd) latestEnd = t;
    }
    if (latestEnd === null) return null;
    // Clock skew between HA and the browser can flip the sign for a
    // freshly-ended session; clamp at 0 so the chip never shows "-5m".
    return Math.max(0, (now - latestEnd) / 60000);
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

/** Human-facing label for an entry row. Sentence-cased and never
 *  prefixed with the technical type for "other" — users see the
 *  actual activity name they logged (or the chip label).
 *  Examples:
 *    - { type: "sleep" }                                → "Sleep"
 *    - { type: "tummy_time" }                           → "Tummy time"
 *    - { type: "feeding", data:{method:"breast_left"} } → "Feeding (breast left)"
 *    - { type: "feeding", data:{method:"bottle", amount:4, unit:"oz"} }
 *                                                       → "Feeding (bottle, 4 oz)"
 *    - { type: "diaper", data:{kind:"wet"} }            → "Diaper (wet)"
 *    - { type: "other", data:{name:"bath"} }            → "Bath"
 */
export function entryLabel(entry: any): string {
    const t = String(entry?.type ?? "");
    const d = entry?.data ?? {};
    if (t === "other") {
        const name = String(d.name ?? "").trim();
        return capitalizeFirst(name || _humanize(t));
    }
    const rawDetail = d.method ?? d.kind;
    const detail =
        rawDetail != null && rawDetail !== ""
            ? _humanize(String(rawDetail))
            : null;
    const main = capitalizeFirst(_humanize(t));
    if (!detail) return main;
    if (
        t === "feeding" &&
        d.amount != null &&
        d.amount !== "" &&
        d.unit
    ) {
        return `${main} (${detail}, ${d.amount} ${d.unit})`;
    }
    return `${main} (${detail})`;
}

function _humanize(s: string): string {
    return s.replace(/_/g, " ");
}

function capitalizeFirst(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
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
