"""Cross-module helpers for reaching the live runtime.

The integration is `single_config_entry: true`, so at most one entry's
runtime ever lives in `hass.data[DOMAIN]`. The helpers here centralize
the "look up the runtime / coordinator / options" pattern that
otherwise gets copy-pasted across services, intents, the WS layer, and
the importers.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DEFAULT_OPTIONS, DOMAIN


def now_iso() -> str:
    """Return an ISO-8601 UTC timestamp for `Entry.timestamp`/`ended_at`."""
    return datetime.now(tz=timezone.utc).isoformat()


def get_runtime(hass: HomeAssistant) -> dict[str, Any] | None:
    """Return the active entry's runtime dict, or None if not set up."""
    runtimes = hass.data.get(DOMAIN, {})
    if not runtimes:
        return None
    return next(iter(runtimes.values()), None)


def get_coordinator(hass: HomeAssistant):
    """Return the coordinator from the active runtime, or None."""
    runtime = get_runtime(hass)
    return runtime["coordinator"] if runtime else None


def get_entry_options(hass: HomeAssistant) -> dict[str, Any]:
    """Return the active entry's options merged over `DEFAULT_OPTIONS`.

    Callers that already hold a `ConfigEntry` should merge defaults
    themselves; this helper is for code paths (services, WS commands)
    that don't otherwise have the entry in hand.
    """
    for entry_id in hass.data.get(DOMAIN, {}):
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None:
            return {**DEFAULT_OPTIONS, **(entry.options or {})}
    return dict(DEFAULT_OPTIONS)
