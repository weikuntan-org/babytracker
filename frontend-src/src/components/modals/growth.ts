import { html, type TemplateResult } from "lit";

import {
    dateInputToIso,
    dateRow,
    growthMeasurementsRow,
    notesInputRow,
    photoRow,
    readPhotoPath,
    todayDateInput,
    type Close,
    type Submit
} from "./_helpers";

export function growthLogForm(
    hass: any,
    baby: string,
    options: any,
    submit: Submit,
    close: Close
): TemplateResult {
    const weightUnit = options?.weight_unit ?? "kg";
    const lengthUnit = options?.length_unit ?? "cm";
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const f = new FormData(form);
        const num = (key: string): number | undefined => {
            const v = String(f.get(key) ?? "").trim();
            if (!v) return undefined;
            const n = Number(v);
            return Number.isFinite(n) ? n : undefined;
        };
        // Backend rejects the call if all three measurements are blank
        // (log_growth requires at least one). The error surfaces in the
        // HA frontend toast — no client-side pre-check.
        submit("log_growth", {
            baby,
            weight: num("weight"),
            height: num("height"),
            head_circumference: num("head"),
            weight_unit: String(f.get("weight_unit") ?? weightUnit),
            length_unit: String(f.get("length_unit") ?? lengthUnit),
            timestamp: dateInputToIso(String(f.get("when") ?? "")),
            notes: String(f.get("notes") ?? "") || undefined,
            photo_path: readPhotoPath(form)
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log growth measurement</h2>
            ${growthMeasurementsRow({
                initialWeightUnit: weightUnit,
                initialLengthUnit: lengthUnit,
                autofocusWeight: true
            })}
            <label for="when">Date</label>
            ${dateRow({
                id: "when",
                value: todayDateInput(),
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
