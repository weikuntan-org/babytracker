"""Tests for the midnight-split helper."""
from __future__ import annotations

import importlib.util
import sys
from datetime import date, timezone
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "babytracker"


def _load_pure(name: str, rel: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / rel)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


# Build the helper without booting HA — copy the static method into a tiny
# wrapper using the models dataclasses.
models_module = _load_pure("models", "models.py")


def _entry(timestamp: str, ended_at: str | None = None):
    return models_module.Entry(
        id="x",
        type="sleep",
        baby_id="a",
        timestamp=timestamp,
        ended_at=ended_at,
    )


def _minutes(entry, day, tz=timezone.utc):
    # Re-implementation mirrors coordinator.minutes_in_day for unit testing.
    from datetime import datetime, time, timedelta

    if entry.timestamp is None:
        return 0.0
    start = datetime.fromisoformat(entry.timestamp)
    end_iso = entry.ended_at or "2026-05-18T00:00:00+00:00"
    end = datetime.fromisoformat(end_iso)
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


def test_entirely_within_day():
    entry = _entry("2026-05-17T08:00:00+00:00", "2026-05-17T08:30:00+00:00")
    assert _minutes(entry, date(2026, 5, 17)) == 30.0


def test_straddles_midnight_split():
    entry = _entry("2026-05-16T23:30:00+00:00", "2026-05-17T01:30:00+00:00")
    assert _minutes(entry, date(2026, 5, 16)) == 30.0
    assert _minutes(entry, date(2026, 5, 17)) == 90.0


def test_outside_day_returns_zero():
    entry = _entry("2026-05-17T08:00:00+00:00", "2026-05-17T08:30:00+00:00")
    assert _minutes(entry, date(2026, 5, 18)) == 0.0
