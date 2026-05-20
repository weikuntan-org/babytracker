import { html, type TemplateResult } from "lit";

import {
    dateInputToIso,
    dateRow,
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
                        autofocus
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
                    />
                    <span class="muted">(uses the length unit above)</span>
                </div>
            </div>
            <label for="when">Date</label>
            ${dateRow({ id: "when", value: todayDateInput() })}
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
