"""Service registration. Grown by M2-M8 milestones."""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import (
    ALL_ACTIVITIES,
    ALL_DIAPER_KINDS,
    ALL_FEEDING_METHODS,
    ALL_LENGTH_UNITS,
    ALL_PUMPING_SIDES,
    ALL_VOLUME_UNITS,
    ALL_WEIGHT_UNITS,
    DOMAIN,
    ENTRY_SOURCE_PROCARE,
    ENTRY_SOURCE_USER,
    OPT_ENABLE_PUMPING,
    VACCINE_SITES,
)
from .eligibility import (
    ensure_activity_enabled,
    ensure_feeding_method_enabled,
    ensure_local_not_locked_out,
    find_baby_by_slug,
)
from .models import Entry

_LOGGER = logging.getLogger(__name__)

# Universal optional fields
_OPTIONAL_PHOTO = vol.Schema(
    {vol.Optional("photo_path"): vol.Any(None, str)}, extra=vol.ALLOW_EXTRA
)

# Photo path validation (§12 #15)
ALLOWED_PHOTO_PREFIXES = ("media-source://",)
ALLOWED_PHOTO_ROOTS = ("local/babytracker", "media-source/local/babytracker")


def _validate_photo_path(path: str | None) -> str | None:
    if path is None or path == "":
        return None
    if not isinstance(path, str):
        raise ServiceValidationError(f"photo_path must be a string, got {type(path)!r}")
    if not any(path.startswith(prefix) for prefix in ALLOWED_PHOTO_PREFIXES):
        raise ServiceValidationError(
            "photo_path must be a media-source:// URL pointing under "
            "/config/media/ or /config/www/"
        )
    if "babytracker" not in path:
        # Soft constraint per §12 #15 — keep entries scoped to the babytracker
        # subtree of HA's media folder.
        raise ServiceValidationError(
            "photo_path must reference the /config/media/babytracker/ or "
            "/config/www/babytracker/ subtree"
        )
    return path


def _now_iso() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


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
            return dict(entry.options or {})
    return {}


# ---------- Service handlers ---------------------------------------------


async def _resolve_baby(hass: HomeAssistant, slug: str):
    coord = _coordinator(hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    return find_baby_by_slug(coord.babies, slug)


async def _ensure_can_log(hass: HomeAssistant, baby, activity: str, source: str) -> None:
    coord = _coordinator(hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    ensure_local_not_locked_out(baby, coord.at_daycare(baby), source)
    ensure_activity_enabled(baby, activity)


def _build_entry(
    *,
    type_: str,
    baby_id: str | None,
    timestamp: str | None = None,
    ended_at: str | None = None,
    notes: str | None = None,
    photo_path: str | None = None,
    data: dict[str, Any] | None = None,
    source: str = ENTRY_SOURCE_USER,
) -> Entry:
    return Entry(
        id=str(uuid.uuid4()),
        type=type_,
        baby_id=baby_id,
        timestamp=timestamp or _now_iso(),
        ended_at=ended_at,
        source=source,
        photo_path=_validate_photo_path(photo_path),
        notes=notes or None,
        data=dict(data or {}),
    )


# ----- log_feeding (M2) ---------------------------------------------------
LOG_FEEDING_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("method"): vol.In(list(ALL_FEEDING_METHODS)),
        vol.Optional("amount"): vol.Coerce(float),
        vol.Optional("unit"): vol.In(list(ALL_VOLUME_UNITS)),
        vol.Optional("started_at"): cv.datetime,
        vol.Optional("ended_at"): cv.datetime,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)


async def _handle_log_feeding(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "feeding", ENTRY_SOURCE_USER)
    method = call.data["method"]
    ensure_feeding_method_enabled(baby, method)
    started = call.data.get("started_at")
    ended = call.data.get("ended_at")
    entry = _build_entry(
        type_="feeding",
        baby_id=baby.id,
        timestamp=started.isoformat() if started else _now_iso(),
        ended_at=ended.isoformat() if ended else None,
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
        data={
            "method": method,
            "amount": call.data.get("amount"),
            "unit": call.data.get("unit"),
        },
    )
    await _coordinator(hass).add_entry(entry)


# ----- start_feeding / end_feeding (M2) -----------------------------------
START_FEEDING_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("method"): vol.In(list(ALL_FEEDING_METHODS)),
        vol.Optional("started_at"): cv.datetime,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)
END_FEEDING_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("amount"): vol.Coerce(float),
        vol.Optional("unit"): vol.In(list(ALL_VOLUME_UNITS)),
        vol.Optional("notes"): cv.string,
    }
)


async def _handle_start_feeding(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "feeding", ENTRY_SOURCE_USER)
    method = call.data["method"]
    ensure_feeding_method_enabled(baby, method)
    coord = _coordinator(hass)
    if coord.open_session(baby.id, "feeding") is not None:
        raise ServiceValidationError("a feeding session is already open")
    started = call.data.get("started_at")
    entry = _build_entry(
        type_="feeding",
        baby_id=baby.id,
        timestamp=started.isoformat() if started else None,
        photo_path=call.data.get("photo_path"),
        data={"method": method},
    )
    await coord.add_entry(entry)


async def _handle_end_feeding(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "feeding", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    entry = coord.open_session(baby.id, "feeding")
    if entry is None:
        raise ServiceValidationError("no open feeding session")
    updates = {}
    if call.data.get("amount") is not None:
        updates["amount"] = call.data["amount"]
    if call.data.get("unit"):
        updates["unit"] = call.data["unit"]
    await coord.close_session(
        entry.id,
        ended_at=_now_iso(),
        notes=call.data.get("notes"),
        data_updates=updates,
    )


# ----- log_diaper (M2) -----------------------------------------------------
LOG_DIAPER_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("kind"): vol.In(list(ALL_DIAPER_KINDS)),
        vol.Optional("timestamp"): cv.datetime,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)


async def _handle_log_diaper(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "diaper", ENTRY_SOURCE_USER)
    ts = call.data.get("timestamp")
    entry = _build_entry(
        type_="diaper",
        baby_id=baby.id,
        timestamp=ts.isoformat() if ts else None,
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
        data={"kind": call.data["kind"]},
    )
    await _coordinator(hass).add_entry(entry)


# ----- Sleep / tummy time (M3) --------------------------------------------
START_SLEEP_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("started_at"): cv.datetime,
        vol.Optional("location"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)
END_SLEEP_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("notes"): cv.string,
    }
)
LOG_SLEEP_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("started_at"): cv.datetime,
        vol.Required("ended_at"): cv.datetime,
        vol.Optional("location"): cv.string,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)
START_TUMMY_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("started_at"): cv.datetime,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)
END_TUMMY_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("notes"): cv.string,
    }
)
LOG_TUMMY_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("started_at"): cv.datetime,
        vol.Required("ended_at"): cv.datetime,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)


async def _handle_start_sleep(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "sleep", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    if coord.open_session(baby.id, "sleep") is not None:
        raise ServiceValidationError("a sleep session is already open")
    started = call.data.get("started_at")
    entry = _build_entry(
        type_="sleep",
        baby_id=baby.id,
        timestamp=started.isoformat() if started else None,
        photo_path=call.data.get("photo_path"),
        data={"location": call.data.get("location") or "home"},
    )
    await coord.add_entry(entry)


async def _handle_log_sleep(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "sleep", ENTRY_SOURCE_USER)
    entry = _build_entry(
        type_="sleep",
        baby_id=baby.id,
        timestamp=call.data["started_at"].isoformat(),
        ended_at=call.data["ended_at"].isoformat(),
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
        data={"location": call.data.get("location") or "home"},
    )
    await _coordinator(hass).add_entry(entry)


async def _handle_end_sleep(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "sleep", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    entry = coord.open_session(baby.id, "sleep")
    if entry is None:
        raise ServiceValidationError("no open sleep session")
    await coord.close_session(
        entry.id, ended_at=_now_iso(), notes=call.data.get("notes")
    )


async def _handle_start_tummy(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "tummy_time", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    if coord.open_session(baby.id, "tummy_time") is not None:
        raise ServiceValidationError("a tummy_time session is already open")
    started = call.data.get("started_at")
    entry = _build_entry(
        type_="tummy_time",
        baby_id=baby.id,
        timestamp=started.isoformat() if started else None,
        photo_path=call.data.get("photo_path"),
    )
    await coord.add_entry(entry)


async def _handle_end_tummy(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "tummy_time", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    entry = coord.open_session(baby.id, "tummy_time")
    if entry is None:
        raise ServiceValidationError("no open tummy_time session")
    await coord.close_session(
        entry.id, ended_at=_now_iso(), notes=call.data.get("notes")
    )


async def _handle_log_tummy(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "tummy_time", ENTRY_SOURCE_USER)
    entry = _build_entry(
        type_="tummy_time",
        baby_id=baby.id,
        timestamp=call.data["started_at"].isoformat(),
        ended_at=call.data["ended_at"].isoformat(),
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
    )
    await _coordinator(hass).add_entry(entry)


# ----- Walks --------------------------------------------------------------
START_WALK_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("started_at"): cv.datetime,
        vol.Optional("location"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)
END_WALK_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("notes"): cv.string,
    }
)
LOG_WALK_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("started_at"): cv.datetime,
        vol.Required("ended_at"): cv.datetime,
        vol.Optional("location"): cv.string,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)


async def _handle_start_walk(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "walk", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    if coord.open_session(baby.id, "walk") is not None:
        raise ServiceValidationError("a walk session is already open")
    data: dict[str, Any] = {}
    if call.data.get("location"):
        data["location"] = call.data["location"]
    started = call.data.get("started_at")
    entry = _build_entry(
        type_="walk",
        baby_id=baby.id,
        timestamp=started.isoformat() if started else None,
        photo_path=call.data.get("photo_path"),
        data=data or None,
    )
    await coord.add_entry(entry)


async def _handle_end_walk(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "walk", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    entry = coord.open_session(baby.id, "walk")
    if entry is None:
        raise ServiceValidationError("no open walk session")
    await coord.close_session(
        entry.id, ended_at=_now_iso(), notes=call.data.get("notes")
    )


async def _handle_log_walk(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "walk", ENTRY_SOURCE_USER)
    data: dict[str, Any] = {}
    if call.data.get("location"):
        data["location"] = call.data["location"]
    entry = _build_entry(
        type_="walk",
        baby_id=baby.id,
        timestamp=call.data["started_at"].isoformat(),
        ended_at=call.data["ended_at"].isoformat(),
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
        data=data or None,
    )
    await _coordinator(hass).add_entry(entry)


# ----- Other (free-form) --------------------------------------------------
LOG_OTHER_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("name"): cv.string,
        vol.Optional("timestamp"): cv.datetime,
        vol.Optional("notes"): cv.string,
    }
)


async def _handle_log_other(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "other", ENTRY_SOURCE_USER)
    ts = call.data.get("timestamp")
    entry = _build_entry(
        type_="other",
        baby_id=baby.id,
        timestamp=ts.isoformat() if ts else None,
        notes=call.data.get("notes"),
        data={"name": call.data["name"]},
    )
    await _coordinator(hass).add_entry(entry)


# ----- Pumping / growth / medication (M4) ---------------------------------
LOG_PUMPING_SCHEMA = vol.Schema(
    {
        vol.Required("volume"): vol.Coerce(float),
        vol.Required("unit"): vol.In(list(ALL_VOLUME_UNITS)),
        vol.Optional("side"): vol.In(list(ALL_PUMPING_SIDES)),
        vol.Optional("duration"): vol.Coerce(float),
        vol.Optional("notes"): cv.string,
    }
)


async def _handle_log_pumping(call: ServiceCall) -> None:
    hass = call.hass
    options = _entry_options(hass)
    if not options.get(OPT_ENABLE_PUMPING, True):
        raise ServiceValidationError("pumping is disabled in integration options")
    entry = _build_entry(
        type_="pumping",
        baby_id=None,
        notes=call.data.get("notes"),
        data={
            "volume": call.data["volume"],
            "unit": call.data["unit"],
            "side": call.data.get("side"),
            "duration": call.data.get("duration"),
        },
    )
    await _coordinator(hass).add_entry(entry)


LOG_GROWTH_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("weight"): vol.Coerce(float),
        vol.Optional("height"): vol.Coerce(float),
        vol.Optional("head_circumference"): vol.Coerce(float),
        vol.Optional("weight_unit"): vol.In(list(ALL_WEIGHT_UNITS)),
        vol.Optional("length_unit"): vol.In(list(ALL_LENGTH_UNITS)),
        vol.Optional("timestamp"): cv.datetime,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)


async def _handle_log_growth(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "growth", ENTRY_SOURCE_USER)
    if (
        call.data.get("weight") is None
        and call.data.get("height") is None
        and call.data.get("head_circumference") is None
    ):
        raise ServiceValidationError("at least one growth measurement is required")
    options = _entry_options(hass)
    weight_unit = call.data.get("weight_unit") or options.get("weight_unit", "kg")
    length_unit = call.data.get("length_unit") or options.get("length_unit", "cm")
    data = {
        "weight": call.data.get("weight"),
        "height": call.data.get("height"),
        "head_circumference": call.data.get("head_circumference"),
        "weight_unit": weight_unit,
        "length_unit": length_unit,
    }
    # Compute percentiles (M6+). When the user back-dates a measurement
    # we must compute percentiles against the baby's age on that date,
    # not today — otherwise the bands are off by however long ago the
    # measurement was taken.
    from . import percentiles

    ts = call.data.get("timestamp")
    measured_at = ts.date() if ts else None
    percentiles.attach_percentile_data(hass, baby, data, measured_at=measured_at)
    entry = _build_entry(
        type_="growth",
        baby_id=baby.id,
        timestamp=ts.isoformat() if ts else None,
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
        data=data,
    )
    await _coordinator(hass).add_entry(entry)


LOG_MEDICATION_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("name"): cv.string,
        vol.Required("dose"): vol.Coerce(float),
        vol.Required("unit"): cv.string,
        vol.Optional("notes"): cv.string,
    }
)


async def _handle_log_medication(call: ServiceCall) -> None:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "medication", ENTRY_SOURCE_USER)
    entry = _build_entry(
        type_="medication",
        baby_id=baby.id,
        notes=call.data.get("notes"),
        data={
            "name": call.data["name"],
            "dose": call.data["dose"],
            "unit": call.data["unit"],
        },
    )
    await _coordinator(hass).add_entry(entry)


# ----- Vaccine (M7) -------------------------------------------------------
LOG_VACCINE_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Required("name"): cv.string,
        vol.Optional("dose_number"): vol.All(vol.Coerce(int), vol.Range(min=1, max=20)),
        vol.Optional("lot_number"): cv.string,
        vol.Optional("provider"): cv.string,
        vol.Optional("site"): vol.In(list(VACCINE_SITES)),
        vol.Optional("timestamp"): cv.datetime,
        vol.Optional("notes"): cv.string,
        vol.Optional("photo_path"): vol.Any(None, str),
    }
)


async def _handle_log_vaccine(call: ServiceCall) -> None:
    from .vaccines import canonical_vaccine

    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    await _ensure_can_log(hass, baby, "vaccine", ENTRY_SOURCE_USER)
    coord = _coordinator(hass)
    name = call.data["name"]
    dose_number = call.data.get("dose_number")
    if dose_number is None:
        canonical_new = canonical_vaccine(name)
        prior = [
            e
            for e in coord.entries_by_baby(baby.id)
            if e.type == "vaccine"
            and not e.readonly
            and canonical_vaccine(e.data.get("name")) == canonical_new
        ]
        dose_number = len(prior) + 1
    ts = call.data.get("timestamp")
    entry = _build_entry(
        type_="vaccine",
        baby_id=baby.id,
        timestamp=ts.isoformat() if ts else _now_iso(),
        notes=call.data.get("notes"),
        photo_path=call.data.get("photo_path"),
        data={
            "name": name,
            "dose_number": dose_number,
            "lot_number": call.data.get("lot_number"),
            "provider": call.data.get("provider"),
            "site": call.data.get("site"),
        },
    )
    await coord.add_entry(entry)


# ----- Edit / delete / purge (M5) -----------------------------------------
EDIT_ENTRY_SCHEMA = vol.Schema(
    {vol.Required("entry_id"): cv.string, vol.Required("fields"): dict}
)
DELETE_ENTRY_SCHEMA = vol.Schema({vol.Required("entry_id"): cv.string})
PURGE_BABY_SCHEMA = vol.Schema({vol.Required("baby_id"): cv.string})


_PERCENTILE_FIELDS = (
    "weight_percentile",
    "weight_z",
    "weight_percentile_source",
    "height_percentile",
    "height_z",
    "height_percentile_source",
    "head_percentile",
    "head_z",
    "head_percentile_source",
    "bmi",
    "bmi_percentile",
    "bmi_z",
    "bmi_percentile_source",
)


async def _handle_edit_entry(call: ServiceCall) -> None:
    coord = _coordinator(call.hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    fields = dict(call.data.get("fields") or {})
    if "photo_path" in fields:
        fields["photo_path"] = _validate_photo_path(fields["photo_path"])
    # Editing a growth entry's measurement or timestamp invalidates the
    # cached percentile fields stored on the entry. Recompute them inline
    # so the merged write that `coord.edit_entry` performs reflects the
    # new age/value pair instead of leaving stale percentile data behind.
    entry = coord.entry_by_id(call.data["entry_id"])
    if entry is not None and entry.type == "growth" and (
        "data" in fields or "timestamp" in fields
    ):
        baby = coord.baby_by_id(entry.baby_id) if entry.baby_id else None
        if baby is not None:
            patch = fields.get("data") or {}
            merged = {**entry.data, **patch}
            for key in _PERCENTILE_FIELDS:
                merged.pop(key, None)
            ts_field = fields.get("timestamp", entry.timestamp)
            measured_at = None
            if ts_field:
                try:
                    measured_at = datetime.fromisoformat(ts_field).date()
                except ValueError:
                    measured_at = None
            from . import percentiles

            percentiles.attach_percentile_data(
                call.hass, baby, merged, measured_at=measured_at
            )
            fields["data"] = merged
    try:
        await coord.edit_entry(call.data["entry_id"], fields)
    except ValueError as err:
        raise ServiceValidationError(str(err)) from err


async def _handle_delete_entry(call: ServiceCall) -> None:
    coord = _coordinator(call.hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    try:
        await coord.delete_entry(call.data["entry_id"])
    except ValueError as err:
        raise ServiceValidationError(str(err)) from err


async def _handle_purge_baby(call: ServiceCall) -> None:
    coord = _coordinator(call.hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    try:
        baby = coord.baby_by_id(call.data["baby_id"])
        if baby is None or not baby.archived:
            raise ServiceValidationError(
                "purge_baby requires the baby to be archived first"
            )
        await coord.purge_baby(call.data["baby_id"])
    except ValueError as err:
        raise ServiceValidationError(str(err)) from err


# ----- export_report (M7) -------------------------------------------------
EXPORT_REPORT_SCHEMA = vol.Schema(
    {
        vol.Required("baby"): cv.string,
        vol.Optional("format", default="html"): vol.In(["html", "csv"]),
        vol.Optional("start"): cv.string,
        vol.Optional("end"): cv.string,
        vol.Optional("sections"): vol.All(cv.ensure_list, [cv.string]),
    }
)


async def _handle_export_report(call: ServiceCall) -> ServiceResponse:
    hass = call.hass
    baby = await _resolve_baby(hass, call.data["baby"])
    from .export import generate_report

    result = await generate_report(
        hass,
        baby,
        fmt=call.data.get("format", "html"),
        start=call.data.get("start"),
        end=call.data.get("end"),
        sections=call.data.get("sections"),
    )
    return result


# ----- set_daycare_presence (M8) ------------------------------------------
SET_DAYCARE_SCHEMA = vol.Schema(
    {vol.Required("baby"): cv.string, vol.Required("value"): cv.boolean}
)


async def _handle_set_daycare(call: ServiceCall) -> None:
    hass = call.hass
    coord = _coordinator(hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    baby = find_baby_by_slug(coord.babies, call.data["baby"])
    await coord.set_at_daycare(baby, call.data["value"])


# ----- Resync importers ---------------------------------------------------
RESYNC_IMPORTERS_SCHEMA = vol.Schema(
    {vol.Optional("baby"): cv.string}
)


async def _handle_resync_importers(call: ServiceCall) -> ServiceResponse:
    hass = call.hass
    coord = _coordinator(hass)
    if coord is None:
        raise ServiceValidationError("babytracker not configured")
    runtime = _runtime(hass)
    importers = (runtime or {}).get("importers") or []
    baby_slug = call.data.get("baby")
    target_id: str | None = None
    if baby_slug:
        target_baby = find_baby_by_slug(coord.babies, baby_slug)
        target_id = target_baby.id
    imported = 0
    matched = 0
    for importer in importers:
        if target_id and importer.baby.id != target_id:
            continue
        matched += 1
        imported += await importer.async_resync()
    return {"matched_importers": matched, "imported": imported}


# -----------------------------------------------------------------
# Registration
# -----------------------------------------------------------------

_REGISTERED: list[str] = []


async def async_register_services(hass: HomeAssistant, entry: ConfigEntry) -> None:
    if _REGISTERED:
        return

    def _reg(name: str, handler, schema, supports_response: SupportsResponse | None = None):
        kwargs: dict[str, Any] = {"schema": schema}
        if supports_response is not None:
            kwargs["supports_response"] = supports_response
        hass.services.async_register(DOMAIN, name, handler, **kwargs)
        _REGISTERED.append(name)

    _reg("log_feeding", _handle_log_feeding, LOG_FEEDING_SCHEMA)
    _reg("start_feeding", _handle_start_feeding, START_FEEDING_SCHEMA)
    _reg("end_feeding", _handle_end_feeding, END_FEEDING_SCHEMA)
    _reg("log_diaper", _handle_log_diaper, LOG_DIAPER_SCHEMA)
    _reg("start_sleep", _handle_start_sleep, START_SLEEP_SCHEMA)
    _reg("end_sleep", _handle_end_sleep, END_SLEEP_SCHEMA)
    _reg("log_sleep", _handle_log_sleep, LOG_SLEEP_SCHEMA)
    _reg("start_tummy_time", _handle_start_tummy, START_TUMMY_SCHEMA)
    _reg("end_tummy_time", _handle_end_tummy, END_TUMMY_SCHEMA)
    _reg("log_tummy_time", _handle_log_tummy, LOG_TUMMY_SCHEMA)
    _reg("start_walk", _handle_start_walk, START_WALK_SCHEMA)
    _reg("end_walk", _handle_end_walk, END_WALK_SCHEMA)
    _reg("log_walk", _handle_log_walk, LOG_WALK_SCHEMA)
    _reg("log_other", _handle_log_other, LOG_OTHER_SCHEMA)
    _reg("log_pumping", _handle_log_pumping, LOG_PUMPING_SCHEMA)
    _reg("log_growth", _handle_log_growth, LOG_GROWTH_SCHEMA)
    _reg("log_medication", _handle_log_medication, LOG_MEDICATION_SCHEMA)
    _reg("log_vaccine", _handle_log_vaccine, LOG_VACCINE_SCHEMA)
    _reg("edit_entry", _handle_edit_entry, EDIT_ENTRY_SCHEMA)
    _reg("delete_entry", _handle_delete_entry, DELETE_ENTRY_SCHEMA)
    _reg("purge_baby", _handle_purge_baby, PURGE_BABY_SCHEMA)
    _reg(
        "export_report",
        _handle_export_report,
        EXPORT_REPORT_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    _reg("set_daycare_presence", _handle_set_daycare, SET_DAYCARE_SCHEMA)
    _reg(
        "resync_importers",
        _handle_resync_importers,
        RESYNC_IMPORTERS_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )


async def async_unregister_services(hass: HomeAssistant) -> None:
    while _REGISTERED:
        name = _REGISTERED.pop()
        if hass.services.has_service(DOMAIN, name):
            hass.services.async_remove(DOMAIN, name)
