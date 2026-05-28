// Quick-log grid — buttons filtered by eligibility (§4.10).
// Every button opens a modal so the user can confirm/pick the time:
//  - Diaper, Bottle, Solids, Other: point-in-time entries with a single When.
//  - Sleep, Tummy, Walk, Breast feeds: session entries with start + optional
//    end. If End is left blank → starts an open session at Started. If filled
//    → log_* retroactively with both bounds.
//
// Until the baby config arrives over WS (on first load / HA restart) we
// render a loading spinner instead of falling back to "all activities":
// showing disabled buttons gave users a false affordance and let them
// queue services that the eligibility gate would reject on the server.
// The WS subscribe helpers retry with backoff, so the spinner converges
// on the real grid as soon as the integration is up.
import { html, type TemplateResult } from "lit";
import { displayBabyName } from "../lib/ha-helpers";

type ServiceCaller = (
    service: string,
    data: Record<string, unknown>,
    sourceBtn?: EventTarget | null
) => Promise<unknown>;

export type SessionRequest =
    | { activity: "sleep" | "tummy_time" | "walk" }
    | { activity: "feeding"; method: "breast_left" | "breast_right" };

export type ModalRequester = (
    target: "diaper" | "bottle" | "solids" | "other" | SessionRequest
) => void;

export function quickLogTemplate(
    babyConfig: any | undefined,
    baby: string,
    _call: ServiceCaller,
    requestModal: ModalRequester
): TemplateResult {
    if (!babyConfig) {
        return html`
            <div
                class="section quick-log-loading"
                role="status"
                aria-live="polite"
                aria-label="Loading activities"
            >
                <span class="spinner" aria-hidden="true"></span>
                <span class="muted">Loading activities…</span>
            </div>
        `;
    }
    const activities: string[] = babyConfig.enabled_activities ?? [];
    const methods: string[] = babyConfig.enabled_feeding_methods ?? [];

    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const displayName = displayBabyName(babyConfig.name ?? baby);
    const buttons: TemplateResult[] = [];

    if (activities.includes("diaper")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log diaper for ${displayName}"
                    @click=${() => requestModal("diaper")}
                >
                    <ha-icon icon="mdi:human-baby-changing-table"></ha-icon>
                    Diaper
                </button>
            `
        );
    }
    if (activities.includes("feeding")) {
        for (const method of methods) {
            if (method === "bottle") {
                buttons.push(
                    html`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${displayName}"
                            @click=${() => requestModal("bottle")}
                        >
                            <ha-icon icon="mdi:baby-bottle-outline"></ha-icon>
                            Bottle
                        </button>
                    `
                );
            } else if (method === "solids") {
                buttons.push(
                    html`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${displayName}"
                            @click=${() => requestModal("solids")}
                        >
                            <ha-icon icon="mdi:silverware-spoon"></ha-icon>
                            Solids
                        </button>
                    `
                );
            } else if (method === "breast_left" || method === "breast_right") {
                buttons.push(
                    html`
                        <button
                            class="quick"
                            aria-label="Log ${method} feeding for ${displayName}"
                            @click=${() =>
                                requestModal({ activity: "feeding", method })}
                        >
                            <ha-icon icon="mdi:mother-nurse"></ha-icon>
                            ${cap(method.replace("_", " "))}
                        </button>
                    `
                );
            }
        }
    }
    if (activities.includes("sleep")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log sleep for ${displayName}"
                    @click=${() => requestModal({ activity: "sleep" })}
                >
                    <ha-icon icon="mdi:bed"></ha-icon>
                    Sleep
                </button>
            `
        );
    }
    if (activities.includes("tummy_time")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${displayName}"
                    @click=${() => requestModal({ activity: "tummy_time" })}
                >
                    <ha-icon icon="mdi:human-handsup"></ha-icon>
                    Tummy time
                </button>
            `
        );
    }
    if (activities.includes("walk")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log walk for ${displayName}"
                    @click=${() => requestModal({ activity: "walk" })}
                >
                    <ha-icon icon="mdi:walk"></ha-icon>
                    Walk
                </button>
            `
        );
    }
    if (activities.includes("other")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log other activity for ${displayName}"
                    @click=${() => requestModal("other")}
                >
                    <ha-icon icon="mdi:dots-horizontal"></ha-icon>
                    Other
                </button>
            `
        );
    }

    return html`
        <div class="section grid" role="group" aria-label="Quick log">
            ${buttons}
        </div>
    `;
}
