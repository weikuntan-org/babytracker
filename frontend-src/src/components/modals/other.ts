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
// set to the chip label and reads the Started/Ended pickers above the
// chip row so a user who set a custom time before tapping gets that
// honored. Untouched Started defaults to the modal's render time —
// effectively "now" for typical tap-and-go usage.
const QUICK_OTHER_OPTIONS = [
    "Bath",
    "Butt wash",
    "Diaper free time",
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
            timestamp: localInputToIso(String(data.get("started") ?? "")),
            ended_at:
                localInputToIso(String(data.get("ended") ?? "")) || undefined,
            notes: String(data.get("notes") ?? "") || undefined,
            photo_path: readPhotoPath(form)
        });
    };
    // Chips read the Started/Ended pickers so a user who set a time
    // before tapping a chip gets that time honored. The Started picker
    // defaults to the modal's render time, so untouched taps still log
    // ~now (the few-second drift between render and tap is acceptable).
    const onQuick = (e: Event, name: string) => {
        const form = (e.currentTarget as HTMLButtonElement).form;
        const payload: Record<string, unknown> = { baby, name };
        if (form) {
            const data = new FormData(form);
            const started = localInputToIso(String(data.get("started") ?? ""));
            const ended = localInputToIso(String(data.get("ended") ?? ""));
            if (started) payload.timestamp = started;
            if (ended) payload.ended_at = ended;
        }
        submit("log_other", payload);
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log activity</h2>
            <label for="started">Started</label>
            ${dateTimeRow({
                id: "started",
                value: nowLocalForInput(),
                required: true
            })}
            <label for="ended"
                >Ended <span class="muted">(optional)</span></label
            >
            ${dateTimeRow({
                id: "ended",
                placeholder: "leave blank for a point-in-time event"
            })}
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${QUICK_OTHER_OPTIONS.map(
                    name => html`
                        <button
                            type="button"
                            class="quick"
                            @click=${(e: Event) => onQuick(e, name)}
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
