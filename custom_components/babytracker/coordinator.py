"""Mutation coordinator (§8.2, §12 #25)."""
from __future__ import annotations

import asyncio
import logging
import uuid
from collections.abc import Callable
from datetime import date, datetime, time, timedelta, timezone
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import slugify

from .const import (
    ALL_ACTIVITIES,
    ALL_FEEDING_METHODS,
    CURRENT_BABY_SCHEMA_VERSION,
    DOMAIN,
    RECENT_ENTRIES_CAP,
    RESERVED_SLUGS,
    SIGNAL_DATA_UPDATED,
)
from .models import Baby, Entry
from .store import BabytrackerStore

_LOGGER = logging.getLogger(__name__)


def _normalize_name(value: str) -> str:
    """Trim + uppercase the first character. Preserves the rest of the
    string verbatim so casing like "McKenzie" or initials like "TJ" stay
    intact — only the leading character is touched.
    """
    trimmed = (value or "").strip()
    if not trimmed:
        return trimmed
    return trimmed[:1].upper() + trimmed[1:]


class BabytrackerCoordinator:
    """Owns the in-memory model + persistence (§8.2)."""

    def __init__(self, hass: HomeAssistant, store: BabytrackerStore) -> None:
        self.hass = hass
        self._store = store
        self._lock = asyncio.Lock()
        self._listeners: list[Callable[[], None]] = []
        self._babies: list[Baby] = []
        self._entries: list[Entry] = []
        # Tracks per-baby daycare presence (§4.6); slug -> bool
        self._at_daycare: dict[str, bool] = {}
        # Unmapped Procare titles, deduped (§15 #21)
        self._unmapped_procare_titles: set[str] = set()

    # ------------------------------------------------------------------
    # Load / accessors
    # ------------------------------------------------------------------
    async def async_load(self) -> None:
        data = self._store.data
        self._babies = [Baby.from_dict(b) for b in data.get("babies", [])]
        self._entries = [Entry.from_dict(e) for e in data.get("entries", [])]
        # Bring at_daycare back from importer config if any
        for baby in self._babies:
            self._at_daycare.setdefault(baby.slug, False)
        names_changed = self._normalize_baby_names()
        if self._migrate_babies() or names_changed:
            # Migration touched at least one baby — persist so the change
            # survives a restart and we don't re-run the migration next time.
            await self._async_persist()

    def _normalize_baby_names(self) -> bool:
        """One-shot backfill: ensure every stored baby name starts with an
        uppercase letter. Idempotent — names already capitalized are left
        untouched, so this runs cheaply on every load.
        """
        changed = False
        for baby in self._babies:
            normalized = _normalize_name(baby.name)
            if normalized != baby.name:
                _LOGGER.info(
                    "babytracker: normalized baby name %r -> %r",
                    baby.name,
                    normalized,
                )
                baby.name = normalized
                changed = True
        return changed

    def _migrate_babies(self) -> bool:
        """Bring older babies up to CURRENT_BABY_SCHEMA_VERSION.

        Per-baby: union enabled_activities with the current ALL_ACTIVITIES
        list. New activity types added in later releases (walk in v0.x,
        other in v0.y) end up enabled on existing babies that were
        configured before those types existed. Users can disable them via
        the options flow; once schema_version reaches the current version
        the migration won't run again.
        """
        changed = False
        for baby in self._babies:
            if baby.schema_version >= CURRENT_BABY_SCHEMA_VERSION:
                continue
            existing = set(baby.enabled_activities)
            additions = [a for a in ALL_ACTIVITIES if a not in existing]
            if additions:
                baby.enabled_activities = list(baby.enabled_activities) + additions
                _LOGGER.info(
                    "babytracker: migrated %s enabled_activities += %s",
                    baby.slug,
                    additions,
                )
            baby.schema_version = CURRENT_BABY_SCHEMA_VERSION
            changed = True
        return changed

    @property
    def babies(self) -> list[Baby]:
        return list(self._babies)

    @property
    def entries(self) -> list[Entry]:
        return list(self._entries)

    def baby_by_id(self, baby_id: str) -> Baby | None:
        for baby in self._babies:
            if baby.id == baby_id:
                return baby
        return None

    def baby_by_slug(self, slug: str) -> Baby | None:
        norm = slug.strip().lower()
        for baby in self._babies:
            if baby.slug == norm:
                return baby
        return None

    def at_daycare(self, baby: Baby) -> bool:
        return self._at_daycare.get(baby.slug, False)

    def get_unmapped_procare_titles(self) -> list[str]:
        return sorted(self._unmapped_procare_titles)

    # ------------------------------------------------------------------
    # Listeners
    # ------------------------------------------------------------------
    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(listener)

        def remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return remove

    def _notify(self) -> None:
        for listener in list(self._listeners):
            try:
                listener()
            except Exception:  # noqa: BLE001
                _LOGGER.exception("Listener error")
        async_dispatcher_send(self.hass, SIGNAL_DATA_UPDATED)

    # ------------------------------------------------------------------
    # Persistence helper (called under lock)
    # ------------------------------------------------------------------
    def _serialize(self) -> dict[str, Any]:
        return {
            "version": self._store.data.get("version", 1),
            "babies": [b.to_dict() for b in self._babies],
            "entries": [e.to_dict() for e in self._entries],
        }

    async def _async_persist(self) -> None:
        self._store.set_data(self._serialize())
        await self._store.async_save()

    # ------------------------------------------------------------------
    # Slug / validation helpers
    # ------------------------------------------------------------------
    def slug_for_name(self, name: str) -> str:
        return slugify(name)

    def slug_collides(
        self, slug: str, *, ignore_baby_id: str | None = None
    ) -> bool:
        norm = slug.lower()
        if norm in RESERVED_SLUGS:
            return True
        for baby in self._babies:
            if baby.archived:
                continue
            if ignore_baby_id is not None and baby.id == ignore_baby_id:
                continue
            if baby.slug == norm:
                return True
        return False

    # ------------------------------------------------------------------
    # Baby mutations
    # ------------------------------------------------------------------
    async def add_baby(
        self,
        *,
        name: str,
        birthday: str,
        sex: str,
        enabled_activities: list[str] | None = None,
        enabled_feeding_methods: list[str] | None = None,
        avatar_url: str | None = None,
    ) -> Baby:
        async with self._lock:
            normalized_name = _normalize_name(name)
            slug = self.slug_for_name(normalized_name)
            baby = Baby(
                id=str(uuid.uuid4()),
                slug=slug,
                name=normalized_name,
                birthday=birthday,
                sex=sex,
                avatar_url=avatar_url,
                enabled_activities=list(enabled_activities or ALL_ACTIVITIES),
                enabled_feeding_methods=list(
                    enabled_feeding_methods or ALL_FEEDING_METHODS
                ),
                # Stamp the current schema version on creation so the
                # one-shot "union back ALL_ACTIVITIES" migration in
                # `_migrate_babies` doesn't run on this baby. Without
                # this, a user who edits enabled_activities (or feeding
                # methods) before the first restart watches their
                # disabled buttons re-appear when the migration runs.
                schema_version=CURRENT_BABY_SCHEMA_VERSION,
            )
            self._babies.append(baby)
            self._at_daycare[baby.slug] = False
            await self._async_persist()
        self._notify()
        return baby

    async def update_baby(
        self,
        baby_id: str,
        *,
        name: str | None = None,
        birthday: str | None = None,
        sex: str | None = None,
        avatar_url: str | None = None,
        enabled_activities: list[str] | None = None,
        enabled_feeding_methods: list[str] | None = None,
    ) -> Baby:
        async with self._lock:
            baby = self.baby_by_id(baby_id)
            if baby is None:
                raise ValueError(f"unknown baby_id {baby_id}")
            if name is not None:
                # slug stays stable (§4.1, §12 #22)
                baby.name = _normalize_name(name)
            if birthday is not None:
                baby.birthday = birthday
            if sex is not None:
                baby.sex = sex
            if avatar_url is not None:
                baby.avatar_url = avatar_url or None
            if enabled_activities is not None:
                baby.enabled_activities = list(enabled_activities)
            if enabled_feeding_methods is not None:
                baby.enabled_feeding_methods = list(enabled_feeding_methods)
            await self._async_persist()
        self._notify()
        return baby

    async def archive_baby(self, baby_id: str) -> Baby:
        async with self._lock:
            baby = self.baby_by_id(baby_id)
            if baby is None:
                raise ValueError(f"unknown baby_id {baby_id}")
            baby.archived = True
            await self._async_persist()
        self._notify()
        return baby

    async def unarchive_baby(self, baby_id: str) -> Baby:
        async with self._lock:
            baby = self.baby_by_id(baby_id)
            if baby is None:
                raise ValueError(f"unknown baby_id {baby_id}")
            baby.archived = False
            await self._async_persist()
        self._notify()
        return baby

    async def purge_baby(self, baby_id: str) -> None:
        async with self._lock:
            baby = self.baby_by_id(baby_id)
            if baby is None:
                raise ValueError(f"unknown baby_id {baby_id}")
            self._babies = [b for b in self._babies if b.id != baby_id]
            self._entries = [e for e in self._entries if e.baby_id != baby_id]
            self._at_daycare.pop(baby.slug, None)
            await self._async_persist()
        self._notify()

    async def set_baby_importer(
        self, baby_id: str, importer: dict[str, Any] | None
    ) -> Baby:
        async with self._lock:
            baby = self.baby_by_id(baby_id)
            if baby is None:
                raise ValueError(f"unknown baby_id {baby_id}")
            baby.importer = importer
            await self._async_persist()
        self._notify()
        return baby

    # ------------------------------------------------------------------
    # Entry mutations
    # ------------------------------------------------------------------
    async def add_entry(self, entry: Entry) -> Entry:
        async with self._lock:
            self._entries.append(entry)
            await self._async_persist()
        self._notify()
        return entry

    async def edit_entry(self, entry_id: str, fields: dict[str, Any]) -> Entry:
        async with self._lock:
            entry = next((e for e in self._entries if e.id == entry_id), None)
            if entry is None:
                raise ValueError(f"unknown entry_id {entry_id}")
            # mutable: timestamp, ended_at, photo_path, notes, fields inside data
            mutable = {"timestamp", "ended_at", "photo_path", "notes", "data"}
            for key, value in fields.items():
                if key not in mutable:
                    raise ValueError(f"field {key} is immutable")
                if key == "data":
                    if not isinstance(value, dict):
                        raise ValueError("data must be a dict")
                    entry.data = {**entry.data, **value}
                else:
                    setattr(entry, key, value)
            entry.revised_at = datetime.now(tz=timezone.utc).isoformat()
            if entry.readonly:
                entry.readonly = False
            await self._async_persist()
        self._notify()
        return entry

    async def delete_entry(self, entry_id: str) -> None:
        async with self._lock:
            before = len(self._entries)
            self._entries = [e for e in self._entries if e.id != entry_id]
            if len(self._entries) == before:
                raise ValueError(f"unknown entry_id {entry_id}")
            await self._async_persist()
        self._notify()

    def open_session(self, baby_id: str, entry_type: str) -> Entry | None:
        for entry in reversed(self._entries):
            if (
                entry.type == entry_type
                and entry.baby_id == baby_id
                and entry.ended_at is None
            ):
                return entry
        return None

    async def close_session(
        self,
        entry_id: str,
        *,
        ended_at: str,
        notes: str | None = None,
        data_updates: dict[str, Any] | None = None,
    ) -> Entry:
        async with self._lock:
            entry = next((e for e in self._entries if e.id == entry_id), None)
            if entry is None:
                raise ValueError(f"unknown entry_id {entry_id}")
            entry.ended_at = ended_at
            if notes:
                entry.notes = notes
            if data_updates:
                entry.data = {**entry.data, **data_updates}
            await self._async_persist()
        self._notify()
        return entry

    # ------------------------------------------------------------------
    # Importer hooks
    # ------------------------------------------------------------------
    async def set_at_daycare(self, baby: Baby, value: bool) -> None:
        async with self._lock:
            self._at_daycare[baby.slug] = bool(value)
        self._notify()

    def record_unmapped_procare_title(self, title: str) -> None:
        if title and title not in self._unmapped_procare_titles:
            self._unmapped_procare_titles.add(title)
            self._notify()

    async def update_imported_entry(
        self,
        entry_id: str,
        *,
        timestamp: str,
        ended_at: str | None,
        notes: str | None,
        photo_path: str | None,
        photo_url: str | None,
        staff: str | None,
        data: dict[str, Any],
    ) -> Entry | None:
        """Re-sync an imported entry with the latest upstream state.

        Used by the importer pipeline when an activity's `source_id` is
        already known: instead of dedup-and-skip, we patch the entry in
        place so updates upstream (e.g. a "Nap Started" turning into
        "Slept from X to Y" once it ends) propagate to our log.

        Returns the entry if anything actually changed, or None if the
        upstream state matches what we already have (so callers can
        avoid superfluous `_notify` fan-outs).

        Intentionally narrow vs `edit_entry`:
        - `readonly` is preserved (imports stay readonly by default).
        - `revised_at` is NOT bumped — `imported_at` is, because this
          isn't a user edit.
        - `id`, `baby_id`, `type`, `source`, `source_id`,
          `source_entity_id` are immutable here.
        - `data` is replaced wholesale (upstream is authoritative for
          imported entries), not merged.
        """
        async with self._lock:
            entry = next((e for e in self._entries if e.id == entry_id), None)
            if entry is None:
                return None
            new_data = dict(data)
            unchanged = (
                entry.timestamp == timestamp
                and entry.ended_at == ended_at
                and entry.notes == notes
                and entry.photo_path == photo_path
                and entry.photo_url == photo_url
                and entry.staff == staff
                and entry.data == new_data
            )
            if unchanged:
                return None
            entry.timestamp = timestamp
            entry.ended_at = ended_at
            entry.notes = notes
            entry.photo_path = photo_path
            entry.photo_url = photo_url
            entry.staff = staff
            entry.data = new_data
            entry.imported_at = datetime.now(tz=timezone.utc).isoformat()
            await self._async_persist()
        self._notify()
        return entry

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------
    def entries_by_baby(self, baby_id: str) -> list[Entry]:
        return [e for e in self._entries if e.baby_id == baby_id]

    def entry_by_id(self, entry_id: str) -> Entry | None:
        for e in self._entries:
            if e.id == entry_id:
                return e
        return None

    def recent_entries(self, baby_id: str | None = None) -> list[Entry]:
        if baby_id is None:
            pool = list(self._entries)
        else:
            pool = [e for e in self._entries if e.baby_id == baby_id]
        pool.sort(key=lambda e: e.timestamp, reverse=True)
        return pool[:RECENT_ENTRIES_CAP]

    def latest_growth_data(self, baby_id: str) -> dict[str, Any]:
        for entry in sorted(self._entries, key=lambda e: e.timestamp, reverse=True):
            if entry.baby_id == baby_id and entry.type == "growth":
                return entry.data
        return {}

    def minutes_in_day(
        self,
        entry: Entry,
        day: date,
        tz: Any,
    ) -> float:
        """Return minutes of a timed session within the local calendar day."""
        if entry.timestamp is None:
            return 0.0
        try:
            start = datetime.fromisoformat(entry.timestamp)
        except ValueError:
            return 0.0
        end_iso = entry.ended_at or datetime.now(tz=start.tzinfo or timezone.utc).isoformat()
        try:
            end = datetime.fromisoformat(end_iso)
        except ValueError:
            return 0.0
        if start.tzinfo is None:
            start = start.replace(tzinfo=timezone.utc)
        if end.tzinfo is None:
            end = end.replace(tzinfo=timezone.utc)
        day_start = datetime.combine(day, time(0, 0), tz)
        day_end = datetime.combine(day + timedelta(days=1), time(0, 0), tz)
        clip_start = max(start, day_start)
        clip_end = min(end, day_end)
        if clip_end <= clip_start:
            return 0.0
        return (clip_end - clip_start).total_seconds() / 60.0
