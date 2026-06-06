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

export function diaperForm(
    hass: any,
    baby: string,
    submit: Submit,
    close: Close
): TemplateResult {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form, (e as any).submitter ?? undefined);
        submit("log_diaper", {
            baby,
            kind: String(data.get("kind") ?? "wet"),
            timestamp: localInputToIso(String(data.get("when") ?? "")),
            notes: String(data.get("notes") ?? "") || undefined,
            photo_path: readPhotoPath(form)
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log diaper</h2>
            <label for="when">Time</label>
            ${dateTimeRow({
                id: "when",
                value: nowLocalForInput(),
                required: true
            })}
            <label for="notes">Notes</label>
            ${notesInputRow(hass)}
            ${photoRow(hass)}
            <div
                style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px;"
            >
                <button
                    type="submit"
                    name="kind"
                    value="wet"
                    class="quick"
                    aria-label="Log wet diaper"
                >
                    Wet
                </button>
                <button
                    type="submit"
                    name="kind"
                    value="dirty"
                    class="quick"
                    aria-label="Log dirty diaper"
                >
                    Dirty
                </button>
                <button
                    type="submit"
                    name="kind"
                    value="both"
                    class="quick"
                    aria-label="Log both diaper"
                >
                    Both
                </button>
            </div>
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
            </div>
        </form>
    `;
}
