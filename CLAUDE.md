# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Home Assistant custom integration (`custom_components/babytracker/`) plus a bundled Lovelace bundle (`custom_components/babytracker/frontend/babytracker-card.js`) that registers two custom elements: `babytracker-card` (main per-baby UI) and `babytracker-growth-card` (standalone growth panel). The integration is `single_config_entry: true` — multi-baby support is internal, not a per-entry concept. All state lives in HA's `Store` (single JSON file under `.storage/babytracker`, rewritten in full on each mutation); there are no external services and no third-party Python deps (`manifest.requirements` stays `[]`).

The authoritative spec is `SPECS.md`. The Python code is sprinkled with section references like `§4.10`, `§8.2`, `§12 #25` — when a design choice looks surprising, the answer is usually in SPECS.md at that reference.

## Commands

```bash
# Python tests (uses pytest-homeassistant-custom-component for HA fixtures)
pip install -r requirements-dev.txt
pytest -q                                  # all tests
pytest tests/test_eligibility.py -q        # one file
pytest tests/test_eligibility.py::test_X   # one test
# Pure-Python tests work without HA installed; test_config_flow.py needs
# home-assistant-frontend (pinned in requirements-dev.txt).

# Frontend (Lit/TS source — see "Two card implementations" below)
cd frontend-src
npm install
npm test                                   # vitest
npm run build                              # vite → custom_components/babytracker/frontend/
```

CI runs on `ubuntu-latest` (`.github/workflows/tests.yml`, `validate.yml`, `release.yml`). `validate.yml` runs `hacs/action` + `hassfest`; `release.yml` builds the card on tag push and fails if the built artefact drifts from what's committed.

## Architecture cheatsheet

- **`coordinator.py`** owns the in-memory `babies`/`entries` lists and all mutations; every mutation goes through it, persists via `BabytrackerStore`, then fires `SIGNAL_DATA_UPDATED`. Sensors and the WS layer subscribe to that dispatcher signal — never read storage directly.
- **`models.py`** holds `Baby`/`Entry` dataclasses. `Baby.slug` is stamped from `name` at creation via `homeassistant.util.slugify` and **never changes** — entity IDs (`sensor.<slug>_*`) are permanent, even on rename. Reserved slug `babytracker` is rejected at config flow.
- **`sensor.py` / `binary_sensor.py`** enumerate ~40 per-baby entities; they all listen on `SIGNAL_DATA_UPDATED` and pull from the coordinator. Eligibility (`baby.enabled_activities`, `enabled_feeding_methods`) gates which entities are registered.
- **`services.py` + `services.yaml`** are the public mutation API (`babytracker.log_diaper`, `start_feeding`, `export_report`, etc.). `intents.py` wraps a subset for Assist.
- **`percentiles.py`** is a hand-rolled LMS engine over vendored WHO/CDC tables in `data/lms/` — Φ comes from `math.erf`, no `scipy`. The WHO↔CDC handoff age is configurable (`OPT_WHO_CDC_HANDOFF_MONTHS`, default 24).
- **`websocket_api.py`** exposes `babytracker/list_babies`, `get_baby_config`, `get_integration_options` for the card. **Subscribe pattern gotcha**: the initial payload is sent via `send_result`, which resolves the JS `subscribeMessage` promise but does *not* invoke its callback. If you add a new subscribable command, push an initial `event_message` right after wiring the dispatcher subscription (see `_ws_get_baby_config`).
- **`importers/procare.py`** is opt-in; it subscribes to the community [`procare_activities`](https://github.com/nmanclank/ha-procare-activity-fetcher) integration's per-kid sensor (`sensor.<kid_slug>_latest_activity`, one per kid) and reads the `activities` attribute (list of `{id, timestamp, title, details, staff, photo_url}`). The importer dedups by `(source, source_id)` and routes recognised activity titles to the coordinator. Title→type mappings live in `importers/procare_mappings.py` — unmapped titles surface in HA logs as `babytracker: unmapped Procare title <title>` and are tracked in `sensor.babytracker_unmapped_procare_titles`. The presence-inference window is configurable (`OPT_PRESENCE_INFERENCE_WINDOW_MINUTES`).
- **`__init__.py`** registers the card via `add_extra_js_url(hass, "/babytracker_static/...")` — this only attaches the JS to **YAML-mode** dashboards. Storage-mode users have to add a Lovelace **Resource** manually (URL `/babytracker_static/babytracker-card.js`, type `JavaScript Module`).

## Two card implementations — they have diverged

- `custom_components/babytracker/frontend/babytracker-card.js` (511 lines, hand-written vanilla JS using template strings + `data-service` click delegation) — **this is what HA actually loads.**
- `frontend-src/src/babytracker-card.ts` (Lit + decorators, decomposed into `components/quick-log.ts` etc., with vitest coverage) — has the same intent but was written independently. Running `vite build` produces an ES-module artefact incompatible with the current static-path layout.

When editing card behavior, patch the vanilla JS for any user-facing change *and* mirror in the TS source so they stay aligned. Eventual cleanup is to pick one as canonical (see open question — the audit hasn't been done).

## Test conventions

- `test_config_flow.py` uses `pytest-homeassistant-custom-component`'s `hass` fixture (full HA bootstrap; needs `home-assistant-frontend`).
- `test_eligibility.py`, `test_export.py`, `test_minutes_in_day.py`, `test_procare_mappings.py` load modules without booting HA via `importlib.util.spec_from_file_location`. **Critical:** these helpers must `sys.modules[name] = module` **before** `spec.loader.exec_module(module)` — Python 3.12's `@dataclass` looks up `cls.__module__` in `sys.modules` and crashes with `AttributeError: 'NoneType' object has no attribute '__dict__'` otherwise.
- `tests/conftest.py` autouse-enables custom integrations via `enable_custom_integrations`.

## HACS / hassfest gotchas

- `custom_components/babytracker/manifest.json` keys must be sorted as: `domain`, `name`, then everything else **alphabetical** (hassfest enforces).
- `manifest.json` must not contain non-standard fields (e.g. `minimum_ha_version` — declare HA minimum in `hacs.json` instead).
- A 256×256 brand icon must exist at `custom_components/babytracker/brand/icon.png` (HACS brands check). The current one is a placeholder.
- The integration declares `CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)` because it implements `async_setup`; removing this triggers a hassfest warning.

## Branch hygiene

`main` is protected: PR required. Solo-dev workflow is "open PR → CI passes → `gh pr merge --admin --squash --delete-branch`". Don't push directly to main.
