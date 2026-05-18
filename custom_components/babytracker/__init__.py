"""babytracker — Home Assistant custom integration entry point."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from .const import CARD_FILENAME, DEFAULT_OPTIONS, DOMAIN, FRONTEND_URL
from .coordinator import BabytrackerCoordinator
from .store import BabytrackerStore

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

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

    # Frontend static path + extra_js_url (§9.5).
    # Cache-bust suffix is the bundle's mtime so every rebuild forces browsers
    # off the stale copy without us having to remember to bump VERSION.
    frontend_dir = Path(__file__).parent / "frontend"
    bundle_path = frontend_dir / CARD_FILENAME
    if bundle_path.exists():
        try:
            await hass.http.async_register_static_paths(
                [
                    StaticPathConfig(
                        FRONTEND_URL, str(frontend_dir), cache_headers=False
                    )
                ]
            )
            cache_bust = int(bundle_path.stat().st_mtime)
            bundle_url = f"{FRONTEND_URL}/{CARD_FILENAME}?v={cache_bust}"
            # Prefer the Storage-mode Lovelace Resource (auto-managed, cache-
            # bust-aware). Only fall back to add_extra_js_url for YAML-mode
            # dashboards — using BOTH causes Storage installs to load the
            # bundle twice and double-register the custom elements.
            registered = await _ensure_lovelace_resource(hass, bundle_url)
            if not registered:
                add_extra_js_url(hass, bundle_url)
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


async def _ensure_lovelace_resource(hass: HomeAssistant, bundle_url: str) -> bool:
    """Create or update the Lovelace Resource pointing at our bundle.

    Returns True if the Storage-mode Resource is in place (created, updated,
    or already current). Returns False if the user is on YAML-mode Lovelace
    or the Lovelace API is unavailable — in which case the caller should
    fall back to `add_extra_js_url`.

    Always returning True for the Storage-mode path matters: we then SKIP
    `add_extra_js_url` to avoid loading the same bundle twice, which would
    double-register the custom elements and throw at the second `define`.
    """
    base = f"{FRONTEND_URL}/{CARD_FILENAME}"
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        return False
    # HA exposes resources via `lovelace.resources` on the LovelaceData dataclass
    # (2024+); fall back to dict access for older versions.
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")
    if resources is None:
        return False
    # Storage-mode collections have async_create_item / async_update_item;
    # YAML-mode (ResourceYAMLCollection) does not.
    if not hasattr(resources, "async_create_item") or not hasattr(
        resources, "async_update_item"
    ):
        return False
    try:
        if hasattr(resources, "async_load"):
            await resources.async_load()
        items = list(resources.async_items())
    except Exception:  # noqa: BLE001
        _LOGGER.debug("Lovelace resources unavailable; skipping auto-register")
        return False

    existing = next(
        (item for item in items if str(item.get("url", "")).split("?", 1)[0] == base),
        None,
    )
    payload = {"url": bundle_url, "res_type": "module"}
    try:
        if existing is None:
            await resources.async_create_item(payload)
            _LOGGER.info("babytracker: registered Lovelace resource %s", bundle_url)
        elif existing.get("url") != bundle_url:
            await resources.async_update_item(existing["id"], payload)
            _LOGGER.info("babytracker: updated Lovelace resource to %s", bundle_url)
        return True
    except Exception:  # noqa: BLE001
        _LOGGER.exception("babytracker: failed to manage Lovelace resource")
        return False
