"""Smoke test for the export module (no HA required for HTML/CSV writers)."""
from __future__ import annotations

import importlib.util
import sys
from datetime import date
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "babytracker"


def _load(name: str, relative: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / relative)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


# The whole-module import path requires HA, but the private writer helpers
# do not. Pull them directly from source so we can exercise them.
models = _load("models", "models.py")
exporter = _load("export", "export.py")


def _baby():
    return models.Baby(
        id="abc",
        slug="ava",
        name="Ava",
        birthday="2025-12-01",
        sex="female",
    )


def _diaper_entry(ts: str):
    return models.Entry(
        id="e",
        type="diaper",
        baby_id="abc",
        timestamp=ts,
        data={"kind": "wet"},
    )


def test_resolve_range_defaults_to_last_90_days():
    start, end = exporter._resolve_range(None, None)  # noqa: SLF001
    assert (end - start).days == 89


def test_resolve_range_swaps_if_inverted():
    start, end = exporter._resolve_range("2026-05-10", "2026-05-01")  # noqa: SLF001
    assert start <= end


def test_filter_entries_respects_section():
    entries = [_diaper_entry("2026-05-15T10:00:00+00:00")]
    out = exporter._filter_entries(  # noqa: SLF001
        entries,
        _baby(),
        date(2026, 5, 1),
        date(2026, 5, 31),
        {"diapers"},
    )
    assert len(out) == 1


def test_write_csv(tmp_path):
    rows = [{"id": "1", "type": "diaper", "data.kind": "wet"}]
    out = tmp_path / "ava.csv"
    exporter._write_csv(out, rows)  # noqa: SLF001
    content = out.read_bytes()
    # UTF-8 BOM
    assert content.startswith(b"\xef\xbb\xbf")
    assert b"diaper" in content


def test_write_html(tmp_path):
    out = tmp_path / "ava.html"
    exporter._write_html(  # noqa: SLF001
        out,
        _baby(),
        {"diapers": [_diaper_entry("2026-05-15T10:00:00+00:00")]},
    )
    html = out.read_text("utf-8")
    assert "<h1>babytracker — Ava</h1>" in html
    assert "diapers" in html
