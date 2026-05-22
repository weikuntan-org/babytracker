import { html, type TemplateResult } from "lit";

import {
    dateTimeRow,
    localInputToIso,
    notesInputRow,
    nowLocalForInput,
    photoRow,
    readPhotoPath,
    type Close,
    type Submit
} from "./_helpers";

// Slider bounds for the oz amount picker. ml mode falls back to a
// plain number input (5-ml precision via the slider would be too fine
// to feel meaningful at typical bottle sizes).
const OZ_SLIDER_MAX = 8;
const OZ_SLIDER_STEP = 0.5;
const OZ_SLIDER_DEFAULT = 4;

export function bottleForm(
    hass: any,
    baby: string,
    options: any,
    lastAmount: number | undefined,
    lastUnit: "ml" | "oz" | undefined,
    submit: Submit,
    close: Close
): TemplateResult {
    // Default unit prefers the integration option, falling back to whatever
    // the previous bottle used, then oz.
    const defaultUnit = options?.volume_unit ?? lastUnit ?? "oz";
    const lastNumeric =
        typeof lastAmount === "number" && Number.isFinite(lastAmount)
            ? lastAmount
            : undefined;
    const defaultAmount = lastNumeric != null ? String(lastNumeric) : "";
    const sliderInitial = Math.max(
        0,
        Math.min(OZ_SLIDER_MAX, lastNumeric ?? OZ_SLIDER_DEFAULT)
    );
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const amountStr = String(data.get("amount") ?? "");
        const amount = amountStr === "" ? undefined : Number(amountStr);
        const at = localInputToIso(String(data.get("at") ?? ""));
        const unit = String(data.get("unit") ?? defaultUnit);
        const notes = String(data.get("notes") ?? "") || undefined;
        // Bottle is a point-in-time event, not a session. Send both started_at
        // and ended_at at the same instant so the entry is closed and doesn't
        // appear as an ongoing feeding in OpenSessionBinary.
        submit("log_feeding", {
            baby,
            method: "bottle",
            amount,
            unit,
            started_at: at,
            ended_at: at,
            notes,
            photo_path: readPhotoPath(form)
        });
    };
    // Live readout for the slider — updates on `@input`. Span is also
    // toggled visible/hidden by the unit-change handler below.
    const onAmountInput = (e: Event) => {
        const input = e.currentTarget as HTMLInputElement;
        if (input.type !== "range") return;
        const readout = input.form?.querySelector<HTMLElement>(
            "#amount-readout"
        );
        if (readout) readout.textContent = `${input.value} oz`;
    };
    // Unit toggle swaps the amount input between a 0–8 oz slider and a
    // free-form ml number input in place. Doing it imperatively keeps
    // the form stateless — there's no Lit reactive shell here.
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
        <form @submit=${onSubmit}>
            <h2>Log bottle</h2>
            <label for="amount">Amount</label>
            <div style="display:flex;gap:8px;align-items:center;">
                ${defaultUnit === "oz"
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
                              autofocus
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
                              .value=${defaultAmount}
                              style="flex:1;min-width:0;"
                              autofocus
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
                <option value="oz" ?selected=${defaultUnit === "oz"}>oz</option>
                <option value="ml" ?selected=${defaultUnit === "ml"}>ml</option>
            </select>
            <label for="at">Time</label>
            ${dateTimeRow({
                id: "at",
                value: nowLocalForInput(),
                required: true
            })}
            <label for="notes">Notes</label>
            ${notesInputRow(hass)}
            ${photoRow(hass)}
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
