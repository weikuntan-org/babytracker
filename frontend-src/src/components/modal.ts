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

/**
 * Convert a stored ISO timestamp to the `YYYY-MM-DDTHH:MM` (local) value
 * an `<input type="datetime-local">` expects. Returns "" for missing or
 * unparseable input so the input stays empty.
 */
function _isoToLocalInput(iso?: string | null): string {
    if (!iso) return "";
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return "";
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
}

const SESSION_ENTRY_TYPES = new Set([
    "sleep",
    "feeding",
    "tummy_time",
    "walk"
]);

export type ActivityKind = "diaper" | "bottle" | "solids" | "other";

export type SessionActivity = "sleep" | "tummy_time" | "walk" | "feeding";

export type ModalKind =
    | { kind: "diaper" | "solids" | "other"; baby: string }
    | {
          kind: "bottle";
          baby: string;
          /** Pre-fill values from the last bottle entry (if any). */
          lastAmount?: number;
          lastUnit?: "ml" | "oz";
      }
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
      }
    | {
          kind: "edit_entry";
          entry: any;
      };

type Submit = (service: string, data: Record<string, unknown>) => Promise<void>;
type Call = (service: string, data: Record<string, unknown>) => Promise<unknown>;
type Close = () => void;
type RequestDelete = (entry: {
    id: string;
    type?: string;
    source?: string;
    staff?: string | null;
}) => void;

export function modalTemplate(
    modal: ModalKind | null,
    options: any,
    submit: Submit,
    call: Call,
    close: Close,
    requestDelete?: RequestDelete
): TemplateResult {
    let body: TemplateResult | typeof nothing = nothing;
    if (modal !== null) {
        switch (modal.kind) {
            case "diaper":
                body = diaperForm(modal.baby, submit, close);
                break;
            case "bottle":
                body = bottleForm(
                    modal.baby,
                    options,
                    modal.lastAmount,
                    modal.lastUnit,
                    submit,
                    close
                );
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
            case "edit_entry":
                body = editEntryForm(
                    modal.entry,
                    submit,
                    close,
                    requestDelete
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
    lastAmount: number | undefined,
    lastUnit: "ml" | "oz" | undefined,
    submit: Submit,
    close: Close
): TemplateResult {
    // Default unit prefers the integration option, falling back to whatever
    // the previous bottle used, then oz.
    const defaultUnit = options?.volume_unit ?? lastUnit ?? "oz";
    const defaultAmount =
        typeof lastAmount === "number" && Number.isFinite(lastAmount)
            ? String(lastAmount)
            : "";
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const amountStr = String(data.get("amount") ?? "");
        const amount = amountStr === "" ? undefined : Number(amountStr);
        const at = _localInputToIso(String(data.get("at") ?? ""));
        const unit = String(data.get("unit") ?? defaultUnit);
        const notes = String(data.get("notes") ?? "") || undefined;
        // Bottle is a point-in-time event, not a session. Send both started_at
        // and ended_at at the same instant so the entry is closed and doesn't
        // appear as an ongoing feeding in OpenSessionBinary.
        submit("log_feeding", {
            baby,
            method: "bottle",
            amount,
            unit,
            started_at: at,
            ended_at: at,
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
                .value=${defaultAmount}
                autofocus
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${defaultUnit === "oz"}>oz</option>
                <option value="ml" ?selected=${defaultUnit === "ml"}>ml</option>
            </select>
            <label for="at">Time</label>
            <input
                id="at"
                name="at"
                type="datetime-local"
                .value=${_nowLocalForInput()}
                required
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

function editEntryForm(
    entry: any,
    submit: Submit,
    close: Close,
    requestDelete?: RequestDelete
): TemplateResult {
    const type = String(entry?.type ?? "");
    const data = entry?.data ?? {};
    const isSession =
        SESSION_ENTRY_TYPES.has(type) &&
        // Bottle feedings are point-in-time (started_at == ended_at); render
        // them as a single Time field, same as the log form.
        !(type === "feeding" && data.method === "bottle");
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const f = new FormData(form);
        const fields: Record<string, unknown> = {};
        const startIso = _localInputToIso(String(f.get("started") ?? ""));
        if (startIso) fields.timestamp = startIso;
        if (isSession) {
            const endIso = _localInputToIso(String(f.get("ended") ?? ""));
            // Empty end → leave the session open (set to null).
            fields.ended_at = endIso ?? null;
        } else if (type === "feeding" && data.method === "bottle") {
            // Single-time bottle: mirror started_at into ended_at so the
            // entry stays "closed" and doesn't reappear in OpenSessionBinary.
            if (startIso) fields.ended_at = startIso;
        }
        const notes = String(f.get("notes") ?? "");
        fields.notes = notes || null;
        const dataPatch: Record<string, unknown> = {};
        if (type === "diaper") {
            dataPatch.kind = String(f.get("kind") ?? data.kind ?? "wet");
        } else if (type === "feeding" && data.method === "bottle") {
            const amtStr = String(f.get("amount") ?? "");
            const amount = amtStr === "" ? null : Number(amtStr);
            dataPatch.amount = amount;
            dataPatch.unit = String(f.get("unit") ?? data.unit ?? "oz");
        } else if (type === "other" || type === "medication") {
            const name = String(f.get("name") ?? "");
            if (name) dataPatch.name = name;
        }
        if (Object.keys(dataPatch).length) fields.data = dataPatch;
        submit("edit_entry", { entry_id: entry.id, fields });
    };
    const onDelete = () => {
        if (requestDelete) {
            requestDelete({
                id: entry.id,
                type: entry.type,
                source: entry.source,
                staff: entry.staff
            });
        }
        close();
    };
    const heading = _editHeading(entry);
    return html`
        <form @submit=${onSubmit}>
            <h2>${heading}</h2>
            ${isSession
                ? html`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${_isoToLocalInput(entry.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${_isoToLocalInput(entry.ended_at)}
                      />
                  `
                : html`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${_isoToLocalInput(entry.timestamp)}
                          required
                      />
                  `}
            ${type === "diaper"
                ? html`
                      <label for="kind">Kind</label>
                      <select id="kind" name="kind">
                          <option value="wet" ?selected=${data.kind === "wet"}>
                              Wet
                          </option>
                          <option
                              value="dirty"
                              ?selected=${data.kind === "dirty"}
                          >
                              Dirty
                          </option>
                          <option value="both" ?selected=${data.kind === "both"}>
                              Both
                          </option>
                      </select>
                  `
                : ""}
            ${type === "feeding" && data.method === "bottle"
                ? html`
                      <label for="amount">Amount</label>
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          .value=${data.amount != null ? String(data.amount) : ""}
                      />
                      <label for="unit">Unit</label>
                      <select id="unit" name="unit">
                          <option value="oz" ?selected=${data.unit === "oz"}>
                              oz
                          </option>
                          <option value="ml" ?selected=${data.unit === "ml"}>
                              ml
                          </option>
                      </select>
                  `
                : ""}
            ${type === "other" || type === "medication"
                ? html`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(data.name ?? "")}
                      />
                  `
                : ""}
            <label for="notes">Notes</label>
            <input
                id="notes"
                name="notes"
                type="text"
                .value=${String(entry.notes ?? "")}
                placeholder="optional"
            />
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button
                    type="button"
                    class="danger"
                    aria-label="Delete entry"
                    @click=${onDelete}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}

function _editHeading(entry: any): string {
    const t = String(entry?.type ?? "entry");
    const d = entry?.data ?? {};
    const detail = d.name ?? d.method ?? d.kind;
    return detail ? `Edit ${t} (${detail})` : `Edit ${t}`;
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
