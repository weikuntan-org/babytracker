// Bundled Lovelace card for the babytracker Home Assistant integration.
// Source-of-truth lives here; the built artefact at
// custom_components/babytracker/frontend/babytracker-card.js is what HA
// loads via the integration's static-path + extra_js_url registration
// (§9.5). PRs that change this file must include the rebuilt artefact;
// release.yml fails on drift.

import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { chip } from "./components/chip";
import { quickLogTemplate, type ModalRequester } from "./components/quick-log";
import { sessionTileTemplate } from "./components/session-tile";
import { recentEntriesTemplate } from "./components/recent-entries";
import { growthChartTemplate } from "./components/growth-chart";
import { exportSheetTemplate } from "./components/export-sheet";
import { importerSyncTemplate } from "./components/importer-sync";
import { todayCountsTemplate } from "./components/today-counts";
import { modalTemplate, type ModalKind } from "./components/modal";
import {
    babyEntityId,
    displayBabyName,
    fireServiceCall,
    subscribeBabyConfig,
    subscribeIntegrationOptions
} from "./lib/ha-helpers";
import { formatMinutes, timeSinceLastWakeMinutes } from "./lib/entries";

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
    "recent",
    "importer_sync"
];

@customElement("babytracker-card")
export class BabytrackerCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerCardConfig;
    @state() private _babyConfig?: any;
    @state() private _options?: any;
    @state() private _modal: ModalKind | null = null;
    @state() private _expandedNotes: Set<string> = new Set();
    @query("dialog") private _dialog!: HTMLDialogElement;
    private _unsubBaby?: () => void;
    private _unsubOptions?: () => void;
    // Ticks the "awake for…" chip without depending on incidental
    // hass-state churn. 30 s is fine resolution for a minutes-granular
    // display and keeps the re-render cost low.
    private _clockTimer?: ReturnType<typeof setInterval>;

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
        .chip .chip-icon {
            color: var(--secondary-text-color);
            --mdc-icon-size: 16px;
            width: 16px;
            height: 16px;
        }
        .chip.warning .chip-icon {
            color: inherit;
        }
        .chip .chip-detail {
            color: var(--secondary-text-color);
            font-size: 0.78rem;
        }
        .chip.warning .chip-detail {
            color: inherit;
        }
        .section {
            margin-top: 12px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .quick-log-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 0;
        }
        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid var(--divider-color, #888);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: bt-spin 0.8s linear infinite;
        }
        @keyframes bt-spin {
            to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
            .spinner { animation: none; }
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
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        button.quick ha-icon {
            --mdc-icon-size: 18px;
            color: var(--secondary-text-color);
            flex-shrink: 0;
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
            flex-direction: column;
            gap: 2px;
            padding: 6px 0;
            border-bottom: 1px solid var(--divider-color);
        }
        ul.entries li .entry-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            column-gap: 8px;
            row-gap: 2px;
        }
        ul.entries li .entry-notes {
            font-size: 0.85rem;
            padding-left: 0;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 4px;
        }
        ul.entries li .entry-notes:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        ul.entries li .entry-notes.expanded {
            white-space: pre-wrap;
            overflow: visible;
            text-overflow: clip;
        }
        ul.entries li .entry-photo {
            margin-top: 4px;
            line-height: 0;
        }
        ul.entries li.clickable {
            cursor: pointer;
            border-radius: 4px;
            margin: 0 -4px;
            padding: 6px 4px;
        }
        ul.entries li.clickable:hover,
        ul.entries li.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        button.danger {
            background: var(--error-color, #c62828);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        button.icon {
            background: transparent;
            border: none;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 1;
            font-size: 1.1rem;
            color: var(--secondary-text-color);
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        button.icon:hover {
            color: var(--primary-text-color);
            background: var(--secondary-background-color);
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
        dialog .dt-row {
            display: flex;
            gap: 6px;
            align-items: stretch;
        }
        dialog .dt-row input {
            flex: 1;
            min-width: 0;
        }
        dialog .dt-row .now-btn {
            padding: 4px 10px;
            font-size: 0.85rem;
            white-space: nowrap;
        }
        dialog .quick-other {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        dialog .quick-other button.quick {
            padding: 8px 12px;
            font-weight: 500;
            flex: 0 0 auto;
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
        if (this._clockTimer == null) {
            this._clockTimer = setInterval(() => this.requestUpdate(), 30000);
        }
    }

    public disconnectedCallback(): void {
        this._unsubBaby?.();
        this._unsubOptions?.();
        this._unsubBaby = undefined;
        this._unsubOptions = undefined;
        if (this._clockTimer != null) {
            clearInterval(this._clockTimer);
            this._clockTimer = undefined;
        }
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

    /** Status chip fragments (no wrapper). Caller wraps these together
     *  with the 24 h chips inside a single `.chips` flex row so the two
     *  groups flow continuously instead of breaking onto separate
     *  lines.
     */
    private _renderStatusChips(): TemplateResult {
        const hass = this.hass!;
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
        // Awake-for is hidden while a sleep session is open (the session
        // tile carries the in-progress duration). When no completed sleep
        // is in recent_entries we stay silent rather than show "—".
        const recentEntries =
            hass.states?.[this._entityId("recent_entries")]?.attributes?.entries ??
            [];
        const awakeMinutes = sleeping
            ? null
            : timeSinceLastWakeMinutes(recentEntries);
        // Bottle/solids "last" times come straight from `recent_entries`
        // (already sorted newest-first), so we can split what was a single
        // "Last feed" chip into per-method visibility. Breast feedings
        // intentionally don't get a chip — they're surfaced via the
        // session tile when in-progress.
        const lastBottle = recentEntries.find(
            (e: any) => e?.type === "feeding" && e?.data?.method === "bottle"
        )?.timestamp;
        const lastSolids = recentEntries.find(
            (e: any) => e?.type === "feeding" && e?.data?.method === "solids"
        )?.timestamp;
        return html`
            ${chip({
                icon: "mdi:baby-bottle-outline",
                label: "Last bottle",
                value: this._timeSince(lastBottle)
            })}
            ${chip({
                icon: "mdi:silverware-spoon",
                label: "Last solids",
                value: this._timeSince(lastSolids)
            })}
            ${chip({
                icon: "mdi:human-baby-changing-table",
                label: "Last diaper",
                value: this._timeSince(lastDiaper)
            })}
            ${awakeMinutes !== null
                ? chip({
                      icon: "mdi:weather-sunny",
                      label: "Awake for",
                      value: formatMinutes(awakeMinutes)
                  })
                : ""}
            ${sleeping
                ? chip({
                      icon: "mdi:bed",
                      label: "Sleeping",
                      value: "Sleeping",
                      warning: true
                  })
                : ""}
            ${walking
                ? chip({
                      icon: "mdi:walk",
                      label: "On a walk",
                      value: "On a walk",
                      warning: true
                  })
                : ""}
            ${atDaycare
                ? chip({
                      icon: "mdi:school-outline",
                      label: "At daycare",
                      value: "At daycare",
                      warning: true
                  })
                : ""}
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
            return;
        }
        this._modal = {
            kind: "session",
            baby,
            activity: target.activity,
            method: target.method
        };
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

    private _requestEdit = (entry: any) => {
        this._modal = { kind: "edit_entry", entry };
    };

    private _toggleNotes = (entryId: string) => {
        const next = new Set(this._expandedNotes);
        if (next.has(entryId)) next.delete(entryId);
        else next.add(entryId);
        this._expandedNotes = next;
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
        const showStatus = sections.includes("status");
        const showToday = sections.includes("today");
        return html`
            <ha-card>
                <h2>${displayBabyName(this._babyConfig?.name ?? this._baby())}</h2>
                ${showStatus || showToday
                    ? html`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${showStatus ? this._renderStatusChips() : ""}
                          ${showToday
                              ? todayCountsTemplate(
                                    this.hass,
                                    this._baby(),
                                    this._babyConfig
                                )
                              : ""}
                      </div>`
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
                          this._requestEdit,
                          this._config.recent_limit ?? 50,
                          this._expandedNotes,
                          this._toggleNotes
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
                this.hass,
                this._modal,
                this._options,
                this._submitModal,
                this._closeModal,
                this._requestDelete
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

// Bundle the standalone summary card (vaccines + growth + trends +
// export) so it ships in the same artefact and is auto-registered when
// users load /babytracker_static/babytracker-card.js.
import "./babytracker-summary-card";
import "./babytracker-history-card";
