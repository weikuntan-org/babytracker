// Standalone baby history card — paginates through one baby's entries by
// calendar day. Date input + prev/next/today buttons; entries for the
// selected local day come from the `babytracker/list_entries_in_range`
// WS command (subscribed so edits made elsewhere reflect immediately).
//
// Tapping a row opens the same edit lightbox as the main card, so editing
// + deletion semantics (including the "confirm delete imported" prompt
// for Procare entries) are shared.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { entryRowTemplate } from "./components/entry-row";
import { modalTemplate, type ModalKind } from "./components/modal";
import {
    requestDeleteOrPromptImported,
    syncDialogToModal,
    type DeleteEntryInput
} from "./components/modals/_host";
import { dialogStyles } from "./components/modals/_styles";
import { subscribeEntriesInRange } from "./lib/ha-helpers";
import {
    formatMinutes,
    formatVolume,
    summarizeDay,
    type DaySummary
} from "./lib/entries";

export interface BabytrackerHistoryCardConfig {
    type: string;
    baby: string;
    /** Initial date in `YYYY-MM-DD`. Defaults to today (local) on first render. */
    initial_date?: string;
}

/** Pad a number to 2 digits. */
function _pad(n: number): string {
    return String(n).padStart(2, "0");
}

/** `YYYY-MM-DD` for a local Date. */
function _toDateInput(d: Date): string {
    return `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}`;
}

/** Parse a `YYYY-MM-DD` (local) into a Date at local midnight. Returns null
 * on bad input so callers can fall back to today.
 */
function _fromDateInput(s: string): Date | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d, 0, 0, 0, 0);
    if (Number.isNaN(dt.getTime())) return null;
    return dt;
}

/** Local midnight → ISO at UTC. */
function _localDayBounds(dateStr: string): { startIso: string; endIso: string } {
    const d = _fromDateInput(dateStr) ?? new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const end = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        23,
        59,
        59,
        999
    );
    return { startIso: start.toISOString(), endIso: end.toISOString() };
}

function _shiftDate(dateStr: string, days: number): string {
    const d = _fromDateInput(dateStr) ?? new Date();
    d.setDate(d.getDate() + days);
    return _toDateInput(d);
}

function _humanDate(dateStr: string): string {
    const d = _fromDateInput(dateStr);
    if (!d) return dateStr;
    return d.toLocaleDateString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

@customElement("babytracker-history-card")
export class BabytrackerHistoryCard extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @state() private _config?: BabytrackerHistoryCardConfig;
    @state() private _date: string = _toDateInput(new Date());
    @state() private _entries: any[] = [];
    @state() private _modal: ModalKind | null = null;
    @state() private _expandedNotes: Set<string> = new Set();
    private _unsubEntries?: () => void;

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
        .nav {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 12px;
        }
        .nav .spacer {
            flex: 1;
        }
        .nav input[type="date"] {
            padding: 6px 8px;
            border-radius: 6px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color, var(--secondary-background-color));
            color: var(--primary-text-color);
            font: inherit;
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        button.primary {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
        }
        button.danger {
            background: var(--error-color, #c62828);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .empty {
            color: var(--secondary-text-color);
            font-size: 0.95rem;
            padding: 12px 0;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 0 0 12px;
        }
        .chip {
            display: inline-flex;
            align-items: baseline;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            font-size: 0.85rem;
            line-height: 1.2;
            color: var(--primary-text-color);
        }
        .chip .chip-label {
            color: var(--secondary-text-color);
        }
        .chip .chip-detail {
            color: var(--secondary-text-color);
            font-size: 0.78rem;
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
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        ${dialogStyles}
    `;

    public setConfig(config: BabytrackerHistoryCardConfig): void {
        if (!config?.baby)
            throw new Error("babytracker-history-card: 'baby' is required");
        this._config = { ...config };
        if (config.initial_date && _fromDateInput(config.initial_date)) {
            this._date = config.initial_date;
        }
    }

    public getCardSize(): number {
        return 6;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this._resubscribe();
    }

    public disconnectedCallback(): void {
        this._unsubEntries?.();
        this._unsubEntries = undefined;
        super.disconnectedCallback();
    }

    public updated(changed: Map<string, unknown>): void {
        if (changed.has("hass") || changed.has("_config") || changed.has("_date")) {
            this._resubscribe();
        }
        if (changed.has("_modal")) {
            syncDialogToModal(this.renderRoot, this._modal);
        }
    }

    private _resubscribe(): void {
        if (!this.hass || !this._config?.baby) return;
        this._unsubEntries?.();
        const { startIso, endIso } = _localDayBounds(this._date);
        this._unsubEntries = subscribeEntriesInRange(
            this.hass,
            this._config.baby,
            startIso,
            endIso,
            (entries) => {
                this._entries = Array.isArray(entries) ? entries : [];
            }
        );
    }

    private _go(delta: number): void {
        this._date = _shiftDate(this._date, delta);
    }

    private _today = () => {
        this._date = _toDateInput(new Date());
    };

    private _onDateChange = (e: Event) => {
        const v = (e.currentTarget as HTMLInputElement).value;
        if (v && _fromDateInput(v)) this._date = v;
    };

    private _requestEdit = (entry: any) => {
        this._modal = { kind: "edit_entry", entry };
    };

    private _requestDelete = (entry: DeleteEntryInput) => {
        this._modal = requestDeleteOrPromptImported(entry, (id) =>
            this.hass.callService("babytracker", "delete_entry", { entry_id: id })
        );
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
        await this.hass.callService("babytracker", service, data);
        this._modal = null;
    };

    private _callService = async (
        service: string,
        data: Record<string, unknown>
    ): Promise<unknown> => {
        return this.hass.callService("babytracker", service, data);
    };

    private _renderChips(summary: DaySummary): TemplateResult {
        const chips: TemplateResult[] = [];

        const diaperDetail: string[] = [];
        if (summary.wet) diaperDetail.push(`${summary.wet}w`);
        if (summary.dirty) diaperDetail.push(`${summary.dirty}d`);
        if (summary.mixed) diaperDetail.push(`${summary.mixed}b`);
        chips.push(html`
            <span class="chip"
                ><span class="chip-label">Diapers</span> ${summary.diapers}${
                    diaperDetail.length > 0
                        ? html` <span class="chip-detail"
                              >(${diaperDetail.join(" · ")})</span
                          >`
                        : ""
                }</span
            >
        `);

        chips.push(html`
            <span class="chip"
                ><span class="chip-label">Sleep</span>
                ${formatMinutes(summary.sleepMinutes)}</span
            >
        `);
        chips.push(html`
            <span class="chip"
                ><span class="chip-label">Longest sleep</span>
                ${formatMinutes(summary.longestSleepMinutes)}</span
            >
        `);

        if (summary.bottleFeeds > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Feeds</span>
                    ${summary.bottleFeeds}
                    <span class="chip-detail"
                        >· ${formatVolume(summary.bottleVolumeMl)}</span
                    ></span
                >
            `);
        }
        if (summary.nursingMinutes > 0) {
            const sides: string[] = [];
            if (summary.nursingLeftMinutes > 0)
                sides.push(`L ${formatMinutes(summary.nursingLeftMinutes)}`);
            if (summary.nursingRightMinutes > 0)
                sides.push(`R ${formatMinutes(summary.nursingRightMinutes)}`);
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Nursing</span>
                    ${formatMinutes(summary.nursingMinutes)}
                    <span class="chip-detail">(${sides.join(" · ")})</span></span
                >
            `);
        }
        if (summary.pumpingMl > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Pumping</span>
                    ${formatVolume(summary.pumpingMl)}</span
                >
            `);
        }
        if (summary.solidsCount > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Solids</span>
                    ${summary.solidsCount}</span
                >
            `);
        }
        if (summary.tummyMinutes > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Tummy time</span>
                    ${formatMinutes(summary.tummyMinutes)}</span
                >
            `);
        }
        if (summary.walkCount > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Walks</span> ${summary.walkCount}
                    <span class="chip-detail"
                        >· ${formatMinutes(summary.walkMinutes)}</span
                    ></span
                >
            `);
        }
        if (summary.medCount > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Meds</span>
                    ${summary.medCount}</span
                >
            `);
        }
        if (summary.vaccineCount > 0) {
            chips.push(html`
                <span class="chip"
                    ><span class="chip-label">Vaccines</span>
                    ${summary.vaccineCount}</span
                >
            `);
        }

        return html`<div class="chips" aria-label="Day summary">
            ${chips}
        </div>`;
    }

    protected render(): TemplateResult {
        if (!this.hass || !this._config) return html``;
        const isToday = this._date === _toDateInput(new Date());
        const summary = summarizeDay(this._entries);
        return html`
            <ha-card>
                <h2>History — ${_humanDate(this._date)}</h2>
                <div class="nav">
                    <button
                        type="button"
                        aria-label="Previous day"
                        @click=${() => this._go(-1)}
                    >
                        ‹
                    </button>
                    <input
                        type="date"
                        aria-label="Pick a date"
                        .value=${this._date}
                        @change=${this._onDateChange}
                    />
                    <button
                        type="button"
                        aria-label="Next day"
                        @click=${() => this._go(1)}
                    >
                        ›
                    </button>
                    <span class="spacer"></span>
                    <button
                        type="button"
                        ?disabled=${isToday}
                        @click=${this._today}
                    >
                        Today
                    </button>
                </div>
                ${this._entries.length === 0
                    ? html`<p class="empty">Nothing logged on this day.</p>`
                    : html`
                          ${this._renderChips(summary)}
                          <ul class="entries">
                              ${this._entries.map((entry: any) =>
                                  entryRowTemplate(
                                      this.hass,
                                      entry,
                                      this._requestEdit,
                                      this._expandedNotes,
                                      this._toggleNotes
                                  )
                              )}
                          </ul>
                      `}
            </ha-card>
            ${modalTemplate(
                this.hass,
                this._modal,
                undefined,
                this._submitModal,
                this._callService,
                this._closeModal,
                this._requestDelete
            )}
        `;
    }

    static getStubConfig(): BabytrackerHistoryCardConfig {
        return { type: "custom:babytracker-history-card", baby: "ava" };
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
    type: "babytracker-history-card",
    name: "babytracker — history",
    description:
        "Paginate through one baby's entries by calendar day with edit + delete."
});
