"""Dataclasses for babytracker (§5)."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

try:
    from .const import ALL_ACTIVITIES, ALL_FEEDING_METHODS
except ImportError:  # pragma: no cover — supports bare-module loading in tests
    from const import ALL_ACTIVITIES, ALL_FEEDING_METHODS  # type: ignore[no-redef]


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
            enabled_activities=list(
                data.get("enabled_activities") or list(ALL_ACTIVITIES)
            ),
            enabled_feeding_methods=list(
                data.get("enabled_feeding_methods") or list(ALL_FEEDING_METHODS)
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
        )
