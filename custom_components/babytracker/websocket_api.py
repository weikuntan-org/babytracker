"""WebSocket commands for the bundled card (§15 #24)."""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import DEFAULT_OPTIONS, DOMAIN, SIGNAL_DATA_UPDATED


def _runtime(hass: HomeAssistant):
    runtimes = hass.data.get(DOMAIN, {})
    if not runtimes:
        return None
    return next(iter(runtimes.values()), None)


def _coordinator(hass: HomeAssistant):
    runtime = _runtime(hass)
    return runtime["coordinator"] if runtime else None


def _entry_options(hass: HomeAssistant) -> dict[str, Any]:
    for entry_id in hass.data.get(DOMAIN, {}):
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None:
            return {**DEFAULT_OPTIONS, **(entry.options or {})}
    return dict(DEFAULT_OPTIONS)


def _list_babies_payload(coord) -> list[dict[str, Any]]:
    return [
        {
            "id": b.id,
            "slug": b.slug,
            "name": b.name,
            "sex": b.sex,
            "birthday": b.birthday,
            "archived": b.archived,
            "enabled_activities": list(b.enabled_activities),
            "enabled_feeding_methods": list(b.enabled_feeding_methods),
        }
        for b in coord.babies
    ]


def _get_baby_config_payload(coord, slug: str) -> dict[str, Any] | None:
    baby = coord.baby_by_slug(slug)
    if baby is None:
        return None
    return {
        "slug": baby.slug,
        "name": baby.name,
        "enabled_activities": list(baby.enabled_activities),
        "enabled_feeding_methods": list(baby.enabled_feeding_methods),
        "importer": baby.importer,
    }


def _load_schedule(schedule_id: str) -> dict[str, Any] | None:
    path = (
        Path(__file__).parent
        / "data"
        / "vaccines"
        / f"{schedule_id}.json"
    )
    if not path.exists():
        return None
    return json.loads(path.read_text("utf-8"))


# ---- Command handlers ----------------------------------------------------


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/list_babies",
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_list_babies(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    coord = _coordinator(hass)
    if coord is None:
        connection.send_error(msg["id"], "not_configured", "babytracker not configured")
        return
    connection.send_result(msg["id"], _list_babies_payload(coord))
    if msg.get("subscribe"):
        @callback
        def _push() -> None:
            connection.send_message(
                websocket_api.event_message(msg["id"], _list_babies_payload(coord))
            )

        connection.subscriptions[msg["id"]] = async_dispatcher_connect(
            hass, SIGNAL_DATA_UPDATED, _push
        )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/get_baby_config",
        vol.Required("baby"): str,
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_get_baby_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    coord = _coordinator(hass)
    if coord is None:
        connection.send_error(msg["id"], "not_configured", "babytracker not configured")
        return
    payload = _get_baby_config_payload(coord, msg["baby"])
    if payload is None:
        connection.send_error(msg["id"], "unknown_baby", msg["baby"])
        return
    connection.send_result(msg["id"], payload)
    if msg.get("subscribe"):
        @callback
        def _push() -> None:
            current = _get_baby_config_payload(coord, msg["baby"])
            if current is not None:
                connection.send_message(
                    websocket_api.event_message(msg["id"], current)
                )

        connection.subscriptions[msg["id"]] = async_dispatcher_connect(
            hass, SIGNAL_DATA_UPDATED, _push
        )
        _push()


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/get_integration_options",
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_get_options(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    def _payload() -> dict[str, Any]:
        payload = _entry_options(hass)
        payload.pop("pending_baby", None)
        return payload

    connection.send_result(msg["id"], _payload())
    if msg.get("subscribe"):
        @callback
        def _push() -> None:
            connection.send_message(
                websocket_api.event_message(msg["id"], _payload())
            )

        connection.subscriptions[msg["id"]] = async_dispatcher_connect(
            hass, SIGNAL_DATA_UPDATED, _push
        )
        _push()


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/get_vaccine_schedule",
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_get_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    schedule_id = _entry_options(hass).get("vaccine_schedule", "us_cdc")
    payload = _load_schedule(schedule_id)
    if payload is None:
        connection.send_error(msg["id"], "missing_schedule", schedule_id)
        return
    connection.send_result(msg["id"], payload)


_REGISTERED = False


async def async_register(hass: HomeAssistant, entry: ConfigEntry) -> None:
    global _REGISTERED  # noqa: PLW0603
    if _REGISTERED:
        return
    websocket_api.async_register_command(hass, _ws_list_babies)
    websocket_api.async_register_command(hass, _ws_get_baby_config)
    websocket_api.async_register_command(hass, _ws_get_options)
    websocket_api.async_register_command(hass, _ws_get_schedule)
    _REGISTERED = True


async def async_unregister(hass: HomeAssistant) -> None:
    # HA does not expose an "unregister command" — they live for the
    # lifetime of the process and are idempotent on reload. The
    # registration flag guards against double-register.
    return None
