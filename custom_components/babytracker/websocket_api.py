"""WebSocket commands for the bundled card (§15 #24)."""
from __future__ import annotations

import base64
import binascii
import json
import logging
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import DEFAULT_OPTIONS, DOMAIN, SIGNAL_DATA_UPDATED
from .photo_storage import PHOTO_MAX_BYTES, PHOTO_MIME_TO_EXT, write_photo

_LOGGER = logging.getLogger(__name__)

# Vaccine schedule JSON cache. Keyed by schedule_id (e.g. "us_cdc").
# Populated via `async_preload_schedule` during entry setup so the sensor
# platform — which reads schedules synchronously from `native_value` — never
# triggers blocking file I/O inside the event loop. Missing files are cached
# as `None` so we don't repeatedly stat them.
_SCHEDULE_CACHE: dict[str, dict[str, Any] | None] = {}


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


def _read_schedule_sync(schedule_id: str) -> dict[str, Any] | None:
    path = (
        Path(__file__).parent
        / "data"
        / "vaccines"
        / f"{schedule_id}.json"
    )
    if not path.exists():
        return None
    return json.loads(path.read_text("utf-8"))


def _load_schedule(schedule_id: str) -> dict[str, Any] | None:
    """Return cached schedule. Synchronous, safe to call from the event loop.

    If the schedule hasn't been pre-loaded via `async_preload_schedule`, this
    returns None — callers fall back to an empty dose list, which is the
    same behavior they had pre-cache when the file was simply missing. The
    pre-load happens unconditionally during entry setup, so a cache miss
    here should only occur for unknown schedule IDs.
    """
    if schedule_id in _SCHEDULE_CACHE:
        return _SCHEDULE_CACHE[schedule_id]
    return None


async def async_preload_schedule(
    hass: HomeAssistant, schedule_id: str
) -> dict[str, Any] | None:
    if schedule_id in _SCHEDULE_CACHE:
        return _SCHEDULE_CACHE[schedule_id]
    payload = await hass.async_add_executor_job(_read_schedule_sync, schedule_id)
    _SCHEDULE_CACHE[schedule_id] = payload
    if payload is None:
        _LOGGER.warning("babytracker: vaccine schedule %r not found", schedule_id)
    return payload


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
@websocket_api.async_response
async def _ws_get_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    schedule_id = _entry_options(hass).get("vaccine_schedule", "us_cdc")
    payload = _load_schedule(schedule_id)
    if payload is None:
        payload = await async_preload_schedule(hass, schedule_id)
    if payload is None:
        connection.send_error(msg["id"], "missing_schedule", schedule_id)
        return
    connection.send_result(msg["id"], payload)


def _entries_in_range_payload(
    coord, slug: str, start_iso: str, end_iso: str
) -> list[dict[str, Any]] | None:
    """Return entries for a baby whose `timestamp` falls in [start, end].

    Returns None if the baby slug is unknown. Sorted newest-first. The
    `data` dict is shallow-copied so the WS payload doesn't accidentally
    expose coordinator-internal mutation aliases.
    """
    baby = coord.baby_by_slug(slug)
    if baby is None:
        return None
    out: list[dict[str, Any]] = []
    for e in coord.entries_by_baby(baby.id):
        if e.timestamp < start_iso or e.timestamp > end_iso:
            continue
        out.append(
            {
                "id": e.id,
                "type": e.type,
                "timestamp": e.timestamp,
                "ended_at": e.ended_at,
                "source": e.source,
                "readonly": e.readonly,
                "data": dict(e.data),
                "photo_path": e.photo_path,
                "photo_url": e.photo_url,
                "staff": e.staff,
                "notes": e.notes,
            }
        )
    out.sort(key=lambda r: r["timestamp"], reverse=True)
    return out


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/list_entries_in_range",
        vol.Required("baby"): str,
        vol.Required("start"): str,  # ISO-8601 inclusive
        vol.Required("end"): str,    # ISO-8601 inclusive
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_list_entries_in_range(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    coord = _coordinator(hass)
    if coord is None:
        connection.send_error(msg["id"], "not_configured", "babytracker not configured")
        return
    payload = _entries_in_range_payload(coord, msg["baby"], msg["start"], msg["end"])
    if payload is None:
        connection.send_error(msg["id"], "unknown_baby", msg["baby"])
        return
    connection.send_result(msg["id"], payload)
    if msg.get("subscribe"):
        @callback
        def _push() -> None:
            # Coordinator may have changed; re-resolve payload each time.
            updated = _entries_in_range_payload(
                coord, msg["baby"], msg["start"], msg["end"]
            )
            if updated is None:
                return
            connection.send_message(
                websocket_api.event_message(msg["id"], updated)
            )

        connection.subscriptions[msg["id"]] = async_dispatcher_connect(
            hass, SIGNAL_DATA_UPDATED, _push
        )
        _push()


def _vaccine_history_payload(coord, slug: str) -> list[dict[str, Any]] | None:
    """Return all vaccine entries for a baby, newest-first.

    Returns None if the baby slug is unknown so the caller can route the
    `unknown_baby` error consistently with the other commands.
    """
    baby = coord.baby_by_slug(slug)
    if baby is None:
        return None
    out: list[dict[str, Any]] = []
    for e in coord.entries_by_baby(baby.id):
        if e.type != "vaccine":
            continue
        out.append(
            {
                "id": e.id,
                "timestamp": e.timestamp,
                "source": e.source,
                "readonly": e.readonly,
                "data": dict(e.data),
                "notes": e.notes,
                "staff": e.staff,
            }
        )
    out.sort(key=lambda r: r["timestamp"], reverse=True)
    return out


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/list_vaccines",
        vol.Required("baby"): str,
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_list_vaccines(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    coord = _coordinator(hass)
    if coord is None:
        connection.send_error(msg["id"], "not_configured", "babytracker not configured")
        return
    payload = _vaccine_history_payload(coord, msg["baby"])
    if payload is None:
        connection.send_error(msg["id"], "unknown_baby", msg["baby"])
        return
    connection.send_result(msg["id"], payload)
    if msg.get("subscribe"):
        @callback
        def _push() -> None:
            updated = _vaccine_history_payload(coord, msg["baby"])
            if updated is None:
                return
            connection.send_message(
                websocket_api.event_message(msg["id"], updated)
            )

        connection.subscriptions[msg["id"]] = async_dispatcher_connect(
            hass, SIGNAL_DATA_UPDATED, _push
        )
        _push()


def _growth_history_payload(coord, slug: str) -> list[dict[str, Any]] | None:
    """Return all growth entries for a baby, newest-first.

    Returns None if the baby slug is unknown so the caller can route the
    `unknown_baby` error consistently with the other commands.
    """
    baby = coord.baby_by_slug(slug)
    if baby is None:
        return None
    out: list[dict[str, Any]] = []
    for e in coord.entries_by_baby(baby.id):
        if e.type != "growth":
            continue
        out.append(
            {
                "id": e.id,
                "type": e.type,
                "timestamp": e.timestamp,
                "source": e.source,
                "readonly": e.readonly,
                "data": dict(e.data),
                "notes": e.notes,
                "staff": e.staff,
            }
        )
    out.sort(key=lambda r: r["timestamp"], reverse=True)
    return out


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/list_growth",
        vol.Required("baby"): str,
        vol.Optional("subscribe"): bool,
    }
)
@callback
def _ws_list_growth(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    coord = _coordinator(hass)
    if coord is None:
        connection.send_error(msg["id"], "not_configured", "babytracker not configured")
        return
    payload = _growth_history_payload(coord, msg["baby"])
    if payload is None:
        connection.send_error(msg["id"], "unknown_baby", msg["baby"])
        return
    connection.send_result(msg["id"], payload)
    if msg.get("subscribe"):
        @callback
        def _push() -> None:
            updated = _growth_history_payload(coord, msg["baby"])
            if updated is None:
                return
            connection.send_message(
                websocket_api.event_message(msg["id"], updated)
            )

        connection.subscriptions[msg["id"]] = async_dispatcher_connect(
            hass, SIGNAL_DATA_UPDATED, _push
        )
        _push()


@websocket_api.websocket_command(
    {
        vol.Required("type"): "babytracker/upload_photo",
        vol.Required("data"): str,
        vol.Required("mime"): str,
    }
)
@websocket_api.async_response
async def _ws_upload_photo(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    mime = msg["mime"].lower().strip()
    if mime not in PHOTO_MIME_TO_EXT:
        connection.send_error(
            msg["id"], "unsupported_mime", f"unsupported photo mime: {mime!r}"
        )
        return
    try:
        payload = base64.b64decode(msg["data"], validate=True)
    except (binascii.Error, ValueError):
        connection.send_error(msg["id"], "invalid_base64", "data is not valid base64")
        return
    if len(payload) == 0:
        connection.send_error(msg["id"], "empty_photo", "photo payload is empty")
        return
    if len(payload) > PHOTO_MAX_BYTES:
        connection.send_error(
            msg["id"],
            "too_large",
            f"photo exceeds {PHOTO_MAX_BYTES} bytes",
        )
        return
    photo_path = await write_photo(hass, payload, mime)
    if photo_path is None:
        connection.send_error(msg["id"], "write_failed", "photo write failed")
        return
    connection.send_result(msg["id"], {"photo_path": photo_path})


_REGISTERED = False


async def async_register(hass: HomeAssistant, entry: ConfigEntry) -> None:
    global _REGISTERED  # noqa: PLW0603
    if _REGISTERED:
        return
    websocket_api.async_register_command(hass, _ws_list_babies)
    websocket_api.async_register_command(hass, _ws_get_baby_config)
    websocket_api.async_register_command(hass, _ws_get_options)
    websocket_api.async_register_command(hass, _ws_get_schedule)
    websocket_api.async_register_command(hass, _ws_list_entries_in_range)
    websocket_api.async_register_command(hass, _ws_list_vaccines)
    websocket_api.async_register_command(hass, _ws_list_growth)
    websocket_api.async_register_command(hass, _ws_upload_photo)
    _REGISTERED = True


async def async_unregister(hass: HomeAssistant) -> None:
    # HA does not expose an "unregister command" — they live for the
    # lifetime of the process and are idempotent on reload. The
    # registration flag guards against double-register.
    return None
