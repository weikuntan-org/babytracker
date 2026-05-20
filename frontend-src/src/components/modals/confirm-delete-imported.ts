import { html, type TemplateResult } from "lit";

import type { Close, Submit } from "./_helpers";

export function confirmDeleteImportedForm(
    entryId: string,
    entryType: string,
    source: string,
    staff: string | null,
    submit: Submit,
    close: Close
): TemplateResult {
    const onConfirm = (e: Event) => {
        e.preventDefault();
        submit("delete_entry", { entry_id: entryId });
    };
    const provenance = staff ? `${source} (${staff})` : source;
    return html`
        <form @submit=${(e: SubmitEvent) => e.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${entryType}</strong> was logged by
                <strong>${provenance}</strong>, not from this card. Deleting it
                here only removes it from babytracker — the upstream record is
                not affected.
            </p>
            <div class="actions">
                <button type="button" @click=${close} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${onConfirm}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
