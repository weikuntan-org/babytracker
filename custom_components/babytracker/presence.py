"""Sign-event detection — the single source of truth for `at_daycare`.

`Entry.type == "other"` with `data["name"]` matching one of the regexes
below represents a Procare-imported (or manually-entered) check-in/out
event. The coordinator's `at_daycare(baby)` walks the baby's entries
newest-first and returns the kind of the most recent sign event:

    - sign-in   → at_daycare = True
    - sign-out  → at_daycare = False
    - no sign event ever → at_daycare = False

This module exists so the regexes have one home that both the Procare
importer (write side) and the coordinator (read side) can share — and
so unit tests can exercise the matching without booting either.
"""
from __future__ import annotations

import re
from typing import Any

# These match the Procare title shapes ("Signed In by Teacher",
# "Sign Out", …) AND the synthetic titles the manual presence-override
# service writes ("Signed In (manual)", "Signed Out (manual)"). The
# `(?: by .+)?` / `(?:\\s+\\(.+\\))?` tails are intentionally lax so
# future Procare wording tweaks keep working.
SIGN_IN_RE = re.compile(
    r"^Sign(?:ed)? In(?:\s+by .+|\s+\(.+\))?$", re.IGNORECASE
)
SIGN_OUT_RE = re.compile(
    r"^Sign(?:ed)? Out(?:\s+by .+|\s+\(.+\))?$", re.IGNORECASE
)


def sign_kind(name: str | None) -> str | None:
    """Return `"in"` / `"out"` / `None` for an `Entry.data["name"]`."""
    if not name:
        return None
    if SIGN_IN_RE.match(name):
        return "in"
    if SIGN_OUT_RE.match(name):
        return "out"
    return None


def entry_sign_kind(entry: Any) -> str | None:
    """Return the sign kind for an `Entry`, or `None` if it isn't a
    sign-in/out event. Cheap and side-effect free so it's safe to call
    inside hot read paths."""
    if getattr(entry, "type", None) != "other":
        return None
    data = getattr(entry, "data", None) or {}
    return sign_kind(data.get("name"))
