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

from datetime import datetime, timedelta, timezone
from typing import Any

import pytest
from homeassistant.core import HomeAssistant

from custom_components.babytracker.const import ENTRY_SOURCE_PROCARE
from custom_components.babytracker.coordinator import BabytrackerCoordinator
from custom_components.babytracker.importers import procare as procare_module
from custom_components.babytracker.importers.procare import (
    ProcareImporter,
    _download_procare_photo,
    _download_procare_video,
    _existing_by_source_id,
)
from custom_components.babytracker.models import Baby, Entry
from custom_components.babytracker.photo_storage import (
    sniff_image_mime,
    sniff_video_mime,
)
from custom_components.babytracker.store import BabytrackerStore


_MAPPINGS = [
    {"pattern": r"^Nap\s+Started", "type": "sleep", "session": "start"},
    {"pattern": r"^Nap\s+Ended", "type": "sleep", "session": "end"},
    {
        "pattern": r"^Slept\s+from\s+.*\s+to\s+",
        "type": "sleep",
        "session": "range",
    },
    {"pattern": r"^Diaper.*Wet", "type": "diaper", "kind": "wet"},
    {"pattern": r"^Video\b", "type": "other"},
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
async def test_nap_ended_activity_is_skipped(hass: HomeAssistant) -> None:
    importer, coord, baby = await _make_importer(hass)

    # A standalone "Nap Ended" has only an end timestamp. Creating a
    # sleep entry from it would yield a 0-duration nap at the end
    # instant. The importer must skip it instead; completed naps come
    # in as "Slept from X to Y" which carries both bounds.
    await importer._process_activity(
        {
            "id": "act-end-only",
            "title": "Nap Ended at 2:30 PM",
            "timestamp": "2026-05-19T14:30:00+00:00",
            "details": None,
        },
        {},
    )
    assert coord.entries_by_baby(baby.id) == []


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


@pytest.mark.asyncio
async def test_resync_backfills_photos_for_orphan_entries(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Procare entries with `photo_url` but no `photo_path` get their
    photos downloaded on resync — even when the corresponding source
    activity is no longer in the upstream sensor's cache (i.e. it
    aged out before our photo-download feature could grab it on the
    first import).
    """
    importer, coord, baby = await _make_importer(hass)

    # Pre-existing entry whose source activity is no longer in the
    # sensor's `activities` attribute (the most common reason a
    # photo_url ends up stranded without a photo_path).
    orphan = Entry(
        id="orphan-1",
        type="diaper",
        baby_id=baby.id,
        timestamp="2026-05-01T10:00:00+00:00",
        source=ENTRY_SOURCE_PROCARE,
        source_entity_id="sensor.ava_activities",
        source_id="aged-out-activity",
        imported_at="2026-05-01T10:00:01+00:00",
        readonly=True,
        photo_path=None,
        photo_url="https://cdn.procare.example/photo/orphan.jpg",
        staff=None,
        notes=None,
        data={"kind": "wet"},
    )
    coord._entries.append(orphan)

    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)

    # Source sensor exists but exposes no activities — the orphan's
    # source has aged out of the upstream cache.
    hass.states.async_set("sensor.ava_activities", "ok", {"activities": []})

    imported = await importer.async_resync()
    assert imported == 0, "no new entries should be created"
    assert stub.calls == ["https://cdn.procare.example/photo/orphan.jpg"]

    updated = coord.entry_by_id("orphan-1")
    assert updated is not None
    assert updated.photo_path is not None
    assert updated.photo_path.startswith(
        "media-source://media_source/local/babytracker/"
    )
    # Upstream pointer preserved.
    assert updated.photo_url == "https://cdn.procare.example/photo/orphan.jpg"


@pytest.mark.asyncio
async def test_backfill_skips_entries_with_local_copy(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, tmp_path
) -> None:
    """Backfill must not re-download photos whose local copy exists on
    disk — re-downloading every settled entry on each resync would be
    wasteful and would also churn through the upstream's signed-URL
    expiry budget unnecessarily.
    """
    importer, coord, baby = await _make_importer(hass)
    # Point the `local` media_dir at tmp_path and create the file the
    # entry references, so the backfill sees it on disk and skips.
    hass.config.media_dirs = {"local": str(tmp_path)}
    (tmp_path / "babytracker").mkdir(parents=True, exist_ok=True)
    (tmp_path / "babytracker" / "already.jpg").write_bytes(b"\x00")
    existing_path = "media-source://media_source/local/babytracker/already.jpg"
    coord._entries.append(
        Entry(
            id="settled-1",
            type="diaper",
            baby_id=baby.id,
            timestamp="2026-05-01T10:00:00+00:00",
            source=ENTRY_SOURCE_PROCARE,
            source_entity_id="sensor.ava_activities",
            source_id="settled-activity",
            imported_at="2026-05-01T10:00:01+00:00",
            readonly=True,
            photo_path=existing_path,
            photo_url="https://cdn.procare.example/photo/settled.jpg",
            staff=None,
            notes=None,
            data={"kind": "wet"},
        )
    )

    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)
    hass.states.async_set("sensor.ava_activities", "ok", {"activities": []})

    await importer.async_resync()
    assert stub.calls == [], "no re-download should fire for settled entries"
    assert coord.entry_by_id("settled-1").photo_path == existing_path


@pytest.mark.asyncio
async def test_backfill_retries_entries_with_missing_on_disk_file(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, tmp_path
) -> None:
    """An entry whose `photo_path` is set but whose file is missing on
    disk (typical cause: prior build wrote to `<config>/media` while
    this install's `media_dirs.local` points elsewhere, so the
    `media_source/resolve_media` URL 404s) gets re-downloaded on
    resync so the card stops showing the fallback icon.
    """
    importer, coord, baby = await _make_importer(hass)
    hass.config.media_dirs = {"local": str(tmp_path)}
    # photo_path is set but no file exists under tmp_path/babytracker/.
    coord._entries.append(
        Entry(
            id="broken-1",
            type="diaper",
            baby_id=baby.id,
            timestamp="2026-05-01T10:00:00+00:00",
            source=ENTRY_SOURCE_PROCARE,
            source_entity_id="sensor.ava_activities",
            source_id="broken-activity",
            imported_at="2026-05-01T10:00:01+00:00",
            readonly=True,
            photo_path="media-source://media_source/local/babytracker/missing.jpg",
            photo_url="https://cdn.procare.example/photo/broken.jpg",
            staff=None,
            notes=None,
            data={"kind": "wet"},
        )
    )

    stub = _PhotoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)
    hass.states.async_set("sensor.ava_activities", "ok", {"activities": []})

    await importer.async_resync()
    assert stub.calls == ["https://cdn.procare.example/photo/broken.jpg"]
    updated = coord.entry_by_id("broken-1")
    assert updated is not None
    # New photo_path points to a fresh download (the stub returns a
    # deterministic hash-derived URL); the broken one is replaced.
    assert updated.photo_path is not None
    assert updated.photo_path != "media-source://media_source/local/babytracker/missing.jpg"
    assert updated.photo_url == "https://cdn.procare.example/photo/broken.jpg"


@pytest.mark.asyncio
async def test_backfill_failure_leaves_entry_alone(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """When the backfill download fails (e.g. expired signed URL),
    the entry stays untouched — `photo_path` is still null, `photo_url`
    is still set, ready to be retried on the next resync.
    """
    importer, coord, baby = await _make_importer(hass)
    coord._entries.append(
        Entry(
            id="stale-1",
            type="diaper",
            baby_id=baby.id,
            timestamp="2026-05-01T10:00:00+00:00",
            source=ENTRY_SOURCE_PROCARE,
            source_entity_id="sensor.ava_activities",
            source_id="stale-activity",
            imported_at="2026-05-01T10:00:01+00:00",
            readonly=True,
            photo_path=None,
            photo_url="https://cdn.procare.example/photo/stale.jpg",
            staff=None,
            notes=None,
            data={"kind": "wet"},
        )
    )

    stub = _PhotoStub(fail=True)
    monkeypatch.setattr(procare_module, "_download_procare_photo", stub)
    hass.states.async_set("sensor.ava_activities", "ok", {"activities": []})

    await importer.async_resync()
    assert stub.calls == ["https://cdn.procare.example/photo/stale.jpg"]
    entry = coord.entry_by_id("stale-1")
    assert entry.photo_path is None
    assert entry.photo_url == "https://cdn.procare.example/photo/stale.jpg"


# ---------------------------------------------------------------------------
# Magic-byte sniffer + Procare CDN content-type handling
#
# Procare's signed S3/CloudFront URLs return `Content-Type:
# application/octet-stream` rather than a real image mime, which used to
# trip the strict allow-list check in `_download_procare_photo`. The fix
# is to sniff the payload's magic bytes when the header is generic.
# These tests pin both the sniffer itself and the importer's tolerant
# header handling.
# ---------------------------------------------------------------------------


_JPEG_HEAD = b"\xff\xd8\xff\xe0" + b"\x00" * 20
_PNG_HEAD = b"\x89PNG\r\n\x1a\n" + b"\x00" * 16
_WEBP_HEAD = b"RIFF\x00\x00\x00\x00WEBPVP8 " + b"\x00" * 8
_HEIC_HEAD = b"\x00\x00\x00\x20ftypheic" + b"\x00" * 16


def test_sniff_image_mime_recognises_known_formats() -> None:
    assert sniff_image_mime(_JPEG_HEAD) == "image/jpeg"
    assert sniff_image_mime(_PNG_HEAD) == "image/png"
    assert sniff_image_mime(_WEBP_HEAD) == "image/webp"
    assert sniff_image_mime(_HEIC_HEAD) == "image/heic"
    # `mif1` brand is part of the HEIF family — collapsed to image/heic
    # by the sniffer since the formats are interchangeable.
    mif1 = b"\x00\x00\x00\x20ftypmif1" + b"\x00" * 16
    assert sniff_image_mime(mif1) == "image/heic"


def test_sniff_image_mime_rejects_non_images_and_truncated_payloads() -> None:
    assert sniff_image_mime(b"") is None
    assert sniff_image_mime(b"<html>not an image") is None
    # Looks JPEG-ish but too short to reach the 12-byte guard.
    assert sniff_image_mime(b"\xff\xd8") is None
    # `ftyp` box with an unknown brand — we don't write what we can't name.
    unknown_brand = b"\x00\x00\x00\x20ftypxxxx" + b"\x00" * 16
    assert sniff_image_mime(unknown_brand) is None


class _FakeResponse:
    """Minimal async-context-manager standing in for an aiohttp response.

    Streams `payload` in 8-byte chunks via `content.iter_chunked` so the
    code-under-test exercises the streaming/size-cap branch the way it
    would against a real CDN response.
    """

    def __init__(self, *, status: int = 200, content_type: str | None = "", payload: bytes = b"") -> None:
        self.status = status
        self.content_type = content_type
        self._payload = payload
        self.content = self  # iter_chunked lives on `resp.content`

    async def __aenter__(self) -> "_FakeResponse":
        return self

    async def __aexit__(self, *exc: Any) -> None:
        return None

    async def iter_chunked(self, _size: int):
        for i in range(0, len(self._payload), 8):
            yield self._payload[i : i + 8]


class _FakeSession:
    def __init__(self, response: _FakeResponse) -> None:
        self._response = response
        self.requested_urls: list[str] = []

    def get(self, url: str, timeout=None) -> _FakeResponse:
        self.requested_urls.append(url)
        return self._response


@pytest.mark.asyncio
async def test_download_procare_photo_sniffs_octet_stream_jpeg(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, tmp_path
) -> None:
    """The reported bug: Procare CDN serves photos as
    `application/octet-stream` and the strict header check used to drop
    them. With sniffing in place the JPEG magic bytes win and the photo
    is written.
    """
    hass.config.media_dirs = {"local": str(tmp_path)}
    session = _FakeSession(
        _FakeResponse(content_type="application/octet-stream", payload=_JPEG_HEAD)
    )
    monkeypatch.setattr(
        procare_module, "async_get_clientsession", lambda _hass: session
    )

    result = await _download_procare_photo(
        hass, "https://cdn.procare.example/photo/signed.jpg"
    )
    assert result is not None
    assert result.startswith("media-source://media_source/local/babytracker/")
    assert result.endswith(".jpg")
    assert session.requested_urls == ["https://cdn.procare.example/photo/signed.jpg"]


@pytest.mark.asyncio
async def test_download_procare_photo_drops_octet_stream_with_unknown_payload(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch, tmp_path
) -> None:
    """If the header is generic AND the payload isn't a recognisable
    image, we drop it — we never write bytes whose format we can't name.
    """
    hass.config.media_dirs = {"local": str(tmp_path)}
    session = _FakeSession(
        _FakeResponse(
            content_type="application/octet-stream",
            payload=b"<html>not an image at all</html>",
        )
    )
    monkeypatch.setattr(
        procare_module, "async_get_clientsession", lambda _hass: session
    )

    result = await _download_procare_photo(
        hass, "https://cdn.procare.example/photo/bogus.jpg"
    )
    assert result is None


@pytest.mark.asyncio
async def test_download_procare_photo_still_rejects_concrete_non_image_header(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A response that explicitly says `text/html` short-circuits before
    we even stream the body — no point pulling bytes we'll throw away.
    """
    session = _FakeSession(
        _FakeResponse(content_type="text/html", payload=b"<html></html>")
    )
    monkeypatch.setattr(
        procare_module, "async_get_clientsession", lambda _hass: session
    )

    result = await _download_procare_photo(
        hass, "https://cdn.procare.example/photo/redirect.html"
    )
    assert result is None
    # Confirm we didn't even try to drain the body (session.get was called
    # but no iter_chunked happened — implicit via the early return).
    assert session.requested_urls == ["https://cdn.procare.example/photo/redirect.html"]


# ---------------------------------------------------------------------------
# Procare video activities ship a poster (`photo_url`) + the clip
# (`video_url`). The importer downloads both, the entry carries both
# `photo_path` and `video_path`, and the frontend swaps the lightbox to a
# `<video>` element when `video_path` is set.
# ---------------------------------------------------------------------------


_MP4_HEAD = b"\x00\x00\x00\x20ftypisom" + b"\x00" * 16
_MOV_HEAD = b"\x00\x00\x00\x20ftypqt  " + b"\x00" * 16
_WEBM_HEAD = b"\x1aE\xdf\xa3" + b"\x00" * 20


def test_sniff_video_mime_recognises_known_formats() -> None:
    assert sniff_video_mime(_MP4_HEAD) == "video/mp4"
    assert sniff_video_mime(_MOV_HEAD) == "video/quicktime"
    assert sniff_video_mime(_WEBM_HEAD) == "video/webm"
    # `mp42` brand also collapses to MP4.
    mp42 = b"\x00\x00\x00\x20ftypmp42" + b"\x00" * 16
    assert sniff_video_mime(mp42) == "video/mp4"


def test_sniff_video_mime_rejects_non_videos_and_truncated_payloads() -> None:
    assert sniff_video_mime(b"") is None
    assert sniff_video_mime(b"<html>not a video") is None
    # A JPEG is not a video, even though the sniff_image_mime path
    # would accept it.
    assert sniff_video_mime(_JPEG_HEAD) is None
    # Unknown ftyp brand — we don't write what we can't name.
    unknown = b"\x00\x00\x00\x20ftypxxxx" + b"\x00" * 16
    assert sniff_video_mime(unknown) is None


class _VideoStub:
    """Counterpart of `_PhotoStub` for the video download path."""

    def __init__(self, *, fail: bool = False) -> None:
        self.calls: list[str] = []
        self.fail = fail

    async def __call__(self, _hass, url: str) -> str | None:
        self.calls.append(url)
        if self.fail:
            return None
        return f"media-source://media_source/local/babytracker/{abs(hash(url))}.mp4"


@pytest.mark.asyncio
async def test_new_video_activity_persists_both_poster_and_clip(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A Procare video activity comes in with `photo_url` (poster JPG)
    and `video_url` (the clip). The importer must download both and the
    resulting entry must carry both `photo_path` and `video_path`.
    """
    importer, coord, baby = await _make_importer(hass)
    photo_stub = _PhotoStub()
    video_stub = _VideoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", photo_stub)
    monkeypatch.setattr(procare_module, "_download_procare_video", video_stub)

    await importer._process_activity(
        {
            "id": "act-video-1",
            "title": "Video",
            "timestamp": "2026-05-28T10:27:10-07:00",
            "details": "Morning outside time!",
            "photo_url": "https://cdn.procare.example/photo/poster.jpg",
            "video_url": "https://cdn.procare.example/video/clip.mp4",
            "staff": "Infant Classroom",
        },
        {},
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    entry = entries[0]
    assert entry.type == "other"
    assert photo_stub.calls == ["https://cdn.procare.example/photo/poster.jpg"]
    assert video_stub.calls == ["https://cdn.procare.example/video/clip.mp4"]
    assert entry.photo_url == "https://cdn.procare.example/photo/poster.jpg"
    assert entry.photo_path is not None
    assert entry.video_url == "https://cdn.procare.example/video/clip.mp4"
    assert entry.video_path is not None
    assert entry.video_path.endswith(".mp4")
    assert entry.staff == "Infant Classroom"
    assert entry.notes == "Morning outside time!"


@pytest.mark.asyncio
async def test_unchanged_video_url_reuses_local_copy(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    importer, coord, baby = await _make_importer(hass)
    photo_stub = _PhotoStub()
    video_stub = _VideoStub()
    monkeypatch.setattr(procare_module, "_download_procare_photo", photo_stub)
    monkeypatch.setattr(procare_module, "_download_procare_video", video_stub)

    activity = {
        "id": "act-video-2",
        "title": "Video",
        "timestamp": "2026-05-28T10:27:10-07:00",
        "details": None,
        "photo_url": "https://cdn.procare.example/photo/poster2.jpg",
        "video_url": "https://cdn.procare.example/video/clip2.mp4",
    }
    await importer._process_activity(activity, {})
    first_video_path = coord.entries_by_baby(baby.id)[0].video_path
    assert video_stub.calls == [activity["video_url"]]

    # Repeat with the same URLs — no re-download for either media kind.
    await importer._process_activity(
        activity, _existing_by_source_id(baby, coord)
    )
    entries = coord.entries_by_baby(baby.id)
    assert len(entries) == 1
    assert entries[0].video_path == first_video_path
    assert video_stub.calls == [activity["video_url"]], (
        "re-download must not fire"
    )


@pytest.mark.asyncio
async def test_resync_backfills_videos_for_orphan_entries(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A Procare entry with `video_url` but no `video_path` (initial
    download failed or pre-feature) gets backfilled on resync the same
    way photos do.
    """
    importer, coord, baby = await _make_importer(hass)
    # Pre-existing video entry whose video_path never landed (initial
    # download failed). Leaving photo_url/path None keeps this test
    # focused on the video backfill path; the photo backfill has its
    # own coverage.
    orphan = Entry(
        id="orphan-vid",
        type="other",
        baby_id=baby.id,
        timestamp="2026-05-28T10:00:00-07:00",
        source=ENTRY_SOURCE_PROCARE,
        source_entity_id="sensor.ava_activities",
        source_id="orphan-vid-source",
        imported_at="2026-05-28T10:01:00-07:00",
        readonly=True,
        photo_path=None,
        photo_url=None,
        video_path=None,
        video_url="https://cdn.procare.example/video/orphan.mp4",
        data={"name": "Video"},
    )
    coord._entries.append(orphan)

    video_stub = _VideoStub()
    monkeypatch.setattr(procare_module, "_download_procare_video", video_stub)

    # Source sensor exists but exposes no activities — backfill is the
    # only path that can reach the orphaned video on resync.
    hass.states.async_set("sensor.ava_activities", "ok", {"activities": []})

    await importer.async_resync()
    assert video_stub.calls == ["https://cdn.procare.example/video/orphan.mp4"]
    updated = coord.entry_by_id("orphan-vid")
    assert updated.video_path is not None
    assert updated.video_path.endswith(".mp4")
    assert updated.video_url == "https://cdn.procare.example/video/orphan.mp4"


# ---------------------------------------------------------------------------
# Presence (`coordinator.at_daycare`) is derived from the entry log: the
# most recent sign-in/out event for the baby wins. Non-sign activities
# (diapers, naps, bottles) have no effect on presence, regardless of
# their timestamp — earlier "inference window" heuristics were removed
# because they kept flipping presence back on after pickup.
# ---------------------------------------------------------------------------


def _iso_minutes_ago(minutes: float) -> str:
    return (
        datetime.now(tz=timezone.utc) - timedelta(minutes=minutes)
    ).isoformat()


@pytest.mark.asyncio
async def test_at_daycare_initially_false(hass: HomeAssistant) -> None:
    _, coord, baby = await _make_importer(hass)
    assert coord.at_daycare(baby) is False


@pytest.mark.asyncio
async def test_non_sign_activity_does_not_set_at_daycare(
    hass: HomeAssistant,
) -> None:
    """A diaper, feeding, or sleep activity is not a presence signal.
    Only sign-in/out events change `at_daycare`.
    """
    importer, coord, baby = await _make_importer(hass)
    await importer._process_activity(
        {
            "id": "recent-diaper",
            "title": "Diaper: Wet",
            "timestamp": _iso_minutes_ago(5),
        },
        {},
    )
    assert coord.at_daycare(baby) is False


@pytest.mark.asyncio
async def test_sign_in_flips_at_daycare_on(hass: HomeAssistant) -> None:
    importer, coord, baby = await _make_importer(hass)
    await importer._process_activity(
        {
            "id": "signin",
            "title": "Signed In by Teacher",
            "timestamp": _iso_minutes_ago(120),
        },
        {},
    )
    assert coord.at_daycare(baby) is True


@pytest.mark.asyncio
async def test_sign_out_after_sign_in_flips_off(hass: HomeAssistant) -> None:
    importer, coord, baby = await _make_importer(hass)
    await importer._process_activity(
        {
            "id": "signin",
            "title": "Signed In by Teacher",
            "timestamp": _iso_minutes_ago(240),
        },
        {},
    )
    await importer._process_activity(
        {
            "id": "signout",
            "title": "Signed Out by Teacher",
            "timestamp": _iso_minutes_ago(120),
        },
        {},
    )
    assert coord.at_daycare(baby) is False


@pytest.mark.asyncio
async def test_latest_sign_event_wins_regardless_of_arrival_order(
    hass: HomeAssistant,
) -> None:
    """Order of arrival doesn't matter — `at_daycare` is determined by
    the entry with the latest timestamp, not the latest insertion.
    """
    importer, coord, baby = await _make_importer(hass)
    # Process the newer sign-out FIRST.
    await importer._process_activity(
        {
            "id": "signout",
            "title": "Signed Out by Teacher",
            "timestamp": _iso_minutes_ago(60),
        },
        {},
    )
    # Then a stale (older) sign-in arrives.
    await importer._process_activity(
        {
            "id": "signin",
            "title": "Signed In by Teacher",
            "timestamp": _iso_minutes_ago(240),
        },
        {},
    )
    assert coord.at_daycare(baby) is False, (
        "the later sign-out (60 min ago) must win over the earlier "
        "sign-in (240 min ago) regardless of arrival order"
    )


@pytest.mark.asyncio
async def test_update_to_non_sign_activity_does_not_set_at_daycare(
    hass: HomeAssistant,
) -> None:
    """Re-processing a non-sign activity (photo backfill, details edit)
    must not change presence — the regression that motivated the rewrite.
    """
    importer, coord, baby = await _make_importer(hass)
    # Seed a sign-out so presence is firmly False to start.
    await importer._process_activity(
        {
            "id": "signout",
            "title": "Signed Out by Teacher",
            "timestamp": _iso_minutes_ago(180),
        },
        {},
    )
    assert coord.at_daycare(baby) is False

    # A fresh-looking diaper update arrives.
    activity = {
        "id": "diaper-1",
        "title": "Diaper: Wet",
        "timestamp": _iso_minutes_ago(2),
    }
    await importer._process_activity(activity, {})
    assert coord.at_daycare(baby) is False

    # Same activity re-emitted as an update — still no effect on presence.
    existing = {
        "diaper-1": next(
            e for e in coord.entries_by_baby(baby.id) if e.type == "diaper"
        )
    }
    await importer._process_activity(activity, existing)
    assert coord.at_daycare(baby) is False


@pytest.mark.asyncio
async def test_set_at_daycare_logs_synthetic_sign_event(
    hass: HomeAssistant,
) -> None:
    """The public override service still works — but now by appending a
    synthetic `(manual)` sign event to the entry log instead of mutating
    a hidden flag. The override is durable across restarts because it
    lives in the persisted entries.
    """
    _, coord, baby = await _make_importer(hass)

    await coord.set_at_daycare(baby, True)
    assert coord.at_daycare(baby) is True
    sign_entries = [
        e for e in coord.entries_by_baby(baby.id)
        if e.type == "other" and "Sign" in (e.data or {}).get("name", "")
    ]
    assert any("(manual)" in e.data.get("name", "") for e in sign_entries)

    await coord.set_at_daycare(baby, False)
    assert coord.at_daycare(baby) is False
