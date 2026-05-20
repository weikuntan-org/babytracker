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
    const defaultAmount =
        typeof lastAmount === "number" && Number.isFinite(lastAmount)
            ? String(lastAmount)
            : "";
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
    return html`
        <form @submit=${onSubmit}>
            <h2>Log bottle</h2>
            <label for="amount">Amount</label>
            <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.5"
                inputmode="decimal"
                .value=${defaultAmount}
                autofocus
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
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
