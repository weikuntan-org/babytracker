"""Tests for the Procare importer's update-or-create flow.

The importer used to dedup by `(source, source_id)` and silently skip
on a repeat hit, so when Procare mutated an in-place activity record
(most commonly a "Nap Started" later becoming "Slept from X to Y" once
the nap ended) the local entry stayed frozen at the initial state.

These tests exercise the new code path through the public importer
`_process_activity` entry point: a repeat activity with mutated state
must patch the existing entry instead of creating a duplicate, and a
truly-unchanged repeat must be a no-op (no `imported_at` bump). They
also pin the Procare-photo-download behaviour: photo_url present →
local `photo_path`, URL stable → no re-download, URL changed → new
download, URL cleared → photo_path cleared, download failure →
photo_url preserved as a diagnostic pointer but photo_path null.
"""
from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant

from custom_components.babytracker.coordinator import BabytrackerCoordinator
from custom_components.babytracker.importers import procare as procare_module
from custom_components.babytracker.importers.procare import (
    ProcareImporter,
    _existing_by_source_id,
)
from custom_components.babytracker.models import Baby
from custom_components.babytracker.store import BabytrackerStore


_MAPPINGS = [
    {"pattern": r"^Nap\s+Started", "type": "sleep", "session": "start"},
    {
        "pattern": r"^Slept\s+from\s+.*\s+to\s+",
        "type": "sleep",
        "session": "range",
    },
    {"pattern": r"^Diaper.*Wet", "type": "diaper", "kind": "wet"},
]


async def _make_importer(
    hass: HomeAssistant,
) -> tuple[ProcareImporter, BabytrackerCoordinator, Baby]:
    store = BabytrackerStore(hass)
    await store.async_load()
    coord = BabytrackerCoordinator(hass, store)
    await coord.async_load()
    baby = Baby(
        id="baby-1",
        slug="ava",
        name="Ava",
        birthday="2025-01-01",
        sex="female",
        enabled_activities=["sleep", "diaper", "feeding", "other"],
        enabled_feeding_methods=["bottle", "solids"],
    )
    # Direct insert — config-flow path would be heavier than this test needs.
    coord._babies.append(baby)
    importer = ProcareImporter(
        hass=hass,
        coordinator=coord,
        baby=baby,
        config={
            "source_entity_id": "sensor.ava_activities",
            "import_types": ["sleep", "diaper", "feeding", "other"],
            "mode": "inference_window",
            "mark_readonly": True,
        },
        mappings=_MAPPINGS,
    )
    return importer, coord, baby


@pytest.mark.asyncio
async def test_repeat_activity_with_mutated_title_updates_existing_entry(
    hass: HomeAssistant,
) -> None:
    importer, coord, baby = await _make_importer(hass)

    # Initial "Nap Started" — creates an open sleep session.
    await importer._process_activity(
        {
            "id": "act-1",
            "title": "Nap Started",
            "timestamp": "2026-05-19T13:00:00+00:00",
            "details": "Drowsy",
        },
        {},
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    initial = entries[0]
    assert initial.type == "sleep"
    assert initial.ended_at is None
    assert initial.notes == "Drowsy"
    assert initial.source_id == "act-1"
    assert initial.readonly is True
    initial_id = initial.id

    # Procare later mutates the same activity to a completed range.
    await importer._process_activity(
        {
            "id": "act-1",
            "title": "Slept from 1:00 PM to 2:30 PM",
            "timestamp": "2026-05-19T13:00:00+00:00",
            "details": "Slept well",
        },
        _existing_by_source_id(baby, coord),
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1, "update must not duplicate the entry"
    after = entries[0]
    assert after.id == initial_id, "entry id should be stable across updates"
    assert after.ended_at is not None, "Slept-from-X-to-Y must set ended_at"
    assert after.notes == "Slept well"
    # Readonly stays true — re-imports are not user edits.
    assert after.readonly is True


@pytest.mark.asyncio
async def test_unchanged_repeat_is_a_noop(hass: HomeAssistant) -> None:
    importer, coord, baby = await _make_importer(hass)

    activity = {
        "id": "act-2",
        "title": "Diaper: Wet",
        "timestamp": "2026-05-19T13:00:00+00:00",
        "details": "",
    }
    await importer._process_activity(activity, {})
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    original_imported_at = entries[0].imported_at

    # Same activity re-emitted with no change → `update_imported_entry`
    # should detect equality and short-circuit before bumping
    # `imported_at`.
    await importer._process_activity(
        activity, _existing_by_source_id(baby, coord)
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    assert entries[0].imported_at == original_imported_at


@pytest.mark.asyncio
async def test_type_change_between_updates_is_logged_and_skipped(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    importer, coord, baby = await _make_importer(hass)

    await importer._process_activity(
        {
            "id": "act-3",
            "title": "Nap Started",
            "timestamp": "2026-05-19T13:00:00+00:00",
            "details": None,
        },
        {},
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    sleep_entry = entries[0]
    assert sleep_entry.type == "sleep"
    initial_ended_at = sleep_entry.ended_at

    # Procare bug: same id surfaces as a wholly different type.
    with caplog.at_level("WARNING"):
        await importer._process_activity(
            {
                "id": "act-3",
                "title": "Diaper: Wet",
                "timestamp": "2026-05-19T14:00:00+00:00",
                "details": None,
            },
            _existing_by_source_id(baby, coord),
        )
    entries = coord.entries_by_baby(baby.id)
    # The sleep entry stays untouched; no diaper entry is created.
    assert len(entries) == 1
    assert entries[0].id == sleep_entry.id
    assert entries[0].type == "sleep"
    assert entries[0].ended_at == initial_ended_at
    assert any(
        "type changed" in record.getMessage()
        and "sleep -> diaper" in record.getMessage()
        for record in caplog.records
    )


class _PhotoStub:
    """Stand-in for `_download_procare_photo`. Records calls so tests can
    assert (a) how many downloads happened and (b) which URLs we asked
    for; returns a different local path per URL so we can tell which
    download the entry's `photo_path` reflects.
    """

    def __init__(self, *, fail: bool = False) -> None:
        self.calls: list[str] = []
        self.fail = fail

    async def __call__(self, _hass, url: str) -> str | None:
        self.calls.append(url)
        if self.fail:
            return None
        # Deterministic per-URL output so test asserts can name a path.
        return f"media-source://media_source/local/babytracker/{abs(hash(url))}.jpg"


@pytest.mark.asyncio
async def test_new_activity_with_photo_downloads_and_stores_locally(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    importer, coord, baby = await _make_importer(hass)
    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)

    await importer._process_activity(
        {
            "id": "act-photo-1",
            "title": "Diaper: Wet",
            "timestamp": "2026-05-19T13:00:00+00:00",
            "details": None,
            "photo_url": "https://cdn.procare.example/photo/abc.jpg",
        },
        {},
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    entry = entries[0]
    assert stub.calls == ["https://cdn.procare.example/photo/abc.jpg"]
    assert entry.photo_url == "https://cdn.procare.example/photo/abc.jpg"
    assert entry.photo_path is not None
    assert entry.photo_path.startswith("media-source://media_source/local/babytracker/")


@pytest.mark.asyncio
async def test_unchanged_photo_url_reuses_local_copy(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    importer, coord, baby = await _make_importer(hass)
    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)

    activity = {
        "id": "act-photo-2",
        "title": "Diaper: Wet",
        "timestamp": "2026-05-19T13:00:00+00:00",
        "details": None,
        "photo_url": "https://cdn.procare.example/photo/xyz.jpg",
    }
    await importer._process_activity(activity, {})
    first_path = coord.entries_by_baby(baby.id)[0].photo_path
    assert stub.calls == [activity["photo_url"]]

    # Repeat with same URL — must NOT trigger a second download, and
    # the entry's photo_path must remain the locally-stored copy.
    await importer._process_activity(
        activity, _existing_by_source_id(baby, coord)
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    assert entries[0].photo_path == first_path
    assert stub.calls == [activity["photo_url"]], "re-download must not fire"


@pytest.mark.asyncio
async def test_photo_url_change_triggers_redownload(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    importer, coord, baby = await _make_importer(hass)
    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)

    base = {
        "id": "act-photo-3",
        "title": "Diaper: Wet",
        "timestamp": "2026-05-19T13:00:00+00:00",
        "details": None,
    }
    await importer._process_activity(
        {**base, "photo_url": "https://cdn.procare.example/photo/v1.jpg"}, {}
    )
    initial_path = coord.entries_by_baby(baby.id)[0].photo_path

    await importer._process_activity(
        {**base, "photo_url": "https://cdn.procare.example/photo/v2.jpg"},
        _existing_by_source_id(baby, coord),
    )
    entry = coord.entries_by_baby(baby.id)[0]
    assert stub.calls == [
        "https://cdn.procare.example/photo/v1.jpg",
        "https://cdn.procare.example/photo/v2.jpg",
    ]
    assert entry.photo_path is not None
    assert entry.photo_path != initial_path
    assert entry.photo_url == "https://cdn.procare.example/photo/v2.jpg"


@pytest.mark.asyncio
async def test_photo_url_cleared_clears_photo_path(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    importer, coord, baby = await _make_importer(hass)
    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)

    base = {
        "id": "act-photo-4",
        "title": "Diaper: Wet",
        "timestamp": "2026-05-19T13:00:00+00:00",
        "details": None,
    }
    await importer._process_activity(
        {**base, "photo_url": "https://cdn.procare.example/photo/gone.jpg"}, {}
    )
    assert coord.entries_by_baby(baby.id)[0].photo_path is not None

    # Procare drops the photo from the activity record (unusual but
    # possible if e.g. the parent deletes the photo upstream).
    await importer._process_activity(
        {**base, "photo_url": None},
        _existing_by_source_id(baby, coord),
    )
    entry = coord.entries_by_baby(baby.id)[0]
    assert entry.photo_url is None
    assert entry.photo_path is None


@pytest.mark.asyncio
async def test_download_failure_preserves_photo_url_pointer(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    importer, coord, baby = await _make_importer(hass)
    stub = _PhotoStub(fail=True)
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)

    await importer._process_activity(
        {
            "id": "act-photo-5",
            "title": "Diaper: Wet",
            "timestamp": "2026-05-19T13:00:00+00:00",
            "details": None,
            "photo_url": "https://cdn.procare.example/photo/broken.jpg",
        },
        {},
    )
    entry = coord.entries_by_baby(baby.id)[0]
    assert stub.calls == ["https://cdn.procare.example/photo/broken.jpg"]
    assert entry.photo_path is None
    # photo_url is preserved so users / diagnostics still see the
    # upstream pointer even though we couldn't grab a local copy.
    assert entry.photo_url == "https://cdn.procare.example/photo/broken.jpg"
