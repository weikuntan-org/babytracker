"""Smoke tests for intent registration (require HA)."""
from __future__ import annotations

import pytest


@pytest.mark.asyncio
async def test_intent_module_exposes_handlers():
    # Module-level import smoke test — proves intents.py is importable
    # without needing a running HA at import time.
    from custom_components.babytracker import intents

    assert hasattr(intents, "_INTENTS")
    assert any(
        h.intent_type == "BabytrackerLogDiaper" for h in (cls() for cls in intents._INTENTS)
    )


@pytest.mark.asyncio
async def test_intents_yaml_loads():
    """Sanity check that intents.yaml parses as YAML."""
    import yaml
    from pathlib import Path

    path = (
        Path(__file__).resolve().parents[1]
        / "custom_components"
        / "babytracker"
        / "intents.yaml"
    )
    data = yaml.safe_load(path.read_text("utf-8"))
    assert data["language"] == "en"
    assert "BabytrackerLogDiaper" in data["intents"]
