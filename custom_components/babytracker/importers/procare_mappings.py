"""Procare title → entry-type mapping loader (§15 #16)."""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant


def _data_path() -> Path:
    return Path(__file__).parent.parent / "data" / "procare" / "default_mappings.json"


def _read_defaults() -> list[dict[str, Any]]:
    path = _data_path()
    if not path.exists():
        return []
    return json.loads(path.read_text("utf-8"))


def load_mappings(overrides: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    """Synchronous mapping loader — kept for tests/CLI use.

    Performs blocking file I/O; do NOT call from the event loop. Production
    code should use `async_load_mappings` which dispatches to the executor.
    """
    defaults = _read_defaults()
    if overrides:
        return list(overrides.get("mappings", [])) + list(defaults)
    return list(defaults)


async def async_load_mappings(
    hass: HomeAssistant, overrides: dict[str, Any] | None = None
) -> list[dict[str, Any]]:
    defaults = await hass.async_add_executor_job(_read_defaults)
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
