"""Procare title → entry-type mapping loader (§15 #16)."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


def _data_path() -> Path:
    return Path(__file__).parent.parent / "data" / "procare" / "default_mappings.json"


def load_mappings(overrides: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    path = _data_path()
    if path.exists():
        defaults = json.loads(path.read_text("utf-8"))
    else:
        defaults = []
    if overrides:
        return list(overrides.get("mappings", [])) + list(defaults)
    return list(defaults)


def match_title(mappings: list[dict[str, Any]], title: str) -> dict[str, Any] | None:
    for mapping in mappings:
        pattern = mapping.get("pattern")
        if not pattern:
            continue
        if re.search(pattern, title, re.IGNORECASE):
            return mapping
    return None
