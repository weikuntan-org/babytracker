"""LMS percentile engine (§4.5, §15 #10-#11).

Reads vendored WHO + CDC reference tables from `data/lms/` and computes
percentiles for growth measurements via the LMS method. The standard
normal CDF Φ is hand-rolled via math.erf so the integration ships with
no third-party deps (manifest.requirements stays []).
"""
from __future__ import annotations

import json
import logging
import math
from datetime import date
from pathlib import Path
from typing import Any

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .const import DEFAULT_OPTIONS, DOMAIN, OPT_WHO_CDC_HANDOFF_MONTHS
    from .models import Baby

_LOGGER = logging.getLogger(__name__)

LB_TO_KG = 0.45359237
IN_TO_CM = 2.54

_TABLE_CACHE: dict[str, dict[str, Any]] = {}


def _lms_path() -> Path:
    return Path(__file__).parent / "data" / "lms"


def _filename(indicator: str, sex: str, source: str) -> str:
    abbr = {
        "weight_for_age": "wfa",
        "length_for_age": "lfa",
        "stature_for_age": "sfa",
        "head_circumference_for_age": "hcfa",
        "weight_for_length": "wfl",
        "weight_for_stature": "wfs",
        "bmi_for_age": "bmifa",
    }.get(indicator, indicator)
    suffix = "girls" if sex == "female" else "boys"
    return f"{source.lower()}_{abbr}_{suffix}.json"


def _load_table(indicator: str, sex: str, source: str) -> dict[str, Any] | None:
    key = f"{source}|{indicator}|{sex}"
    if key in _TABLE_CACHE:
        return _TABLE_CACHE[key]
    path = _lms_path() / _filename(indicator, sex, source)
    if not path.exists():
        _TABLE_CACHE[key] = None  # type: ignore[assignment]
        return None
    table = json.loads(path.read_text("utf-8"))
    _TABLE_CACHE[key] = table
    return table


def _interp_lms(table: dict[str, Any], x_input: float) -> tuple[float, float, float] | None:
    rows = table.get("rows") or []
    if not rows:
        return None
    if x_input < rows[0]["x"] or x_input > rows[-1]["x"]:
        return None
    # Binary search for the bracket
    lo, hi = 0, len(rows) - 1
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if rows[mid]["x"] <= x_input:
            lo = mid
        else:
            hi = mid
    a, b = rows[lo], rows[hi]
    if b["x"] == a["x"]:
        t = 0.0
    else:
        t = (x_input - a["x"]) / (b["x"] - a["x"])
    L = a["L"] + (b["L"] - a["L"]) * t
    M = a["M"] + (b["M"] - a["M"]) * t
    S = a["S"] + (b["S"] - a["S"]) * t
    return L, M, S


def z_score(L: float, M: float, S: float, X: float) -> float:
    if S == 0:
        return 0.0
    if abs(L) < 1e-9:
        return math.log(X / M) / S
    return (((X / M) ** L) - 1) / (L * S)


def percentile(z: float) -> float:
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0))) * 100.0


def source_for_age(age_days: int, handoff_months: int = 24) -> str:
    handoff_days = int(round(handoff_months * 30.4375))
    return "WHO" if age_days < handoff_days else "CDC"


def lb_to_kg(value: float) -> float:
    return value * LB_TO_KG


def in_to_cm(value: float) -> float:
    return value * IN_TO_CM


def to_kg(value: float, unit: str) -> float:
    return value if unit == "kg" else lb_to_kg(value)


def to_cm(value: float, unit: str) -> float:
    return value if unit == "cm" else in_to_cm(value)


def kg_to_lb(value: float) -> float:
    return value / LB_TO_KG


def cm_to_in(value: float) -> float:
    return value / IN_TO_CM


def convert_weight(value: float, from_unit: str, to_unit: str) -> float:
    """Convert between weight units (kg ↔ lb). Unknown units pass through."""
    if from_unit == to_unit:
        return value
    if from_unit == "lb" and to_unit == "kg":
        return lb_to_kg(value)
    if from_unit == "kg" and to_unit == "lb":
        return kg_to_lb(value)
    return value


def convert_length(value: float, from_unit: str, to_unit: str) -> float:
    """Convert between length units (cm ↔ in). Unknown units pass through."""
    if from_unit == to_unit:
        return value
    if from_unit == "in" and to_unit == "cm":
        return in_to_cm(value)
    if from_unit == "cm" and to_unit == "in":
        return cm_to_in(value)
    return value


def bmi(weight_kg: float, height_cm: float) -> float:
    if height_cm <= 0:
        return 0.0
    h_m = height_cm / 100.0
    return weight_kg / (h_m * h_m)


def age_days(birthday: str, today: date | None = None) -> int:
    bd = date.fromisoformat(birthday)
    today = today or date.today()
    return (today - bd).days


def compute_percentile(
    indicator: str,
    sex: str,
    source: str,
    x_input: float,
    y_input: float,
) -> dict[str, float | str] | None:
    table = _load_table(indicator, sex, source)
    if table is None:
        return None
    lms = _interp_lms(table, x_input)
    if lms is None:
        return None
    L, M, S = lms
    z = z_score(L, M, S, y_input)
    return {
        "percentile": round(percentile(z), 1),
        "z_score": round(z, 2),
        "source": table.get("source", source),
        "data_version": table.get("data_version", "unknown"),
    }


def _options(hass: "HomeAssistant") -> dict[str, Any]:
    from .const import DEFAULT_OPTIONS, DOMAIN  # local import keeps module HA-free

    for entry_id in hass.data.get(DOMAIN, {}):
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is not None:
            return {**DEFAULT_OPTIONS, **(entry.options or {})}
    return dict(DEFAULT_OPTIONS)


def attach_percentile_data(
    hass: "HomeAssistant",
    baby: "Baby",
    data: dict[str, Any],
    measured_at: date | None = None,
) -> None:
    """Compute percentile fields and merge them into `data` in place.

    Called from `log_growth`. Percentiles are persisted into the entry's
    `data` block so historical values stay stable across reference table
    bumps (§4.5). `measured_at` is the date the measurement was taken
    (used to compute the baby's age at that point); defaults to today
    so the existing call path keeps the same behavior.
    """
    from .const import OPT_WHO_CDC_HANDOFF_MONTHS

    options = _options(hass)
    handoff = int(options.get(OPT_WHO_CDC_HANDOFF_MONTHS, 24))

    weight_raw = data.get("weight")
    height_raw = data.get("height")
    head_raw = data.get("head_circumference")
    weight_unit = data.get("weight_unit", "kg")
    length_unit = data.get("length_unit", "cm")

    weight_kg = to_kg(float(weight_raw), weight_unit) if weight_raw is not None else None
    height_cm = to_cm(float(height_raw), length_unit) if height_raw is not None else None
    head_cm = to_cm(float(head_raw), length_unit) if head_raw is not None else None

    a_days = age_days(baby.birthday, today=measured_at)
    src = source_for_age(a_days, handoff)

    if weight_kg is not None:
        result = compute_percentile(
            "weight_for_age", baby.sex, src, a_days, round(weight_kg, 2)
        )
        if result is not None:
            data["weight_percentile"] = result["percentile"]
            data["weight_z"] = result["z_score"]
            data["weight_percentile_source"] = result["source"]

    if height_cm is not None:
        ind = "length_for_age" if src == "WHO" else "stature_for_age"
        result = compute_percentile(
            ind, baby.sex, src, a_days, round(height_cm, 1)
        )
        if result is not None:
            data["height_percentile"] = result["percentile"]
            data["height_z"] = result["z_score"]
            data["height_percentile_source"] = result["source"]

    if head_cm is not None and src == "WHO":
        result = compute_percentile(
            "head_circumference_for_age", baby.sex, src, a_days, round(head_cm, 1)
        )
        if result is not None:
            data["head_percentile"] = result["percentile"]
            data["head_z"] = result["z_score"]
            data["head_percentile_source"] = result["source"]

    if weight_kg is not None and height_cm is not None:
        b = round(bmi(weight_kg, height_cm), 1)
        data["bmi"] = b
        result = compute_percentile("bmi_for_age", baby.sex, src, a_days, b)
        if result is not None:
            data["bmi_percentile"] = result["percentile"]
            data["bmi_z"] = result["z_score"]
            data["bmi_percentile_source"] = result["source"]
