import { describe, expect, it } from "vitest";
import { babyEntityId } from "./ha-helpers";

describe("babyEntityId", () => {
    it("defaults to the sensor domain", () => {
        expect(babyEntityId("ayden", "recent_entries")).toBe(
            "sensor.babytracker_ayden_recent_entries"
        );
    });

    it("supports binary_sensor", () => {
        expect(babyEntityId("ayden", "sleeping", "binary_sensor")).toBe(
            "binary_sensor.babytracker_ayden_sleeping"
        );
    });

    it("composes the babytracker_ prefix that HA generates from the device name", () => {
        // The integration's DeviceInfo is `babytracker — <baby>`; HA slugifies
        // that into the entity_id, producing `babytracker_<slug>_<suffix>`.
        // This test pins the contract.
        expect(babyEntityId("ava_smith", "last_feeding")).toBe(
            "sensor.babytracker_ava_smith_last_feeding"
        );
    });
});
