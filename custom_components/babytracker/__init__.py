"""babytracker — Home Assistant custom integration entry point."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import CARD_FILENAME, DEFAULT_OPTIONS, DOMAIN, FRONTEND_URL, VERSION
from .coordinator import BabytrackerCoordinator
from .store import BabytrackerStore

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.BINARY_SENSOR]


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = BabytrackerStore(hass)
    await store.async_load()
    coordinator = BabytrackerCoordinator(hass, store)
    await coordinator.async_load()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "store": store,
        "coordinator": coordinator,
    }

    # Materialise initial baby from config flow if present
    pending = (entry.options or {}).get("pending_baby")
    if pending and not coordinator.babies:
        await coordinator.add_baby(
            name=pending["name"],
            birthday=pending["birthday"],
            sex=pending["sex"],
            enabled_activities=pending.get("enabled_activities"),
            enabled_feeding_methods=pending.get("enabled_feeding_methods"),
            avatar_url=pending.get("avatar_url"),
        )
        new_options = {k: v for k, v in (entry.options or {}).items() if k != "pending_baby"}
        new_options = {**DEFAULT_OPTIONS, **new_options}
        hass.config_entries.async_update_entry(entry, options=new_options)

    # Register services (filled in by service modules in later milestones)
    from . import services as _services  # local import to avoid cycle at module load

    await _services.async_register_services(hass, entry)

    # Register WS commands (consumed by the card, §15 #24)
    from . import websocket_api as _ws

    await _ws.async_register(hass, entry)

    # Frontend static path + extra_js_url (§9.5)
    frontend_dir = Path(__file__).parent / "frontend"
    if (frontend_dir / CARD_FILENAME).exists():
        try:
            await hass.http.async_register_static_paths(
                [
                    StaticPathConfig(
                        FRONTEND_URL, str(frontend_dir), cache_headers=False
                    )
                ]
            )
            add_extra_js_url(hass, f"{FRONTEND_URL}/{CARD_FILENAME}?v={VERSION}")
        except Exception:  # noqa: BLE001
            _LOGGER.exception("Failed to register frontend resources")

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    # Set up importers once the platform is up (M8)
    from .importers import async_setup_importers

    await async_setup_importers(hass, entry, coordinator)

    # Register intent handlers (M9)
    from . import intents as _intents

    await _intents.async_register(hass, entry)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    from .importers import async_unload_importers

    await async_unload_importers(hass, entry)

    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        from . import services as _services

        await _services.async_unregister_services(hass)
        from . import websocket_api as _ws

        await _ws.async_unregister(hass)

        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
