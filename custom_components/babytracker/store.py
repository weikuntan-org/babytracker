"""Storage wrapper for babytracker (§5, §8.3)."""
from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_MINOR_VERSION, STORAGE_VERSION


def _default_data() -> dict[str, Any]:
    return {
        "version": STORAGE_VERSION,
        "babies": [],
        "entries": [],
    }


class BabytrackerStore:
    """Single JSON Store rewritten in full on each change (§5, §12 #24)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            minor_version=STORAGE_MINOR_VERSION,
            atomic_writes=True,
        )
        self._data: dict[str, Any] = _default_data()

    async def async_load(self) -> dict[str, Any]:
        loaded = await self._store.async_load()
        if loaded is None:
            self._data = _default_data()
        else:
            # Defensive: fill in any missing keys
            self._data = {
                "version": loaded.get("version", STORAGE_VERSION),
                "babies": list(loaded.get("babies") or []),
                "entries": list(loaded.get("entries") or []),
            }
        return self._data

    @property
    def data(self) -> dict[str, Any]:
        return self._data

    async def async_save(self) -> None:
        await self._store.async_save(self._data)

    def set_data(self, data: dict[str, Any]) -> None:
        self._data = data


async def _async_migrate(
    old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
) -> dict[str, Any]:
    """Migration stub (§8.3). v1.minor=1 is current; nothing to do yet."""
    return old_data
