import { describe, expect, it } from "vitest";
import { fitToBox, pathFromPoints } from "./chart";

describe("chart helpers", () => {
    it("fitToBox returns empty array for empty input", () => {
        expect(fitToBox([], 100, 100)).toEqual([]);
    });

    it("fitToBox scales points within bounds", () => {
        const fitted = fitToBox(
            [
                { x: 0, y: 0 },
                { x: 10, y: 20 }
            ],
            100,
            100,
            10
        );
        expect(fitted[0].x).toBeCloseTo(10);
        expect(fitted[1].x).toBeCloseTo(90);
    });

    it("pathFromPoints joins to an SVG path", () => {
        const path = pathFromPoints([
            { x: 0, y: 0 },
            { x: 1, y: 1 }
        ]);
        expect(path).toContain("M0,0");
        expect(path).toContain("L1,1");
    });
});
