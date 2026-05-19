"""Shared helpers for writing entry photos under HA's media folder.

Both the user-upload WS command (`websocket_api._ws_upload_photo`) and the
Procare importer (which downloads photos from Procare's CDN) persist files
to `/config/media/babytracker/<uuid>.<ext>` and surface them as
`media-source://media_source/local/babytracker/<uuid>.<ext>` so the
existing `_validate_photo_path` (§5 photos) accepts them.

The mime allow-list and 5 MB cap are kept here so both paths stay in
lock-step — adding a new format only requires one edit.
"""
from __future__ import annotations

import logging
import uuid
from pathlib import Path

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

PHOTO_MAX_BYTES = 5 * 1024 * 1024
PHOTO_MIME_TO_EXT: dict[str, str] = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
}


def media_source_url(filename: str) -> str:
    """Return the `media-source://` URL for a `media/babytracker/<filename>`.

    Kept in one place so the format stays consistent with what
    `services._validate_photo_path` expects (must include `"babytracker"`).
    """
    return f"media-source://media_source/local/babytracker/{filename}"


def _write_sync(target: Path, payload: bytes) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(payload)


async def write_photo(
    hass: HomeAssistant, payload: bytes, mime: str
) -> str | None:
    """Persist `payload` under HA's media folder and return its
    `media-source://` URL.

    Validates that the mime is in the allow-list and the payload is
    within the 5 MB cap. Returns None on validation or IO failure
    (callers warn-log via the importer's own error path; the
    user-upload path's WS handler surfaces specific error codes
    before reaching here).
    """
    ext = PHOTO_MIME_TO_EXT.get(mime.lower().strip())
    if ext is None:
        _LOGGER.warning("babytracker: unsupported photo mime %r", mime)
        return None
    if len(payload) == 0:
        _LOGGER.warning("babytracker: empty photo payload, skipping write")
        return None
    if len(payload) > PHOTO_MAX_BYTES:
        _LOGGER.warning(
            "babytracker: photo payload %d > %d cap, skipping write",
            len(payload),
            PHOTO_MAX_BYTES,
        )
        return None
    filename = f"{uuid.uuid4().hex}.{ext}"
    target = Path(hass.config.path("media", "babytracker", filename))
    try:
        await hass.async_add_executor_job(_write_sync, target, payload)
    except OSError as err:
        _LOGGER.warning("babytracker: photo write failed: %s", err)
        return None
    return media_source_url(filename)
