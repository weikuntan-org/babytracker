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

export function displayBabyName(name: string | undefined | null): string {
    if (typeof name !== "string" || name.length === 0) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export async function fireServiceCall(
    hass: any,
    domain: string,
    service: string,
    data: Record<string, unknown>
): Promise<unknown> {
    return hass.callService(domain, service, data);
}

/** Subscribe to a babytracker WS command with retry-on-failure.
 *
 * Background: on HA restart the babytracker-card mounts before the
 * integration finishes loading. The WS server returns `not_configured`
 * (or `unknown_baby` if babies haven't deserialised yet), the subscribe
 * promise rejects, and the card silently falls back to its defaults
 * forever — most visibly, all activity buttons appear in the quick-log
 * grid because `enabled_activities` is missing.
 *
 * Retries with exponential backoff (1, 2, 4, 8, 16, 30, 30…s) until
 * the subscription succeeds or the caller unsubscribes. No total
 * attempt cap — the page is already open, and at 30 s steady-state
 * it's two RPCs/minute, well below anything HA would flag.
 */
function _subscribeWithRetry(
    hass: any,
    message: Record<string, unknown> & { type: string },
    cb: (data: any) => void,
    label: string
): () => void {
    const state: {
        unsub?: () => void;
        cancelled: boolean;
        timer?: ReturnType<typeof setTimeout>;
    } = { cancelled: false };

    const attempt = async (n: number): Promise<void> => {
        if (state.cancelled) return;
        try {
            const unsubscribe = await hass.connection.subscribeMessage(
                cb,
                message
            );
            // Caller may have unsubscribed while we were awaiting; honour it.
            if (state.cancelled) {
                try {
                    unsubscribe();
                } catch {
                    // Ignore — already torn down by the connection.
                }
                return;
            }
            state.unsub = unsubscribe;
        } catch (err) {
            console.warn(`babytracker: ${label} failed (attempt ${n + 1})`, err);
            if (state.cancelled) return;
            const delay = Math.min(30000, 1000 * 2 ** n);
            state.timer = setTimeout(() => {
                state.timer = undefined;
                attempt(n + 1);
            }, delay);
        }
    };

    attempt(0);

    return () => {
        state.cancelled = true;
        if (state.timer != null) {
            clearTimeout(state.timer);
            state.timer = undefined;
        }
        state.unsub?.();
    };
}

export function subscribeBabyConfig(
    hass: any,
    baby: string,
    cb: (data: any) => void
): () => void {
    return _subscribeWithRetry(
        hass,
        { type: "babytracker/get_baby_config", baby, subscribe: true },
        cb,
        "subscribeBabyConfig"
    );
}

export function subscribeIntegrationOptions(
    hass: any,
    cb: (data: any) => void
): () => void {
    return _subscribeWithRetry(
        hass,
        { type: "babytracker/get_integration_options", subscribe: true },
        cb,
        "subscribeIntegrationOptions"
    );
}

export function subscribeEntriesInRange(
    hass: any,
    baby: string,
    startIso: string,
    endIso: string,
    cb: (entries: any[]) => void
): () => void {
    return _subscribeWithRetry(
        hass,
        {
            type: "babytracker/list_entries_in_range",
            baby,
            start: startIso,
            end: endIso,
            subscribe: true
        },
        cb,
        "subscribeEntriesInRange"
    );
}

export function subscribeVaccines(
    hass: any,
    baby: string,
    cb: (entries: any[]) => void
): () => void {
    return _subscribeWithRetry(
        hass,
        { type: "babytracker/list_vaccines", baby, subscribe: true },
        cb,
        "subscribeVaccines"
    );
}

export function subscribeGrowth(
    hass: any,
    baby: string,
    cb: (entries: any[]) => void
): () => void {
    return _subscribeWithRetry(
        hass,
        { type: "babytracker/list_growth", baby, subscribe: true },
        cb,
        "subscribeGrowth"
    );
}
