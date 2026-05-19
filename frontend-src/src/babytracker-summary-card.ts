// Standalone baby summary card — surfaces vaccines, growth, trend charts,
// and the pediatrician export for one baby. Bundled into the same
// babytracker-card.js artefact as the main card, registered as a separate
// Lovelace custom element so users place it independently on their dashboard.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { exportSheetTemplate } from "./components/export-sheet";
import { growthChartTemplate } from "./components/growth-chart";
import { modalTemplate, type ModalKind } from "./components/modal";
import { trendsTemplate } from "./components/trends";
import { vaccinesDueTemplate } from "./components/vaccines-due";
import { babyEntityId, subscribeIntegrationOptions } from "./lib/ha-helpers";

export interface BabytrackerSummaryCardConfig {
    type: string;
    baby: string;
    sections?: string[];
    units?: { volume?: string; weight?: string; length?: string };
    trend_days?: number;
}

const DEFAULT_SECTIONS = ["vaccines", "growth", "trends", "export"];

@customElement("babytracker-summary-card")
export class BabytrackerSummaryCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerSummaryCardConfig;
    @state() private _options?: any;
    @state() private _modal: ModalKind | null = null;
    private _unsubOptions?: () => void;

    static styles = css`
        :host {
            display: block;
            font-family: var(--primary-font-family, system-ui);
        }
        ha-card {
            padding: 16px;
        }
        h2 {
            font-size: 1.15rem;
            margin: 0 0 8px;
            color: var(--primary-text-color);
        }
        .section {
            margin-top: 12px;
        }
        .chip {
            padding: 6px 10px;
            border-radius: 16px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .chip.warning {
            background: var(--warning-color);
            color: var(--text-primary-color, #fff);
        }
        .growth-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .label {
            font-size: 0.85rem;
            color: var(--secondary-text-color);
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        button.primary {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        svg {
            width: 100%;
            height: 120px;
            margin-top: 8px;
        }
        .trend + .trend {
            margin-top: 8px;
        }
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        dialog {
            border: none;
            border-radius: 12px;
            padding: 16px;
            min-width: min(360px, 92vw);
            background: var(--card-background-color);
            color: var(--primary-text-color);
        }
        dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }
        dialog form {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        dialog .actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 8px;
        }
        dialog input,
        dialog select {
            padding: 8px;
            border-radius: 6px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            font: inherit;
        }
        .chip .spacer {
            flex: 1;
        }
    `;

    public setConfig(config: BabytrackerSummaryCardConfig): void {
        if (!config?.baby)
            throw new Error("babytracker-summary-card: 'baby' is required");
        this._config = { ...config };
    }

    public getCardSize(): number {
        return 4;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this._maybeSubscribe();
    }

    public disconnectedCallback(): void {
        this._unsubOptions?.();
        this._unsubOptions = undefined;
        super.disconnectedCallback();
    }

    public updated(changed: Map<string, unknown>): void {
        if (changed.has("hass") || changed.has("_config")) {
            this._maybeSubscribe();
        }
        if (changed.has("_modal")) {
            const dlg = this.renderRoot.querySelector(
                "dialog"
            ) as HTMLDialogElement | null;
            if (dlg) {
                if (this._modal && !dlg.open) dlg.showModal();
                if (!this._modal && dlg.open) dlg.close();
            }
        }
    }

    private _closeModal = () => {
        this._modal = null;
    };

    private _submitModal = async (
        service: string,
        data: Record<string, unknown>
    ) => {
        await this.hass.callService("babytracker", service, data);
        this._modal = null;
    };

    private _callService = async (
        service: string,
        data: Record<string, unknown>
    ): Promise<unknown> => {
        return this.hass.callService("babytracker", service, data);
    };

    private _requestLogGrowth = () => {
        if (!this._config?.baby) return;
        this._modal = { kind: "log_growth", baby: this._config.baby };
    };

    private _requestLogVaccine = () => {
        if (!this._config?.baby) return;
        const due = this.hass?.states?.[
            babyEntityId(this._config.baby, "vaccines_due")
        ];
        const defaultName: string =
            due?.state && due.state !== "none" && due.state !== "unknown"
                ? String(due.state)
                : "";
        const doseVal = due?.attributes?.dose_number;
        const defaultDose: number | undefined =
            typeof doseVal === "number" ? doseVal : undefined;
        const upcoming: any[] = Array.isArray(due?.attributes?.upcoming)
            ? due.attributes.upcoming
            : [];
        const scheduleNames: string[] = upcoming
            .map((u: any) => (u && typeof u.name === "string" ? u.name : null))
            .filter((n: string | null): n is string => Boolean(n));
        this._modal = {
            kind: "log_vaccine",
            baby: this._config.baby,
            defaultName,
            defaultDose,
            scheduleNames
        };
    };

    private _maybeSubscribe(): void {
        if (!this.hass || !this._config) return;
        if (!this._unsubOptions) {
            this._unsubOptions = subscribeIntegrationOptions(
                this.hass,
                (data) => {
                    this._options = data;
                }
            );
        }
    }

    private get _sections(): string[] {
        return this._config?.sections ?? DEFAULT_SECTIONS;
    }

    protected render(): TemplateResult {
        if (!this.hass || !this._config) return html``;
        const sections = this._sections;
        return html`
            <ha-card>
                ${sections.includes("vaccines")
                    ? vaccinesDueTemplate(
                          this.hass,
                          this._config.baby,
                          this._requestLogVaccine
                      )
                    : ""}
                ${sections.includes("growth")
                    ? growthChartTemplate(
                          this.hass,
                          this._config.baby,
                          this._options,
                          this._config.units,
                          this._requestLogGrowth
                      )
                    : ""}
                ${sections.includes("trends")
                    ? trendsTemplate(
                          this.hass,
                          this._config.baby,
                          this._config.trend_days ?? 7
                      )
                    : ""}
                ${sections.includes("export")
                    ? exportSheetTemplate(this.hass, this._config.baby)
                    : ""}
            </ha-card>
            ${modalTemplate(
                this._modal,
                this._options,
                this._submitModal,
                this._callService,
                this._closeModal
            )}
        `;
    }

    static getStubConfig(): BabytrackerSummaryCardConfig {
        return { type: "custom:babytracker-summary-card", baby: "ava" };
    }
}

declare global {
    interface Window {
        customCards?: Array<{
            type: string;
            name: string;
            description: string;
        }>;
    }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
    type: "babytracker-summary-card",
    name: "babytracker — summary",
    description:
        "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
