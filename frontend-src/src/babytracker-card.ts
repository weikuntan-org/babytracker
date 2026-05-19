// Bundled Lovelace card for the babytracker Home Assistant integration.
// Source-of-truth lives here; the built artefact at
// custom_components/babytracker/frontend/babytracker-card.js is what HA
// loads via the integration's static-path + extra_js_url registration
// (§9.5). PRs that change this file must include the rebuilt artefact;
// release.yml fails on drift.

import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { quickLogTemplate, type ModalRequester } from "./components/quick-log";
import { sessionTileTemplate } from "./components/session-tile";
import { recentEntriesTemplate } from "./components/recent-entries";
import { vaccinesDueTemplate } from "./components/vaccines-due";
import { growthChartTemplate } from "./components/growth-chart";
import { exportSheetTemplate } from "./components/export-sheet";
import { importerSyncTemplate } from "./components/importer-sync";
import { todayCountsTemplate } from "./components/today-counts";
import { modalTemplate, type ModalKind } from "./components/modal";
import {
    babyEntityId,
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
    "today",
    "active_session",
    "quick_log",
    "vaccines",
    "recent",
    "importer_sync",
    "export"
];

@customElement("babytracker-card")
export class BabytrackerCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerCardConfig;
    @state() private _babyConfig?: any;
    @state() private _options?: any;
    @state() private _modal: ModalKind | null = null;
    @query("dialog") private _dialog!: HTMLDialogElement;
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
        @keyframes bt-flash {
            0%   { background: var(--success-color, #43a047); color: #fff; }
            70%  { background: var(--success-color, #43a047); color: #fff; }
            100% { background: var(--secondary-background-color); color: var(--primary-text-color); }
        }
        button.quick.logged {
            animation: bt-flash 700ms ease-out;
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
        dialog {
            border: none;
            border-radius: 12px;
            padding: 16px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            max-width: 360px;
            width: 90vw;
        }
        dialog::backdrop {
            background: rgba(0, 0, 0, 0.4);
        }
        dialog form {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        dialog label {
            font-size: 0.9rem;
            color: var(--primary-text-color);
        }
        dialog input,
        dialog select,
        dialog textarea {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--divider-color);
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            font: inherit;
        }
        dialog .actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 8px;
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
        if (changed.has("_modal")) {
            if (this._modal && this._dialog && !this._dialog.open) {
                this._dialog.showModal();
            } else if (!this._modal && this._dialog?.open) {
                this._dialog.close();
            }
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

    private _entityId(
        suffix: string,
        prefix: "sensor" | "binary_sensor" = "sensor"
    ): string {
        return babyEntityId(this._baby(), suffix, prefix);
    }

    private _renderStatus(): TemplateResult {
        const hass = this.hass!;
        const lastFeeding = hass.states?.[this._entityId("last_feeding")]?.state;
        const lastDiaper = hass.states?.[this._entityId("last_diaper")]?.state;
        const sleeping =
            hass.states?.[this._entityId("sleeping", "binary_sensor")]?.state ===
            "on";
        const walking =
            hass.states?.[this._entityId("walking", "binary_sensor")]?.state ===
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
                ${walking
                    ? html`<div class="chip warning" role="listitem">On a walk</div>`
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

    private _handleService = async (
        service: string,
        data: Record<string, unknown>,
        sourceBtn?: EventTarget | null
    ): Promise<unknown> => {
        const btn =
            sourceBtn instanceof HTMLElement && sourceBtn.classList.contains("quick")
                ? sourceBtn
                : null;
        try {
            const result = await fireServiceCall(this.hass!, "babytracker", service, data);
            if (btn) {
                btn.classList.add("logged");
                setTimeout(() => btn.classList.remove("logged"), 700);
            }
            // The coordinator dispatches SIGNAL_DATA_UPDATED synchronously inside
            // the service call, so hass.states is already up to date by the time
            // the promise resolves. HA *should* push a new hass to us; force a
            // re-render now in case it doesn't (older HA + same-reference hass).
            this.requestUpdate();
            return result;
        } catch (err) {
            console.warn("babytracker: service call failed", service, err);
            throw err;
        }
    };

    private _isSleeping(): boolean {
        return (
            this.hass?.states?.[this._entityId("sleeping", "binary_sensor")]
                ?.state === "on"
        );
    }

    private _lastBottle():
        | { amount: number; unit: "ml" | "oz" }
        | undefined {
        const sensor =
            this.hass?.states?.[this._entityId("recent_entries")];
        const entries: any[] = sensor?.attributes?.entries ?? [];
        for (const e of entries) {
            if (
                e?.type === "feeding" &&
                e?.data?.method === "bottle" &&
                typeof e?.data?.amount === "number" &&
                (e?.data?.unit === "ml" || e?.data?.unit === "oz")
            ) {
                return { amount: e.data.amount, unit: e.data.unit };
            }
        }
        return undefined;
    }

    private _interceptIfSleeping(
        label: string,
        action: () => void | Promise<void>
    ): void | Promise<void> {
        if (!this._isSleeping()) return action();
        this._modal = {
            kind: "end_sleep_first",
            baby: this._baby(),
            label,
            then: action
        };
    }

    private _requestModal = (
        target:
            | "diaper"
            | "bottle"
            | "solids"
            | "other"
            | {
                  activity: "sleep" | "tummy_time" | "walk" | "feeding";
                  method?: "breast_left" | "breast_right";
              }
    ): void => {
        const baby = this._baby();
        if (typeof target === "string") {
            const labels: Record<typeof target, string> = {
                diaper: "logging a diaper",
                bottle: "logging a bottle",
                solids: "logging solids",
                other: "logging this"
            };
            this._interceptIfSleeping(labels[target], () => {
                if (target === "bottle") {
                    const last = this._lastBottle();
                    this._modal = {
                        kind: "bottle",
                        baby,
                        lastAmount: last?.amount,
                        lastUnit: last?.unit
                    };
                } else {
                    this._modal = { kind: target, baby };
                }
            });
            return;
        }
        // Session request. Don't intercept "log another sleep" — backend
        // rejects that with a clearer error. For other sessions while sleep
        // is open, intercept so the user can end sleep first.
        const sessionLabels: Record<typeof target.activity, string> = {
            sleep: "logging another sleep session",
            tummy_time: "starting tummy time",
            walk: "starting a walk",
            feeding: "starting a feeding session"
        };
        const open = () => {
            this._modal = {
                kind: "session",
                baby,
                activity: target.activity,
                method: target.method
            };
        };
        if (target.activity === "sleep") {
            open();
            return;
        }
        this._interceptIfSleeping(sessionLabels[target.activity], open);
    };

    private _requestDelete = (entry: {
        id: string;
        type?: string;
        source?: string;
        staff?: string | null;
    }) => {
        // User-authored entries delete with no confirmation (the existing
        // behavior). Anything else came from an importer (Procare today),
        // so prompt before removing the local copy.
        if (!entry.source || entry.source === "user") {
            this._handleService("delete_entry", { entry_id: entry.id });
            return;
        }
        this._modal = {
            kind: "confirm_delete_imported",
            entryId: entry.id,
            entryType: entry.type ?? "entry",
            source: entry.source,
            staff: entry.staff ?? null
        };
    };

    private _closeModal = () => {
        this._modal = null;
    };

    private _submitModal = async (
        service: string,
        data: Record<string, unknown>
    ) => {
        await this._handleService(service, data);
        this._closeModal();
    };

    protected render(): TemplateResult {
        if (!this.hass || !this._config) return html``;
        const sections = this._sections;
        return html`
            <ha-card>
                <h2>${this._babyConfig?.name ?? this._baby()}</h2>
                ${sections.includes("status") ? this._renderStatus() : ""}
                ${sections.includes("today")
                    ? todayCountsTemplate(this.hass, this._baby(), this._babyConfig)
                    : ""}
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
                          this._handleService,
                          this._requestModal
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
                          this._requestDelete,
                          this._config.recent_limit ?? 50
                      )
                    : ""}
                ${sections.includes("importer_sync")
                    ? importerSyncTemplate(
                          this._babyConfig,
                          this._baby(),
                          this._handleService
                      )
                    : ""}
                ${sections.includes("export")
                    ? exportSheetTemplate(this.hass, this._baby())
                    : ""}
            </ha-card>
            ${modalTemplate(
                this._modal,
                this._options,
                this._submitModal,
                (service, data) => this._handleService(service, data),
                this._closeModal
            )}
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
    description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});

// Editor lives in editor.ts.
import("./editor");

// Bundle the standalone growth card so it ships in the same artefact and
// is auto-registered when users load /babytracker_static/babytracker-card.js.
import "./babytracker-growth-card";
