"""Pediatrician-friendly report export (§4.9, §15 #14)."""
from __future__ import annotations

import csv
import html
import io
import logging
import os
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from typing import TYPE_CHECKING

try:
    from .runtime import parse_ts
except ImportError:  # pragma: no cover — supports bare-module loading in tests
    from runtime import parse_ts  # type: ignore[no-redef]

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .models import Baby

_LOGGER = logging.getLogger(__name__)

DEFAULT_SECTIONS = (
    "feedings",
    "sleep",
    "tummy_time",
    "diapers",
    "pumping",
    "growth",
    "vaccines",
    "medications",
)

_TYPE_TO_SECTION = {
    "feeding": "feedings",
    "sleep": "sleep",
    "tummy_time": "tummy_time",
    "diaper": "diapers",
    "pumping": "pumping",
    "growth": "growth",
    "vaccine": "vaccines",
    "medication": "medications",
}


def _output_dir(hass: "HomeAssistant") -> Path:
    path = Path(hass.config.path("www")) / "babytracker"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _resolve_range(start: str | None, end: str | None) -> tuple[date, date]:
    today = date.today()
    if end:
        end_date = date.fromisoformat(end)
    else:
        end_date = today
    if start:
        start_date = date.fromisoformat(start)
    else:
        start_date = end_date - timedelta(days=89)
    if start_date > end_date:
        start_date, end_date = end_date, start_date
    return start_date, end_date


def _filter_entries(
    entries, baby, start: date, end: date, sections: set[str]
) -> list:
    out = []
    for entry in entries:
        if entry.baby_id != baby.id and entry.type != "pumping":
            continue
        section = _TYPE_TO_SECTION.get(entry.type)
        if not section or section not in sections:
            continue
        try:
            ts = datetime.fromisoformat(entry.timestamp).date()
        except ValueError:
            continue
        if ts < start or ts > end:
            continue
        out.append(entry)
    out.sort(key=lambda e: parse_ts(e.timestamp))
    return out


def _flatten(entry) -> dict[str, Any]:
    row: dict[str, Any] = {
        "id": entry.id,
        "type": entry.type,
        "timestamp": entry.timestamp,
        "ended_at": entry.ended_at,
        "source": entry.source,
        "notes": entry.notes,
        "photo_path": entry.photo_path,
    }
    for key, value in (entry.data or {}).items():
        row[f"data.{key}"] = value
    return row


def _write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    fieldnames: list[str] = []
    for row in rows:
        for key in row:
            if key not in fieldnames:
                fieldnames.append(key)
    # UTF-8 with BOM for Excel friendliness (§15 #14)
    with open(path, "w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def _html_table(entries, section: str) -> str:
    if not entries:
        return f"<h2>{section}</h2><p>No entries.</p>"
    buf = io.StringIO()
    buf.write(f"<h2>{section}</h2><table><thead><tr>")
    columns = ["timestamp", "ended_at", "details"]
    for col in columns:
        buf.write(f"<th>{html.escape(col)}</th>")
    buf.write("</tr></thead><tbody>")
    for entry in entries:
        buf.write("<tr>")
        buf.write(f"<td>{html.escape(entry.timestamp)}</td>")
        buf.write(f"<td>{html.escape(entry.ended_at or '')}</td>")
        details = ", ".join(
            f"{k}={v}" for k, v in (entry.data or {}).items() if v is not None
        )
        buf.write(f"<td>{html.escape(details)}</td>")
        buf.write("</tr>")
    buf.write("</tbody></table>")
    return buf.getvalue()


def _write_html(path: Path, baby, entries_by_section: dict[str, list]) -> None:
    parts: list[str] = []
    parts.append("<!doctype html><html><head><meta charset='utf-8'>")
    parts.append(f"<title>babytracker — {html.escape(baby.name)}</title>")
    parts.append(
        "<style>"
        "body{font-family:-apple-system,system-ui,sans-serif;margin:2rem;color:#111}"
        "h1{font-size:1.8rem;margin:0 0 0.25rem}"
        "h2{margin-top:1.5rem;border-bottom:1px solid #ddd;padding-bottom:0.25rem}"
        "table{border-collapse:collapse;width:100%;margin-top:0.5rem}"
        "th,td{border:1px solid #ddd;padding:4px 8px;text-align:left;font-size:13px}"
        ".meta{color:#555;font-size:14px;margin-bottom:1rem}"
        "</style></head><body>"
    )
    parts.append(f"<h1>babytracker — {html.escape(baby.name)}</h1>")
    parts.append(
        f"<p class='meta'>Birthday: {html.escape(baby.birthday)} · Sex: "
        f"{html.escape(baby.sex)}</p>"
    )
    for section in DEFAULT_SECTIONS:
        entries = entries_by_section.get(section, [])
        parts.append(_html_table(entries, section))
    parts.append("</body></html>")
    path.write_text("".join(parts), encoding="utf-8")


async def generate_report(
    hass: "HomeAssistant",
    baby,
    *,
    fmt: str = "html",
    start: str | None = None,
    end: str | None = None,
    sections: list[str] | None = None,
) -> dict[str, str]:
    from .runtime import get_coordinator

    coord = get_coordinator(hass)
    if coord is None:
        raise RuntimeError("babytracker not configured")
    start_date, end_date = _resolve_range(start, end)
    section_set = set(sections) if sections else set(DEFAULT_SECTIONS)
    entries = _filter_entries(coord.entries, baby, start_date, end_date, section_set)

    out_dir = _output_dir(hass)
    filename = f"{baby.slug}-{start_date.isoformat()}-{end_date.isoformat()}.{fmt}"
    path = out_dir / filename

    if fmt == "csv":
        rows = [_flatten(e) for e in entries]
        await hass.async_add_executor_job(_write_csv, path, rows)
    else:
        grouped: dict[str, list] = {s: [] for s in DEFAULT_SECTIONS}
        for entry in entries:
            section = _TYPE_TO_SECTION.get(entry.type)
            if section:
                grouped.setdefault(section, []).append(entry)
        await hass.async_add_executor_job(_write_html, path, baby, grouped)

    url = f"/local/babytracker/{filename}"
    return {"path": str(path), "url": url}
