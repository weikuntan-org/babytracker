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

// Common one-tap activities. Each chip submits `log_other` with `name`
// set to the chip label and timestamp/notes/photo left blank so the
// server defaults to "now". Users who need finer control type into
// the input below and use the dated form.
const QUICK_OTHER_OPTIONS = [
    "Bath",
    "Butt wash",
    "Medication",
    "Vitamin",
    "Burp",
    "Spit up",
    "Throw up"
] as const;

export function otherForm(
    hass: any,
    baby: string,
    submit: Submit,
    close: Close
): TemplateResult {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        submit("log_other", {
            baby,
            name: String(data.get("name") ?? ""),
            timestamp: localInputToIso(String(data.get("when") ?? "")),
            notes: String(data.get("notes") ?? "") || undefined,
            photo_path: readPhotoPath(form)
        });
    };
    const onQuick = (name: string) => submit("log_other", { baby, name });
    return html`
        <form @submit=${onSubmit}>
            <h2>Log activity</h2>
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${QUICK_OTHER_OPTIONS.map(
                    name => html`
                        <button
                            type="button"
                            class="quick"
                            @click=${() => onQuick(name)}
                        >
                            ${name}
                        </button>
                    `
                )}
            </div>
            <label for="name">Or type your own</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. doctor visit, first smile"
                autofocus
                required
            />
            <label for="when">When</label>
            ${dateTimeRow({ id: "when", value: nowLocalForInput() })}
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
