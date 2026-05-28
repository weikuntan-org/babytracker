"""Lightweight tests on the dataclass + storage shape (no HA required)."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(
    0, str(Path(__file__).resolve().parents[1] / "custom_components" / "babytracker")
)

from models import Baby, Entry, entry_to_card_dict  # type: ignore  # noqa: E402


def test_baby_round_trip():
    baby = Baby(
        id="abc",
        slug="ava",
        name="Ava",
        birthday="2025-12-01",
        sex="female",
    )
    raw = baby.to_dict()
    rebuilt = Baby.from_dict(raw)
    assert rebuilt == baby


def test_baby_defaults_include_all_activities():
    baby = Baby.from_dict(
        {
            "id": "x",
            "slug": "ben",
            "name": "Ben",
            "birthday": "2024-01-01",
            "sex": "male",
        }
    )
    assert "feeding" in baby.enabled_activities
    assert "vaccine" in baby.enabled_activities
    assert "bottle" in baby.enabled_feeding_methods


def test_entry_round_trip_user_source():
    entry = Entry(
        id="e1",
        type="diaper",
        baby_id="abc",
        timestamp="2026-05-17T08:00:00+00:00",
        data={"kind": "wet"},
    )
    raw = entry.to_dict()
    rebuilt = Entry.from_dict(raw)
    assert rebuilt == entry
    # User-source entries do not get importer fields in the serialised form
    assert "source_id" not in raw


def test_entry_round_trip_procare_source():
    entry = Entry(
        id="e2",
        type="diaper",
        baby_id="abc",
        timestamp="2026-05-17T08:00:00+00:00",
        source="procare",
        source_entity_id="sensor.ava_activities",
        source_id="pc-123",
        imported_at="2026-05-17T08:01:00+00:00",
        readonly=True,
        data={"kind": "wet"},
    )
    raw = entry.to_dict()
    assert raw["source_id"] == "pc-123"
    rebuilt = Entry.from_dict(raw)
    assert rebuilt == entry


def test_entry_new_defaults_timestamp_and_source():
    entry = Entry.new(type_="diaper", baby_id="abc", data={"kind": "wet"})
    assert entry.id  # uuid stamped
    assert entry.type == "diaper"
    assert entry.timestamp  # auto-defaulted
    assert entry.source == "user"
    assert entry.data == {"kind": "wet"}
    # `data` should be a fresh dict, not the caller's reference
    src = {"kind": "wet"}
    e2 = Entry.new(type_="diaper", baby_id="abc", data=src)
    src["mutated"] = True
    assert "mutated" not in e2.data


def test_entry_new_passthrough_timestamp_and_notes():
    entry = Entry.new(
        type_="sleep",
        baby_id="abc",
        timestamp="2026-05-17T08:00:00+00:00",
        ended_at="2026-05-17T09:00:00+00:00",
        notes="",
    )
    assert entry.timestamp == "2026-05-17T08:00:00+00:00"
    assert entry.ended_at == "2026-05-17T09:00:00+00:00"
    # empty-string notes should collapse to None — matches the prior
    # `_build_entry` contract that services depended on.
    assert entry.notes is None


def test_entry_to_card_dict_shape():
    entry = Entry(
        id="e1",
        type="diaper",
        baby_id="abc",
        timestamp="2026-05-17T08:00:00+00:00",
        data={"kind": "wet"},
        notes="changed mid-nap",
    )
    payload = entry_to_card_dict(entry)
    # All 13 card-facing fields present, baby_id omitted by default.
    assert set(payload) == {
        "id",
        "type",
        "timestamp",
        "ended_at",
        "source",
        "readonly",
        "data",
        "photo_path",
        "photo_url",
        "video_path",
        "video_url",
        "staff",
        "notes",
    }
    assert payload["data"] == {"kind": "wet"}
    # `data` is shallow-copied so callers can't mutate the entry.
    payload["data"]["mutated"] = True
    assert "mutated" not in entry.data


def test_entry_to_card_dict_with_baby_id():
    entry = Entry(
        id="e1",
        type="diaper",
        baby_id="abc",
        timestamp="2026-05-17T08:00:00+00:00",
    )
    payload = entry_to_card_dict(entry, include_baby_id=True)
    assert payload["baby_id"] == "abc"
