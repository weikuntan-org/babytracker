"""Canonical vaccine-name aliasing.

The frontend dropdown (`COMMON_VACCINES` in `frontend-src/src/components/modal.ts`)
labels common vaccines as "Full name (abbreviation)" — "Hepatitis B (HepB)",
"Rotavirus (RV)", "Polio (IPV)", etc. The vendored schedule files in
`data/vaccines/` use a mix of formats inherited from the source organisations
("Hepatitis B", "Rotavirus (RV1)", "Polio (IPV)", "Varicella"…) and legacy
entries (logged before the dropdown switch) use the short forms ("HepB",
"Rotavirus", "VAR"…).

`VACCINE_ALIASES` collapses every spelling into the canonical "Full (abbr)"
label so dose-number counting, dose-due detection, and the dropdown render
all agree on which entries cover which schedule slot.

This Python table mirrors `VACCINE_ALIASES` in `frontend-src/src/components/modal.ts`;
keep both in sync if you add a new vaccine.
"""
from __future__ import annotations

VACCINE_ALIASES: dict[str, str] = {
    "HepA": "Hepatitis A (HepA)",
    "Hepatitis A": "Hepatitis A (HepA)",
    "HepB": "Hepatitis B (HepB)",
    "Hepatitis B": "Hepatitis B (HepB)",
    "IPV": "Polio (IPV)",
    "Polio": "Polio (IPV)",
    "RV": "Rotavirus (RV)",
    "RV1": "Rotavirus (RV)",
    "RV5": "Rotavirus (RV)",
    "Rotavirus": "Rotavirus (RV)",
    "Rotavirus (RV1)": "Rotavirus (RV)",
    "Rotavirus (RV5)": "Rotavirus (RV)",
    "VAR": "Varicella (VAR)",
    "Varicella": "Varicella (VAR)",
    "PCV13": "Pneumococcal (PCV13)",
    "PCV15": "Pneumococcal (PCV15)",
    "PCV20": "Pneumococcal (PCV20)",
}


def canonical_vaccine(name: str | None) -> str | None:
    """Return the canonical "Full (abbr)" label for a vaccine name, or the
    input unchanged when no alias is defined. None passes through so the
    callers can use this against `entry.data.get("name")` without a guard.
    """
    if name is None:
        return None
    return VACCINE_ALIASES.get(name, name)
