// Helpers for cards that host a modal dialog (summary + history). The
// per-baby main card uses a slightly richer service-call wrapper for
// quick-log button feedback, so it keeps its own delete branch — but
// the underlying decision tree ("user-authored → delete now; imported
// → prompt") is identical and lives here so the two satellite cards
// stop drifting.
import type { ModalKind } from "../modal";

export interface DeleteEntryInput {
    id: string;
    type?: string;
    source?: string;
    staff?: string | null;
}

/**
 * Decide what to do with a delete request for `entry`. For user-authored
 * entries the caller's `deleteNow` callback fires `delete_entry`; for
 * imported entries we return the modal payload the host should swap
 * into its `_modal` state so the "delete this imported entry?" prompt
 * appears. Returns null when the delete was handled synchronously.
 */
export function requestDeleteOrPromptImported(
    entry: DeleteEntryInput,
    deleteNow: (entryId: string) => void
): ModalKind | null {
    if (!entry.source || entry.source === "user") {
        deleteNow(entry.id);
        return null;
    }
    return {
        kind: "confirm_delete_imported",
        entryId: entry.id,
        entryType: entry.type ?? "entry",
        source: entry.source,
        staff: entry.staff ?? null
    };
}

/**
 * Open or close the host's `<dialog>` element in response to a `_modal`
 * state change. Call from `updated()` when `_modal` is in the changed
 * map.
 */
export function syncDialogToModal(
    renderRoot: ParentNode,
    modal: unknown
): void {
    const dlg = renderRoot.querySelector("dialog") as HTMLDialogElement | null;
    if (!dlg) return;
    if (modal && !dlg.open) dlg.showModal();
    if (!modal && dlg.open) dlg.close();
}
