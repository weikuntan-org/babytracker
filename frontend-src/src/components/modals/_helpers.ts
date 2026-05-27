// Shared utilities for the per-kind modal forms. Each form file under
// `components/modals/` imports the bits it needs from here; the top-level
// `components/modal.ts` dispatches to them and re-exports the public types.
import { html, type TemplateResult } from "lit";
import "../mic-button";
import "../photo-button";

export type Submit = (
    service: string,
    data: Record<string, unknown>
) => Promise<void>;
export type Close = () => void;
export type RequestDelete = (entry: {
    id: string;
    type?: string;
    source?: string;
    staff?: string | null;
}) => void;

// Entry types that the edit modal renders with a "Started + Ended"
// pair instead of a single timestamp. "other" is included because the
// end-time is optional — a blank "Ended" still serializes to null and
// leaves the entry as a point-in-time event.
export const SESSION_ENTRY_TYPES: ReadonlySet<string> = new Set([
    "sleep",
    "feeding",
    "tummy_time",
    "walk",
    "other"
]);

/**
 * Notes input + mic button row. Used by every dialog that has a
 * `<input name="notes">` field. The mic button transcribes speech and
 * appends to the notes value (see `components/mic-button.ts`).
 */
export function notesInputRow(
    hass: any,
    opts: {
        placeholder?: string;
        value?: string;
        autofocus?: boolean;
    } = {}
): TemplateResult {
    return html`
        <div style="display:flex;gap:6px;align-items:center;">
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder=${opts.placeholder ?? "optional"}
                .value=${opts.value ?? ""}
                ?autofocus=${opts.autofocus ?? false}
                style="flex:1;min-width:0;"
            />
            <bt-mic-button .hass=${hass}></bt-mic-button>
        </div>
    `;
}

/**
 * Photo-attach row. `bt-photo-button` exposes the resulting media-source
 * URL on its `.value` property; form submit handlers read it via
 * `readPhotoPath(form)` instead of `FormData` because custom elements
 * don't participate in `FormData` by default.
 */
export function photoRow(hass: any, currentValue?: string): TemplateResult {
    return html`
        <label>Photo</label>
        <bt-photo-button
            .hass=${hass}
            .value=${currentValue ?? ""}
        ></bt-photo-button>
    `;
}

export function readPhotoPath(form: HTMLFormElement): string | undefined {
    const el = form.querySelector("bt-photo-button") as any;
    const v = el?.value;
    return typeof v === "string" && v.length > 0 ? v : undefined;
}

const _pad = (n: number) => String(n).padStart(2, "0");

/**
 * Current local time as the `value` for an `<input type="datetime-local">`.
 * The input expects `YYYY-MM-DDTHH:MM` in *local* time (no timezone suffix).
 */
export function nowLocalForInput(): string {
    const d = new Date();
    return (
        `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}` +
        `T${_pad(d.getHours())}:${_pad(d.getMinutes())}`
    );
}

/**
 * Convert a `datetime-local` input value (`YYYY-MM-DDTHH:MM` in local time)
 * to a UTC ISO string the backend can parse via `cv.datetime`. Empty input
 * returns undefined so the backend falls back to "now".
 */
export function localInputToIso(value: string): string | undefined {
    if (!value) return undefined;
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) return undefined;
    return new Date(ms).toISOString();
}

/**
 * Convert a stored ISO timestamp to the `YYYY-MM-DDTHH:MM` (local) value
 * an `<input type="datetime-local">` expects. Returns "" for missing or
 * unparseable input so the input stays empty.
 */
export function isoToLocalInput(iso?: string | null): string {
    if (!iso) return "";
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return "";
    const d = new Date(ms);
    return (
        `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}` +
        `T${_pad(d.getHours())}:${_pad(d.getMinutes())}`
    );
}

/** Today's local date in `YYYY-MM-DD` for `<input type="date">` defaults. */
export function todayDateInput(): string {
    const d = new Date();
    return `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}`;
}

/**
 * Convert a stored ISO timestamp to the `YYYY-MM-DD` (local) value an
 * `<input type="date">` expects. Returns "" for missing or unparseable
 * input so the input stays empty.
 */
export function isoToDateInput(iso?: string | null): string {
    if (!iso) return "";
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return "";
    const d = new Date(ms);
    return `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}`;
}

/**
 * Convert a `YYYY-MM-DD` (local) date input value to a UTC ISO datetime
 * the backend's `cv.datetime` can parse. Anchors to local midnight so
 * date-only events (growth, vaccines) sort to the start of the day on
 * the chart, ahead of any same-day activity entries.
 *
 * Tradeoff: a viewer in a far-future timezone could see the wall-clock
 * day shift back by one. The babytracker workflow is single-user,
 * single-timezone in practice, so this is acceptable in exchange for
 * the more intuitive "first event of the day" sort order.
 */
export function dateInputToIso(value: string): string | undefined {
    if (!value) return undefined;
    const ms = Date.parse(`${value}T00:00`);
    if (Number.isNaN(ms)) return undefined;
    return new Date(ms).toISOString();
}

/**
 * `datetime-local` input + a "Now" button that one-clicks the value to
 * the current local time. The button lives next to the input so parents
 * ending an open session don't have to drill through the datetime
 * picker just to write "now".
 */
export function dateTimeRow(opts: {
    id: string;
    value?: string;
    required?: boolean;
    placeholder?: string;
}): TemplateResult {
    const setNow = (e: Event) => {
        const btn = e.currentTarget as HTMLElement;
        const input = btn.parentElement?.querySelector(
            "input"
        ) as HTMLInputElement | null;
        if (!input) return;
        input.value = nowLocalForInput();
        // Fire input/change so any listeners (validation, form state)
        // react the same way as a manual edit.
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    return html`
        <div class="dt-row">
            <input
                id=${opts.id}
                name=${opts.id}
                type="datetime-local"
                .value=${opts.value ?? ""}
                placeholder=${opts.placeholder ?? ""}
                ?required=${opts.required ?? false}
            />
            <button
                type="button"
                class="now-btn"
                aria-label="Set to now"
                title="Set to current time"
                @click=${setNow}
            >
                Now
            </button>
        </div>
    `;
}

// Slider bounds for the oz bottle-amount picker. ml mode falls back
// to a plain number input (5-ml precision via the slider would be too
// fine to feel meaningful at typical bottle sizes). Shared between
// the log-bottle modal and the edit-entry modal so they stay in sync.
const OZ_SLIDER_MAX = 8;
const OZ_SLIDER_STEP = 0.5;
const OZ_SLIDER_DEFAULT = 4;

/**
 * Bottle "Amount + Unit" row used by both the log-bottle modal and the
 * edit-entry modal's bottle-feeding branch. In oz mode renders a 0–8
 * `<input type="range">` (0.5 step) with a live readout; in ml mode
 * renders a free-form number input. The unit `<select>` swaps the
 * input in place imperatively so both modals can stay stateless.
 */
export function bottleAmountRow(opts: {
    initialAmount?: number;
    initialUnit: "oz" | "ml" | string;
    autofocus?: boolean;
}): TemplateResult {
    const initialUnit = opts.initialUnit === "ml" ? "ml" : "oz";
    const hasAmount =
        typeof opts.initialAmount === "number" &&
        Number.isFinite(opts.initialAmount);
    const initialAmount = hasAmount ? (opts.initialAmount as number) : undefined;
    const numberValue = initialAmount != null ? String(initialAmount) : "";
    const sliderInitial = Math.max(
        0,
        Math.min(OZ_SLIDER_MAX, initialAmount ?? OZ_SLIDER_DEFAULT)
    );
    const onAmountInput = (e: Event) => {
        const input = e.currentTarget as HTMLInputElement;
        if (input.type !== "range") return;
        const readout = input.form?.querySelector<HTMLElement>(
            "#amount-readout"
        );
        if (readout) readout.textContent = `${input.value} oz`;
    };
    const onUnitChange = (e: Event) => {
        const select = e.currentTarget as HTMLSelectElement;
        const form = select.form;
        if (!form) return;
        const amount = form.querySelector<HTMLInputElement>(
            'input[name="amount"]'
        );
        const readout = form.querySelector<HTMLElement>("#amount-readout");
        if (!amount) return;
        if (select.value === "oz") {
            amount.type = "range";
            amount.min = "0";
            amount.max = String(OZ_SLIDER_MAX);
            amount.step = String(OZ_SLIDER_STEP);
            amount.removeAttribute("inputmode");
            const v = Number(amount.value);
            const clamped = Number.isFinite(v)
                ? Math.max(0, Math.min(OZ_SLIDER_MAX, v))
                : OZ_SLIDER_DEFAULT;
            amount.value = String(clamped);
            if (readout) {
                readout.style.display = "";
                readout.textContent = `${amount.value} oz`;
            }
        } else {
            amount.type = "number";
            amount.min = "0";
            amount.step = "1";
            amount.removeAttribute("max");
            amount.inputMode = "decimal";
            if (readout) readout.style.display = "none";
        }
    };
    return html`
        <label for="amount">Amount</label>
        <div style="display:flex;gap:8px;align-items:center;">
            ${initialUnit === "oz"
                ? html`
                      <input
                          id="amount"
                          name="amount"
                          type="range"
                          min="0"
                          max=${OZ_SLIDER_MAX}
                          step=${OZ_SLIDER_STEP}
                          .value=${String(sliderInitial)}
                          @input=${onAmountInput}
                          style="flex:1;min-width:0;"
                          ?autofocus=${opts.autofocus ?? false}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="min-width:4ch;text-align:right;"
                          >${sliderInitial} oz</span
                      >
                  `
                : html`
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="1"
                          inputmode="decimal"
                          .value=${numberValue}
                          style="flex:1;min-width:0;"
                          ?autofocus=${opts.autofocus ?? false}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="display:none;"
                      ></span>
                  `}
        </div>
        <label for="unit">Unit</label>
        <select id="unit" name="unit" @change=${onUnitChange}>
            <option value="oz" ?selected=${initialUnit === "oz"}>oz</option>
            <option value="ml" ?selected=${initialUnit === "ml"}>ml</option>
        </select>
    `;
}

/**
 * Growth measurements grid (weight + height + head circumference, each
 * with its own unit selector). Shared between the log-growth modal and
 * the edit-entry modal's growth branch so they can't drift. All three
 * measurement inputs are optional on the create side (the backend
 * rejects an entry with all three blank); on the edit side they pre-fill
 * from the entry's stored values.
 */
export function growthMeasurementsRow(opts: {
    initialWeight?: number;
    initialHeight?: number;
    initialHead?: number;
    initialWeightUnit?: "kg" | "lb" | string;
    initialLengthUnit?: "cm" | "in" | string;
    autofocusWeight?: boolean;
}): TemplateResult {
    const weightUnit = opts.initialWeightUnit === "lb" ? "lb" : "kg";
    const lengthUnit = opts.initialLengthUnit === "in" ? "in" : "cm";
    const fmt = (n: number | undefined) =>
        typeof n === "number" && Number.isFinite(n) ? String(n) : "";
    return html`
        <div
            style="display:grid;grid-template-columns:2fr 1fr;gap:8px;align-items:end;"
        >
            <div>
                <label for="weight">Weight</label>
                <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    .value=${fmt(opts.initialWeight)}
                    ?autofocus=${opts.autofocusWeight ?? false}
                />
            </div>
            <div>
                <label for="weight_unit">Unit</label>
                <select id="weight_unit" name="weight_unit">
                    <option value="kg" ?selected=${weightUnit === "kg"}>
                        kg
                    </option>
                    <option value="lb" ?selected=${weightUnit === "lb"}>
                        lb
                    </option>
                </select>
            </div>
            <div>
                <label for="height">Height</label>
                <input
                    id="height"
                    name="height"
                    type="number"
                    min="0"
                    step="0.1"
                    inputmode="decimal"
                    .value=${fmt(opts.initialHeight)}
                />
            </div>
            <div>
                <label for="length_unit">Unit</label>
                <select id="length_unit" name="length_unit">
                    <option value="cm" ?selected=${lengthUnit === "cm"}>
                        cm
                    </option>
                    <option value="in" ?selected=${lengthUnit === "in"}>
                        in
                    </option>
                </select>
            </div>
            <div style="grid-column: span 2;">
                <label for="head">Head circumference</label>
                <input
                    id="head"
                    name="head"
                    type="number"
                    min="0"
                    step="0.1"
                    inputmode="decimal"
                    .value=${fmt(opts.initialHead)}
                />
                <span class="muted">(uses the length unit above)</span>
            </div>
        </div>
    `;
}

/**
 * Date-only sibling of `dateTimeRow` — adds a `Today` button next to a
 * `<input type="date">`. Used by growth and vaccine entries, which are
 * date-only by design (no time component).
 */
export function dateRow(opts: {
    id: string;
    value?: string;
    required?: boolean;
}): TemplateResult {
    const setToday = (e: Event) => {
        const btn = e.currentTarget as HTMLElement;
        const input = btn.parentElement?.querySelector(
            "input"
        ) as HTMLInputElement | null;
        if (!input) return;
        input.value = todayDateInput();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    return html`
        <div class="dt-row">
            <input
                id=${opts.id}
                name=${opts.id}
                type="date"
                .value=${opts.value ?? ""}
                ?required=${opts.required ?? false}
            />
            <button
                type="button"
                class="now-btn"
                aria-label="Set to today"
                title="Set to today's date"
                @click=${setToday}
            >
                Today
            </button>
        </div>
    `;
}
