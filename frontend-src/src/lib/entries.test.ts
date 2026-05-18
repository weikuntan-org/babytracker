import { describe, expect, it } from "vitest";
import {
    entriesInLastWindow,
    formatClock,
    formatMinutes,
    formatVolume,
    parseTimestamp,
    summarize
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
    });

    it("classifies diaper kinds (both increments wet AND dirty)", () => {
        const entries = [
            { type: "diaper", timestamp: iso(-1), data: { kind: "wet" } },
            { type: "diaper", timestamp: iso(-2), data: { kind: "dirty" } },
            { type: "diaper", timestamp: iso(-3), data: { kind: "both" } },
            { type: "diaper", timestamp: iso(-4), data: { kind: "wet" } }
        ];
        const s = summarize(entries, NOW);
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
            wetDiapers: 0,
            dirtyDiapers: 0,
            totalVolumeMl: 0,
            sleepMinutes: 0
        });
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
