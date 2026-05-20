"""`runtime.parse_ts` is the sort key used wherever entries are ordered
chronologically. The function exists because lexicographic sort on raw
`Entry.timestamp` strings is wrong when imported entries (Procare, etc.)
carry a non-UTC offset and HA-generated `now_iso()` entries carry `+00:00`.
"""
from __future__ import annotations

import importlib.util
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "babytracker"


def _load_pure(name: str, rel: str):
    spec = importlib.util.spec_from_file_location(name, ROOT / rel)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


# `runtime.py` has a `from .const import ...` that falls back to bare
# `from const import ...` for test loading — make sure `const` is in
# sys.modules even when this test runs in isolation (pytest tests/test_parse_ts.py).
if "const" not in sys.modules:
    _load_pure("const", "const.py")
runtime = _load_pure("runtime", "runtime.py")


def test_parses_utc_offset() -> None:
    got = runtime.parse_ts("2026-05-20T18:30:00+00:00")
    assert got == datetime(2026, 5, 20, 18, 30, tzinfo=timezone.utc)


def test_parses_zulu_suffix() -> None:
    got = runtime.parse_ts("2026-05-20T18:30:00+00:00")
    assert got == datetime(2026, 5, 20, 18, 30, tzinfo=timezone.utc)


def test_mixed_offsets_sort_chronologically() -> None:
    # The whole point of `parse_ts`: lex sort on the raw strings would put
    # `t_pdt` (= 18:00 UTC) BEFORE `t_utc` (= 13:00 UTC) because
    # `"...11:..."` < `"...13:..."`. Sorted by `parse_ts`, t_utc comes first.
    t_pdt = "2026-05-20T11:00:00-07:00"   # = 18:00:00 UTC
    t_utc = "2026-05-20T13:00:00+00:00"   # = 13:00:00 UTC
    rows = [{"timestamp": t_pdt}, {"timestamp": t_utc}]
    rows.sort(key=lambda r: runtime.parse_ts(r["timestamp"]))
    assert [r["timestamp"] for r in rows] == [t_utc, t_pdt]


def test_reverse_sort_puts_newest_first_across_offsets() -> None:
    # Newest-first sort is what the WS list_entries_in_range payload uses.
    # The PDT timestamp is the newer instant so it must come first.
    rows = [
        {"timestamp": "2026-05-20T13:00:00+00:00"},  # 13:00 UTC
        {"timestamp": "2026-05-20T11:00:00-07:00"},  # 18:00 UTC (newer)
    ]
    rows.sort(key=lambda r: runtime.parse_ts(r["timestamp"]), reverse=True)
    assert rows[0]["timestamp"] == "2026-05-20T11:00:00-07:00"


def test_missing_input_returns_fallback() -> None:
    # Sorts before any reasonable real timestamp so a bad row doesn't crash
    # the sort and doesn't accidentally become "newest" under reverse=True.
    assert runtime.parse_ts(None) == datetime(1970, 1, 1, tzinfo=timezone.utc)
    assert runtime.parse_ts("") == datetime(1970, 1, 1, tzinfo=timezone.utc)


def test_unparseable_input_returns_fallback() -> None:
    assert runtime.parse_ts("not-a-date") == datetime(
        1970, 1, 1, tzinfo=timezone.utc
    )
