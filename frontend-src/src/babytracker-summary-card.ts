// Standalone baby summary card — surfaces vaccines, growth, trend charts,
// and the pediatrician export for one baby. Bundled into the same
// babytracker-card.js artefact as the main card, registered as a separate
// Lovelace custom element so users place it independently on their dashboard.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { exportSheetTemplate } from "./components/export-sheet";
import { growthChartTemplate } from "./components/growth-chart";
import { modalTemplate, type ModalKind } from "./components/modal";
import {
    requestDeleteOrPromptImported,
    syncDialogToModal,
    type DeleteEntryInput
} from "./components/modals/_host";
import { dialogStyles } from "./components/modals/_styles";
import { trendsTemplate } from "./components/trends";
import { vaccineHistoryTemplate } from "./components/vaccine-history";
import { vaccinesDueTemplate } from "./components/vaccines-due";
import {
    babyEntityId,
    subscribeGrowth,
    subscribeIntegrationOptions,
    subscribeVaccines
} from "./lib/ha-helpers";

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
    @state() private _vaccines: any[] = [];
    @state() private _growth: any[] = [];
    private _unsubOptions?: () => void;
    private _unsubVaccines?: () => void;
    private _unsubGrowth?: () => void;

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
        .growth-summary {
            padding: 6px 8px;
            margin: 0 -8px;
            border-radius: 6px;
        }
        .growth-summary.clickable {
            cursor: pointer;
        }
        .growth-summary.clickable:hover,
        .growth-summary.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        .growth-date {
            margin-bottom: 4px;
        }
        .growth-trend {
            margin-top: 12px;
        }
        .growth-trend .label-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 4px 12px;
            justify-content: space-between;
        }
        .growth-trend .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 0.75rem;
            color: var(--secondary-text-color);
        }
        .growth-trend .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .growth-trend .swatch {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
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
        .trend .label-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 4px 12px;
            justify-content: space-between;
        }
        .trend .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 0.75rem;
            color: var(--secondary-text-color);
        }
        .trend .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .trend .swatch {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
        }
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        ${dialogStyles}
        .chip .spacer {
            flex: 1;
        }
        dialog input[hidden] {
            display: none;
        }
        .vaccine-history h3 {
            margin: 0 0 6px;
            font-size: 1rem;
            color: var(--primary-text-color);
        }
        ul.vh-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        ul.vh-list li {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            column-gap: 8px;
            row-gap: 2px;
            padding: 4px 0;
            border-bottom: 1px solid var(--divider-color);
        }
        ul.vh-list li.clickable {
            cursor: pointer;
            border-radius: 4px;
            margin: 0 -4px;
            padding: 4px 4px;
        }
        ul.vh-list li.clickable:hover,
        ul.vh-list li.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        ul.vh-list li:last-child {
            border-bottom: none;
        }
        .vh-date {
            min-width: 96px;
        }
        .vh-name {
            font-weight: 500;
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
        this._unsubVaccines?.();
        this._unsubVaccines = undefined;
        this._unsubGrowth?.();
        this._unsubGrowth = undefined;
        super.disconnectedCallback();
    }

    public updated(changed: Map<string, unknown>): void {
        if (changed.has("hass") || changed.has("_config")) {
            this._maybeSubscribe();
        }
        if (changed.has("_modal")) {
            syncDialogToModal(this.renderRoot, this._modal);
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

    private _requestLogGrowth = () => {
        if (!this._config?.baby) return;
        this._modal = { kind: "log_growth", baby: this._config.baby };
    };

    private _requestEditEntry = (entry: any) => {
        this._modal = { kind: "edit_entry", entry };
    };

    private _requestDelete = (entry: DeleteEntryInput) => {
        this._modal = requestDeleteOrPromptImported(entry, (id) =>
            this.hass.callService("babytracker", "delete_entry", { entry_id: id })
        );
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
        if (
            !this._unsubVaccines &&
            this._sections.includes("vaccines") &&
            this._config?.baby
        ) {
            this._unsubVaccines = subscribeVaccines(
                this.hass,
                this._config.baby,
                (entries) => {
                    this._vaccines = Array.isArray(entries) ? entries : [];
                }
            );
        }
        if (
            !this._unsubGrowth &&
            this._sections.includes("growth") &&
            this._config?.baby
        ) {
            this._unsubGrowth = subscribeGrowth(
                this.hass,
                this._config.baby,
                (entries) => {
                    this._growth = Array.isArray(entries) ? entries : [];
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
                    ? html`
                          ${vaccinesDueTemplate(
                              this.hass,
                              this._config.baby,
                              this._requestLogVaccine
                          )}
                          ${vaccineHistoryTemplate(
                              this._vaccines,
                              this._requestEditEntry
                          )}
                      `
                    : ""}
                ${sections.includes("growth")
                    ? growthChartTemplate(
                          this.hass,
                          this._config.baby,
                          this._options,
                          this._config.units,
                          this._requestLogGrowth,
                          this._growth[0],
                          this._requestEditEntry,
                          this._growth
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
                this.hass,
                this._modal,
                this._options,
                this._submitModal,
                this._closeModal,
                this._requestDelete
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
