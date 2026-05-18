"""Eligibility + daycare-lockout unit tests."""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1] / "custom_components" / "babytracker"


def _load(name, rel):
    spec = importlib.util.spec_from_file_location(name, ROOT / rel)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


# Need to load const + models + eligibility while the module package is not
# importable through HA's loader. Use direct file loading.
const_module = _load("const", "const.py")
sys.modules.setdefault("const", const_module)
models_module = _load("models", "models.py")
sys.modules.setdefault("models", models_module)
# `eligibility.py` does `from .const import DOMAIN` etc. — patch its package
# by re-executing under a synthetic package.
package_spec = importlib.util.spec_from_loader("_bt_pkg", loader=None, is_package=True)
package = importlib.util.module_from_spec(package_spec)
sys.modules["_bt_pkg"] = package
package.const = const_module
package.models = models_module
sys.modules["_bt_pkg.const"] = const_module
sys.modules["_bt_pkg.models"] = models_module
elig_spec = importlib.util.spec_from_file_location(
    "_bt_pkg.eligibility", ROOT / "eligibility.py"
)
eligibility = importlib.util.module_from_spec(elig_spec)
elig_spec.loader.exec_module(eligibility)


def _baby(**kwargs):
    defaults = {
        "id": "1",
        "slug": "ava",
        "name": "Ava",
        "birthday": "2025-12-01",
        "sex": "female",
    }
    defaults.update(kwargs)
    return models_module.Baby.from_dict(defaults)


def test_find_baby_by_slug_finds():
    baby = _baby()
    found = eligibility.find_baby_by_slug([baby], "ava")
    assert found is baby


def test_find_baby_by_slug_skips_archived():
    baby = _baby(archived=True)
    with pytest.raises(Exception):
        eligibility.find_baby_by_slug([baby], "ava")


def test_eligibility_blocks_disabled_activity():
    baby = _baby(enabled_activities=["feeding"])
    with pytest.raises(Exception):
        eligibility.ensure_activity_enabled(baby, "vaccine")


def test_eligibility_blocks_disabled_feeding_method():
    baby = _baby(enabled_feeding_methods=["bottle"])
    with pytest.raises(Exception):
        eligibility.ensure_feeding_method_enabled(baby, "breast_left")


def test_daycare_lockout_blocks_when_checked_in():
    baby = _baby(importer={"block_local_while_checked_in": True})
    with pytest.raises(Exception):
        eligibility.ensure_local_not_locked_out(baby, True, "user")


def test_daycare_lockout_passes_for_procare_source():
    baby = _baby(importer={"block_local_while_checked_in": True})
    eligibility.ensure_local_not_locked_out(baby, True, "procare")  # no raise


def test_daycare_lockout_opt_out():
    baby = _baby(importer={"block_local_while_checked_in": False})
    eligibility.ensure_local_not_locked_out(baby, True, "user")  # no raise
