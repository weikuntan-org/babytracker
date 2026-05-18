// Quick-log grid — buttons filtered by eligibility (§4.10).
// Some activities open a modal (diaper, bottle, solids) for extra input;
// others fire directly (sleep, tummy time, walk, breast feeds).
import { html, type TemplateResult } from "lit";

type ServiceCaller = (
    service: string,
    data: Record<string, unknown>,
    sourceBtn?: EventTarget | null
) => Promise<unknown>;

export type ModalRequester = (kind: "diaper" | "bottle" | "solids") => void;

const DEFAULT_ACTIVITIES = [
    "feeding",
    "sleep",
    "tummy_time",
    "diaper",
    "growth",
    "medication",
    "vaccine",
    "walk"
];
const DEFAULT_METHODS = ["bottle", "breast_left", "breast_right", "solids"];

export function quickLogTemplate(
    babyConfig: any | undefined,
    baby: string,
    call: ServiceCaller,
    requestModal: ModalRequester
): TemplateResult {
    const activities: string[] = babyConfig?.enabled_activities ?? DEFAULT_ACTIVITIES;
    const methods: string[] = babyConfig?.enabled_feeding_methods ?? DEFAULT_METHODS;

    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const buttons: TemplateResult[] = [];

    if (activities.includes("diaper")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Log diaper for ${baby}"
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
                            aria-label="Log bottle feeding for ${baby}"
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
                            aria-label="Log solids feeding for ${baby}"
                            @click=${() => requestModal("solids")}
                        >
                            Solids
                        </button>
                    `
                );
            } else {
                // breast_left / breast_right — start session, no modal.
                buttons.push(
                    html`
                        <button
                            class="quick"
                            aria-label="Start ${method} feeding for ${baby}"
                            @click=${(e: Event) =>
                                call(
                                    "start_feeding",
                                    { baby, method },
                                    e.currentTarget
                                )}
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
                    aria-label="Start sleep for ${baby}"
                    @click=${(e: Event) =>
                        call("start_sleep", { baby }, e.currentTarget)}
                >
                    Start sleep
                </button>
            `
        );
    }
    if (activities.includes("tummy_time")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Start tummy time for ${baby}"
                    @click=${(e: Event) =>
                        call("start_tummy_time", { baby }, e.currentTarget)}
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
                    aria-label="Start walk for ${baby}"
                    @click=${(e: Event) =>
                        call("start_walk", { baby }, e.currentTarget)}
                >
                    Start walk
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
