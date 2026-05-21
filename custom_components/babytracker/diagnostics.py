"""Diagnostics (§12 #33)."""
from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN

REDACTED_FIELDS = {"notes", "photo_path", "photo_url", "provider", "staff", "avatar_url"}


def _redact_entry(entry: dict[str, Any]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for key, value in entry.items():
        if key in REDACTED_FIELDS:
            out[key] = None if value is None else "**REDACTED**"
        elif key == "data" and isinstance(value, dict):
            out[key] = {
                k: ("**REDACTED**" if k in REDACTED_FIELDS else v)
                for k, v in value.items()
            }
        else:
            out[key] = value
    return out


def _redact_baby(baby: dict[str, Any]) -> dict[str, Any]:
    return {k: ("**REDACTED**" if k in REDACTED_FIELDS else v) for k, v in baby.items()}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id)
    if not runtime:
        return {"error": "integration not loaded"}
    coordinator = runtime["coordinator"]
    return {
        "options": {k: v for k, v in (entry.options or {}).items() if k != "pending_baby"},
        "babies": [_redact_baby(b.to_dict()) for b in coordinator.babies],
        "entries": [_redact_entry(e.to_dict()) for e in coordinator.entries[-200:]],
        "at_daycare": {
            b.slug: coordinator.at_daycare(b) for b in coordinator.babies
        },
        "unmapped_procare_titles_count": len(
            coordinator.get_unmapped_procare_titles()
        ),
    }
