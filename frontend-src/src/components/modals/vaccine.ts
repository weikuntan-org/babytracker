import { html, type TemplateResult } from "lit";

import {
    dateInputToIso,
    dateRow,
    notesInputRow,
    photoRow,
    readPhotoPath,
    todayDateInput,
    type Close,
    type Submit
} from "./_helpers";

// US/UK common childhood + adolescent vaccines. Routine names match the
// shorthand pediatricians use on records, which matches what the CDC/NHS
// schedule files in `data/vaccines/` ship. "Other…" is the escape hatch
// for anything novel (travel, COVID variants, brand-specific lots) that
// the dropdown doesn't cover.
// Canonical labels: full name + abbreviation in parentheses where both
// forms are in common use. Pure-acronym vaccines (DTaP, MMR, Hib, etc.)
// stay as-is because nobody refers to "Diphtheria/Tetanus/acellular
// Pertussis" outside of textbooks.
const COMMON_VACCINES = [
    "COVID-19",
    "DTaP",
    "Hepatitis A (HepA)",
    "Hepatitis B (HepB)",
    "Hib",
    "HPV",
    "Influenza",
    "MenACWY",
    "MenB",
    "MMR",
    "Pneumococcal (PCV13)",
    "Pneumococcal (PCV15)",
    "Pneumococcal (PCV20)",
    "Polio (IPV)",
    "Rotavirus (RV)",
    "RSV",
    "Tdap",
    "Varicella (VAR)"
];

// Map of older/shorter/alternate vaccine names to their canonical labels
// above. Used to:
//   1. Dedupe the merged COMMON + scheduleNames list so we don't show
//      both "HepB" and "Hepatitis B" in the dropdown.
//   2. Map a stored entry's name back onto a dropdown entry when
//      pre-selecting `defaultName`, so an existing "HepA" log doesn't
//      fall through to the "Other…" branch.
// Keep keys as the raw strings users / the schedule have historically
// produced; values are the canonical label.
const VACCINE_ALIASES: Record<string, string> = {
    HepA: "Hepatitis A (HepA)",
    "Hepatitis A": "Hepatitis A (HepA)",
    HepB: "Hepatitis B (HepB)",
    "Hepatitis B": "Hepatitis B (HepB)",
    IPV: "Polio (IPV)",
    Polio: "Polio (IPV)",
    RV: "Rotavirus (RV)",
    RV1: "Rotavirus (RV)",
    RV5: "Rotavirus (RV)",
    Rotavirus: "Rotavirus (RV)",
    "Rotavirus (RV1)": "Rotavirus (RV)",
    "Rotavirus (RV5)": "Rotavirus (RV)",
    VAR: "Varicella (VAR)",
    Varicella: "Varicella (VAR)",
    PCV13: "Pneumococcal (PCV13)",
    PCV15: "Pneumococcal (PCV15)",
    PCV20: "Pneumococcal (PCV20)"
};

function _canonicalVaccine(name: string): string {
    return VACCINE_ALIASES[name] ?? name;
}

// Injection sites shown in the dropdown. Exported so the edit modal
// renders the same choice list as the create modal — keeping the two
// in sync without a deeper refactor.
export const VACCINE_SITES = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
] as const;

export function vaccineLogForm(
    hass: any,
    baby: string,
    defaultName: string,
    defaultDose: number | undefined,
    scheduleNames: string[],
    submit: Submit,
    close: Close
): TemplateResult {
    const sites = VACCINE_SITES;
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const f = new FormData(form);
        const choice = String(f.get("vaccine_select") ?? "").trim();
        const customName = String(f.get("vaccine_custom") ?? "").trim();
        const name = choice === "__other__" ? customName : choice;
        if (!name) return;
        const doseStr = String(f.get("dose_number") ?? "").trim();
        const dose_number = doseStr === "" ? undefined : Number(doseStr);
        const site = String(f.get("site") ?? "").trim() || undefined;
        const lot_number = String(f.get("lot_number") ?? "").trim() || undefined;
        const provider = String(f.get("provider") ?? "").trim() || undefined;
        submit("log_vaccine", {
            baby,
            name,
            dose_number,
            site,
            lot_number,
            provider,
            timestamp: dateInputToIso(String(f.get("when") ?? "")),
            notes: String(f.get("notes") ?? "") || undefined,
            photo_path: readPhotoPath(form)
        });
    };
    // Build the dropdown list: common vaccines + anything the configured
    // schedule references, run through the canonical-form normalizer so
    // "HepB" and "Hepatitis B" collapse into the same "Hepatitis B (HepB)"
    // entry, sorted.
    const dropdownNames = Array.from(
        new Set(
            [...COMMON_VACCINES, ...scheduleNames]
                .filter((n): n is string => Boolean(n) && n !== "none")
                .map(_canonicalVaccine)
        )
    ).sort((a, b) => a.localeCompare(b));
    // Resolve the initial selection: canonicalize the stored name first
    // so older entries logged as "HepA" (etc.) land on the canonical
    // dropdown entry rather than falling through to "Other…".
    const canonicalDefault =
        defaultName && defaultName !== "none"
            ? _canonicalVaccine(defaultName)
            : "";
    const defaultIsKnown =
        !!canonicalDefault && dropdownNames.includes(canonicalDefault);
    const defaultIsCustom = !!canonicalDefault && !defaultIsKnown;
    const initialSelect = defaultIsKnown
        ? canonicalDefault
        : defaultIsCustom
        ? "__other__"
        : "";
    const initialCustom = defaultIsCustom ? canonicalDefault : "";
    const onSelectChange = (e: Event) => {
        const select = e.currentTarget as HTMLSelectElement;
        const custom = select
            .closest("form")
            ?.querySelector("#vaccine_custom") as HTMLInputElement | null;
        if (!custom) return;
        if (select.value === "__other__") {
            custom.hidden = false;
            custom.required = true;
            custom.focus();
        } else {
            custom.hidden = true;
            custom.required = false;
            custom.value = "";
        }
    };
    return html`
        <form @submit=${onSubmit}>
            <h2>Log vaccine</h2>
            <label for="vaccine_select">Vaccine</label>
            <select
                id="vaccine_select"
                name="vaccine_select"
                required
                autofocus
                @change=${onSelectChange}
            >
                <option value="" disabled ?selected=${initialSelect === ""}>
                    (pick one)
                </option>
                ${dropdownNames.map(
                    (n) => html`<option
                        value=${n}
                        ?selected=${initialSelect === n}
                    >
                        ${n}
                    </option>`
                )}
                <option
                    value="__other__"
                    ?selected=${initialSelect === "__other__"}
                >
                    Other…
                </option>
            </select>
            <input
                id="vaccine_custom"
                name="vaccine_custom"
                type="text"
                placeholder="Vaccine name"
                .value=${initialCustom}
                ?hidden=${initialSelect !== "__other__"}
                ?required=${initialSelect === "__other__"}
            />
            <label for="dose_number"
                >Dose number <span class="muted">(auto if blank)</span></label
            >
            <input
                id="dose_number"
                name="dose_number"
                type="number"
                min="1"
                max="20"
                step="1"
                inputmode="numeric"
                .value=${defaultDose != null ? String(defaultDose) : ""}
            />
            <label for="site">Site</label>
            <select id="site" name="site">
                <option value="">(unspecified)</option>
                ${sites.map(
                    (s) => html`<option value=${s}>${s.replace("_", " ")}</option>`
                )}
            </select>
            <label for="lot_number">Lot number</label>
            <input
                id="lot_number"
                name="lot_number"
                type="text"
                placeholder="optional"
            />
            <label for="provider">Provider</label>
            <input
                id="provider"
                name="provider"
                type="text"
                placeholder="optional"
            />
            <label for="when">Date</label>
            ${dateRow({
                id: "when",
                value: todayDateInput(),
                required: true
            })}
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
