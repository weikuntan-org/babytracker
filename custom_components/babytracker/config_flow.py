"""Config + Options flow (§4.1)."""
from __future__ import annotations

from datetime import date
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.util import slugify

from .const import (
    ALL_ACTIVITIES,
    ALL_FEEDING_METHODS,
    ALL_LENGTH_UNITS,
    ALL_VOLUME_UNITS,
    ALL_WEIGHT_UNITS,
    DEFAULT_OPTIONS,
    DOMAIN,
    MAX_BIRTHDAY_AGE_YEARS,
    OPT_ENABLE_PUMPING,
    OPT_LENGTH_UNIT,
    OPT_PRESENCE_INFERENCE_WINDOW_MINUTES,
    OPT_VACCINE_GRACE_DAYS,
    OPT_VACCINE_SCHEDULE,
    OPT_VOLUME_UNIT,
    OPT_WEIGHT_UNIT,
    OPT_WHO_CDC_HANDOFF_MONTHS,
    RESERVED_SLUGS,
)


def _validate_birthday(value: str) -> str:
    try:
        parsed = date.fromisoformat(value)
    except ValueError as err:
        raise vol.Invalid("invalid_date") from err
    today = date.today()
    if parsed > today:
        raise vol.Invalid("birthday_future")
    ceiling = date(today.year - MAX_BIRTHDAY_AGE_YEARS, today.month, today.day)
    if parsed < ceiling:
        raise vol.Invalid("birthday_too_old")
    return value


def _validate_name(value: str) -> str:
    trimmed = (value or "").strip()
    if not trimmed or len(trimmed) > 40:
        raise vol.Invalid("name_length")
    return trimmed


def _add_baby_schema(defaults: dict[str, Any] | None = None) -> vol.Schema:
    defaults = defaults or {}
    return vol.Schema(
        {
            vol.Required(CONF_NAME, default=defaults.get(CONF_NAME, "")): str,
            vol.Required(
                "birthday", default=defaults.get("birthday")
            ): selector.DateSelector(),
            vol.Required("sex", default=defaults.get("sex", "female")): vol.In(
                ["female", "male"]
            ),
            vol.Optional("avatar_url", default=defaults.get("avatar_url", "")): str,
        }
    )


def _eligibility_schema(defaults: dict[str, Any] | None = None) -> vol.Schema:
    defaults = defaults or {}
    return vol.Schema(
        {
            vol.Required(
                "enabled_activities",
                default=defaults.get("enabled_activities", list(ALL_ACTIVITIES)),
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=list(ALL_ACTIVITIES),
                    multiple=True,
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
            vol.Required(
                "enabled_feeding_methods",
                default=defaults.get(
                    "enabled_feeding_methods", list(ALL_FEEDING_METHODS)
                ),
            ): selector.SelectSelector(
                selector.SelectSelectorConfig(
                    options=list(ALL_FEEDING_METHODS),
                    multiple=True,
                    mode=selector.SelectSelectorMode.LIST,
                )
            ),
        }
    )


class BabytrackerConfigFlow(ConfigFlow, domain=DOMAIN):
    """Initial setup: welcome → add baby → eligibility → confirm."""

    VERSION = 1

    def __init__(self) -> None:
        self._pending_baby: dict[str, Any] = {}

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is None:
            return self.async_show_form(step_id="user")
        return await self.async_step_add_baby()

    async def async_step_add_baby(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                name = _validate_name(user_input[CONF_NAME])
            except vol.Invalid:
                errors[CONF_NAME] = "name_length"
                name = user_input.get(CONF_NAME, "")
            try:
                birthday = _validate_birthday(user_input["birthday"])
            except vol.Invalid as err:
                errors["birthday"] = str(err)
                birthday = user_input.get("birthday")
            slug = slugify(name) if name else ""
            if slug in RESERVED_SLUGS:
                errors[CONF_NAME] = "slug_reserved"
            if not errors:
                self._pending_baby = {
                    CONF_NAME: name,
                    "birthday": birthday,
                    "sex": user_input["sex"],
                    "slug": slug,
                    "avatar_url": user_input.get("avatar_url") or None,
                }
                return await self.async_step_eligibility()
        return self.async_show_form(
            step_id="add_baby",
            data_schema=_add_baby_schema(user_input),
            errors=errors,
        )

    async def async_step_eligibility(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._pending_baby["enabled_activities"] = list(
                user_input["enabled_activities"]
            )
            self._pending_baby["enabled_feeding_methods"] = list(
                user_input["enabled_feeding_methods"]
            )
            return await self.async_step_confirm()
        return self.async_show_form(
            step_id="eligibility",
            data_schema=_eligibility_schema(),
        )

    async def async_step_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is None:
            return self.async_show_form(
                step_id="confirm",
                description_placeholders={
                    "name": self._pending_baby[CONF_NAME],
                    "birthday": self._pending_baby["birthday"],
                    "sex": self._pending_baby["sex"],
                },
            )
        return self.async_create_entry(
            title="babytracker",
            data={},
            options={**DEFAULT_OPTIONS, "pending_baby": self._pending_baby},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return BabytrackerOptionsFlow(config_entry)


class BabytrackerOptionsFlow(OptionsFlow):
    """Re-entrable options: manage babies + integration-wide options."""

    def __init__(self, config_entry: ConfigEntry) -> None:
        self._entry = config_entry
        self._working_baby_id: str | None = None
        self._pending_baby: dict[str, Any] = {}

    @property
    def _coordinator(self):
        runtime = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id)
        return runtime["coordinator"] if runtime else None

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return await self.async_step_main_menu()

    async def async_step_main_menu(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="main_menu",
            menu_options=[
                "add_baby",
                "edit_baby",
                "archive_baby",
                "unarchive_baby",
                "manage_importers",
                "integration_options",
            ],
        )

    # ---- Add baby ---------------------------------------------------
    async def async_step_add_baby(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                name = _validate_name(user_input[CONF_NAME])
            except vol.Invalid:
                errors[CONF_NAME] = "name_length"
                name = user_input.get(CONF_NAME, "")
            try:
                birthday = _validate_birthday(user_input["birthday"])
            except vol.Invalid as err:
                errors["birthday"] = str(err)
                birthday = user_input.get("birthday")
            slug = slugify(name) if name else ""
            if slug in RESERVED_SLUGS:
                errors[CONF_NAME] = "slug_reserved"
            elif self._coordinator and self._coordinator.slug_collides(slug):
                errors[CONF_NAME] = "slug_collision"
            if not errors:
                self._pending_baby = {
                    CONF_NAME: name,
                    "birthday": birthday,
                    "sex": user_input["sex"],
                    "slug": slug,
                    "avatar_url": user_input.get("avatar_url") or None,
                }
                return await self.async_step_add_baby_eligibility()
        return self.async_show_form(
            step_id="add_baby",
            data_schema=_add_baby_schema(user_input),
            errors=errors,
        )

    async def async_step_add_baby_eligibility(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            self._pending_baby["enabled_activities"] = list(
                user_input["enabled_activities"]
            )
            self._pending_baby["enabled_feeding_methods"] = list(
                user_input["enabled_feeding_methods"]
            )
            if self._coordinator:
                await self._coordinator.add_baby(
                    name=self._pending_baby[CONF_NAME],
                    birthday=self._pending_baby["birthday"],
                    sex=self._pending_baby["sex"],
                    enabled_activities=self._pending_baby["enabled_activities"],
                    enabled_feeding_methods=self._pending_baby[
                        "enabled_feeding_methods"
                    ],
                    avatar_url=self._pending_baby.get("avatar_url"),
                )
            return self.async_create_entry(title="", data=self._entry.options)
        return self.async_show_form(
            step_id="add_baby_eligibility",
            data_schema=_eligibility_schema(),
        )

    # ---- Edit baby --------------------------------------------------
    async def async_step_edit_baby(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        coord = self._coordinator
        if not coord or not coord.babies:
            return self.async_abort(reason="no_babies")
        if user_input is None:
            return self.async_show_form(
                step_id="edit_baby",
                data_schema=vol.Schema(
                    {
                        vol.Required("baby_id"): vol.In(
                            {b.id: b.name for b in coord.babies}
                        )
                    }
                ),
            )
        self._working_baby_id = user_input["baby_id"]
        return await self.async_step_edit_baby_form()

    async def async_step_edit_baby_form(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        coord = self._coordinator
        baby = coord.baby_by_id(self._working_baby_id) if coord else None
        if not baby:
            return self.async_abort(reason="unknown_baby")
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                name = _validate_name(user_input[CONF_NAME])
            except vol.Invalid:
                errors[CONF_NAME] = "name_length"
                name = user_input.get(CONF_NAME, baby.name)
            try:
                birthday = _validate_birthday(user_input["birthday"])
            except vol.Invalid as err:
                errors["birthday"] = str(err)
                birthday = user_input.get("birthday", baby.birthday)
            if not errors:
                await coord.update_baby(
                    baby.id,
                    name=name,
                    birthday=birthday,
                    sex=user_input["sex"],
                    avatar_url=user_input.get("avatar_url") or None,
                    enabled_activities=list(user_input["enabled_activities"]),
                    enabled_feeding_methods=list(user_input["enabled_feeding_methods"]),
                )
                return self.async_create_entry(title="", data=self._entry.options)
        schema = _add_baby_schema(
            {
                CONF_NAME: baby.name,
                "birthday": baby.birthday,
                "sex": baby.sex,
                "avatar_url": baby.avatar_url or "",
            }
        ).extend(
            _eligibility_schema(
                {
                    "enabled_activities": baby.enabled_activities,
                    "enabled_feeding_methods": baby.enabled_feeding_methods,
                }
            ).schema
        )
        return self.async_show_form(
            step_id="edit_baby_form",
            data_schema=schema,
            errors=errors,
        )

    # ---- Archive / unarchive ---------------------------------------
    async def async_step_archive_baby(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        coord = self._coordinator
        active = [b for b in (coord.babies if coord else []) if not b.archived]
        if not active:
            return self.async_abort(reason="no_babies")
        if user_input is None:
            return self.async_show_form(
                step_id="archive_baby",
                data_schema=vol.Schema(
                    {vol.Required("baby_id"): vol.In({b.id: b.name for b in active})}
                ),
            )
        await coord.archive_baby(user_input["baby_id"])
        return self.async_create_entry(title="", data=self._entry.options)

    async def async_step_unarchive_baby(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        coord = self._coordinator
        archived = [b for b in (coord.babies if coord else []) if b.archived]
        if not archived:
            return self.async_abort(reason="no_archived")
        if user_input is None:
            return self.async_show_form(
                step_id="unarchive_baby",
                data_schema=vol.Schema(
                    {vol.Required("baby_id"): vol.In({b.id: b.name for b in archived})}
                ),
            )
        await coord.unarchive_baby(user_input["baby_id"])
        return self.async_create_entry(title="", data=self._entry.options)

    # ---- Importer management (functional in M8) --------------------
    async def async_step_manage_importers(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        coord = self._coordinator
        babies = [b for b in (coord.babies if coord else []) if not b.archived]
        if not babies:
            return self.async_abort(reason="no_babies")
        if user_input is None:
            return self.async_show_form(
                step_id="manage_importers",
                data_schema=vol.Schema(
                    {vol.Required("baby_id"): vol.In({b.id: b.name for b in babies})}
                ),
            )
        self._working_baby_id = user_input["baby_id"]
        return await self.async_step_importer_form()

    async def async_step_importer_form(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        coord = self._coordinator
        baby = coord.baby_by_id(self._working_baby_id) if coord else None
        if not baby:
            return self.async_abort(reason="unknown_baby")
        importer = baby.importer or {}
        if user_input is not None:
            sensor_id = (user_input.get("source_entity_id") or "").strip()
            new_importer = None
            if sensor_id:
                new_importer = {
                    "source_entity_id": sensor_id,
                    "import_types": list(user_input["import_types"]),
                    "mark_readonly": user_input["mark_readonly"],
                    "daycare_location_label": user_input.get(
                        "daycare_location_label", "daycare"
                    )
                    or "daycare",
                    "daycare_open_time": user_input.get("daycare_open_time") or None,
                    "daycare_close_time": user_input.get("daycare_close_time") or None,
                    "daycare_days": list(user_input.get("daycare_days") or []),
                    "block_local_while_checked_in": user_input[
                        "block_local_while_checked_in"
                    ],
                    "presence_inference_window_minutes": user_input.get(
                        "presence_inference_window_minutes", 60
                    ),
                    "mode": importer.get("mode", "inference_window"),
                }
            await coord.set_baby_importer(baby.id, new_importer)
            return self.async_create_entry(title="", data=self._entry.options)
        schema = vol.Schema(
            {
                vol.Optional(
                    "source_entity_id",
                    default=importer.get("source_entity_id", ""),
                ): str,
                vol.Required(
                    "import_types",
                    default=importer.get(
                        "import_types", ["feeding", "sleep", "diaper"]
                    ),
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=["feeding", "sleep", "diaper", "photo", "note"],
                        multiple=True,
                    )
                ),
                vol.Required(
                    "mark_readonly",
                    default=importer.get("mark_readonly", True),
                ): bool,
                vol.Optional(
                    "daycare_location_label",
                    default=importer.get("daycare_location_label", "daycare"),
                ): str,
                vol.Optional(
                    "daycare_open_time",
                    default=importer.get("daycare_open_time", ""),
                ): str,
                vol.Optional(
                    "daycare_close_time",
                    default=importer.get("daycare_close_time", ""),
                ): str,
                vol.Required(
                    "daycare_days",
                    default=importer.get(
                        "daycare_days", ["mon", "tue", "wed", "thu", "fri"]
                    ),
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                        multiple=True,
                    )
                ),
                vol.Required(
                    "block_local_while_checked_in",
                    default=importer.get("block_local_while_checked_in", True),
                ): bool,
                vol.Optional(
                    "presence_inference_window_minutes",
                    default=importer.get("presence_inference_window_minutes", 60),
                ): vol.All(vol.Coerce(int), vol.Range(min=10, max=480)),
            }
        )
        return self.async_show_form(step_id="importer_form", data_schema=schema)

    # ---- Integration options ---------------------------------------
    async def async_step_integration_options(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        current = {**DEFAULT_OPTIONS, **(self._entry.options or {})}
        if user_input is not None:
            new_options = dict(self._entry.options or {})
            new_options.update(user_input)
            return self.async_create_entry(title="", data=new_options)
        schema = vol.Schema(
            {
                vol.Required(
                    OPT_VOLUME_UNIT, default=current[OPT_VOLUME_UNIT]
                ): vol.In(list(ALL_VOLUME_UNITS)),
                vol.Required(
                    OPT_WEIGHT_UNIT, default=current[OPT_WEIGHT_UNIT]
                ): vol.In(list(ALL_WEIGHT_UNITS)),
                vol.Required(
                    OPT_LENGTH_UNIT, default=current[OPT_LENGTH_UNIT]
                ): vol.In(list(ALL_LENGTH_UNITS)),
                vol.Required(
                    OPT_ENABLE_PUMPING, default=current[OPT_ENABLE_PUMPING]
                ): bool,
                vol.Required(
                    OPT_VACCINE_SCHEDULE, default=current[OPT_VACCINE_SCHEDULE]
                ): vol.In(["us_cdc", "uk_nhs"]),
                vol.Required(
                    OPT_VACCINE_GRACE_DAYS,
                    default=current[OPT_VACCINE_GRACE_DAYS],
                ): vol.All(vol.Coerce(int), vol.Range(min=0, max=365)),
                vol.Required(
                    OPT_WHO_CDC_HANDOFF_MONTHS,
                    default=current[OPT_WHO_CDC_HANDOFF_MONTHS],
                ): vol.All(vol.Coerce(int), vol.Range(min=12, max=60)),
                vol.Required(
                    OPT_PRESENCE_INFERENCE_WINDOW_MINUTES,
                    default=current[OPT_PRESENCE_INFERENCE_WINDOW_MINUTES],
                ): vol.All(vol.Coerce(int), vol.Range(min=10, max=480)),
            }
        )
        return self.async_show_form(
            step_id="integration_options", data_schema=schema
        )
