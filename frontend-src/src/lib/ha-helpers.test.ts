import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { babyEntityId, subscribeBabyConfig } from "./ha-helpers";

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

describe("subscribe* retry behavior", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    function _fakeHass(
        subscribeMessage: (cb: any, msg: any) => Promise<() => void>
    ) {
        return { connection: { subscribeMessage } };
    }

    it("retries on subscribe rejection until it succeeds (regression: silent failure left all activity buttons visible after HA restart)", async () => {
        // First two calls reject (integration not yet loaded), third resolves.
        const attempts: number[] = [];
        const unsubscribeSpy = vi.fn();
        const subscribeMessage = vi.fn(async () => {
            attempts.push(Date.now());
            if (attempts.length < 3) throw new Error("not_configured");
            return unsubscribeSpy;
        });
        const hass = _fakeHass(subscribeMessage);
        const cb = vi.fn();

        const unsub = subscribeBabyConfig(hass, "ava", cb);

        // First attempt fires immediately.
        await vi.advanceTimersByTimeAsync(0);
        expect(subscribeMessage).toHaveBeenCalledTimes(1);

        // Backoff 1: 1000ms.
        await vi.advanceTimersByTimeAsync(1000);
        expect(subscribeMessage).toHaveBeenCalledTimes(2);

        // Backoff 2: 2000ms — and this attempt resolves.
        await vi.advanceTimersByTimeAsync(2000);
        expect(subscribeMessage).toHaveBeenCalledTimes(3);

        // No further attempts should be scheduled now that we're subscribed.
        await vi.advanceTimersByTimeAsync(60000);
        expect(subscribeMessage).toHaveBeenCalledTimes(3);

        // Unsubscribing should call the underlying unsubscribe handle.
        unsub();
        expect(unsubscribeSpy).toHaveBeenCalledOnce();
    });

    it("stops retrying once the caller unsubscribes", async () => {
        const subscribeMessage = vi.fn(async () => {
            throw new Error("not_configured");
        });
        const hass = _fakeHass(subscribeMessage);
        const unsub = subscribeBabyConfig(hass, "ava", vi.fn());

        await vi.advanceTimersByTimeAsync(0);
        expect(subscribeMessage).toHaveBeenCalledTimes(1);

        unsub();

        // Even after the would-be backoff window elapses, no more attempts.
        await vi.advanceTimersByTimeAsync(10000);
        expect(subscribeMessage).toHaveBeenCalledTimes(1);
    });
});
