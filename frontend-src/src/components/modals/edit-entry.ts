import { html, type TemplateResult } from "lit";

import {
    SESSION_ENTRY_TYPES,
    bottleAmountRow,
    dateInputToIso,
    dateRow,
    dateTimeRow,
    growthMeasurementsRow,
    isoToDateInput,
    isoToLocalInput,
    localInputToIso,
    notesInputRow,
    photoRow,
    readPhotoPath,
    type Close,
    type RequestDelete,
    type Submit
} from "./_helpers";

export function editEntryForm(
    hass: any,
    entry: any,
    submit: Submit,
    close: Close,
    requestDelete?: RequestDelete
): TemplateResult {
    const type = String(entry?.type ?? "");
    const data = entry?.data ?? {};
    const isPointInTimeFeeding =
        type === "feeding" &&
        (data.method === "bottle" || data.method === "solids");
    // Vaccines + growth measurements are calendar-day-only — drop the
    // time picker on the edit form too (matches the log forms).
    const isDateOnly = type === "vaccine" || type === "growth";
    const isSession =
        SESSION_ENTRY_TYPES.has(type) && !isPointInTimeFeeding;
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const f = new FormData(form);
        const fields: Record<string, unknown> = {};
        const startIso = isDateOnly
            ? dateInputToIso(String(f.get("started") ?? ""))
            : localInputToIso(String(f.get("started") ?? ""));
        if (startIso) fields.timestamp = startIso;
        if (isSession) {
            const endIso = localInputToIso(String(f.get("ended") ?? ""));
            // Empty end → leave the session open (set to null).
            fields.ended_at = endIso ?? null;
        } else if (isPointInTimeFeeding) {
            // Bottle/solids: mirror started_at into ended_at so the entry
            // stays "closed" and doesn't reappear in OpenSessionBinary.
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
        } else if (type === "growth") {
            const num = (key: string): number | null | undefined => {
                const raw = f.get(key);
                if (raw === null) return undefined;
                const v = String(raw).trim();
                if (v === "") return null;
                const n = Number(v);
                return Number.isFinite(n) ? n : undefined;
            };
            const weight = num("weight");
            const height = num("height");
            const head = num("head");
            if (weight !== undefined) dataPatch.weight = weight;
            if (height !== undefined) dataPatch.height = height;
            if (head !== undefined) dataPatch.head_circumference = head;
            dataPatch.weight_unit = String(
                f.get("weight_unit") ?? data.weight_unit ?? "kg"
            );
            dataPatch.length_unit = String(
                f.get("length_unit") ?? data.length_unit ?? "cm"
            );
        }
        if (Object.keys(dataPatch).length) fields.data = dataPatch;
        // Photo path: the bt-photo-button reports "" when the user
        // removes an attached photo, so pass null in that case to clear
        // the field server-side.
        const photo = readPhotoPath(form);
        fields.photo_path = photo ?? null;
        submit("edit_entry", { entry_id: entry.id, fields });
    };
    const onDelete = () => {
        if (!requestDelete) {
            close();
            return;
        }
        const isImported = !!entry.source && entry.source !== "user";
        // For user-authored entries `requestDelete` fires `delete_entry`
        // immediately and doesn't touch the modal state — close it here so
        // the form doesn't linger over a now-deleted entry.
        // For imported entries `requestDelete` replaces `_modal` with the
        // "confirm delete imported" dialog; closing here would clobber
        // that swap (both updates land in the same microtask), so leave
        // the modal stack to the host.
        if (!isImported) close();
        requestDelete({
            id: entry.id,
            type: entry.type,
            source: entry.source,
            staff: entry.staff
        });
    };
    const heading = _editHeading(entry);
    return html`
        <form @submit=${onSubmit}>
            <h2>${heading}</h2>
            ${isSession
                ? html`
                      <label for="started">Started</label>
                      ${dateTimeRow({
                          id: "started",
                          value: isoToLocalInput(entry.timestamp),
                          required: true
                      })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${dateTimeRow({
                          id: "ended",
                          value: isoToLocalInput(entry.ended_at)
                      })}
                  `
                : isDateOnly
                ? html`
                      <label for="started">Date</label>
                      ${dateRow({
                          id: "started",
                          value: isoToDateInput(entry.timestamp),
                          required: true
                      })}
                  `
                : html`
                      <label for="started">Time</label>
                      ${dateTimeRow({
                          id: "started",
                          value: isoToLocalInput(entry.timestamp),
                          required: true
                      })}
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
                ? bottleAmountRow({
                      initialAmount:
                          typeof data.amount === "number" ? data.amount : undefined,
                      initialUnit: data.unit ?? "oz"
                  })
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
            ${type === "growth"
                ? growthMeasurementsRow({
                      initialWeight:
                          typeof data.weight === "number" ? data.weight : undefined,
                      initialHeight:
                          typeof data.height === "number" ? data.height : undefined,
                      initialHead:
                          typeof data.head_circumference === "number"
                              ? data.head_circumference
                              : undefined,
                      initialWeightUnit: data.weight_unit ?? "kg",
                      initialLengthUnit: data.length_unit ?? "cm"
                  })
                : ""}
            <label for="notes">Notes</label>
            ${notesInputRow(hass, {
                value: String(entry.notes ?? "")
            })}
            ${photoRow(hass, entry.photo_path ?? "")}
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
