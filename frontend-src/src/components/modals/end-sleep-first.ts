import { html, type TemplateResult } from "lit";

import { displayBabyName } from "../../lib/ha-helpers";
import type { Call, Close } from "./_helpers";

export function endSleepFirstForm(
    baby: string,
    babyName: string | undefined,
    label: string,
    then: () => void | Promise<void>,
    call: Call,
    close: Close
): TemplateResult {
    const skip = async () => {
        close();
        await then();
    };
    const endAndContinue = async () => {
        try {
            await call("end_sleep", { baby });
        } catch (err) {
            console.warn("babytracker: end_sleep failed", err);
        }
        close();
        await then();
    };
    const displayName = displayBabyName(babyName ?? baby);
    return html`
        <form @submit=${(e: SubmitEvent) => e.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${displayName} is asleep. End the sleep session before ${label}?</p>
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="button" @click=${skip}>Skip, just log</button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${endAndContinue}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
