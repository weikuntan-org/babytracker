// Quick-log grid — buttons filtered by eligibility (§4.10).
// Every button opens a modal so the user can confirm/pick the time:
//  - Diaper, Bottle, Solids, Other: point-in-time entries with a single When.
//  - Sleep, Tummy, Walk, Breast feeds: session entries with start + optional
//    end. If End is left blank → starts an open session at Started. If filled
//    → log_* retroactively with both bounds.
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

const DEFAULT_ACTIVITIES = [
    "feeding",
    "sleep",
    "tummy_time",
    "diaper",
    "growth",
    "medication",
    "vaccine",
    "walk",
    "other"
];
const DEFAULT_METHODS = ["bottle", "breast_left", "breast_right", "solids"];

export function quickLogTemplate(
    babyConfig: any | undefined,
    baby: string,
    _call: ServiceCaller,
    requestModal: ModalRequester
): TemplateResult {
    const activities: string[] = babyConfig?.enabled_activities ?? DEFAULT_ACTIVITIES;
    const methods: string[] = babyConfig?.enabled_feeding_methods ?? DEFAULT_METHODS;

    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const displayName = displayBabyName(babyConfig?.name ?? baby);
    const buttons: TemplateResult[] = [];

    if (activities.includes("diaper")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log diaper for ${displayName}"
                    @click=${() => requestModal("diaper")}
                >
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
