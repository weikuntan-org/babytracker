"""Tests for the vaccine schedule shape."""
from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "babytracker"


def test_us_cdc_schedule_loads():
    raw = (ROOT / "data" / "vaccines" / "us_cdc.json").read_text("utf-8")
    schedule = json.loads(raw)
    assert schedule["source"] == "US CDC"
    assert any(d["name"] == "MMR" for d in schedule["doses"])
    # Every dose has required fields
    for dose in schedule["doses"]:
        assert "name" in dose and "dose_number" in dose and "target_age_days" in dose


def test_uk_nhs_schedule_loads():
    raw = (ROOT / "data" / "vaccines" / "uk_nhs.json").read_text("utf-8")
    schedule = json.loads(raw)
    assert schedule["source"] == "UK NHS"
    assert any(d["name"].startswith("6-in-1") for d in schedule["doses"])
