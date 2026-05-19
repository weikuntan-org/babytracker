"""Procare importer (§4.6, §15 #16-#21).

Procare entries arrive via state-change events on
`sensor.<child>_activities`; the attribute `activities` holds the last
N activities with `id`, `timestamp`, `title`, `details`, `photo_url`,
`staff`. The importer dedups on `(source, source_id)` and routes
recognised activity titles to the coordinator's normal mutation
pipeline.
"""
from __future__ import annotations

import logging
import re
import uuid
from datetime import datetime, time, timedelta, timezone
from typing import Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_change

from ..const import ENTRY_SOURCE_PROCARE
from ..models import Baby, Entry
from .base import BaseImporter
from .procare_mappings import async_load_mappings, match_title

_LOGGER = logging.getLogger(__name__)

BOTTLE_AMOUNT_RE = re.compile(r"(\d+(?:\.\d+)?)\s*(ml|oz|mL|OZ)\b")
SIGN_IN_RE = re.compile(r"^Sign(?:ed)? In(?: by .+)?$", re.IGNORECASE)
SIGN_OUT_RE = re.compile(r"^Sign(?:ed)? Out(?: by .+)?$", re.IGNORECASE)
SLEEP_RANGE_RE = re.compile(
    r"Slept\s+from\s+(\d{1,2}:\d{2}\s*[APap][Mm])\s+to\s+(\d{1,2}:\d{2}\s*[APap][Mm])",
    re.IGNORECASE,
)

_WEEKDAY_BY_NAME = {
    "mon": 0,
    "tue": 1,
    "wed": 2,
    "thu": 3,
    "fri": 4,
    "sat": 5,
    "sun": 6,
}


def _now_iso() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def _parse_time(value: str | None) -> time | None:
    if not value:
        return None
    try:
        hour, minute = (int(p) for p in value.split(":")[:2])
        return time(hour=hour, minute=minute)
    except Exception:  # noqa: BLE001
        return None


def _parse_sleep_range(
    title: str, anchor_iso: str | None
) -> tuple[str, str] | None:
    """Return (start_iso, end_iso) parsed from a 'Slept from X to Y' title.

    Anchored to the date+timezone of the activity's timestamp. If the
    upstream timestamp is missing or unparseable we fall back to UTC
    "today" — which loses tz fidelity but keeps the entry chronological.

    Returns None if the title doesn't match the expected pattern.
    """
    m = SLEEP_RANGE_RE.search(title or "")
    if not m:
        return None
    try:
        start_t = datetime.strptime(m.group(1).strip().upper(), "%I:%M %p").time()
        end_t = datetime.strptime(m.group(2).strip().upper(), "%I:%M %p").time()
    except ValueError:
        return None
    anchor: datetime | None = None
    if anchor_iso:
        try:
            anchor = datetime.fromisoformat(anchor_iso)
        except ValueError:
            anchor = None
    if anchor is None:
        anchor = datetime.now(tz=timezone.utc)
    tz = anchor.tzinfo or timezone.utc
    base_date = anchor.astimezone(tz).date()
    start_dt = datetime.combine(base_date, start_t).replace(tzinfo=tz)
    end_dt = datetime.combine(base_date, end_t).replace(tzinfo=tz)
    if end_dt < start_dt:
        # Sleep spanned midnight — start was the previous local day.
        start_dt -= timedelta(days=1)
    return start_dt.isoformat(), end_dt.isoformat()


def _seen_ids_for(baby: Baby, coordinator) -> set[str]:
    return {
        e.source_id
        for e in coordinator.entries_by_baby(baby.id)
        if e.source == ENTRY_SOURCE_PROCARE and e.source_id
    }


class ProcareImporter(BaseImporter):
    """Per-baby Procare importer."""

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator,
        baby: Baby,
        config: dict[str, Any],
        mappings: list[dict[str, Any]] | None = None,
    ) -> None:
        self.hass = hass
        self.coordinator = coordinator
        self.baby = baby
        self.config = dict(config)
        self.mappings = mappings or []
        self._unsub_state = None
        self._unsub_close_time = None

    @property
    def sensor_entity_id(self) -> str:
        return self.config["source_entity_id"]

    # ------------------------------------------------------------------
    async def async_setup(self) -> None:
        if not self.mappings:
            self.mappings = await async_load_mappings(self.hass)
        self._unsub_state = async_track_state_change_event(
            self.hass, [self.sensor_entity_id], self._handle_state_change
        )
        close = _parse_time(self.config.get("daycare_close_time"))
        if close is not None:
            self._unsub_close_time = async_track_time_change(
                self.hass,
                self._auto_sign_out,
                hour=close.hour,
                minute=close.minute,
                second=0,
            )

    async def async_unload(self) -> None:
        if self._unsub_state:
            self._unsub_state()
            self._unsub_state = None
        if self._unsub_close_time:
            self._unsub_close_time()
            self._unsub_close_time = None

    # ------------------------------------------------------------------
    @callback
    def _handle_state_change(self, event: Event) -> None:
        self.hass.async_create_task(self._async_process_state(event))

    async def _async_process_state(self, event: Event) -> None:
        new_state = event.data.get("new_state")
        if new_state is None:
            return
        activities = new_state.attributes.get("activities") or []
        if not activities:
            return
        seen = _seen_ids_for(self.baby, self.coordinator)
        for activity in activities:
            await self._process_activity(activity, seen)

    async def async_resync(self) -> int:
        """Re-read the source sensor's current state and process every
        activity through the dedup pipeline. Returns the number of new
        entries created (activities already imported are skipped via
        the existing `(source, source_id)` dedup, so this is safe to
        call repeatedly).

        Important limitation: the source sensor only exposes whatever the
        upstream Procare integration has cached (typically the most recent
        ~N activities). Resync cannot recover deleted babytracker entries
        whose corresponding source activity has aged out of that cache —
        the data isn't reachable from here. The INFO log line below makes
        the boundary visible so users can confirm whether their missing
        entries are still in the source.
        """
        state = self.hass.states.get(self.sensor_entity_id)
        if state is None:
            _LOGGER.warning(
                "babytracker: resync skipped, source sensor %s not found",
                self.sensor_entity_id,
            )
            return 0
        activities = state.attributes.get("activities") or []
        before = len(self.coordinator.entries_by_baby(self.baby.id))
        seen = _seen_ids_for(self.baby, self.coordinator)
        already_seen = sum(
            1
            for a in activities
            if str(a.get("id") or "") and str(a.get("id") or "") in seen
        )
        for activity in activities:
            await self._process_activity(activity, seen)
        after = len(self.coordinator.entries_by_baby(self.baby.id))
        imported = max(0, after - before)
        _LOGGER.info(
            "babytracker: resync %s — source has %d activities; "
            "%d already imported, %d newly imported",
            self.baby.slug,
            len(activities),
            already_seen,
            imported,
        )
        return imported

    async def _process_activity(self, activity: dict[str, Any], seen: set[str]) -> None:
        source_id = str(activity.get("id") or "")
        if not source_id or source_id in seen:
            return
        title = (activity.get("title") or "").strip()
        if not title:
            return
        timestamp = activity.get("timestamp") or _now_iso()
        # Sign in/out (§15 #17) — set presence AND log as an "other" entry so
        # the check-in/out shows up in the activity log. The presence side
        # effect runs regardless of import_types; the log entry is created
        # inline via the standard pipeline below by treating sign-in/out as
        # synthetic "other"-type mappings.
        synthetic_mapping: dict[str, Any] | None = None
        if SIGN_IN_RE.match(title):
            await self._set_at_daycare(True, source="title_events")
            synthetic_mapping = {"type": "other"}
        elif SIGN_OUT_RE.match(title):
            await self._set_at_daycare(False, source="title_events")
            synthetic_mapping = {"type": "other"}

        if synthetic_mapping is not None:
            mapping = synthetic_mapping
        else:
            mapping = match_title(self.mappings, title)
            if mapping is None:
                _LOGGER.warning(
                    "babytracker: unmapped Procare title %r on %s",
                    title,
                    self.sensor_entity_id,
                )
                self.coordinator.record_unmapped_procare_title(title)
                return

        entry_type = mapping["type"]
        if entry_type not in (self.config.get("import_types") or []):
            return

        # Inference-window mode: if we have no recent sign-in but receive
        # activities, assume baby is checked in.
        if self.config.get("mode", "inference_window") == "inference_window":
            await self._set_at_daycare(True, source="inference_window")

        photo_url = activity.get("photo_url")
        staff = activity.get("staff")
        data = self._derive_data(entry_type, activity, mapping)
        timestamp = data.pop("__timestamp_override", None) or timestamp
        # Surface the Procare `details` payload as the entry's `notes`
        # field so it shows up in the recent-entries notes row.
        notes = (activity.get("details") or "").strip() or None

        entry = Entry(
            id=str(uuid.uuid4()),
            type=entry_type,
            baby_id=self.baby.id,
            timestamp=timestamp,
            ended_at=data.pop("__ended_at", None),
            source=ENTRY_SOURCE_PROCARE,
            source_entity_id=self.sensor_entity_id,
            source_id=source_id,
            imported_at=_now_iso(),
            readonly=self.config.get("mark_readonly", True),
            photo_url=photo_url,
            staff=staff,
            notes=notes,
            data=data,
        )
        await self.coordinator.add_entry(entry)
        seen.add(source_id)

    def _derive_data(
        self,
        entry_type: str,
        activity: dict[str, Any],
        mapping: dict[str, Any],
    ) -> dict[str, Any]:
        details = (activity.get("details") or "").strip()
        if entry_type == "diaper":
            return {"kind": mapping.get("kind", "wet")}
        if entry_type == "feeding":
            method = mapping.get("method", "bottle")
            data: dict[str, Any] = {"method": method}
            if method == "bottle":
                m = BOTTLE_AMOUNT_RE.search(details) or BOTTLE_AMOUNT_RE.search(
                    activity.get("title") or ""
                )
                if m:
                    data["amount"] = float(m.group(1))
                    data["unit"] = m.group(2).lower()
                else:
                    _LOGGER.warning(
                        "babytracker: could not parse bottle amount from %r",
                        details or activity.get("title"),
                    )
            elif method == "solids":
                if details:
                    data["food"] = details
            # Procare feeding events are point-in-time logs, not session
            # start/end pairs — close the entry at the same timestamp so it
            # doesn't show up as an ongoing feeding in OpenSessionBinary.
            data["__ended_at"] = activity.get("timestamp") or _now_iso()
            return data
        if entry_type == "sleep":
            data = {"location": self.config.get("daycare_location_label", "daycare")}
            session = mapping.get("session")
            if session == "end":
                data["__ended_at"] = activity.get("timestamp") or _now_iso()
            elif session == "range":
                parsed = _parse_sleep_range(
                    activity.get("title") or "", activity.get("timestamp")
                )
                if parsed is not None:
                    start_iso, end_iso = parsed
                    data["__timestamp_override"] = start_iso
                    data["__ended_at"] = end_iso
            return data
        if entry_type == "other":
            # Free-form entries (sign-in/out, Learning, …). Surface the
            # Procare title as the activity name and stash the detail line
            # in `details` for the recent-entries view.
            data: dict[str, Any] = {"name": activity.get("title") or "Other"}
            if details:
                data["details"] = details
            return data
        return {}

    async def _set_at_daycare(self, value: bool, *, source: str) -> None:
        await self.coordinator.set_at_daycare(self.baby, value)
        # Mode auto-switch (§15 #19)
        if source == "title_events" and self.config.get("mode") != "title_events":
            self.config["mode"] = "title_events"
            await self.coordinator.set_baby_importer(self.baby.id, self.config)

    @callback
    def _auto_sign_out(self, now: datetime) -> None:
        weekday = now.weekday()
        days = [
            _WEEKDAY_BY_NAME[d] for d in (self.config.get("daycare_days") or []) if d in _WEEKDAY_BY_NAME
        ]
        if days and weekday not in days:
            return
        if not self.coordinator.at_daycare(self.baby):
            return
        _LOGGER.info(
            "babytracker: auto-signing %s out at daycare close time",
            self.baby.slug,
        )
        self.hass.async_create_task(
            self.coordinator.set_at_daycare(self.baby, False)
        )
