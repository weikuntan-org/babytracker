"""babytracker binary_sensor platform (§6)."""
from __future__ import annotations

from datetime import date, timedelta

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    DEFAULT_OPTIONS,
    DOMAIN,
    OPT_VACCINE_GRACE_DAYS,
    OPT_VACCINE_SCHEDULE,
    SIGNAL_DATA_UPDATED,
)
from .coordinator import BabytrackerCoordinator
from .models import Baby


def _device_info(baby: Baby) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, baby.id)},
        name=f"babytracker — {baby.name}",
        manufacturer="babytracker",
        model="baby",
    )


class _BabyBinary(BinarySensorEntity):
    _attr_should_poll = False
    _attr_has_entity_name = True

    def __init__(self, coord: BabytrackerCoordinator, baby: Baby, suffix: str, name: str):
        self._coord = coord
        self._baby_id = baby.id
        self._attr_unique_id = f"{baby.id}_{suffix}"
        self._attr_translation_key = suffix
        self._attr_name = name
        self._attr_device_info = _device_info(baby)

    @property
    def _baby(self) -> Baby:
        return self._coord.baby_by_id(self._baby_id)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_DATA_UPDATED, self._handle)
        )

    @callback
    def _handle(self) -> None:
        self.async_write_ha_state()


class OpenSessionBinary(_BabyBinary):
    def __init__(self, coord, baby, type_: str, suffix: str, name: str):
        super().__init__(coord, baby, suffix, name)
        self._type = type_

    @property
    def is_on(self) -> bool:
        baby = self._baby
        if baby is None:
            return False
        return self._coord.open_session(baby.id, self._type) is not None


class AtDaycareBinary(_BabyBinary):
    def __init__(self, coord, baby):
        super().__init__(coord, baby, "at_daycare", "At daycare")

    @property
    def is_on(self) -> bool:
        baby = self._baby
        if baby is None:
            return False
        return self._coord.at_daycare(baby)


class VaccinesOverdueBinary(_BabyBinary):
    def __init__(self, coord, baby, hass: HomeAssistant, entry: ConfigEntry):
        super().__init__(coord, baby, "vaccines_overdue", "Vaccines overdue")
        self._entry = entry

    def _options(self):
        return {**DEFAULT_OPTIONS, **(self._entry.options or {})}

    def _schedule(self):
        from .websocket_api import _load_schedule

        schedule_id = self._options().get(OPT_VACCINE_SCHEDULE, "us_cdc")
        return _load_schedule(schedule_id) or {}

    @property
    def is_on(self) -> bool:
        from .vaccines import canonical_vaccine

        baby = self._baby
        if baby is None:
            return False
        try:
            bd = date.fromisoformat(baby.birthday)
        except ValueError:
            return False
        grace_days = int(self._options().get(OPT_VACCINE_GRACE_DAYS, 14))
        # Canonicalize stored + schedule names so a logged "Hepatitis B
        # (HepB)" satisfies the schedule's "Hepatitis B" dose slot.
        prior = {
            (canonical_vaccine(e.data.get("name")), e.data.get("dose_number"))
            for e in self._coord.entries_by_baby(baby.id)
            if e.type == "vaccine" and not e.readonly
        }
        today = dt_util.now().date()
        for dose in (self._schedule().get("doses") or []):
            if (canonical_vaccine(dose["name"]), dose.get("dose_number")) in prior:
                continue
            due_on = bd + timedelta(days=int(dose["target_age_days"]))
            if today > due_on + timedelta(days=grace_days):
                return True
        return False


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    runtime = hass.data[DOMAIN][entry.entry_id]
    coord: BabytrackerCoordinator = runtime["coordinator"]

    entities: list[BinarySensorEntity] = []
    for baby in coord.babies:
        if baby.archived:
            continue
        ea = set(baby.enabled_activities)
        if "sleep" in ea:
            entities.append(OpenSessionBinary(coord, baby, "sleep", "sleeping", "Sleeping"))
        if "feeding" in ea:
            entities.append(OpenSessionBinary(coord, baby, "feeding", "feeding", "Feeding"))
        if "tummy_time" in ea:
            entities.append(
                OpenSessionBinary(coord, baby, "tummy_time", "tummy_time", "Tummy time")
            )
        if "walk" in ea:
            entities.append(
                OpenSessionBinary(coord, baby, "walk", "walking", "Walking")
            )
        if baby.importer and baby.importer.get("source_entity_id"):
            entities.append(AtDaycareBinary(coord, baby))
        if "vaccine" in ea:
            entities.append(VaccinesOverdueBinary(coord, baby, hass, entry))

    async_add_entities(entities)
