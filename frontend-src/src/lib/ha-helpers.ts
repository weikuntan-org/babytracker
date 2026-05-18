// WebSocket subscriptions for babytracker's commands (§15 #24).

// HA composes per-baby entity_ids from the device name "babytracker — <baby>"
// (em-dash slugified to underscore), producing the `babytracker_<slug>_*`
// prefix. Card lookups must use this exact prefix or every state read misses.
export function babyEntityId(
    baby: string,
    suffix: string,
    domain: "sensor" | "binary_sensor" = "sensor"
): string {
    return `${domain}.babytracker_${baby}_${suffix}`;
}

export async function fireServiceCall(
    hass: any,
    domain: string,
    service: string,
    data: Record<string, unknown>
): Promise<unknown> {
    return hass.callService(domain, service, data);
}

export function subscribeBabyConfig(
    hass: any,
    baby: string,
    cb: (data: any) => void
): () => void {
    const unsub: { current?: () => void } = {};
    (async () => {
        try {
            const unsubscribe = await hass.connection.subscribeMessage(
                cb,
                { type: "babytracker/get_baby_config", baby, subscribe: true }
            );
            unsub.current = unsubscribe;
        } catch (err) {
            console.warn("babytracker: subscribeBabyConfig failed", err);
        }
    })();
    return () => unsub.current?.();
}

export function subscribeIntegrationOptions(
    hass: any,
    cb: (data: any) => void
): () => void {
    const unsub: { current?: () => void } = {};
    (async () => {
        try {
            const unsubscribe = await hass.connection.subscribeMessage(
                cb,
                { type: "babytracker/get_integration_options", subscribe: true }
            );
            unsub.current = unsubscribe;
        } catch (err) {
            console.warn(
                "babytracker: subscribeIntegrationOptions failed",
                err
            );
        }
    })();
    return () => unsub.current?.();
}
