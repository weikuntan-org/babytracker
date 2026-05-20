// Modal/lightbox dispatcher. Each entry-kind has its own form in
// `components/modals/`; this file is just the switch + the public
// `ModalKind` union the cards type their `_modal` state against.
import { html, nothing, type TemplateResult } from "lit";

import type { Call, Close, RequestDelete, Submit } from "./modals/_helpers";
import { bottleForm } from "./modals/bottle";
import { confirmDeleteImportedForm } from "./modals/confirm-delete-imported";
import { diaperForm } from "./modals/diaper";
import { editEntryForm } from "./modals/edit-entry";
import { endSleepFirstForm } from "./modals/end-sleep-first";
import { growthLogForm } from "./modals/growth";
import { otherForm } from "./modals/other";
import { sessionForm, type SessionActivity } from "./modals/session";
import { solidsForm } from "./modals/solids";
import { vaccineLogForm } from "./modals/vaccine";

export type { SessionActivity } from "./modals/session";

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
          /** Configured display name (preserves casing like "TJ"). */
          babyName?: string;
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
      }
    | {
          kind: "log_growth";
          baby: string;
      }
    | {
          kind: "log_vaccine";
          baby: string;
          /** Pre-fill name + dose from `sensor.<baby>_vaccines_due`. */
          defaultName?: string;
          defaultDose?: number;
          /** Names suggested by the configured vaccine schedule. */
          scheduleNames?: string[];
      };

export function modalTemplate(
    hass: any,
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
                body = diaperForm(hass, modal.baby, submit, close);
                break;
            case "bottle":
                body = bottleForm(
                    hass,
                    modal.baby,
                    options,
                    modal.lastAmount,
                    modal.lastUnit,
                    submit,
                    close
                );
                break;
            case "solids":
                body = solidsForm(hass, modal.baby, submit, close);
                break;
            case "other":
                body = otherForm(hass, modal.baby, submit, close);
                break;
            case "session":
                body = sessionForm(
                    hass,
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
                    modal.babyName,
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
                    hass,
                    modal.entry,
                    submit,
                    close,
                    requestDelete
                );
                break;
            case "log_growth":
                body = growthLogForm(hass, modal.baby, options, submit, close);
                break;
            case "log_vaccine":
                body = vaccineLogForm(
                    hass,
                    modal.baby,
                    modal.defaultName ?? "",
                    modal.defaultDose,
                    modal.scheduleNames ?? [],
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
