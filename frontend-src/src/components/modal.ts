// Modal/lightbox forms for activities that need extra input on tap.
import { html, type TemplateResult, nothing } from "lit";

export type ActivityKind = "diaper" | "bottle" | "solids";

export type ModalKind =
    | { kind: ActivityKind; baby: string }
    | { kind: "end_sleep_first"; baby: string; then: ActivityKind };

type Submit = (service: string, data: Record<string, unknown>) => Promise<void>;
type Swap = (kind: ActivityKind) => void;
type Call = (service: string, data: Record<string, unknown>) => Promise<unknown>;
type Close = () => void;

export function modalTemplate(
    modal: ModalKind | null,
    options: any,
    submit: Submit,
    swap: Swap,
    call: Call,
    close: Close
): TemplateResult {
    return html`
        <dialog @cancel=${close} @close=${close}>
            ${modal === null
                ? nothing
                : modal.kind === "diaper"
                  ? diaperForm(modal.baby, submit, close)
                  : modal.kind === "bottle"
                    ? bottleForm(modal.baby, options, submit, close)
                    : modal.kind === "solids"
                      ? solidsForm(modal.baby, submit, close)
                      : endSleepFirstForm(
                            modal.baby,
                            modal.then,
                            swap,
                            call,
                            close
                        )}
        </dialog>
    `;
}

function endSleepFirstForm(
    baby: string,
    next: ActivityKind,
    swap: Swap,
    call: Call,
    close: Close
): TemplateResult {
    const labels: Record<ActivityKind, string> = {
        diaper: "logging a diaper",
        bottle: "logging a bottle",
        solids: "logging solids"
    };
    const endAndContinue = async () => {
        try {
            await call("end_sleep", { baby });
        } catch (err) {
            console.warn("babytracker: end_sleep failed", err);
        }
        swap(next);
    };
    return html`
        <form @submit=${(e: SubmitEvent) => e.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${baby} is asleep. End the sleep session before ${labels[next]}?</p>
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="button" @click=${() => swap(next)}>
                    Skip, just log
                </button>
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

function diaperForm(
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
            notes: String(data.get("notes") ?? "") || undefined
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log diaper</h2>
            <label for="notes">Notes</label>
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder="optional"
            />
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

function bottleForm(
    baby: string,
    options: any,
    submit: Submit,
    close: Close
): TemplateResult {
    const defaultUnit = options?.volume_unit ?? "oz";
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const amountStr = String(data.get("amount") ?? "");
        const amount = amountStr === "" ? undefined : Number(amountStr);
        submit("log_feeding", {
            baby,
            method: "bottle",
            amount,
            unit: String(data.get("unit") ?? defaultUnit),
            notes: String(data.get("notes") ?? "") || undefined
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
                autofocus
                required
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${defaultUnit === "oz"}>oz</option>
                <option value="ml" ?selected=${defaultUnit === "ml"}>ml</option>
            </select>
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}

function solidsForm(
    baby: string,
    submit: Submit,
    close: Close
): TemplateResult {
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        submit("log_feeding", {
            baby,
            method: "solids",
            notes: String(data.get("notes") ?? "") || undefined
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log solids</h2>
            <label for="notes">What was fed</label>
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder="e.g. banana, oatmeal"
                autofocus
                required
            />
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
