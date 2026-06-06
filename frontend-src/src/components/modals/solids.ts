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

export function solidsForm(
    hass: any,
    baby: string,
    submit: Submit,
    close: Close
): TemplateResult {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const at = localInputToIso(String(data.get("when") ?? ""));
        // Solids, like bottle, is a point-in-time event — close the entry
        // at the same timestamp so it doesn't show up as an ongoing feeding
        // in OpenSessionBinary.
        submit("log_feeding", {
            baby,
            method: "solids",
            started_at: at,
            ended_at: at,
            notes: String(data.get("notes") ?? "") || undefined,
            photo_path: readPhotoPath(form)
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${notesInputRow(hass, {
                placeholder: "e.g. banana, oatmeal",
                autofocus: true
            })}
            <label for="when">Time</label>
            ${dateTimeRow({
                id: "when",
                value: nowLocalForInput(),
                required: true
            })}
            ${photoRow(hass)}
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
