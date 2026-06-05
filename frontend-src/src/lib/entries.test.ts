import { describe, expect, it } from "vitest";
import {
    entriesInLastWindow,
    entryLabel,
    formatClock,
    formatMinutes,
    formatVolume,
    parseTimestamp,
    sessionDurationMinutes,
    summarize,
    summarizeDay,
    timeSinceLastWakeMinutes
} from "./entries";

// Fixed "now" for deterministic windowing.
const NOW = Date.parse("2026-05-18T22:30:00Z");
const HOUR = 60 * 60 * 1000;

function iso(offsetHoursFromNow: number): string {
    return new Date(NOW + offsetHoursFromNow * HOUR).toISOString();
}

describe("parseTimestamp", () => {
    it("returns 0 for empty/undefined", () => {
        expect(parseTimestamp(undefined)).toBe(0);
        expect(parseTimestamp("")).toBe(0);
        expect(parseTimestamp(null)).toBe(0);
    });

    it("returns 0 for unparseable strings", () => {
        expect(parseTimestamp("not a date")).toBe(0);
    });

    it("parses ISO8601 with timezone", () => {
        expect(parseTimestamp("2026-05-18T22:30:00Z")).toBe(NOW);
    });
});

describe("entriesInLastWindow", () => {
    const entries = [
        { id: "a", timestamp: iso(-2) }, // 2h ago — in
        { id: "b", timestamp: iso(-23) }, // 23h ago — in
        { id: "c", timestamp: iso(-25) }, // 25h ago — out
        { id: "d", timestamp: iso(-0.5) }, // 30min ago — in
        { id: "e", timestamp: undefined } // bad — out
    ];

    it("filters to entries inside the trailing 24h window", () => {
        const out = entriesInLastWindow(entries, 24 * HOUR, NOW);
        expect(out.map((e) => e.id)).toEqual(["d", "a", "b"]);
    });

    it("sorts newest-first", () => {
        const out = entriesInLastWindow(entries, 24 * HOUR, NOW);
        const stamps = out.map((e) => parseTimestamp(e.timestamp));
        for (let i = 1; i < stamps.length; i++) {
            expect(stamps[i - 1]).toBeGreaterThanOrEqual(stamps[i]);
        }
    });

    it("excludes entries with missing/invalid timestamps", () => {
        const out = entriesInLastWindow(entries, 24 * HOUR, NOW);
        expect(out.map((e) => e.id)).not.toContain("e");
    });

    it("does not mutate the input array", () => {
        const input = entries.slice();
        const snapshot = JSON.stringify(input);
        entriesInLastWindow(input, 24 * HOUR, NOW);
        expect(JSON.stringify(input)).toBe(snapshot);
    });

    it("accepts a custom window", () => {
        const out = entriesInLastWindow(entries, 1 * HOUR, NOW);
        expect(out.map((e) => e.id)).toEqual(["d"]);
    });
});

describe("summarize", () => {
    it("counts feedings and totals volume in ml", () => {
        const entries = [
            {
                type: "feeding",
                timestamp: iso(-1),
                data: { method: "bottle", amount: 6, unit: "oz" }
            },
            {
                type: "feeding",
                timestamp: iso(-3),
                data: { method: "bottle", amount: 120, unit: "ml" }
            },
            {
                type: "feeding",
                timestamp: iso(-5),
                data: { method: "solids" } // no amount → counted, not volumed
            }
        ];
        const s = summarize(entries, NOW);
        expect(s.feedings).toBe(3);
        // 6oz ≈ 177.4 ml + 120 ml = ~297.4
        expect(s.totalVolumeMl).toBeCloseTo(6 * 29.5735 + 120, 4);
        expect(s.solidsCount).toBe(1);
    });

    it("classifies diaper kinds (both increments wet AND dirty)", () => {
        const entries = [
            { type: "diaper", timestamp: iso(-1), data: { kind: "wet" } },
            { type: "diaper", timestamp: iso(-2), data: { kind: "dirty" } },
            { type: "diaper", timestamp: iso(-3), data: { kind: "both" } },
            { type: "diaper", timestamp: iso(-4), data: { kind: "wet" } }
        ];
        const s = summarize(entries, NOW);
        expect(s.diapers).toBe(4); // four diaper events total
        expect(s.wetDiapers).toBe(3); // wet + both + wet
        expect(s.dirtyDiapers).toBe(2); // dirty + both
    });

    it("clips sleep sessions to the window start", () => {
        // A 30h session that started 30h ago: only the last 24h count.
        const entries = [
            {
                type: "sleep",
                timestamp: iso(-30),
                ended_at: iso(0)
            }
        ];
        const s = summarize(entries, NOW);
        expect(s.sleepMinutes).toBeCloseTo(24 * 60, 2);
    });

    it("treats an in-progress sleep session as ending at now", () => {
        const entries = [
            {
                type: "sleep",
                timestamp: iso(-1), // started 1h ago
                ended_at: null
            }
        ];
        const s = summarize(entries, NOW);
        expect(s.sleepMinutes).toBeCloseTo(60, 2);
    });

    it("ignores entries outside the window", () => {
        const entries = [
            { type: "feeding", timestamp: iso(-25), data: { amount: 6, unit: "oz" } },
            { type: "diaper", timestamp: iso(-30), data: { kind: "wet" } }
        ];
        const s = summarize(entries, NOW);
        expect(s).toEqual({
            feedings: 0,
            diapers: 0,
            wetDiapers: 0,
            dirtyDiapers: 0,
            totalVolumeMl: 0,
            sleepMinutes: 0,
            solidsCount: 0
        });
    });
});

describe("summarizeDay", () => {
    it("returns zeros for an empty day", () => {
        const s = summarizeDay([], NOW);
        expect(s.diapers).toBe(0);
        expect(s.sleepMinutes).toBe(0);
        expect(s.longestSleepMinutes).toBe(0);
        expect(s.bottleFeeds).toBe(0);
        expect(s.nursingMinutes).toBe(0);
        expect(s.pumpingMl).toBe(0);
        expect(s.solidsCount).toBe(0);
        expect(s.tummyMinutes).toBe(0);
        expect(s.walkCount).toBe(0);
        expect(s.medCount).toBe(0);
        expect(s.vaccineCount).toBe(0);
    });

    it("counts diapers; `both` increments wet AND dirty (matches summarize)", () => {
        const entries = [
            { type: "diaper", timestamp: iso(-1), data: { kind: "wet" } },
            { type: "diaper", timestamp: iso(-2), data: { kind: "dirty" } },
            { type: "diaper", timestamp: iso(-3), data: { kind: "both" } },
            { type: "diaper", timestamp: iso(-4), data: { kind: "wet" } }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.diapers).toBe(4);
        expect(s.wet).toBe(3); // wet + both + wet
        expect(s.dirty).toBe(2); // dirty + both
    });

    it("sums sleep durations and tracks the longest single stretch", () => {
        const entries = [
            { type: "sleep", timestamp: iso(-8), ended_at: iso(-7) }, // 60m
            { type: "sleep", timestamp: iso(-4), ended_at: iso(-0.5) }, // 210m
            { type: "sleep", timestamp: iso(-12), ended_at: iso(-10) } // 120m
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.sleepMinutes).toBeCloseTo(60 + 210 + 120, 2);
        expect(s.longestSleepMinutes).toBeCloseTo(210, 2);
    });

    it("treats an in-progress sleep as ending at `now`", () => {
        const entries = [
            { type: "sleep", timestamp: iso(-2), ended_at: null }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.sleepMinutes).toBeCloseTo(120, 2);
        expect(s.longestSleepMinutes).toBeCloseTo(120, 2);
    });

    it("counts bottle feeds separately from nursing/solids and totals volume", () => {
        const entries = [
            {
                type: "feeding",
                timestamp: iso(-1),
                data: { method: "bottle", amount: 4, unit: "oz" }
            },
            {
                type: "feeding",
                timestamp: iso(-3),
                data: { method: "bottle", amount: 100, unit: "ml" }
            },
            {
                type: "feeding",
                timestamp: iso(-5),
                ended_at: iso(-4.5),
                data: { method: "breast_left" }
            },
            {
                type: "feeding",
                timestamp: iso(-6),
                data: { method: "solids" }
            }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.bottleFeeds).toBe(2);
        expect(s.bottleVolumeMl).toBeCloseTo(4 * 29.5735 + 100, 4);
        expect(s.nursingMinutes).toBeCloseTo(30, 2);
        expect(s.solidsCount).toBe(1);
    });

    it("splits nursing minutes per side", () => {
        const entries = [
            {
                type: "feeding",
                timestamp: iso(-2),
                ended_at: iso(-1.75),
                data: { method: "breast_left" } // 15m
            },
            {
                type: "feeding",
                timestamp: iso(-4),
                ended_at: iso(-3.5),
                data: { method: "breast_right" } // 30m
            }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.nursingMinutes).toBeCloseTo(45, 2);
        expect(s.nursingLeftMinutes).toBeCloseTo(15, 2);
        expect(s.nursingRightMinutes).toBeCloseTo(30, 2);
    });

    it("totals pumping volume across sessions, normalising oz→ml", () => {
        const entries = [
            {
                type: "pumping",
                timestamp: iso(-1),
                data: { volume: 4, unit: "oz" }
            },
            {
                type: "pumping",
                timestamp: iso(-3),
                data: { volume: 80, unit: "ml" }
            }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.pumpingMl).toBeCloseTo(4 * 29.5735 + 80, 4);
    });

    it("counts tummy time, walks, meds, and vaccines", () => {
        const entries = [
            { type: "tummy_time", timestamp: iso(-2), ended_at: iso(-1.75) },
            { type: "walk", timestamp: iso(-3), ended_at: iso(-2.5) },
            { type: "walk", timestamp: iso(-5), ended_at: iso(-4) },
            { type: "medication", timestamp: iso(-6), data: {} },
            { type: "medication", timestamp: iso(-7), data: {} },
            { type: "vaccine", timestamp: iso(-8), data: {} }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.tummyMinutes).toBeCloseTo(15, 2);
        expect(s.walkCount).toBe(2);
        expect(s.walkMinutes).toBeCloseTo(90, 2);
        expect(s.medCount).toBe(2);
        expect(s.vaccineCount).toBe(1);
    });

    it("`both`-only day reports the diaper once but counts toward both wet and dirty", () => {
        const entries = [
            { type: "diaper", timestamp: iso(-1), data: { kind: "both" } }
        ];
        const s = summarizeDay(entries, NOW);
        expect(s.diapers).toBe(1);
        expect(s.wet).toBe(1);
        expect(s.dirty).toBe(1);
    });
});

describe("sessionDurationMinutes", () => {
    it("returns elapsed minutes for a completed session", () => {
        const mins = sessionDurationMinutes(iso(-2), iso(-0.5), NOW); // 90m
        expect(mins).toBeCloseTo(90, 2);
    });

    it("uses `now` as the end for an in-progress session", () => {
        const mins = sessionDurationMinutes(iso(-1), null, NOW); // 60m
        expect(mins).toBeCloseTo(60, 2);
    });

    it("treats empty-string endedAt as in-progress", () => {
        const mins = sessionDurationMinutes(iso(-1), "", NOW);
        expect(mins).toBeCloseTo(60, 2);
    });

    it("returns 0 for a missing/invalid start timestamp", () => {
        expect(sessionDurationMinutes(undefined, null, NOW)).toBe(0);
        expect(sessionDurationMinutes("nope", null, NOW)).toBe(0);
    });

    it("returns 0 when end precedes start (clock skew safety)", () => {
        expect(sessionDurationMinutes(iso(-1), iso(-2), NOW)).toBe(0);
    });
});

describe("formatMinutes", () => {
    it("renders zero/invalid as '0m'", () => {
        expect(formatMinutes(0)).toBe("0m");
        expect(formatMinutes(-5)).toBe("0m");
        expect(formatMinutes(NaN)).toBe("0m");
    });

    it("renders minutes under an hour", () => {
        expect(formatMinutes(5)).toBe("5m");
        expect(formatMinutes(59)).toBe("59m");
    });

    it("renders even hours without the minutes suffix", () => {
        expect(formatMinutes(60)).toBe("1h");
        expect(formatMinutes(180)).toBe("3h");
    });

    it("renders hours+minutes for non-whole hours", () => {
        expect(formatMinutes(90)).toBe("1h 30m");
        expect(formatMinutes(125)).toBe("2h 5m");
    });
});

describe("formatVolume", () => {
    it("renders zero/invalid as '0 oz'", () => {
        expect(formatVolume(0)).toBe("0 oz");
        expect(formatVolume(NaN)).toBe("0 oz");
    });

    it("prefers oz once the amount reaches 1 oz", () => {
        expect(formatVolume(29.5735)).toBe("1.0 oz");
        expect(formatVolume(177.441)).toBe("6.0 oz");
    });

    it("falls back to ml for tiny amounts under 1 oz", () => {
        expect(formatVolume(10)).toBe("10 ml");
        expect(formatVolume(29)).toBe("29 ml");
    });
});

describe("formatClock", () => {
    it("renders empty for missing input", () => {
        expect(formatClock(undefined)).toBe("");
        expect(formatClock("")).toBe("");
        expect(formatClock("garbage")).toBe("");
    });

    it("renders an HH:MM clock from an ISO timestamp", () => {
        const s = formatClock("2026-05-18T22:30:00Z");
        // Exact rendering depends on the test runner's locale/timezone, so
        // only assert structure: two pairs of digits separated by a colon.
        expect(s).toMatch(/^\d{1,2}:\d{2}(\s?[AP]M)?$/i);
    });
});

describe("timeSinceLastWakeMinutes", () => {
    it("returns null when no completed sleep is present", () => {
        expect(timeSinceLastWakeMinutes([], NOW)).toBeNull();
        // An open session (no ended_at) is not a "wake" yet.
        expect(
            timeSinceLastWakeMinutes(
                [{ type: "sleep", timestamp: iso(-2) }],
                NOW
            )
        ).toBeNull();
    });

    it("returns minutes since the latest ended_at across all entries", () => {
        // recent_entries is sorted by start time; the LATEST end may
        // belong to an earlier-sorted entry if naps ever overlapped.
        const entries = [
            { type: "sleep", timestamp: iso(-1), ended_at: iso(-0.5) },
            { type: "sleep", timestamp: iso(-3), ended_at: iso(-0.25) },
            { type: "feeding", timestamp: iso(-0.1), data: {} }
        ];
        const mins = timeSinceLastWakeMinutes(entries, NOW);
        // 0.25h × 60 = 15m since the latest end.
        expect(mins).toBeCloseTo(15, 2);
    });

    it("clamps negative deltas to 0 (clock skew safety)", () => {
        // ended_at in the future relative to NOW.
        const entries = [
            { type: "sleep", timestamp: iso(-1), ended_at: iso(1) }
        ];
        expect(timeSinceLastWakeMinutes(entries, NOW)).toBe(0);
    });

    it("ignores non-sleep entries and invalid timestamps", () => {
        const entries = [
            { type: "diaper", timestamp: iso(-1) },
            { type: "sleep", timestamp: iso(-2), ended_at: "garbage" },
            { type: "sleep", timestamp: iso(-3), ended_at: iso(-1) }
        ];
        const mins = timeSinceLastWakeMinutes(entries, NOW);
        expect(mins).toBeCloseTo(60, 2);
    });
});

describe("entryLabel", () => {
    it("capitalizes the leading letter of plain types", () => {
        expect(entryLabel({ type: "sleep" })).toBe("Sleep");
        expect(entryLabel({ type: "walk" })).toBe("Walk");
        expect(entryLabel({ type: "growth" })).toBe("Growth");
        expect(entryLabel({ type: "medication" })).toBe("Medication");
    });

    it("replaces underscores with spaces in type names", () => {
        expect(entryLabel({ type: "tummy_time" })).toBe("Tummy time");
    });

    it("renders feedings with method and humanises breast_left/right", () => {
        expect(
            entryLabel({ type: "feeding", data: { method: "breast_left" } })
        ).toBe("Feeding (breast left)");
        expect(
            entryLabel({ type: "feeding", data: { method: "solids" } })
        ).toBe("Feeding (solids)");
    });

    it("includes amount/unit on bottle feedings", () => {
        expect(
            entryLabel({
                type: "feeding",
                data: { method: "bottle", amount: 4, unit: "oz" }
            })
        ).toBe("Feeding (bottle, 4 oz)");
    });

    it("renders diapers with their kind", () => {
        expect(entryLabel({ type: "diaper", data: { kind: "wet" } })).toBe(
            "Diaper (wet)"
        );
        expect(entryLabel({ type: "diaper", data: { kind: "both" } })).toBe(
            "Diaper (both)"
        );
    });

    it("for 'other' entries shows just the user-provided name (capitalised)", () => {
        expect(entryLabel({ type: "other", data: { name: "bath" } })).toBe(
            "Bath"
        );
        // Quick-log chip labels arrive already title-cased; left alone.
        expect(
            entryLabel({ type: "other", data: { name: "Butt wash" } })
        ).toBe("Butt wash");
        // User-typed entries get the leading letter capitalised, the rest
        // of the casing is left as the user typed it.
        expect(
            entryLabel({ type: "other", data: { name: "doctor visit" } })
        ).toBe("Doctor visit");
    });

    it("falls back to the type when 'other' has no name", () => {
        expect(entryLabel({ type: "other", data: {} })).toBe("Other");
        expect(entryLabel({ type: "other" })).toBe("Other");
    });
});
