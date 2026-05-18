"""Tests for the Procare title mapping loader."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(
    0,
    str(
        Path(__file__).resolve().parents[1]
        / "custom_components"
        / "babytracker"
        / "importers"
    ),
)
# Adjust path so the module can import its sibling without going through HA's
# `custom_components.babytracker` package.
import importlib.util

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "babytracker"


def _load(module_name: str, relative: str):
    spec = importlib.util.spec_from_file_location(module_name, ROOT / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


mappings_module = _load("procare_mappings", "importers/procare_mappings.py")
load_mappings = mappings_module.load_mappings
match_title = mappings_module.match_title


def test_load_mappings_has_default_entries():
    rows = load_mappings()
    assert any(r.get("type") == "diaper" for r in rows)
    assert any(r.get("type") == "feeding" for r in rows)
    assert any(r.get("type") == "sleep" for r in rows)


def test_match_diaper_wet():
    rows = load_mappings()
    m = match_title(rows, "Diaper: Wet")
    assert m is not None and m["type"] == "diaper" and m["kind"] == "wet"


def test_match_diaper_dirty_variants():
    rows = load_mappings()
    for title in ("Diaper: BM", "Diaper: Dirty"):
        m = match_title(rows, title)
        assert m is not None and m["type"] == "diaper" and m["kind"] == "dirty"


def test_match_bottle_feeding():
    rows = load_mappings()
    m = match_title(rows, "Bottle: 60 ml")
    assert m is not None and m["type"] == "feeding" and m["method"] == "bottle"


def test_match_meal_feeding():
    rows = load_mappings()
    m = match_title(rows, "Meal: Sweet potato")
    assert m is not None and m["type"] == "feeding" and m["method"] == "solids"


def test_match_sleep_start_end():
    rows = load_mappings()
    start = match_title(rows, "Nap Started at 10:00")
    end = match_title(rows, "Nap Ended at 11:30")
    assert start and start["session"] == "start"
    assert end and end["session"] == "end"


def test_match_unknown_returns_none():
    rows = load_mappings()
    assert match_title(rows, "Photo of cool drawing") is None
