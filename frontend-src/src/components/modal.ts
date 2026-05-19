// Modal/lightbox forms for activities that need extra input on tap.
import { html, type TemplateResult, nothing } from "lit";

/**
 * Current local time as the `value` for an `<input type="datetime-local">`.
 * The input expects `YYYY-MM-DDTHH:MM` in *local* time (no timezone suffix).
 */
function _nowLocalForInput(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
}

/**
 * Convert a `datetime-local` input value (`YYYY-MM-DDTHH:MM` in local time)
 * to a UTC ISO string the backend can parse via `cv.datetime`. Empty input
 * returns undefined so the backend falls back to "now".
 */
function _localInputToIso(value: string): string | undefined {
    if (!value) return undefined;
    const ms = Date.parse(value);
    if (Number.isNaN(ms)) return undefined;
    return new Date(ms).toISOString();
}

export type ActivityKind = "diaper" | "bottle" | "solids" | "other";

export type SessionActivity = "sleep" | "tummy_time" | "walk" | "feeding";

export type ModalKind =
    | { kind: ActivityKind; baby: string }
    | {
          kind: "session";
          baby: string;
          activity: SessionActivity;
          /** Only set when activity = "feeding" — picks the feeding method. */
          method?: "breast_left" | "breast_right";
      }
    | {
          kind: "end_sleep_first";
          baby: string;
          label: string;
          then: () => void | Promise<void>;
      }
    | {
          kind: "confirm_delete_imported";
          entryId: string;
          entryType: string;
          source: string;
          staff?: string | null;
      };

type Submit = (service: string, data: Record<string, unknown>) => Promise<void>;
type Call = (service: string, data: Record<string, unknown>) => Promise<unknown>;
type Close = () => void;

export function modalTemplate(
    modal: ModalKind | null,
    options: any,
    submit: Submit,
    call: Call,
    close: Close
): TemplateResult {
    let body: TemplateResult | typeof nothing = nothing;
    if (modal !== null) {
        switch (modal.kind) {
            case "diaper":
                body = diaperForm(modal.baby, submit, close);
                break;
            case "bottle":
                body = bottleForm(modal.baby, options, submit, close);
                break;
            case "solids":
                body = solidsForm(modal.baby, submit, close);
                break;
            case "other":
                body = otherForm(modal.baby, submit, close);
                break;
            case "session":
                body = sessionForm(
                    modal.baby,
                    modal.activity,
                    modal.method,
                    submit,
                    close
                );
                break;
            case "end_sleep_first":
                body = endSleepFirstForm(
                    modal.baby,
                    modal.label,
                    modal.then,
                    call,
                    close
                );
                break;
            case "confirm_delete_imported":
                body = confirmDeleteImportedForm(
                    modal.entryId,
                    modal.entryType,
                    modal.source,
                    modal.staff ?? null,
                    submit,
                    close
                );
                break;
        }
    }
    return html`
        <dialog @cancel=${close} @close=${close}>${body}</dialog>
    `;
}

function endSleepFirstForm(
    baby: string,
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
    return html`
        <form @submit=${(e: SubmitEvent) => e.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${baby} is asleep. End the sleep session before ${label}?</p>
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
            timestamp: _localInputToIso(String(data.get("when") ?? "")),
            notes: String(data.get("notes") ?? "") || undefined
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${_nowLocalForInput()}
            />
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
        const startedAt = _localInputToIso(String(data.get("started") ?? ""));
        const endedAt = _localInputToIso(String(data.get("ended") ?? ""));
        const unit = String(data.get("unit") ?? defaultUnit);
        const notes = String(data.get("notes") ?? "") || undefined;
        // No end time → open a live feeding session at started_at. Amount is
        // recorded on the session entry but the session stays open until the
        // user taps End on the active-session banner.
        if (!endedAt) {
            submit("start_feeding", {
                baby,
                method: "bottle",
                started_at: startedAt
            });
            return;
        }
        // Both ends → completed feeding entry (the historical/single-entry path).
        submit("log_feeding", {
            baby,
            method: "bottle",
            amount,
            unit,
            started_at: startedAt,
            ended_at: endedAt,
            notes
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
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${defaultUnit === "oz"}>oz</option>
                <option value="ml" ?selected=${defaultUnit === "ml"}>ml</option>
            </select>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${_nowLocalForInput()}
                required
            />
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            <input
                id="ended"
                name="ended"
                type="datetime-local"
                placeholder="leave blank for an open session"
            />
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
            started_at: _localInputToIso(String(data.get("when") ?? "")),
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
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${_nowLocalForInput()}
            />
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}

function otherForm(
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
            timestamp: _localInputToIso(String(data.get("when") ?? "")),
            notes: String(data.get("notes") ?? "") || undefined
        });
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log activity</h2>
            <label for="name">What happened</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. bath, doctor visit, first smile"
                autofocus
                required
            />
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${_nowLocalForInput()}
            />
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}

function confirmDeleteImportedForm(
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

function sessionForm(
    baby: string,
    activity: SessionActivity,
    method: "breast_left" | "breast_right" | undefined,
    submit: Submit,
    close: Close
): TemplateResult {
    const titleMap: Record<SessionActivity, string> = {
        sleep: "Log sleep",
        tummy_time: "Log tummy time",
        walk: "Log walk",
        feeding: method
            ? `Log ${method.replace("_", " ")} feeding`
            : "Log feeding"
    };
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const startedAt = _localInputToIso(String(data.get("started") ?? ""));
        const endedAt = _localInputToIso(String(data.get("ended") ?? ""));
        const notes = String(data.get("notes") ?? "") || undefined;

        // No end → open a live session at started_at (start_*).
        // Both ends supplied → retroactive completed entry (log_*).
        if (!endedAt) {
            const payload: Record<string, unknown> = {
                baby,
                started_at: startedAt
            };
            let service: string;
            switch (activity) {
                case "sleep":
                    service = "start_sleep";
                    break;
                case "tummy_time":
                    service = "start_tummy_time";
                    break;
                case "walk":
                    service = "start_walk";
                    break;
                case "feeding":
                    service = "start_feeding";
                    payload.method = method!;
                    break;
            }
            submit(service, payload);
            return;
        }

        const payload: Record<string, unknown> = {
            baby,
            started_at: startedAt,
            ended_at: endedAt,
            notes
        };
        let service: string;
        switch (activity) {
            case "sleep":
                service = "log_sleep";
                break;
            case "tummy_time":
                service = "log_tummy_time";
                break;
            case "walk":
                service = "log_walk";
                break;
            case "feeding":
                service = "log_feeding";
                payload.method = method!;
                break;
        }
        submit(service, payload);
    };

    return html`
        <form @submit=${onSubmit}>
            <h2>${titleMap[activity]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${_nowLocalForInput()}
                required
            />
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            <input
                id="ended"
                name="ended"
                type="datetime-local"
                placeholder="leave blank for an open session"
            />
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
