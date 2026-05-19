"""Procare importer (§4.6, §15 #16-#21).

Procare entries arrive via state-change events on
`sensor.<child>_activities`; the attribute `activities` holds the last
N activities with `id`, `timestamp`, `title`, `details`, `photo_url`,
`staff`. The importer dedups on `(source, source_id)` and routes
recognised activity titles to the coordinator's normal mutation
pipeline. When an activity carries a `photo_url`, we download the
bytes via HA's aiohttp session and persist them locally under
`/config/media/babytracker/` so the card can display Procare photos
the same way it shows user-uploaded ones (a `media-source://` URL on
the entry's `photo_path` field). Procare photo URLs are signed and
time-bounded, so we attempt the download promptly at ingest time; on
failure the entry's `photo_url` is preserved as a diagnostic pointer.
"""
from __future__ import annotations

import asyncio
import logging
import re
import uuid
from datetime import datetime, time, timedelta, timezone
from typing import Any

import aiohttp
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_change

from ..const import ENTRY_SOURCE_PROCARE
from ..models import Baby, Entry
from ..photo_storage import (
    PHOTO_MAX_BYTES,
    PHOTO_MIME_TO_EXT,
    local_path_for,
    sniff_image_mime,
    write_photo,
)
from ..runtime import now_iso
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


def _existing_by_source_id(baby: Baby, coordinator) -> dict[str, Entry]:
    """Map `source_id` → `Entry` for every Procare-imported entry on `baby`.

    Used by the importer pipeline to detect whether a refreshed
    upstream activity corresponds to an existing local entry (update
    path) or a brand-new one (create path).
    """
    return {
        e.source_id: e
        for e in coordinator.entries_by_baby(baby.id)
        if e.source == ENTRY_SOURCE_PROCARE and e.source_id
    }


# Procare photo URLs are signed CDN links (S3/CloudFront). We allow only
# https because (a) Procare always uses TLS in practice and (b) it removes
# the trivial "fetch http://internal/foo" SSRF shape even though the URL
# arrives via a user-installed trusted integration.
_PROCARE_PHOTO_TIMEOUT = aiohttp.ClientTimeout(total=30)


async def _download_procare_photo(
    hass: HomeAssistant, url: str
) -> str | None:
    """Fetch a Procare photo URL and persist it locally.

    Returns the resulting `media-source://...` URL on success, or None
    on any failure (HTTP error, wrong content-type, size cap exceeded,
    network timeout). Failures are logged but never propagate — the
    caller leaves the entry's `photo_url` field alone so the upstream
    pointer remains visible in diagnostics even when we couldn't grab
    a local copy.
    """
    if not isinstance(url, str) or not url.startswith("https://"):
        _LOGGER.warning(
            "babytracker: refusing non-https Procare photo URL: %r", url
        )
        return None
    session = async_get_clientsession(hass)
    try:
        async with session.get(url, timeout=_PROCARE_PHOTO_TIMEOUT) as resp:
            if resp.status != 200:
                _LOGGER.warning(
                    "babytracker: Procare photo HTTP %s for %s",
                    resp.status,
                    url,
                )
                return None
            header_mime = (resp.content_type or "").lower().strip()
            # Procare's signed CDN responses often come back as
            # `application/octet-stream` (or empty), so we don't reject
            # on the header alone — we sniff the actual payload below.
            # A header that's a concrete non-image type still short-circuits.
            if (
                header_mime
                and header_mime != "application/octet-stream"
                and header_mime not in PHOTO_MIME_TO_EXT
            ):
                _LOGGER.warning(
                    "babytracker: Procare photo unsupported content-type %r",
                    header_mime,
                )
                return None
            # Stream the body so a server that omits Content-Length
            # can't push us past the 5 MB cap before we react.
            buf = bytearray()
            async for chunk in resp.content.iter_chunked(65536):
                buf.extend(chunk)
                if len(buf) > PHOTO_MAX_BYTES:
                    _LOGGER.warning(
                        "babytracker: Procare photo exceeds %d bytes, abandoning",
                        PHOTO_MAX_BYTES,
                    )
                    return None
            payload = bytes(buf)
    except (asyncio.TimeoutError, aiohttp.ClientError) as err:
        _LOGGER.warning("babytracker: Procare photo download failed: %s", err)
        return None
    mime = (
        header_mime
        if header_mime in PHOTO_MIME_TO_EXT
        else sniff_image_mime(payload)
    )
    if mime is None:
        _LOGGER.warning(
            "babytracker: Procare photo magic bytes did not match a known "
            "image format (header was %r); dropping",
            header_mime,
        )
        return None
    return await write_photo(hass, payload, mime)


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
        existing = _existing_by_source_id(self.baby, self.coordinator)
        for activity in activities:
            await self._process_activity(activity, existing)

    async def async_resync(self) -> int:
        """Re-read the source sensor's current state and re-process every
        activity. New activities are created; previously-imported ones
        are checked against their current upstream state and patched
        in place if anything changed (see `_process_activity`). Also
        runs a photo-backfill pass for our own Procare-sourced entries
        that have a `photo_url` but no local `photo_path` yet — the
        activity-iteration pass only sees activities currently in the
        source sensor's cache, so entries whose source has aged out
        (or whose first download attempt failed) are unreachable from
        that path.

        Returns the number of newly-created entries — updates and
        photo backfills are logged separately rather than rolled into
        the return value.

        Important limitation: the source sensor only exposes whatever
        the upstream Procare integration has cached. Resync cannot
        recover deleted babytracker entries whose corresponding source
        activity has aged out of that cache.
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
        existing = _existing_by_source_id(self.baby, self.coordinator)
        already_seen = sum(
            1
            for a in activities
            if str(a.get("id") or "") and str(a.get("id") or "") in existing
        )
        for activity in activities:
            await self._process_activity(activity, existing)
        after = len(self.coordinator.entries_by_baby(self.baby.id))
        imported = max(0, after - before)
        backfilled = await self._backfill_photo_paths()
        _LOGGER.info(
            "babytracker: resync %s — source has %d activities; "
            "%d already imported, %d newly imported, %d photos backfilled",
            self.baby.slug,
            len(activities),
            already_seen,
            imported,
            backfilled,
        )
        return imported

    async def _backfill_photo_paths(self) -> int:
        """Retry photo downloads for Procare-sourced entries whose
        `photo_url` is set and whose locally-stored copy is either
        absent or no longer on disk.

        Two cases are covered:
        - `photo_path` was never set (initial download failed, or the
          first import predated the photo-download feature). Source
          activities that aged out of the upstream sensor's cache are
          only reachable through this path.
        - `photo_path` is set but the file is missing on disk (most
          commonly: an earlier build wrote under `<config>/media` but
          this install's `media_dirs.local` points elsewhere, so the
          resolver 404s).

        Returns the number of entries that gained (or regained) a local
        copy. A failed download leaves the entry alone — its existing
        fields are preserved and we'll retry on the next resync.
        """
        candidates: list[Entry] = []
        for entry in self.coordinator.entries_by_baby(self.baby.id):
            if entry.source != ENTRY_SOURCE_PROCARE or not entry.photo_url:
                continue
            if not entry.photo_path:
                candidates.append(entry)
                continue
            target = local_path_for(self.hass, entry.photo_path)
            if target is None:
                # photo_path doesn't fit our `media-source://media_source/local/…`
                # shape — leave it for the user to manage.
                continue
            exists = await self.hass.async_add_executor_job(target.exists)
            if not exists:
                candidates.append(entry)
        backfilled = 0
        for entry in candidates:
            photo_path = await _download_procare_photo(
                self.hass, entry.photo_url
            )
            if photo_path is None:
                continue
            await self.coordinator.update_imported_entry(
                entry.id,
                timestamp=entry.timestamp,
                ended_at=entry.ended_at,
                notes=entry.notes,
                photo_path=photo_path,
                photo_url=entry.photo_url,
                staff=entry.staff,
                data=entry.data,
            )
            backfilled += 1
        return backfilled

    async def _process_activity(
        self, activity: dict[str, Any], existing: dict[str, Entry]
    ) -> None:
        source_id = str(activity.get("id") or "")
        if not source_id:
            return
        title = (activity.get("title") or "").strip()
        if not title:
            return
        timestamp = activity.get("timestamp") or now_iso()
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

        photo_url = activity.get("photo_url") or None
        staff = activity.get("staff")
        data = self._derive_data(entry_type, activity, mapping)
        timestamp = data.pop("__timestamp_override", None) or timestamp
        ended_at = data.pop("__ended_at", None)
        # Surface the Procare `details` payload as the entry's `notes`
        # field so it shows up in the recent-entries notes row.
        notes = (activity.get("details") or "").strip() or None

        prior = existing.get(source_id)
        if prior is not None:
            # Update path: upstream may have mutated this activity (most
            # commonly "Nap Started" → "Slept from X to Y" once the nap
            # ends, but also added details/photo_url after the fact).
            # We refuse to silently change the entry's *type*, since a
            # type change between updates would indicate a Procare bug
            # or a remapping race — better to log and skip than to
            # corrupt counts/eligibility downstream.
            if prior.type != entry_type:
                _LOGGER.warning(
                    "babytracker: Procare activity %s type changed (%s -> %s); "
                    "leaving existing entry alone",
                    source_id,
                    prior.type,
                    entry_type,
                )
                return
            photo_path = await self._resolve_photo_path(photo_url, prior)
            await self.coordinator.update_imported_entry(
                prior.id,
                timestamp=timestamp,
                ended_at=ended_at,
                notes=notes,
                photo_path=photo_path,
                photo_url=photo_url,
                staff=staff,
                data=data,
            )
            return

        photo_path = await self._resolve_photo_path(photo_url, None)
        entry = Entry(
            id=str(uuid.uuid4()),
            type=entry_type,
            baby_id=self.baby.id,
            timestamp=timestamp,
            ended_at=ended_at,
            source=ENTRY_SOURCE_PROCARE,
            source_entity_id=self.sensor_entity_id,
            source_id=source_id,
            imported_at=now_iso(),
            readonly=self.config.get("mark_readonly", True),
            photo_path=photo_path,
            photo_url=photo_url,
            staff=staff,
            notes=notes,
            data=data,
        )
        await self.coordinator.add_entry(entry)
        existing[source_id] = entry

    async def _resolve_photo_path(
        self, photo_url: str | None, prior: Entry | None
    ) -> str | None:
        """Return the local `photo_path` for an activity's `photo_url`.

        Reuses a previously-downloaded file when the upstream URL is
        unchanged (`prior.photo_url == photo_url` and `prior.photo_path`
        is set); otherwise pulls the bytes from Procare's CDN and
        persists them. Returns None when there's no photo to attach or
        the download failed — the entry's `photo_url` field still
        preserves the upstream pointer either way.
        """
        if not photo_url:
            return None
        if (
            prior is not None
            and prior.photo_url == photo_url
            and prior.photo_path
        ):
            return prior.photo_path
        return await _download_procare_photo(self.hass, photo_url)

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
            data["__ended_at"] = activity.get("timestamp") or now_iso()
            return data
        if entry_type == "sleep":
            data = {"location": self.config.get("daycare_location_label", "daycare")}
            session = mapping.get("session")
            if session == "end":
                data["__ended_at"] = activity.get("timestamp") or now_iso()
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
