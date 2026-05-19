"""babytracker sensor platform (§6)."""
from __future__ import annotations

from collections.abc import Callable
from datetime import date, datetime, timezone
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfMass, UnitOfLength, UnitOfTime, UnitOfVolume
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    ALL_DIAPER_KINDS,
    ALL_FEEDING_METHODS,
    DEFAULT_OPTIONS,
    DOMAIN,
    OPT_ENABLE_PUMPING,
    OPT_VACCINE_SCHEDULE,
    RECENT_ENTRIES_CAP,
    SIGNAL_DATA_UPDATED,
)
from .coordinator import BabytrackerCoordinator
from .models import Baby

# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------


def _entry_options(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    return {**DEFAULT_OPTIONS, **(entry.options or {})}


def _local_today(hass: HomeAssistant) -> date:
    return dt_util.now().date()


def _device_info_for(baby: Baby) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, baby.id)},
        name=f"babytracker — {baby.name}",
        manufacturer="babytracker",
        model="baby",
    )


def _global_device_info() -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, "global")},
        name="babytracker",
        manufacturer="babytracker",
        model="integration",
    )


def _parse(ts: str | None) -> datetime | None:
    if not ts:
        return None
    try:
        dt = datetime.fromisoformat(ts)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def _last_entry_of_type(coord: BabytrackerCoordinator, baby_id: str, type_: str):
    entries = [
        e for e in coord.entries_by_baby(baby_id) if e.type == type_
    ]
    if not entries:
        return None
    return max(entries, key=lambda e: e.timestamp)


def _count_today(
    hass: HomeAssistant,
    coord: BabytrackerCoordinator,
    baby_id: str,
    type_: str,
    predicate: Callable[[Any], bool] | None = None,
) -> int:
    today = _local_today(hass)
    count = 0
    for e in coord.entries_by_baby(baby_id):
        if e.type != type_:
            continue
        dt = _parse(e.timestamp)
        if dt is None:
            continue
        if dt.astimezone(dt_util.DEFAULT_TIME_ZONE).date() != today:
            continue
        if predicate and not predicate(e):
            continue
        count += 1
    return count


def _sum_minutes_today(
    hass: HomeAssistant,
    coord: BabytrackerCoordinator,
    baby_id: str,
    type_: str,
) -> float:
    today = _local_today(hass)
    tz = dt_util.DEFAULT_TIME_ZONE
    total = 0.0
    for e in coord.entries_by_baby(baby_id):
        if e.type != type_:
            continue
        total += coord.minutes_in_day(e, today, tz)
    return round(total, 1)


# ------------------------------------------------------------------
# Base entity
# ------------------------------------------------------------------


class BabytrackerEntity(SensorEntity):
    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, coord: BabytrackerCoordinator) -> None:
        self._coord = coord

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_DATA_UPDATED, self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()


# ------------------------------------------------------------------
# Per-baby sensors
# ------------------------------------------------------------------


class _BabyEntity(BabytrackerEntity):
    def __init__(
        self,
        coord: BabytrackerCoordinator,
        baby: Baby,
        suffix: str,
        name: str,
    ) -> None:
        super().__init__(coord)
        self._baby = baby
        self._attr_unique_id = f"{baby.id}_{suffix}"
        self._attr_translation_key = suffix
        self._attr_name = name
        self._attr_device_info = _device_info_for(baby)

    @property
    def baby(self) -> Baby:
        # Refresh from coordinator each access in case name changed
        return self._coord.baby_by_id(self._baby.id) or self._baby


class LastEventSensor(_BabyEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coord, baby, type_: str, suffix: str, name: str) -> None:
        super().__init__(coord, baby, suffix, name)
        self._type = type_

    @property
    def native_value(self) -> datetime | None:
        entry = _last_entry_of_type(self._coord, self.baby.id, self._type)
        return _parse(entry.timestamp) if entry else None


class LastFeedingMethodSensor(_BabyEntity):
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = list(ALL_FEEDING_METHODS)

    def __init__(self, coord, baby):
        super().__init__(coord, baby, "last_feeding_method", "Last feeding method")

    @property
    def native_value(self) -> str | None:
        entry = _last_entry_of_type(self._coord, self.baby.id, "feeding")
        return entry.data.get("method") if entry else None


class LastFeedingAmountSensor(_BabyEntity):
    # SensorDeviceClass.VOLUME only accepts state classes total / total_increasing
    # (it's modeled as a cumulative meter). This sensor is a snapshot of the
    # last feeding's volume, so it intentionally has no state class — that
    # disables long-term statistics, which is correct for a "last value"
    # reading.
    _attr_device_class = SensorDeviceClass.VOLUME

    def __init__(self, coord, baby):
        super().__init__(coord, baby, "last_feeding_amount", "Last feeding amount")

    @property
    def native_value(self):
        entry = _last_entry_of_type(self._coord, self.baby.id, "feeding")
        return entry.data.get("amount") if entry else None

    @property
    def native_unit_of_measurement(self):
        entry = _last_entry_of_type(self._coord, self.baby.id, "feeding")
        unit = entry.data.get("unit") if entry else None
        if unit == "ml":
            return UnitOfVolume.MILLILITERS
        if unit == "oz":
            return UnitOfVolume.FLUID_OUNCES
        return None


class CountTodaySensor(_BabyEntity):
    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(
        self,
        coord,
        baby,
        type_: str,
        suffix: str,
        name: str,
        predicate=None,
    ) -> None:
        super().__init__(coord, baby, suffix, name)
        self._type = type_
        self._predicate = predicate

    @property
    def native_value(self) -> int:
        return _count_today(self.hass, self._coord, self.baby.id, self._type, self._predicate)

    # No last_reset: TOTAL_INCREASING infers the daily reset from the value
    # dropping back to 0 after midnight (HA tightened this — setting
    # last_reset on a TOTAL_INCREASING sensor is now a ValueError).


class TotalFeedingVolumeTodaySensor(_BabyEntity):
    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(self, coord, baby, options):
        super().__init__(
            coord, baby, "total_feeding_volume_today", "Total feeding volume today"
        )
        self._volume_unit = options.get("volume_unit", "ml")

    @property
    def native_unit_of_measurement(self):
        return (
            UnitOfVolume.MILLILITERS
            if self._volume_unit == "ml"
            else UnitOfVolume.FLUID_OUNCES
        )

    @property
    def native_value(self) -> float:
        today = _local_today(self.hass)
        tz = dt_util.DEFAULT_TIME_ZONE
        total = 0.0
        for e in self._coord.entries_by_baby(self.baby.id):
            if e.type != "feeding":
                continue
            amount = e.data.get("amount")
            unit = e.data.get("unit")
            if amount is None:
                continue
            dt = _parse(e.timestamp)
            if dt is None or dt.astimezone(tz).date() != today:
                continue
            value = float(amount)
            if unit == "oz" and self._volume_unit == "ml":
                value *= 29.5735
            elif unit == "ml" and self._volume_unit == "oz":
                value /= 29.5735
            total += value
        return round(total, 1)

    # last_reset omitted intentionally — see CountTodaySensor.


class MinutesTodaySensor(_BabyEntity):
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    def __init__(self, coord, baby, type_, suffix, name):
        super().__init__(coord, baby, suffix, name)
        self._type = type_

    @property
    def native_value(self) -> float:
        return _sum_minutes_today(self.hass, self._coord, self.baby.id, self._type)

    # last_reset omitted intentionally — see CountTodaySensor.


class LastDiaperKindSensor(_BabyEntity):
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = list(ALL_DIAPER_KINDS)

    def __init__(self, coord, baby):
        super().__init__(coord, baby, "last_diaper_kind", "Last diaper kind")

    @property
    def native_value(self) -> str | None:
        entry = _last_entry_of_type(self._coord, self.baby.id, "diaper")
        return entry.data.get("kind") if entry else None


# ----- Growth -------------------------------------------------------


class GrowthValueSensor(_BabyEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coord,
        baby,
        field: str,
        suffix: str,
        name: str,
        unit: str | None = None,
        device_class: SensorDeviceClass | None = None,
    ):
        super().__init__(coord, baby, suffix, name)
        self._field = field
        self._attr_native_unit_of_measurement = unit
        if device_class:
            self._attr_device_class = device_class

    @property
    def native_value(self):
        data = self._coord.latest_growth_data(self.baby.id)
        return data.get(self._field)


class PercentileSensor(_BabyEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coord, baby, data_key: str, suffix: str, name: str):
        super().__init__(coord, baby, suffix, name)
        self._data_key = data_key

    @property
    def native_value(self):
        data = self._coord.latest_growth_data(self.baby.id)
        return data.get(self._data_key)

    @property
    def extra_state_attributes(self):
        data = self._coord.latest_growth_data(self.baby.id)
        return {
            "z_score": data.get(self._data_key.replace("percentile", "z")),
            "source": data.get(f"{self._data_key}_source"),
        }


# ----- Recent entries ----------------------------------------------


class RecentEntriesSensor(_BabyEntity):
    def __init__(self, coord, baby):
        super().__init__(coord, baby, "recent_entries", "Recent entries")

    @property
    def native_value(self) -> int:
        return min(len(self._coord.entries_by_baby(self.baby.id)), RECENT_ENTRIES_CAP)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        recent = self._coord.recent_entries(self.baby.id)
        return {
            "entries": [
                {
                    "id": e.id,
                    "type": e.type,
                    "timestamp": e.timestamp,
                    "ended_at": e.ended_at,
                    "source": e.source,
                    "readonly": e.readonly,
                    "data": dict(e.data),
                    "photo_path": e.photo_path,
                    "photo_url": e.photo_url,
                    "staff": e.staff,
                    "notes": e.notes,
                }
                for e in recent
            ]
        }


# ----- Vaccines (M7) ------------------------------------------------


class LastVaccineSensor(LastEventSensor):
    pass


class VaccinesDueSensor(_BabyEntity):
    def __init__(self, coord, baby, hass: HomeAssistant, entry: ConfigEntry):
        super().__init__(coord, baby, "vaccines_due", "Vaccines due")
        self._entry = entry

    def _schedule(self):
        from .websocket_api import _load_schedule  # local import

        options = _entry_options(self.hass, self._entry)
        schedule_id = options.get(OPT_VACCINE_SCHEDULE, "us_cdc")
        return _load_schedule(schedule_id) or {}

    def _next_due(self):
        schedule = self._schedule()
        doses = schedule.get("doses") or []
        if not doses:
            return None
        try:
            bd = date.fromisoformat(self.baby.birthday)
        except ValueError:
            return None
        coord = self._coord
        prior = [
            (e.data.get("name"), e.data.get("dose_number"))
            for e in coord.entries_by_baby(self.baby.id)
            if e.type == "vaccine" and not e.readonly
        ]
        prior_set = {(name, dose) for name, dose in prior if name and dose}
        undosed = [d for d in doses if (d["name"], d.get("dose_number")) not in prior_set]
        if not undosed:
            return None
        undosed.sort(key=lambda d: d["target_age_days"])
        next_d = undosed[0]
        return {
            "dose": next_d,
            "due_on": (bd + _days(next_d["target_age_days"])).isoformat(),
            "undosed": undosed,
        }

    @property
    def native_value(self):
        nxt = self._next_due()
        if nxt is None:
            return "none"
        return nxt["dose"]["name"]

    @property
    def extra_state_attributes(self):
        nxt = self._next_due()
        if nxt is None:
            return {"dose_number": None, "due_on": None, "overdue_days": 0, "upcoming": []}
        try:
            bd = date.fromisoformat(self.baby.birthday)
        except ValueError:
            bd = None
        upcoming = []
        for d in nxt["undosed"][:5]:
            upcoming.append(
                {
                    "name": d["name"],
                    "dose_number": d.get("dose_number"),
                    "due_on": (bd + _days(d["target_age_days"])).isoformat() if bd else None,
                }
            )
        due_on = date.fromisoformat(nxt["due_on"])
        today = _local_today(self.hass)
        overdue = max(0, (today - due_on).days)
        return {
            "dose_number": nxt["dose"].get("dose_number"),
            "due_on": nxt["due_on"],
            "overdue_days": overdue,
            "upcoming": upcoming,
        }


def _days(n: int):
    from datetime import timedelta

    return timedelta(days=n)


class AgeDaysSensor(_BabyEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "d"

    def __init__(self, coord, baby):
        super().__init__(coord, baby, "age_days", "Age in days")

    @property
    def native_value(self) -> int | None:
        try:
            bd = date.fromisoformat(self.baby.birthday)
        except ValueError:
            return None
        return (_local_today(self.hass) - bd).days


class AgeMonthsSensor(_BabyEntity):
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "mo"

    def __init__(self, coord, baby):
        super().__init__(coord, baby, "age_months", "Age in months")

    @property
    def native_value(self) -> float | None:
        try:
            bd = date.fromisoformat(self.baby.birthday)
        except ValueError:
            return None
        days = (_local_today(self.hass) - bd).days
        return round(days / 30.4375, 1)


# ----- Global sensors ----------------------------------------------


class _GlobalEntity(BabytrackerEntity):
    def __init__(self, coord, suffix: str, name: str):
        super().__init__(coord)
        self._attr_unique_id = f"global_{suffix}"
        self._attr_translation_key = suffix
        self._attr_name = name
        self._attr_device_info = _global_device_info()


class GlobalLastPumpingSensor(_GlobalEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, coord):
        super().__init__(coord, "last_pumping", "Last pumping")

    @property
    def native_value(self) -> datetime | None:
        latest = None
        for e in self._coord.entries:
            if e.type != "pumping":
                continue
            dt = _parse(e.timestamp)
            if dt is None:
                continue
            if latest is None or dt > latest:
                latest = dt
        return latest


class GlobalPumpingTodaySensor(_GlobalEntity):
    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(self, coord, options):
        super().__init__(coord, "pumping_today", "Pumping today")
        self._volume_unit = options.get("volume_unit", "ml")

    @property
    def native_unit_of_measurement(self):
        return (
            UnitOfVolume.MILLILITERS
            if self._volume_unit == "ml"
            else UnitOfVolume.FLUID_OUNCES
        )

    @property
    def native_value(self) -> float:
        today = _local_today(self.hass)
        tz = dt_util.DEFAULT_TIME_ZONE
        total = 0.0
        for e in self._coord.entries:
            if e.type != "pumping":
                continue
            dt = _parse(e.timestamp)
            if dt is None or dt.astimezone(tz).date() != today:
                continue
            amount = e.data.get("volume")
            unit = e.data.get("unit")
            if amount is None:
                continue
            value = float(amount)
            if unit == "oz" and self._volume_unit == "ml":
                value *= 29.5735
            elif unit == "ml" and self._volume_unit == "oz":
                value /= 29.5735
            total += value
        return round(total, 1)

    # last_reset omitted intentionally — see CountTodaySensor.


class GlobalRecentEntriesSensor(_GlobalEntity):
    def __init__(self, coord):
        super().__init__(coord, "recent_entries", "Recent entries")

    @property
    def native_value(self) -> int:
        return min(len(self._coord.entries), RECENT_ENTRIES_CAP)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        entries = self._coord.recent_entries()
        return {
            "entries": [
                {
                    "id": e.id,
                    "type": e.type,
                    "baby_id": e.baby_id,
                    "timestamp": e.timestamp,
                    "ended_at": e.ended_at,
                    "source": e.source,
                    "data": dict(e.data),
                }
                for e in entries
            ]
        }


class UnmappedProcareTitlesSensor(_GlobalEntity):
    def __init__(self, coord):
        super().__init__(coord, "unmapped_procare_titles", "Unmapped Procare titles")

    @property
    def native_value(self) -> int:
        return len(self._coord.get_unmapped_procare_titles())

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"titles": self._coord.get_unmapped_procare_titles()}


# ------------------------------------------------------------------
# Platform entry
# ------------------------------------------------------------------


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    runtime = hass.data[DOMAIN][entry.entry_id]
    coord: BabytrackerCoordinator = runtime["coordinator"]
    options = _entry_options(hass, entry)

    entities: list[SensorEntity] = []

    for baby in coord.babies:
        if baby.archived:
            continue
        ea = set(baby.enabled_activities)
        if "feeding" in ea:
            entities.extend(
                [
                    LastEventSensor(coord, baby, "feeding", "last_feeding", "Last feeding"),
                    LastFeedingMethodSensor(coord, baby),
                    LastFeedingAmountSensor(coord, baby),
                    CountTodaySensor(coord, baby, "feeding", "feedings_today", "Feedings today"),
                    TotalFeedingVolumeTodaySensor(coord, baby, options),
                ]
            )
        if "diaper" in ea:
            entities.extend(
                [
                    LastEventSensor(coord, baby, "diaper", "last_diaper", "Last diaper"),
                    LastDiaperKindSensor(coord, baby),
                    CountTodaySensor(coord, baby, "diaper", "diapers_today", "Diapers today"),
                    CountTodaySensor(
                        coord,
                        baby,
                        "diaper",
                        "wet_diapers_today",
                        "Wet diapers today",
                        predicate=lambda e: e.data.get("kind") in ("wet", "both"),
                    ),
                    CountTodaySensor(
                        coord,
                        baby,
                        "diaper",
                        "dirty_diapers_today",
                        "Dirty diapers today",
                        predicate=lambda e: e.data.get("kind") in ("dirty", "both"),
                    ),
                ]
            )
        if "sleep" in ea:
            entities.extend(
                [
                    LastEventSensor(coord, baby, "sleep", "last_sleep_start", "Last sleep start"),
                    MinutesTodaySensor(coord, baby, "sleep", "total_sleep_today", "Total sleep today"),
                    CountTodaySensor(coord, baby, "sleep", "naps_today", "Naps today"),
                ]
            )
        if "tummy_time" in ea:
            entities.extend(
                [
                    LastEventSensor(
                        coord,
                        baby,
                        "tummy_time",
                        "last_tummy_time_start",
                        "Last tummy time start",
                    ),
                    MinutesTodaySensor(
                        coord, baby, "tummy_time", "total_tummy_time_today", "Total tummy time today"
                    ),
                    CountTodaySensor(
                        coord, baby, "tummy_time", "tummy_time_sessions_today", "Tummy time sessions today"
                    ),
                ]
            )
        if "walk" in ea:
            entities.extend(
                [
                    LastEventSensor(
                        coord,
                        baby,
                        "walk",
                        "last_walk_start",
                        "Last walk start",
                    ),
                    MinutesTodaySensor(
                        coord, baby, "walk", "total_walk_today", "Total walk today"
                    ),
                    CountTodaySensor(
                        coord, baby, "walk", "walks_today", "Walks today"
                    ),
                ]
            )
        if "other" in ea:
            entities.append(
                LastEventSensor(coord, baby, "other", "last_other", "Last other")
            )
        if "growth" in ea:
            entities.extend(
                [
                    GrowthValueSensor(
                        coord,
                        baby,
                        "weight",
                        "weight",
                        "Weight",
                        unit=options.get("weight_unit", "kg"),
                        device_class=SensorDeviceClass.WEIGHT,
                    ),
                    GrowthValueSensor(
                        coord,
                        baby,
                        "height",
                        "height",
                        "Height",
                        unit=options.get("length_unit", "cm"),
                        device_class=SensorDeviceClass.DISTANCE,
                    ),
                    GrowthValueSensor(
                        coord,
                        baby,
                        "head_circumference",
                        "head_circumference",
                        "Head circumference",
                        unit=options.get("length_unit", "cm"),
                        device_class=SensorDeviceClass.DISTANCE,
                    ),
                    GrowthValueSensor(coord, baby, "bmi", "bmi", "BMI"),
                    PercentileSensor(coord, baby, "weight_percentile", "weight_percentile", "Weight percentile"),
                    PercentileSensor(coord, baby, "height_percentile", "height_percentile", "Height percentile"),
                    PercentileSensor(
                        coord,
                        baby,
                        "head_percentile",
                        "head_circumference_percentile",
                        "Head circumference percentile",
                    ),
                    PercentileSensor(coord, baby, "bmi_percentile", "bmi_percentile", "BMI percentile"),
                ]
            )
        if "vaccine" in ea:
            entities.extend(
                [
                    LastVaccineSensor(coord, baby, "vaccine", "last_vaccine", "Last vaccine"),
                    VaccinesDueSensor(coord, baby, hass, entry),
                ]
            )
        entities.append(AgeDaysSensor(coord, baby))
        entities.append(AgeMonthsSensor(coord, baby))
        entities.append(RecentEntriesSensor(coord, baby))

    # Global sensors
    if options.get(OPT_ENABLE_PUMPING, True):
        entities.append(GlobalLastPumpingSensor(coord))
        entities.append(GlobalPumpingTodaySensor(coord, options))
    entities.append(GlobalRecentEntriesSensor(coord))
    if any((b.importer or {}).get("source_entity_id") for b in coord.babies):
        entities.append(UnmappedProcareTitlesSensor(coord))

    async_add_entities(entities)
