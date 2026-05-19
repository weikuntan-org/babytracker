"""Importer subsystem (§4.6)."""
from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from ..const import DOMAIN
from .procare import ProcareImporter
from .procare_mappings import async_load_mappings


def _runtime(hass: HomeAssistant, entry_id: str):
    return hass.data.get(DOMAIN, {}).get(entry_id)


async def async_setup_importers(
    hass: HomeAssistant, entry: ConfigEntry, coordinator
) -> None:
    importers: list[ProcareImporter] = []
    mappings: list | None = None
    for baby in coordinator.babies:
        if baby.archived:
            continue
        cfg = baby.importer
        if not cfg or not cfg.get("source_entity_id"):
            continue
        if mappings is None:
            mappings = await async_load_mappings(hass)
        importer = ProcareImporter(hass, coordinator, baby, cfg, mappings=mappings)
        await importer.async_setup()
        importers.append(importer)

    runtime = hass.data.setdefault(DOMAIN, {}).setdefault(entry.entry_id, {})
    runtime["importers"] = importers


async def async_unload_importers(hass: HomeAssistant, entry: ConfigEntry) -> None:
    runtime = hass.data.get(DOMAIN, {}).get(entry.entry_id) or {}
    for importer in runtime.get("importers", []):
        await importer.async_unload()
    runtime["importers"] = []
