// Bundled Lovelace card for the babytracker Home Assistant integration.
// Source-of-truth lives here; the built artefact at
// custom_components/babytracker/frontend/babytracker-card.js is what HA
// loads via the integration's static-path + extra_js_url registration
// (§9.5). PRs that change this file must include the rebuilt artefact;
// release.yml fails on drift.

import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { quickLogTemplate } from "./components/quick-log";
import { sessionTileTemplate } from "./components/session-tile";
import { recentEntriesTemplate } from "./components/recent-entries";
import { vaccinesDueTemplate } from "./components/vaccines-due";
import { growthChartTemplate } from "./components/growth-chart";
import { exportSheetTemplate } from "./components/export-sheet";
import {
    fireServiceCall,
    subscribeBabyConfig,
    subscribeIntegrationOptions
} from "./lib/ha-helpers";

export interface BabytrackerCardConfig {
    type: string;
    baby: string;
    sections?: string[];
    units?: { volume?: string; weight?: string; length?: string };
    recent_limit?: number;
}

const DEFAULT_SECTIONS = [
    "status",
    "quick_log",
    "active_session",
    "vaccines",
    "growth",
    "recent",
    "export"
];

@customElement("babytracker-card")
export class BabytrackerCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerCardConfig;
    @state() private _babyConfig?: any;
    @state() private _options?: any;
    private _unsubBaby?: () => void;
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
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
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
        .section {
            margin-top: 12px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
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
        button.quick {
            padding: 14px 12px;
            font-weight: 600;
        }
        svg {
            width: 100%;
            height: 120px;
            margin-top: 8px;
        }
        ul.entries {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        ul.entries li {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 0;
            border-bottom: 1px solid var(--divider-color);
        }
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        .spacer {
            flex: 1;
        }
    `;

    public setConfig(config: BabytrackerCardConfig): void {
        if (!config?.baby) throw new Error("babytracker-card: 'baby' is required");
        this._config = { ...config };
    }

    public getCardSize(): number {
        return 6;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this._maybeSubscribe();
    }

    public disconnectedCallback(): void {
        this._unsubBaby?.();
        this._unsubOptions?.();
        this._unsubBaby = undefined;
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
        if (!this._unsubBaby) {
            this._unsubBaby = subscribeBabyConfig(
                this.hass,
                this._config.baby,
                (data) => {
                    this._babyConfig = data;
                }
            );
        }
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

    private _baby(): string {
        return this._config!.baby;
    }

    private _entityId(suffix: string, prefix = "sensor"): string {
        return `${prefix}.${this._baby()}_${suffix}`;
    }

    private _renderStatus(): TemplateResult {
        const hass = this.hass!;
        const lastFeeding = hass.states?.[this._entityId("last_feeding")]?.state;
        const lastDiaper = hass.states?.[this._entityId("last_diaper")]?.state;
        const sleeping =
            hass.states?.[this._entityId("sleeping", "binary_sensor")]?.state ===
            "on";
        const atDaycare =
            hass.states?.[this._entityId("at_daycare", "binary_sensor")]?.state ===
            "on";
        return html`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(lastFeeding)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(lastDiaper)}
                </div>
                ${sleeping
                    ? html`<div class="chip warning" role="listitem">Sleeping</div>`
                    : ""}
                ${atDaycare
                    ? html`<div class="chip warning" role="listitem">At daycare</div>`
                    : ""}
            </div>
        `;
    }

    private _timeSince(iso?: string): string {
        if (!iso || iso === "unknown" || iso === "unavailable") return "—";
        const then = Date.parse(iso);
        if (Number.isNaN(then)) return "—";
        const mins = Math.floor((Date.now() - then) / 60000);
        if (mins < 1) return "now";
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        return hrs < 24
            ? `${hrs}h ${mins % 60}m`
            : `${Math.floor(hrs / 24)}d`;
    }

    private _handleService = (
        service: string,
        data: Record<string, unknown>
    ) => {
        return fireServiceCall(this.hass!, "babytracker", service, data);
    };

    protected render(): TemplateResult {
        if (!this.hass || !this._config) return html``;
        const sections = this._sections;
        return html`
            <ha-card>
                <h2>${this._babyConfig?.name ?? this._baby()}</h2>
                ${sections.includes("status") ? this._renderStatus() : ""}
                ${sections.includes("active_session")
                    ? sessionTileTemplate(
                          this.hass,
                          this._baby(),
                          this._handleService
                      )
                    : ""}
                ${sections.includes("quick_log")
                    ? quickLogTemplate(
                          this._babyConfig,
                          this._baby(),
                          this._handleService
                      )
                    : ""}
                ${sections.includes("vaccines")
                    ? vaccinesDueTemplate(this.hass, this._baby())
                    : ""}
                ${sections.includes("growth")
                    ? growthChartTemplate(
                          this.hass,
                          this._baby(),
                          this._options,
                          this._config.units
                      )
                    : ""}
                ${sections.includes("recent")
                    ? recentEntriesTemplate(
                          this.hass,
                          this._baby(),
                          this._handleService,
                          this._config.recent_limit ?? 10
                      )
                    : ""}
                ${sections.includes("export")
                    ? exportSheetTemplate(this.hass, this._baby())
                    : ""}
            </ha-card>
        `;
    }
}

// Lovelace registration
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
    type: "babytracker-card",
    name: "babytracker",
    description: "Track feedings, sleep, diapers, growth, and vaccines."
});

// Editor lives in editor.ts so the main bundle stays small.
import("./editor");
