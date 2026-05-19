// Standalone medical/summary card — surfaces a baby's vaccine status and
// growth values. Bundled into the same babytracker-card.js artefact as the
// main card, registered as a separate Lovelace custom element so users
// place it independently on their dashboard.
//
// Backward compat: the old `babytracker-growth-card` element name is kept
// as an alias so existing dashboard YAMLs keep working — both registrations
// resolve to this class.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { exportSheetTemplate } from "./components/export-sheet";
import { growthChartTemplate } from "./components/growth-chart";
import { trendsTemplate } from "./components/trends";
import { vaccinesDueTemplate } from "./components/vaccines-due";
import { subscribeIntegrationOptions } from "./lib/ha-helpers";

export interface BabytrackerMedicalCardConfig {
    type: string;
    baby: string;
    sections?: string[];
    units?: { volume?: string; weight?: string; length?: string };
    trend_days?: number;
}

const DEFAULT_SECTIONS = ["vaccines", "growth", "trends", "export"];

@customElement("babytracker-medical-card")
export class BabytrackerMedicalCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerMedicalCardConfig;
    @state() private _options?: any;
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
    `;

    public setConfig(config: BabytrackerMedicalCardConfig): void {
        if (!config?.baby)
            throw new Error("babytracker-medical-card: 'baby' is required");
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
    }

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
                    ? vaccinesDueTemplate(this.hass, this._config.baby)
                    : ""}
                ${sections.includes("growth")
                    ? growthChartTemplate(
                          this.hass,
                          this._config.baby,
                          this._options,
                          this._config.units
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
        `;
    }

    static getStubConfig(): BabytrackerMedicalCardConfig {
        return { type: "custom:babytracker-medical-card", baby: "ava" };
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

// Backward-compat alias: the card used to be registered as
// `babytracker-growth-card`. Existing dashboard YAMLs using that type
// keep working — both names resolve to BabytrackerMedicalCard.
if (!customElements.get("babytracker-growth-card")) {
    customElements.define(
        "babytracker-growth-card",
        class extends BabytrackerMedicalCard {} as any
    );
}

window.customCards = window.customCards ?? [];
window.customCards.push({
    type: "babytracker-medical-card",
    name: "babytracker — medical",
    description:
        "Vaccines due and growth values/percentiles for one baby."
});
