"""Assist intent handlers (§10.2, §15 #22-#23)."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import intent

from .const import (
    ALL_DIAPER_KINDS,
    ALL_FEEDING_METHODS,
    ALL_VOLUME_UNITS,
    DOMAIN,
    ENTRY_SOURCE_USER,
)
from .eligibility import (
    ensure_activity_enabled,
    ensure_feeding_method_enabled,
    ensure_local_not_locked_out,
    find_baby_by_slug,
)
from .models import Entry
import uuid

_LOGGER = logging.getLogger(__name__)


def _coordinator(hass: HomeAssistant):
    runtimes = hass.data.get(DOMAIN, {})
    if not runtimes:
        return None
    return next(iter(runtimes.values()))["coordinator"]


def _resolve(hass: HomeAssistant, slug: str):
    coord = _coordinator(hass)
    if coord is None:
        raise intent.IntentHandleError("babytracker not configured")
    return coord, find_baby_by_slug(coord.babies, slug)


def _ensure(coord, baby, activity):
    ensure_local_not_locked_out(baby, coord.at_daycare(baby), ENTRY_SOURCE_USER)
    ensure_activity_enabled(baby, activity)


def _now_iso() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def _speak(response: intent.IntentResponse, text: str) -> intent.IntentResponse:
    response.async_set_speech(text)
    return response


def _handle_validation(err: ServiceValidationError, response: intent.IntentResponse) -> intent.IntentResponse:
    placeholders = err.translation_placeholders or {}
    key = err.translation_key or ""
    if key == "eligibility_rejected":
        return _speak(
            response,
            f"{placeholders.get('method_label', '').replace('_', ' ').title()} isn't enabled for {placeholders.get('baby_name', 'baby')}",
        )
    if key == "daycare_lockout":
        return _speak(
            response,
            f"{placeholders.get('baby_name', 'baby')} is checked in at daycare",
        )
    if key == "unknown_baby":
        return _speak(response, f"I don't know a baby named {placeholders.get('baby', 'that')}")
    return _speak(response, str(err))


class _BaseHandler(intent.IntentHandler):
    intent_type = ""

    slot_schema = {}

    async def async_handle(self, intent_obj):  # type: ignore[override]
        response = intent_obj.create_response()
        try:
            return await self._async_handle(intent_obj, response)
        except ServiceValidationError as err:
            return _handle_validation(err, response)


class LogDiaperIntent(_BaseHandler):
    intent_type = "BabytrackerLogDiaper"
    description = "Log a diaper change."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        baby_slug = slots["baby"]["value"]
        kind = slots["kind"]["value"]
        if kind not in ALL_DIAPER_KINDS:
            return _speak(response, f"{kind} is not a recognised diaper kind")
        coord, baby = _resolve(intent_obj.hass, baby_slug)
        _ensure(coord, baby, "diaper")
        entry = Entry(
            id=str(uuid.uuid4()),
            type="diaper",
            baby_id=baby.id,
            timestamp=_now_iso(),
            data={"kind": kind},
        )
        await coord.add_entry(entry)
        return _speak(response, f"Logged a {kind} diaper for {baby.name}")


class StartSleepIntent(_BaseHandler):
    intent_type = "BabytrackerStartSleep"
    description = "Start a sleep session."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        _ensure(coord, baby, "sleep")
        location = slots.get("location", {}).get("value") or "home"
        if coord.open_session(baby.id, "sleep") is not None:
            return _speak(response, f"{baby.name} is already asleep")
        await coord.add_entry(
            Entry(
                id=str(uuid.uuid4()),
                type="sleep",
                baby_id=baby.id,
                timestamp=_now_iso(),
                data={"location": location},
            )
        )
        return _speak(response, f"{baby.name} is now sleeping ({location})")


class EndSleepIntent(_BaseHandler):
    intent_type = "BabytrackerEndSleep"
    description = "End a sleep session."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        _ensure(coord, baby, "sleep")
        entry = coord.open_session(baby.id, "sleep")
        if entry is None:
            return _speak(response, f"{baby.name} doesn't have an open sleep session")
        await coord.close_session(entry.id, ended_at=_now_iso())
        return _speak(response, f"Ended {baby.name}'s sleep session")


class StartFeedingIntent(_BaseHandler):
    intent_type = "BabytrackerStartFeeding"
    description = "Start a feeding session."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        method = slots["method"]["value"]
        if method not in ALL_FEEDING_METHODS:
            return _speak(response, f"{method} is not a recognised feeding method")
        _ensure(coord, baby, "feeding")
        ensure_feeding_method_enabled(baby, method)
        if coord.open_session(baby.id, "feeding") is not None:
            return _speak(response, f"{baby.name} already has an open feeding")
        await coord.add_entry(
            Entry(
                id=str(uuid.uuid4()),
                type="feeding",
                baby_id=baby.id,
                timestamp=_now_iso(),
                data={"method": method},
            )
        )
        return _speak(response, f"Started a {method.replace('_', ' ')} feeding for {baby.name}")


class EndFeedingIntent(_BaseHandler):
    intent_type = "BabytrackerEndFeeding"
    description = "End an open feeding session."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        _ensure(coord, baby, "feeding")
        entry = coord.open_session(baby.id, "feeding")
        if entry is None:
            return _speak(response, f"{baby.name} has no open feeding session")
        updates = {}
        amount = slots.get("amount", {}).get("value")
        unit = slots.get("unit", {}).get("value")
        if amount is not None:
            try:
                updates["amount"] = float(amount)
            except (TypeError, ValueError):
                pass
        if unit in ALL_VOLUME_UNITS:
            updates["unit"] = unit
        await coord.close_session(entry.id, ended_at=_now_iso(), data_updates=updates)
        return _speak(response, f"Ended feeding for {baby.name}")


class LogFeedingIntent(_BaseHandler):
    intent_type = "BabytrackerLogFeeding"
    description = "Log a complete feeding."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        method = slots["method"]["value"]
        if method not in ALL_FEEDING_METHODS:
            return _speak(response, f"{method} is not a recognised feeding method")
        _ensure(coord, baby, "feeding")
        ensure_feeding_method_enabled(baby, method)
        amount = slots.get("amount", {}).get("value")
        unit = slots.get("unit", {}).get("value")
        data = {"method": method}
        if amount is not None:
            try:
                data["amount"] = float(amount)
            except (TypeError, ValueError):
                pass
        if unit in ALL_VOLUME_UNITS:
            data["unit"] = unit
        await coord.add_entry(
            Entry(
                id=str(uuid.uuid4()),
                type="feeding",
                baby_id=baby.id,
                timestamp=_now_iso(),
                data=data,
            )
        )
        return _speak(response, f"Logged a {method.replace('_', ' ')} for {baby.name}")


class LogTummyTimeIntent(_BaseHandler):
    intent_type = "BabytrackerLogTummyTime"
    description = "Retroactively log a tummy time session."

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        _ensure(coord, baby, "tummy_time")
        minutes = int(float(slots["duration_minutes"]["value"]))
        now = datetime.now(tz=timezone.utc)
        start = now - timedelta(minutes=minutes)
        await coord.add_entry(
            Entry(
                id=str(uuid.uuid4()),
                type="tummy_time",
                baby_id=baby.id,
                timestamp=start.isoformat(),
                ended_at=now.isoformat(),
            )
        )
        return _speak(response, f"Logged {minutes} minutes of tummy time for {baby.name}")


class LastFeedingTimeIntent(_BaseHandler):
    intent_type = "BabytrackerLastFeedingTime"
    description = "How long since the last feeding?"

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        entries = sorted(
            (e for e in coord.entries_by_baby(baby.id) if e.type == "feeding"),
            key=lambda e: e.timestamp,
            reverse=True,
        )
        if not entries:
            return _speak(response, f"{baby.name} hasn't fed yet today")
        last = datetime.fromisoformat(entries[0].timestamp)
        delta = datetime.now(tz=last.tzinfo or timezone.utc) - last
        minutes = int(delta.total_seconds() // 60)
        return _speak(response, f"{baby.name} fed {minutes} minutes ago")


class LastDiaperTimeIntent(_BaseHandler):
    intent_type = "BabytrackerLastDiaperTime"
    description = "How long since the last diaper?"

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        entries = sorted(
            (e for e in coord.entries_by_baby(baby.id) if e.type == "diaper"),
            key=lambda e: e.timestamp,
            reverse=True,
        )
        if not entries:
            return _speak(response, f"No diapers logged yet for {baby.name}")
        last = entries[0]
        last_dt = datetime.fromisoformat(last.timestamp)
        delta = datetime.now(tz=last_dt.tzinfo or timezone.utc) - last_dt
        minutes = int(delta.total_seconds() // 60)
        kind = last.data.get("kind", "wet")
        return _speak(response, f"{baby.name}'s last diaper was {kind}, {minutes} minutes ago")


class IsSleepingIntent(_BaseHandler):
    intent_type = "BabytrackerIsSleeping"
    description = "Is the baby asleep?"

    async def _async_handle(self, intent_obj, response):
        slots = self.async_validate_slots(intent_obj.slots)
        coord, baby = _resolve(intent_obj.hass, slots["baby"]["value"])
        entry = coord.open_session(baby.id, "sleep")
        if entry is None:
            return _speak(response, f"{baby.name} is awake")
        start = datetime.fromisoformat(entry.timestamp)
        delta = datetime.now(tz=start.tzinfo or timezone.utc) - start
        minutes = int(delta.total_seconds() // 60)
        return _speak(response, f"{baby.name} has been asleep for {minutes} minutes")


_INTENTS = (
    LogDiaperIntent,
    StartSleepIntent,
    EndSleepIntent,
    StartFeedingIntent,
    EndFeedingIntent,
    LogFeedingIntent,
    LogTummyTimeIntent,
    LastFeedingTimeIntent,
    LastDiaperTimeIntent,
    IsSleepingIntent,
)

_REGISTERED = False


async def async_register(hass: HomeAssistant, entry: ConfigEntry) -> None:
    global _REGISTERED  # noqa: PLW0603
    if _REGISTERED:
        return
    for cls in _INTENTS:
        intent.async_register(hass, cls())
    _REGISTERED = True
