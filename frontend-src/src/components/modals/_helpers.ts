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
export type Call = (
    service: string,
    data: Record<string, unknown>
) => Promise<unknown>;
export type Close = () => void;
export type RequestDelete = (entry: {
    id: string;
    type?: string;
    source?: string;
    staff?: string | null;
}) => void;

export const SESSION_ENTRY_TYPES: ReadonlySet<string> = new Set([
    "sleep",
    "feeding",
    "tummy_time",
    "walk"
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
 * the backend's `cv.datetime` can parse. Anchors to local noon so a date
 * doesn't shift across timezones during the JSON round-trip — important
 * for events like vaccines where only the calendar day matters.
 */
export function dateInputToIso(value: string): string | undefined {
    if (!value) return undefined;
    const ms = Date.parse(`${value}T12:00`);
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
