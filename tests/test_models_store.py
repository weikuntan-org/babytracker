"""Lightweight tests on the dataclass + storage shape (no HA required)."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(
    0, str(Path(__file__).resolve().parents[1] / "custom_components" / "babytracker")
)

from models import Baby, Entry  # type: ignore  # noqa: E402


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
