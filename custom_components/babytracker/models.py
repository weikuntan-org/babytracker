"""Dataclasses for babytracker (§5)."""
from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

try:
    from .const import ALL_ACTIVITIES, ALL_FEEDING_METHODS, ENTRY_SOURCE_USER
except ImportError:  # pragma: no cover — supports bare-module loading in tests
    from const import ALL_ACTIVITIES, ALL_FEEDING_METHODS, ENTRY_SOURCE_USER  # type: ignore[no-redef]


@dataclass
class Baby:
    """One tracked baby (§4.1)."""

    id: str
    slug: str
    name: str
    birthday: str  # YYYY-MM-DD
    sex: str  # "male" | "female"
    avatar_url: str | None = None
    enabled_activities: list[str] = field(default_factory=lambda: list(ALL_ACTIVITIES))
    enabled_feeding_methods: list[str] = field(
        default_factory=lambda: list(ALL_FEEDING_METHODS)
    )
    archived: bool = False
    importer: dict[str, Any] | None = None
    # Bumped whenever the integration adds new activity types so an
    # already-configured baby can be migrated to know about them. The
    # coordinator runs the migration on load; user opt-outs after migration
    # stick (next load already has the activity in the list, so the
    # migration sees nothing missing).
    schema_version: int = 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "slug": self.slug,
            "name": self.name,
            "birthday": self.birthday,
            "sex": self.sex,
            "avatar_url": self.avatar_url,
            "enabled_activities": list(self.enabled_activities),
            "enabled_feeding_methods": list(self.enabled_feeding_methods),
            "archived": self.archived,
            "importer": dict(self.importer) if self.importer else None,
            "schema_version": self.schema_version,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Baby:
        return cls(
            id=data["id"],
            slug=data["slug"],
            name=data["name"],
            birthday=data["birthday"],
            sex=data["sex"],
            avatar_url=data.get("avatar_url"),
            # Use `data.get(key, default)` rather than `data.get(key) or default`
            # so a stored empty list (user disabled everything) survives a
            # reload instead of being silently replaced with ALL_ACTIVITIES.
            enabled_activities=list(
                data["enabled_activities"]
                if "enabled_activities" in data
                else ALL_ACTIVITIES
            ),
            enabled_feeding_methods=list(
                data["enabled_feeding_methods"]
                if "enabled_feeding_methods" in data
                else ALL_FEEDING_METHODS
            ),
            archived=bool(data.get("archived", False)),
            importer=data.get("importer"),
            schema_version=int(data.get("schema_version", 0)),
        )


@dataclass
class Entry:
    """One logged event (§5)."""

    id: str
    type: str
    baby_id: str | None  # null only for pumping
    timestamp: str  # ISO-8601
    ended_at: str | None = None
    source: str = "user"
    photo_path: str | None = None
    notes: str | None = None
    revised_at: str | None = None
    data: dict[str, Any] = field(default_factory=dict)

    # Importer-only fields
    source_entity_id: str | None = None
    source_id: str | None = None
    imported_at: str | None = None
    readonly: bool = False
    photo_url: str | None = None
    staff: str | None = None
    # Video clip attached to the entry. Procare video activities expose
    # `photo_url` (poster JPG) + `video_url` (actual clip); we reuse
    # `photo_path` for the poster and stash the locally-persisted clip
    # under `video_path`. Both fields stay importer-only for now — the
    # user-upload WS flow only supports photos.
    video_path: str | None = None
    video_url: str | None = None

    def to_dict(self) -> dict[str, Any]:
        out: dict[str, Any] = {
            "id": self.id,
            "type": self.type,
            "baby_id": self.baby_id,
            "timestamp": self.timestamp,
            "ended_at": self.ended_at,
            "source": self.source,
            "photo_path": self.photo_path,
            "notes": self.notes,
            "revised_at": self.revised_at,
            "data": dict(self.data),
        }
        if self.source != "user":
            out.update(
                {
                    "source_entity_id": self.source_entity_id,
                    "source_id": self.source_id,
                    "imported_at": self.imported_at,
                    "readonly": self.readonly,
                    "photo_url": self.photo_url,
                    "staff": self.staff,
                    "video_path": self.video_path,
                    "video_url": self.video_url,
                }
            )
        return out

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Entry:
        return cls(
            id=data["id"],
            type=data["type"],
            baby_id=data.get("baby_id"),
            timestamp=data["timestamp"],
            ended_at=data.get("ended_at"),
            source=data.get("source", "user"),
            photo_path=data.get("photo_path"),
            notes=data.get("notes"),
            revised_at=data.get("revised_at"),
            data=dict(data.get("data") or {}),
            source_entity_id=data.get("source_entity_id"),
            source_id=data.get("source_id"),
            imported_at=data.get("imported_at"),
            readonly=bool(data.get("readonly", False)),
            photo_url=data.get("photo_url"),
            staff=data.get("staff"),
            video_path=data.get("video_path"),
            video_url=data.get("video_url"),
        )

    @classmethod
    def new(
        cls,
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
        """Build a user-flow Entry with a fresh UUID and defaulted timestamp.

        Importer flows (Procare) construct `Entry(...)` directly because
        they need to set importer-only fields (`source_entity_id`,
        `source_id`, `imported_at`, `readonly`, `photo_url`, `staff`)
        that don't apply to user-initiated entries.

        Photo-path validation lives at the service boundary, not here —
        a malformed `photo_path` passed in by an importer is the
        importer's responsibility to catch.
        """
        return cls(
            id=str(uuid.uuid4()),
            type=type_,
            baby_id=baby_id,
            timestamp=timestamp or datetime.now(tz=timezone.utc).isoformat(),
            ended_at=ended_at,
            source=source,
            photo_path=photo_path,
            notes=notes or None,
            data=dict(data or {}),
        )


def entry_to_card_dict(entry: Entry, *, include_baby_id: bool = False) -> dict[str, Any]:
    """Card-facing serialization of an `Entry`.

    Used by the WS `list_entries_in_range` payload and the
    `RecentEntriesSensor` attribute. Distinct from `Entry.to_dict()`
    (the store-shape serialization) in two ways:

    * Always emits the importer-only fields (`readonly`, `photo_url`,
      `staff`) so the JS card can render imported entries without
      having to branch on `source != "user"`.
    * Omits `baby_id` and `revised_at` by default — the WS payload is
      already scoped to a single baby, and the card doesn't read
      `revised_at`. Set `include_baby_id=True` for the
      `GlobalRecentEntriesSensor` shape.
    """
    out: dict[str, Any] = {
        "id": entry.id,
        "type": entry.type,
        "timestamp": entry.timestamp,
        "ended_at": entry.ended_at,
        "source": entry.source,
        "readonly": entry.readonly,
        "data": dict(entry.data),
        "photo_path": entry.photo_path,
        "photo_url": entry.photo_url,
        "video_path": entry.video_path,
        "video_url": entry.video_url,
        "staff": entry.staff,
        "notes": entry.notes,
    }
    if include_baby_id:
        out["baby_id"] = entry.baby_id
    return out
