// Standalone growth-chart card. Bundled into the same babytracker-card.js
// artefact as the main card, registered as a separate Lovelace custom
// element so users can place it independently on their dashboard.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { growthChartTemplate } from "./components/growth-chart";
import { subscribeIntegrationOptions } from "./lib/ha-helpers";

export interface BabytrackerGrowthCardConfig {
    type: string;
    baby: string;
    units?: { volume?: string; weight?: string; length?: string };
}

@customElement("babytracker-growth-card")
export class BabytrackerGrowthCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerGrowthCardConfig;
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
        .growth-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .label {
            font-size: 0.85rem;
            color: var(--secondary-text-color);
        }
        svg {
            width: 100%;
            height: 120px;
            margin-top: 8px;
        }
    `;

    public setConfig(config: BabytrackerGrowthCardConfig): void {
        if (!config?.baby)
            throw new Error("babytracker-growth-card: 'baby' is required");
        this._config = { ...config };
    }

    public getCardSize(): number {
        return 3;
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

    protected render(): TemplateResult {
        if (!this.hass || !this._config) return html``;
        return html`
            <ha-card>
                ${growthChartTemplate(
                    this.hass,
                    this._config.baby,
                    this._options,
                    this._config.units
                )}
            </ha-card>
        `;
    }

    static getStubConfig(): BabytrackerGrowthCardConfig {
        return { type: "custom:babytracker-growth-card", baby: "ava" };
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
    type: "babytracker-growth-card",
    name: "babytracker — growth",
    description: "WHO/CDC growth values and percentiles for one baby."
});
