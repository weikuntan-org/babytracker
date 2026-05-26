import { describe, expect, it } from "vitest";

import {
    dateInputToIso,
    isoToDateInput,
    isoToLocalInput,
    localInputToIso
} from "./_helpers";
import { requestDeleteOrPromptImported } from "./_host";

describe("localInputToIso", () => {
    it("returns undefined for empty input", () => {
        expect(localInputToIso("")).toBeUndefined();
    });

    it("returns undefined for unparseable input", () => {
        expect(localInputToIso("not a date")).toBeUndefined();
    });

    it("converts a YYYY-MM-DDTHH:MM local value to an ISO string", () => {
        // Local-time → UTC depends on TZ; assert the result is a valid
        // parseable ISO and that Date.parse round-trips to the original
        // local moment.
        const out = localInputToIso("2026-05-20T08:30");
        expect(out).toBeTruthy();
        expect(Number.isNaN(Date.parse(out!))).toBe(false);
    });
});

describe("isoToLocalInput", () => {
    it("returns '' for null/undefined/empty", () => {
        expect(isoToLocalInput(undefined)).toBe("");
        expect(isoToLocalInput(null)).toBe("");
        expect(isoToLocalInput("")).toBe("");
    });

    it("returns '' for unparseable input", () => {
        expect(isoToLocalInput("not a date")).toBe("");
    });

    it("round-trips: localInputToIso → isoToLocalInput preserves the wall-clock value", () => {
        const original = "2026-05-20T08:30";
        const iso = localInputToIso(original)!;
        expect(isoToLocalInput(iso)).toBe(original);
    });
});

describe("dateInputToIso", () => {
    it("returns undefined for empty input", () => {
        expect(dateInputToIso("")).toBeUndefined();
    });

    it("anchors to local midnight (start of day)", () => {
        const iso = dateInputToIso("2026-05-20")!;
        expect(iso).toBeTruthy();
        // The wall-clock date should round-trip back to the same
        // YYYY-MM-DD form for the test machine's local timezone.
        expect(isoToDateInput(iso)).toBe("2026-05-20");
        // And the local wall-clock time should be 00:00 — the whole
        // point of this anchor change is that date-only events sort to
        // the very start of the day on the chart.
        const local = new Date(iso);
        expect(local.getHours()).toBe(0);
        expect(local.getMinutes()).toBe(0);
    });
});

describe("isoToDateInput", () => {
    it("returns '' for falsy/unparseable input", () => {
        expect(isoToDateInput(undefined)).toBe("");
        expect(isoToDateInput("")).toBe("");
        expect(isoToDateInput("not a date")).toBe("");
    });
});

describe("requestDeleteOrPromptImported", () => {
    it("invokes deleteNow and returns null for user-authored entries", () => {
        const calls: string[] = [];
        const out = requestDeleteOrPromptImported(
            { id: "e1", type: "diaper", source: "user" },
            (id) => calls.push(id)
        );
        expect(out).toBeNull();
        expect(calls).toEqual(["e1"]);
    });

    it("treats a missing source as user-authored", () => {
        const calls: string[] = [];
        const out = requestDeleteOrPromptImported({ id: "e1" }, (id) =>
            calls.push(id)
        );
        expect(out).toBeNull();
        expect(calls).toEqual(["e1"]);
    });

    it("returns a confirm_delete_imported modal payload for imported entries", () => {
        const calls: string[] = [];
        const out = requestDeleteOrPromptImported(
            {
                id: "e2",
                type: "feeding",
                source: "procare",
                staff: "Ms. Smith"
            },
            (id) => calls.push(id)
        );
        expect(calls).toEqual([]);
        expect(out).toEqual({
            kind: "confirm_delete_imported",
            entryId: "e2",
            entryType: "feeding",
            source: "procare",
            staff: "Ms. Smith"
        });
    });

    it("defaults entryType to 'entry' and staff to null when fields are missing", () => {
        const out = requestDeleteOrPromptImported(
            { id: "e3", source: "procare" },
            () => {}
        );
        expect(out).toEqual({
            kind: "confirm_delete_imported",
            entryId: "e3",
            entryType: "entry",
            source: "procare",
            staff: null
        });
    });
});
