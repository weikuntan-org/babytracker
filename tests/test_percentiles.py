"""Tests for the LMS percentile module.

These tests do not require Home Assistant — `percentiles.py` is a pure
Python module that reads JSON files from the data/ folder.
"""
from __future__ import annotations

import math
import sys
from datetime import date
from pathlib import Path

import pytest

# Make the integration importable without HA
sys.path.insert(
    0, str(Path(__file__).resolve().parents[1] / "custom_components" / "babytracker")
)

import percentiles  # type: ignore  # noqa: E402


def test_z_score_l_zero_branch():
    # When L = 0 the formula reduces to ln(X/M)/S
    z = percentiles.z_score(0.0, 10.0, 0.1, 10.0)
    assert z == pytest.approx(0.0, abs=1e-9)
    z = percentiles.z_score(0.0, 10.0, 0.1, math.e * 10.0)
    assert z == pytest.approx(10.0, abs=1e-6)


def test_z_score_l_nonzero_branch():
    # X == M → Z == 0 regardless of L
    assert percentiles.z_score(0.5, 5.0, 0.2, 5.0) == pytest.approx(0.0, abs=1e-9)


def test_percentile_from_z_zero_is_50():
    assert percentiles.percentile(0.0) == pytest.approx(50.0, abs=1e-6)


def test_percentile_from_z_plus_one_is_8413():
    assert percentiles.percentile(1.0) == pytest.approx(84.13, abs=0.05)


def test_source_for_age_handoff():
    assert percentiles.source_for_age(0, 24) == "WHO"
    assert percentiles.source_for_age(800, 24) == "CDC"


def test_lb_to_kg():
    assert percentiles.lb_to_kg(10.0) == pytest.approx(4.5359237)


def test_in_to_cm():
    assert percentiles.in_to_cm(10.0) == pytest.approx(25.4)


def test_bmi():
    assert percentiles.bmi(70.0, 175.0) == pytest.approx(22.86, abs=0.01)


def test_compute_percentile_who_wfa_boys_at_birth_at_median():
    # WHO weight-for-age boys at day 0 has M=3.3464 — measuring 3.3464 kg
    # should yield exactly the 50th percentile (z=0).
    result = percentiles.compute_percentile(
        "weight_for_age", "male", "WHO", 0.0, 3.3464
    )
    assert result is not None
    assert result["percentile"] == pytest.approx(50.0, abs=0.5)
    assert result["z_score"] == pytest.approx(0.0, abs=0.05)
    assert result["source"] == "WHO"


def test_compute_percentile_who_wfa_girls_at_birth_at_median():
    result = percentiles.compute_percentile(
        "weight_for_age", "female", "WHO", 0.0, 3.2322
    )
    assert result is not None
    assert result["percentile"] == pytest.approx(50.0, abs=0.5)


def test_compute_percentile_outside_range_returns_none():
    # CDC weight-for-age starts at 730 days; querying at 365 returns None
    result = percentiles.compute_percentile(
        "weight_for_age", "male", "CDC", 365.0, 12.0
    )
    assert result is None


def test_compute_percentile_interpolation():
    # An age between rows should produce a reasonable percentile
    result = percentiles.compute_percentile(
        "weight_for_age", "male", "WHO", 45.0, 5.0
    )
    assert result is not None
    assert 0.0 <= result["percentile"] <= 100.0


def test_age_days():
    today = date(2026, 5, 17)
    assert percentiles.age_days("2026-05-17", today) == 0
    assert percentiles.age_days("2025-05-17", today) == 365
