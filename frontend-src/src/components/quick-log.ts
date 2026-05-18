// Quick-log grid — buttons filtered by eligibility (§4.10).
import { html, type TemplateResult } from "lit";

type ServiceCaller = (service: string, data: Record<string, unknown>) => Promise<unknown>;

export function quickLogTemplate(
    babyConfig: any | undefined,
    baby: string,
    call: ServiceCaller
): TemplateResult {
    const activities: string[] = babyConfig?.enabled_activities ?? [
        "feeding",
        "sleep",
        "tummy_time",
        "diaper",
        "growth",
        "medication",
        "vaccine"
    ];
    const methods: string[] = babyConfig?.enabled_feeding_methods ?? [
        "bottle",
        "breast_left",
        "breast_right",
        "solids"
    ];

    const buttons: TemplateResult[] = [];
    if (activities.includes("diaper")) {
        for (const kind of ["wet", "dirty", "both"]) {
            buttons.push(
                html`
                    <button
                        class="quick"
                        aria-label="Log ${kind} diaper for ${baby}"
                        @click=${() => call("log_diaper", { baby, kind })}
                    >
                        ${kind} diaper
                    </button>
                `
            );
        }
    }
    if (activities.includes("feeding")) {
        for (const method of methods) {
            buttons.push(
                html`
                    <button
                        class="quick"
                        aria-label="Start ${method} feeding for ${baby}"
                        @click=${() =>
                            call("start_feeding", { baby, method })}
                    >
                        ${method.replace("_", " ")}
                    </button>
                `
            );
        }
    }
    if (activities.includes("sleep")) {
        buttons.push(
            html`
                <button
                    class="quick"
                    aria-label="Start sleep for ${baby}"
                    @click=${() => call("start_sleep", { baby })}
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
                    @click=${() => call("start_tummy_time", { baby })}
                >
                    Tummy time
                </button>
            `
        );
    }

    return html`
        <div
            class="section"
            role="group"
            aria-label="Quick log"
            style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;"
        >
            ${buttons}
        </div>
    `;
}
