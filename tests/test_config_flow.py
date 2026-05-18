"""Config flow tests (require pytest-homeassistant-custom-component)."""
from __future__ import annotations

from datetime import date, timedelta

import pytest
from homeassistant import data_entry_flow
from homeassistant.core import HomeAssistant

from custom_components.babytracker.const import DOMAIN


@pytest.mark.asyncio
async def test_full_user_flow(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={}
    )
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "add_baby"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            "name": "Ava",
            "birthday": "2025-12-01",
            "sex": "female",
            "avatar_url": "",
        },
    )
    assert result["type"] == data_entry_flow.FlowResultType.FORM
    assert result["step_id"] == "eligibility"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            "enabled_activities": [
                "feeding",
                "sleep",
                "tummy_time",
                "diaper",
                "growth",
                "medication",
                "vaccine",
            ],
            "enabled_feeding_methods": ["bottle", "solids"],
        },
    )
    assert result["step_id"] == "confirm"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={}
    )
    assert result["type"] == data_entry_flow.FlowResultType.CREATE_ENTRY


@pytest.mark.asyncio
async def test_rejects_future_birthday(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={}
    )
    future = (date.today() + timedelta(days=365)).isoformat()
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            "name": "Ava",
            "birthday": future,
            "sex": "female",
            "avatar_url": "",
        },
    )
    assert result["errors"].get("birthday") == "birthday_future"


@pytest.mark.asyncio
async def test_rejects_reserved_slug(hass: HomeAssistant) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            "name": "babytracker",
            "birthday": "2025-01-01",
            "sex": "female",
            "avatar_url": "",
        },
    )
    assert result["errors"].get("name") == "slug_reserved"
