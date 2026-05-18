# babytracker — Home Assistant Custom Integration

A native Home Assistant integration for logging and tracking infant care
activities (feeding, sleep, tummy time, diapers, pumping, growth, medication,
vaccines) entirely within HA, with data stored locally and an optional
pediatrician-friendly export.

Status: spec — not yet implemented.

---

## 1. Goals

- Track everyday baby-care activities through Home Assistant.
- All data stays local in HA's storage; no external service or cloud sync.
- Logging happens primarily through tappable Lovelace dashboard buttons.
- Designed to be installable via HACS and pass `hassfest` / HACS validation.

## 2. Non-goals (v1)

- **Bespoke chat-app or messenger clients** — no WhatsApp, Telegram,
  Signal, Discord, Slack, Matrix, SMS, or iMessage code lives inside
  babytracker. §10 spells out how users wire these up with HA's
  existing `notify` platform and Assist intents.
- **Physical-button or mobile actionable-notification UX** beyond the
  Lovelace card. The integration exposes services so users can wire
  Zigbee buttons, ESPHome devices, or mobile-app quick actions to
  them, but no shipped UI for those surfaces.
- Multi-user attribution (which parent logged the entry).
- Cloud backup or sharing babytracker data **back** to daycare /
  caregiver systems. (We *import* from daycare via §4.6; we don't
  push our log outward.)
- Trend forecasting / pediatric AI advice. Percentiles are computed from
  static reference data only; no predictive modelling.

## 3. User stories

1. As a parent, I tap a tile on my HA dashboard to log a wet diaper for
   "Ava" and see her diaper count for today update immediately.
2. As a parent, I start a sleep session when Ava goes down, and end it
   when she wakes; `binary_sensor.ava_sleeping` reflects state for
   automations (e.g. white-noise scene), and total nap time for the day
   is available as a sensor.
3. As a parent of twins, every action is namespaced per child — I can
   log a feeding for "Ben" without affecting Ava's counters.
4. As a tired parent, I tapped the wrong button. I open a "Recent
   entries" panel, find the bad entry, and delete or edit it.
5. As a parent recording growth, I log weight and height at a
   pediatrician visit; the latest measurement is shown as a sensor,
   along with the WHO/CDC percentile for the child's age and sex.
6. As a parent using my HA dashboard, I install a single Lovelace
   card per baby that surfaces today's counts, last-event times, a
   start/stop-sleep tile, quick-log buttons, growth charts with
   percentile bands, and a recent-entries list with delete buttons —
   without writing Lovelace YAML.
7. As a parent whose child attends a daycare on Procare Connect, I
   point babytracker at the existing `procare_activities` integration;
   diapers, meals, naps, and photos logged by daycare staff appear
   automatically in babytracker alongside what I logged at home, with
   no double-entry and no second login.
8. As a parent attaching a quick photo (a first-foods plate, a diaper
   rash for the pediatrician), I add a `photo_path` to any entry and
   the card thumbnails it inline.
9. As a parent preparing for a pediatrician visit, I call
   `babytracker.export_report` and get a single printable HTML page
   (and a matching CSV) covering feedings, sleep, diapers, growth,
   percentiles, vaccines, and medications for a chosen date range.
10. As a parent following my country's recommended vaccine schedule,
    I log each dose with date and provider; `sensor.<baby>_vaccines_due`
    warns me when the next scheduled dose is approaching or overdue.

## 4. Functional requirements

### 4.1 Baby registry

Each baby is represented by a record with these fields:

| Field                       | Type                              | Required | Notes                                                                 |
| --------------------------- | --------------------------------- | :------: | --------------------------------------------------------------------- |
| `id`                        | str (UUID4, `str(uuid.uuid4())`)  |    ✓     | Stamped at config-flow exit; never reused.                            |
| `slug`                      | str (`homeassistant.util.slugify(name)` at *creation*) | ✓ | Drives entity ids; **never** changes after creation. Renames update `name` only. |
| `name`                      | str                               |    ✓     | 1–40 chars; Unicode allowed; whitespace-trimmed. Slug derived from this at creation. |
| `birthday`                  | str (`YYYY-MM-DD`)                |    ✓     | Must be ≤ today (no future) and ≥ 25 years ago (CDC chart ceiling). |
| `sex`                       | `"male" \| "female"`              |    ✓     | Required at creation (§12 #6).                                        |
| `avatar_url`                | str \| null                       |          | Free-form URL or `media-source://`; not validated.                    |
| `enabled_activities`        | list[str]                         |    ✓     | Defaults to all (§4.10).                                              |
| `enabled_feeding_methods`   | list[str]                         |    ✓     | Defaults to all four (§4.10).                                         |
| `archived`                  | bool                              |          | Default `false`. Archived babies stay in storage for export (§12 #21) but their entities are unregistered and they don't appear in selectors. |

Slug rules (§12 #22):

- `slug = slugify(name)` at creation; `slugify` is HA's
  `homeassistant.util.slugify` (lowercases, ASCII-folds, replaces
  non-alphanumeric runs with `_`).
- Reject the baby at config-flow validation if `slug` collides with
  any **non-archived** existing baby's `slug` (case-insensitive).
- Reject the reserved slug `babytracker` (collides with global
  entity prefixes).
- Renaming a baby keeps the original `slug` so entity ids stay
  stable; only `name` changes.

Config flow steps (initial setup, first run only):

1. **Welcome** — informational; explains that the integration is
   single-entry and asks the user to add at least one baby to
   proceed.
2. **Add baby** — fields: `name` (text), `birthday` (date picker),
   `sex` (select: Male / Female). Validation errors render inline.
3. **Eligibility** — checkboxes for `enabled_activities` (all on
   by default) and `enabled_feeding_methods` (all on by default).
   Shown collapsed under an "Advanced" toggle so the common case
   is one click.
4. **Confirm** — review screen; submit creates the entry.

Options flow (re-entrable from Settings → Devices & Services):

- **Main page** — list of babies (name, slug, age); buttons:
  `Add baby`, `Edit baby`, `Archive baby`, `Unarchive baby`,
  `Restore baby`, `Manage importers`, `Integration options`.
- **Add baby** — same three-step subflow as items 2–4 above.
- **Edit baby** — same form pre-populated. `slug` is read-only.
- **Archive baby** — confirmation dialog; sets `archived: true`,
  unregisters entities. Reversible.
- **Manage importers** — per-baby Procare entity mapping (§4.6).
- **Integration options** — global toggles: `volume_unit` default
  (ml/oz, §12 #1), `weight_unit`, `length_unit`, `enable_pumping`
  (§12 #18), `vaccine_schedule` (`us_cdc` / `uk_nhs` / …, §12 #13),
  `vaccine_grace_days` (default 14, §12 #14),
  `who_cdc_handoff_months` (default 24, §12 #7),
  `presence_inference_window_minutes` (default 60, §4.6).

At least one non-archived baby must exist before any logging
service will accept calls. Eligibility (`enabled_activities`,
`enabled_feeding_methods`) is detailed in §4.10.

### 4.2 Activities

Each activity type has a "log" service call (and, where applicable,
start/end pair for timed sessions).

| Type        | Mode             | Required fields                  | Optional fields                                |
| ----------- | ---------------- | -------------------------------- | ---------------------------------------------- |
| feeding     | one-shot or timed| `baby`, `method`                 | `amount`, `unit`, `started_at`, `ended_at`, `notes` |
| sleep       | timed (start/end)| `baby`                           | `location`, `notes`                            |
| tummy_time  | timed (start/end)| `baby`                           | `notes`                                        |
| diaper      | one-shot         | `baby`, `kind`                   | `notes`                                        |
| pumping     | one-shot         | `volume`, `unit`                 | `side`, `duration`, `notes` *(not per-baby)*   |
| growth      | one-shot         | `baby` and at least one measure  | `weight`, `height`, `head_circumference`, units, `notes` |
| medication  | one-shot         | `baby`, `name`, `dose`, `unit`   | `notes`                                        |
| vaccine     | one-shot         | `baby`, `name`                   | `dose_number`, `lot_number`, `provider`, `site`, `notes` |

Common optional fields on **every** entry type: `photo_path` (a path
resolvable through HA's `media_source`, e.g. `media-source://media_source/local/babytracker/ava/2026-05-17.jpg`)
and `notes`.

Field vocabularies:
- `method` (feeding): `bottle | breast_left | breast_right | solids`
  — left/right *is* the method, not a separate field, so a feeding
  entry never has both a `method=breast_left` and a `side=…`.
- `kind` (diaper): `wet | dirty | both`
- `side` (pumping only): `left | right | both`
- `unit` (volume): `ml | oz`
- units (growth): `kg | lb`, `cm | in`
- `site` (vaccine): `left_thigh | right_thigh | left_arm | right_arm | oral | nasal`

### 4.3 Edit / delete

- Every logged entry has a stable `id` (uuid).
- Services `babytracker.edit_entry` and `babytracker.delete_entry`
  operate by `id`.
- A "recent entries" sensor (per baby, plus a global list) exposes the
  last N entries with their ids so users can build a Lovelace
  markdown/entity card to find and delete them.

### 4.4 Daily counters

"Today" is defined as the local HA-timezone calendar day. Timed
sessions that cross midnight (sleep, tummy time, long feedings)
are split for counting purposes: each day gets the minutes that
occurred within it.

### 4.5 Growth percentiles

For each `log_growth` entry, the integration computes percentiles
from static WHO and CDC reference data using the LMS method:

```
Z = ((X / M)^L − 1) / (L · S)        if L ≠ 0
Z = ln(X / M) / S                    if L = 0
percentile = Φ(Z) · 100              (Φ = standard-normal CDF)
```

Reference data shipped with the integration:

| Source | Range          | Indicators                                                          |
| ------ | -------------- | ------------------------------------------------------------------- |
| WHO    | 0 – 24 months  | weight-for-age, length-for-age, head-circumference-for-age, weight-for-length, BMI-for-age |
| CDC    | 24 mo – 20 yr  | weight-for-age, stature-for-age, weight-for-stature, BMI-for-age    |

LMS tables are stored as JSON in
`custom_components/babytracker/data/lms/`, one file per
indicator × sex × source, and loaded once at startup. Source
files are vendored from the WHO and CDC public datasets with a
`SOURCES.md` documenting the download URLs and licence (WHO and
CDC growth standards are public-domain / freely usable).

#### LMS file schema

Each file conforms to this shape (example: `who_wfa_girls.json`):

```jsonc
{
  "indicator": "weight_for_age",    // see indicators table below
  "sex": "female",                  // "male" | "female"
  "source": "WHO",                  // "WHO" | "CDC" — drives the percentile sensor's `source` attribute
  "data_version": "who_2006_v1",    // bumped when reference tables change
  "x_axis": "age_days",             // "age_days" for *-for-age; "length_cm" for weight-for-length; "stature_cm" for weight-for-stature
  "y_axis": "weight_kg",            // "weight_kg" | "length_cm" | "head_kg" | "bmi" — units that LMS table values are in
  "rows": [
    { "x": 0,   "L": 0.3809, "M": 3.2322, "S": 0.14171 },
    { "x": 1,   "L": 0.3866, "M": 3.2517, "S": 0.14150 },
    { "x": 2,   "L": 0.3923, "M": 3.2712, "S": 0.14129 }
    // … one row per integer x value across the reference range
  ]
}
```

Indicators expected to ship in v1:

| Indicator                       | x_axis      | y_axis     | WHO range | CDC range |
| ------------------------------- | ----------- | ---------- | --------- | --------- |
| `weight_for_age`                | `age_days`  | `weight_kg`| 0–730 d   | 730–7300 d|
| `length_for_age` / `stature_for_age` | `age_days`  | `length_cm`| 0–730 d   | 730–7300 d|
| `head_circumference_for_age`    | `age_days`  | `length_cm`| 0–730 d   | (n/a)     |
| `weight_for_length`             | `length_cm` | `weight_kg`| 45–110 cm | (n/a)     |
| `weight_for_stature` (CDC only) | `stature_cm`| `weight_kg`| (n/a)     | 77–121 cm |
| `bmi_for_age`                   | `age_days`  | `bmi`      | 0–730 d   | 730–7300 d|

The percentile module:

- Reads the relevant file for `(indicator, sex, source)` where
  `source` is chosen by the WHO↔CDC handoff age (§12 #7).
- For an input `x_input` (e.g. age in days) not on an integer row,
  linearly interpolate `L`, `M`, `S` between the two surrounding rows.
- Computes Z via the LMS formula above.
- Computes percentile via `0.5 * (1 + math.erf(z / math.sqrt(2)))` ×
  100 — **no `scipy` dependency** (hand-rolled `Φ` keeps
  `requirements: []`).

BMI and unit conversion rules:

- BMI = `weight_kg / (height_m)^2` where `height_m = height_cm / 100`.
- Input conversions before lookup: `lb → kg = lb × 0.45359237`;
  `in → cm = in × 2.54`. Round inputs to one decimal before LMS
  lookup; round percentile output to one decimal; round Z-score
  to two decimals.
- Weight-for-length / weight-for-stature / BMI-for-age **require**
  both weight and length on the *same* growth entry. If only
  weight is logged, those derived percentiles are not computed for
  that entry; the sensor keeps its previous value (it doesn't
  drop to `unknown` just because a one-field growth log came in).

Behaviour:

- Because `sex` is required at baby creation (§4.1), percentiles are
  computed for every growth entry within the reference age range.
  Outside the range (e.g. measurement past the CDC ceiling) the
  percentile sensor reports `unknown`.
- Each `log_growth` call writes the percentile values into the
  entry's `data` block so historical percentiles remain stable even
  if reference tables are updated later.
- The integration exposes the percentile as both a number sensor and
  a Z-score attribute (some pediatricians prefer Z-scores).

### 4.6 Importers (external data sources)

`babytracker` ships an importer subsystem so activities logged in
other systems can flow into a baby's timeline without duplicate
data entry. Each importer is optional and configured per baby.

**Procare Connect** is the first supported importer. It consumes the
existing community integration
[`ha-procare-activity-fetcher`](https://github.com/nmanclank/ha-procare-activity-fetcher)
(domain `procare_activities`) — babytracker does **not** reimplement
the Procare API or auth flow. The user installs that integration
separately; babytracker reads its sensors.

Behaviour:

- The Procare integration exposes `sensor.<child>_activities`, whose
  state is the latest activity title and whose attributes contain
  the last 7 days of activities with `id`, `timestamp`, `title`,
  `details`, `photo_url`, `staff`.
- babytracker subscribes to state changes on that sensor and ingests
  any activity whose `id` has not been seen before. No polling.
- Each imported entry is stored with:
  ```jsonc
  {
    "source": "procare",
    "source_entity_id": "sensor.ava_activities",
    "source_id": "<procare activity id>",
    "imported_at": "ISO-8601",
    "readonly": true,
    "photo_url": "...",
    "staff": "..."
  }
  ```
  Dedup is on `(source, source_id)`.
- `readonly: true` is the default — daycare-sourced entries can
  still be deleted, but the card visually distinguishes them and
  warns before editing.

Title → entry-type mapping (heuristic, configurable):

| Procare title pattern                          | babytracker type | Fields parsed                       |
| ---------------------------------------------- | ---------------- | ----------------------------------- |
| `Diaper: Wet` / `Diaper: BM` / `Diaper: Both`  | diaper           | `kind`                              |
| `Bottle: …`                                    | feeding          | `method=bottle`, `amount` from details |
| `Meal: …`                                      | feeding          | `method=solids`, food in `notes`    |
| `Nap Started …` / `Nap Ended …`                | sleep start/end  | `location=daycare`                  |
| `Photo` / `Note` / anything else               | skipped (default) — surfaced on the recent-entries panel as info-only if the user opts in |

Mappings live in `importers/procare_mappings.py` as data, not code,
so users can override or extend them via integration options.

Importer config (per baby, set during integration options flow):

- `source_entity_id` — the Procare sensor to subscribe to
- `import_types` — subset of `{feeding, sleep, diaper, photo, note}`
- `mark_readonly` — bool, default `true`
- `daycare_location_label` — used as `location` on imported sleep
  sessions; default `daycare`
- `daycare_open_time` — local `HH:MM` (24h). Optional but recommended.
- `daycare_close_time` — local `HH:MM` (24h). When set, the importer
  forces `at_daycare` off at this time on operating days; treats a
  missing `Sign Out` as expected at end-of-day. No `WARNING` logged
  in this case (it's the normal path).
- `daycare_days` — list of weekdays the daycare operates;
  default `["mon", "tue", "wed", "thu", "fri"]`. Only used when
  `daycare_close_time` is set.

Open-session conflicts (e.g. Procare reports "Nap Started" while a
home sleep session is already open) are resolved in §12 #11 by a
**daycare-presence lockout**: while the baby is checked in at
daycare, the integration rejects non-Procare service calls.

Check-in tracking:

- The Procare importer recognises `Sign In` / `Sign Out` (or
  equivalent) title patterns and maintains
  `binary_sensor.<baby>_at_daycare`. On is the period between the
  most recent sign-in and the next sign-out.
- While `at_daycare` is on, services with `source != "procare"`
  raise `ServiceValidationError("<baby> is checked in at daycare;
  logs are coming from the Procare importer")`. The Assist intents
  return the same as speech.
- The lockout is opt-out: an importer-config option
  `block_local_while_checked_in` (default `true`) can be flipped
  off for households where a parent legitimately logs alongside
  Procare (e.g. a forgotten home pumping session).
- If `procare_activities` provides no sign-in/sign-out events for a
  given school, the importer falls back to inferring presence from
  any activity in the last 60 minutes (configurable
  `presence_inference_window_minutes`).
- Auto-sign-out by operating hours: when `daycare_close_time` is
  configured and the current day is in `daycare_days`, the importer
  registers `async_track_time_change` at that time. If `at_daycare`
  is still on when the trigger fires, it flips off — logged at
  `INFO` (expected), not `WARNING`. Households that don't configure
  hours get no auto-clear; `at_daycare` stays on until the next
  sign event or a `set_daycare_presence` call.
- Manual override: `babytracker.set_daycare_presence(baby, value)`
  service exists for edge cases (sensor stuck, school day ended
  but no sign-out fired, no operating hours set).

### 4.7 Photos and attachments

Any entry may carry an optional `photo_path`. The integration
**does not** upload, copy, resize, or otherwise touch image bytes;
`photo_path` is a string that resolves through HA's
`media_source` system (e.g.
`media-source://media_source/local/babytracker/<baby>/<file>.jpg`).

Behaviour:

- The integration validates that the string parses as a
  `media-source://` URL but does not check existence at log time
  (the file may not yet be in the media folder).
- The card renders thumbnails by issuing a standard
  `media_source/resolve_media` request through `hass.callWS`.
- Procare-imported entries store the upstream `photo_url` as a
  separate field (it's a remote URL, not a `media_source://` path)
  and the card distinguishes the two.
- A future v1.x can add a Lovelace upload sheet that writes into
  `/config/media/babytracker/<baby>/`. v1 keeps it path-only.

### 4.8 Vaccines

Vaccines are first-class entries, distinct from medications, to
support a scheduled-dose model:

- Each `vaccine` entry has `name`, optional `dose_number`,
  `lot_number`, `provider`, `site`, `notes`, plus the standard
  `timestamp` (administration date).
- A vendored schedule lives at
  `custom_components/babytracker/data/vaccines/us_cdc.json`
  (others can ship later, e.g. `uk_nhs.json`). Selected via the
  integration's `vaccine_schedule` option (§4.1).

#### Vaccine schedule file schema

```jsonc
{
  "schedule_id": "us_cdc_2024",       // referenced by integration option
  "source": "US CDC",                 // human-readable provenance
  "version": "2024-01",               // bumped when CDC publishes a new schedule
  "doses": [
    {
      "name": "Hepatitis B",          // canonical name; card may translate label (§12 #35)
      "dose_number": 1,
      "target_age_days": 0,           // recommended age for this dose
      "min_age_days": 0,              // earliest acceptable
      "max_age_days": 30,             // latest acceptable before "late"
      "default_site": "left_thigh"    // optional pre-fill in card; user can change
    },
    { "name": "Hepatitis B",     "dose_number": 2, "target_age_days": 30,  "min_age_days": 28,  "max_age_days": 90 },
    { "name": "Rotavirus (RV1)", "dose_number": 1, "target_age_days": 60,  "min_age_days": 42,  "max_age_days": 105 }
    // … one entry per scheduled (vaccine, dose_number)
  ]
}
```

`sensor.<baby>_vaccines_due` behaviour:

- For each `(name, dose_number)` in the active schedule, look up
  whether the baby has a logged `vaccine` entry with the same
  `name` and `dose_number` (or, if entry has no `dose_number`,
  auto-infer as `(count of prior doses of this name for this baby) + 1`).
- "Next due" is the earliest unscheduled dose by `target_age_days`,
  computed as `due_on = birthday + target_age_days`.
- State: the vaccine `name` of the next-due dose. Attributes:
  `dose_number`, `due_on` (ISO date), `overdue_days`
  (`max(0, (today − due_on).days)`), `upcoming` (list of the next
  five `{name, dose_number, due_on}`).
- All doses administered: state `none`.
- Schedule selected but empty: state `none`.

`binary_sensor.<baby>_vaccines_overdue`:

- On when there exists an undosed schedule entry with
  `today > (birthday + target_age_days) + grace_days`
  where `grace_days` is from integration options (default 14, §12 #14).

Free-form vaccine logging (vaccines not on the schedule, e.g. an
optional annual flu shot) is **accepted** and stored, but does not
affect `vaccines_due` / `vaccines_overdue`. The entry shows up in
the recent-entries panel and the export report's vaccine section.

`dose_number` inference on `log_vaccine` (called without one):
auto-set to `(count of prior non-readonly vaccine entries for this
baby with matching `name`) + 1`. The user-facing speech / confirm
text always shows the inferred number so the parent can correct it
if wrong.

No notifications shipped — users wire HA automations off the
sensor (`state != none and as_timestamp(due_on) − now < 7d`).

### 4.9 Reports & export

Service `babytracker.export_report(baby, format, start, end, sections?)`
generates a pediatrician-friendly summary file.

- `format`: `html` (printable, single self-contained file with
  inline CSS and embedded growth-chart SVG) or `csv` (one row per
  entry, columns flattened from `data`).
- `sections`: optional subset of
  `{feedings, sleep, tummy_time, diapers, pumping, growth, vaccines, medications}`.
  Default = all relevant types in range.
- Output path: `/config/www/babytracker/<baby>-<start>-<end>.<ext>`
  so the file is downloadable from `https://<ha>/local/babytracker/…`
  and the service response includes that URL.
- HTML report includes:
  - Header: baby name, birthday, age at end-of-range, latest
    weight/height/head and their percentiles.
  - Growth chart: weight-for-age and length-for-age across the
    range, plotted on WHO/CDC percentile bands.
  - Tables per section, grouped by day.
  - Vaccine schedule status (administered vs. upcoming/overdue).
- No image bytes are embedded; entries that have `photo_path`
  render as a "📷" indicator with the resolved URL.
- CSV is suitable for spreadsheet import; one file per export call.

### 4.10 Per-baby activity eligibility

Babies have different care patterns. An exclusively bottle-fed baby
shouldn't be prompted for "breast left / right"; a baby past the
tummy-time stage shouldn't see that button; siblings on a transition
to solids may want only `bottle` and `solids` exposed.

Two eligibility lists live on each baby:

- `enabled_activities`: subset of
  `{feeding, sleep, tummy_time, diaper, growth, medication, vaccine}`.
  Pumping is parent-level, not per-baby, and is gated by a separate
  global option.
- `enabled_feeding_methods`: subset of the `method` vocabulary
  `{bottle, breast_left, breast_right, solids}`. Only meaningful
  when `feeding` is enabled.

Defaults at baby creation:

- All activities enabled.
- All four feeding methods enabled.

Behaviour:

- The integration **rejects** service calls for a disabled activity
  or feeding method with `ServiceValidationError`, including imported
  entries (the Procare importer will silently skip ineligible
  activity titles for that baby and log a `DEBUG` line).
- A separate gate from §4.6 — the daycare-presence lockout — can
  also reject non-Procare calls while a baby is checked in. Both
  gates apply in series; eligibility is checked first.
- Entities for disabled activities are **not registered** for that
  baby. Toggling an activity on/off through the options flow adds
  or removes the relevant entities at runtime via
  `async_add_entities` / `async_remove`.
- The Lovelace card reads each baby's eligibility from the
  integration (exposed via a `babytracker.get_baby_config` WS
  command) and renders only enabled quick-log buttons.
- Eligibility is editable any time through the options flow; past
  entries are never deleted or hidden when an activity is disabled
  later (they remain in `recent_entries` and in exports).

Open question on per-baby vs. per-method granularity for sleep
locations and diaper kinds is captured in §12.

## 5. Data model

Stored as a single JSON blob via HA's `homeassistant.helpers.storage.Store`.

```jsonc
{
  "version": 1,
  "babies": [
    {
      "id": "uuid",                     // str(uuid.uuid4()), stable
      "slug": "ava",                    // slugify(name) at creation; stable across renames
      "name": "Ava",                    // display name, mutable
      "birthday": "2025-12-01",         // ISO YYYY-MM-DD
      "sex": "female",                  // "male" | "female", required at creation
      "avatar_url": null,
      "archived": false,                // hidden from selectors when true; entities unregistered
      "enabled_activities": [           // gates services + card buttons (see §4.10)
        "feeding", "sleep", "tummy_time", "diaper",
        "growth", "medication", "vaccine"
      ],
      "enabled_feeding_methods": [      // subset of feeding.method vocabulary
        "bottle", "solids"              // e.g. exclusively bottle-fed: no breast prompts
      ]
    }
  ],
  "entries": [
    {
      "id": "uuid",
      "type": "feeding",                // feeding | sleep | tummy_time | diaper |
                                        //   pumping | growth | medication | vaccine
      "baby_id": "uuid|null",           // null only for pumping
      "timestamp": "ISO-8601",          // event time (start, for sessions)
      "ended_at": "ISO-8601|null",
      "source": "user",                 // "user" | "procare" | …
      "photo_path": null,               // media-source:// URL or null
      "notes": null,
      "revised_at": null,               // set when edit_entry rewrites the entry
      "data": { /* type-specific fields, see §4.2 */ }
    },
    {
      // imported entries carry these additional top-level fields
      "id": "uuid",
      "type": "diaper",
      "baby_id": "uuid",
      "timestamp": "ISO-8601",
      "ended_at": null,
      "source": "procare",
      "source_entity_id": "sensor.ava_activities",
      "source_id": "<procare activity id>",
      "imported_at": "ISO-8601",
      "readonly": true,
      "photo_url": "https://…",         // remote URL, distinct from photo_path
      "staff": "Ms. Lee",
      "photo_path": null,
      "notes": null,
      "data": { "kind": "wet" }
    }
  ]
}
```

Notes:
- Active sleep / feeding sessions are entries with `ended_at: null`.
  At most one open session of each kind per baby.
- Entries are append-only from the user's perspective; the edit
  service rewrites the entry in place and bumps a `revised_at`
  field for the audit trail.
- Storage is rewritten in full on each change. Expected volume is
  small (a few hundred entries / day worst case), well within
  comfortable bounds for `Store`.

## 6. Entities exposed

Entity ids use the slugified baby name. Examples below assume "Ava".

### Per-baby sensors

| Entity                                    | State                          | device_class |
| ----------------------------------------- | ------------------------------ | ------------ |
| `sensor.ava_last_feeding`                 | ISO timestamp                  | timestamp    |
| `sensor.ava_last_feeding_method`          | `bottle`/`breast_left`/…       | enum         |
| `sensor.ava_last_feeding_amount`          | number (in current unit) or `unknown` if last feeding had no amount (e.g. solids) | volume |
| `sensor.ava_feedings_today`               | count                          | —            |
| `sensor.ava_total_feeding_volume_today`   | number                         | volume       |
| `sensor.ava_last_diaper`                  | ISO timestamp                  | timestamp    |
| `sensor.ava_last_diaper_kind`             | `wet`/`dirty`/`both`           | enum         |
| `sensor.ava_diapers_today`                | count                          | —            |
| `sensor.ava_wet_diapers_today`            | count                          | —            |
| `sensor.ava_dirty_diapers_today`          | count                          | —            |
| `sensor.ava_last_sleep_start`             | ISO timestamp                  | timestamp    |
| `sensor.ava_last_sleep_end`               | ISO timestamp                  | timestamp    |
| `sensor.ava_total_sleep_today`            | minutes                        | duration     |
| `sensor.ava_naps_today`                   | count                          | —            |
| `sensor.ava_last_tummy_time_start`        | ISO timestamp                  | timestamp    |
| `sensor.ava_total_tummy_time_today`       | minutes                        | duration     |
| `sensor.ava_tummy_time_sessions_today`    | count                          | —            |
| `sensor.ava_last_vaccine`                 | ISO timestamp                  | timestamp    |
| `sensor.ava_vaccines_due`                 | next vaccine name or `none`; attrs: `dose_number`, `due_on`, `overdue_days`, `upcoming` | — |
| `sensor.ava_weight`                       | latest growth weight           | weight       |
| `sensor.ava_height`                       | latest growth height           | distance     |
| `sensor.ava_head_circumference`           | latest                         | distance     |
| `sensor.ava_weight_percentile`            | 0–100, attr `z_score`, `source`| —            |
| `sensor.ava_height_percentile`            | 0–100, attr `z_score`, `source`| —            |
| `sensor.ava_head_circumference_percentile`| 0–100, attr `z_score`, `source`| —            |
| `sensor.ava_bmi`                          | computed BMI                   | —            |
| `sensor.ava_bmi_percentile`               | 0–100, attr `z_score`, `source`| —            |
| `sensor.ava_age_days`                     | days since birthday            | duration     |
| `sensor.ava_recent_entries`               | count; attributes hold this baby's last 50 entries with ids | — |

### Per-baby binary sensors

| Entity                              | On when                              |
| ----------------------------------- | ------------------------------------ |
| `binary_sensor.ava_sleeping`        | an open sleep session exists         |
| `binary_sensor.ava_feeding`         | an open feeding session exists       |
| `binary_sensor.ava_tummy_time`      | an open tummy-time session exists    |
| `binary_sensor.ava_vaccines_overdue`| at least one scheduled dose is past due |
| `binary_sensor.ava_at_daycare`      | baby is checked in at daycare per Procare importer (§4.6) |

### Global

| Entity                            | State                              |
| --------------------------------- | ---------------------------------- |
| `sensor.babytracker_last_pumping` | ISO timestamp                      |
| `sensor.babytracker_pumping_today`| total ml/oz pumped today           |
| `sensor.babytracker_recent_entries` | count; attributes hold last 50 entries across all babies |

All entities are grouped under a single `babytracker` HA Device per
baby (plus a device for pumping/global), so the device page in HA acts
as a per-baby dashboard.

Entities for activities **not** in a baby's `enabled_activities`
are not registered for that baby (see §4.10). Toggling eligibility
adds or removes the corresponding entities at runtime.

## 7. Services

Namespace: `babytracker.*`. All take a `baby` slug except `log_pumping`.

- `log_feeding(baby, method, amount?, unit?, started_at?, ended_at?, notes?, photo_path?)`
- `start_feeding(baby, method)`
- `end_feeding(baby, amount?, unit?, notes?)`
- `start_sleep(baby, location?)`
- `end_sleep(baby, notes?)`
- `start_tummy_time(baby)`
- `end_tummy_time(baby, notes?)`
- `log_tummy_time(baby, started_at, ended_at, notes?)`  *(retroactive)*
- `log_diaper(baby, kind, notes?, photo_path?)`
- `log_pumping(volume, unit, side?, duration?, notes?)`
- `log_growth(baby, weight?, height?, head_circumference?, weight_unit?, length_unit?, notes?, photo_path?)`
- `log_medication(baby, name, dose, unit, notes?)`
- `log_vaccine(baby, name, dose_number?, lot_number?, provider?, site?, timestamp?, notes?, photo_path?)`
- `edit_entry(entry_id, fields)`
- `delete_entry(entry_id)`
- `export_report(baby, format, start, end, sections?)` → returns `{path, url}`
- `purge_baby(baby_id)` — hard-removes an archived baby and all their
  entries (§12 #21)
- `set_daycare_presence(baby, value)` — manual override for the
  Procare check-in/out tracker (§4.6)

All services that take a `baby` raise `ServiceValidationError` if
the target baby's `enabled_activities` (and, for feedings, the
`method`) does not permit the call (§4.10).

Each service definition lives in `services.yaml` with proper
selectors so the HA UI's "Developer Tools → Services" form is usable
on its own.

## 8. Architecture

### 8.1 File layout

Single repository — integration + bundled Lovelace card (§12 #9):

```
babytracker/                          ← single repo, type: integration
├── README.md
├── SPECS.md                          ← this document
├── hacs.json                         # type: integration only
├── info.md
├── custom_components/
│   └── babytracker/
│       ├── __init__.py               # async_setup_entry; registers static path + extra_js_url
│       ├── manifest.json
│       ├── const.py
│       ├── config_flow.py            # initial setup + options (manage babies)
│       ├── coordinator.py            # DataUpdateCoordinator-like manager
│       ├── store.py                  # Store wrapper, schema migrations
│       ├── models.py                 # dataclasses for Baby / Entry
│       ├── percentiles.py            # LMS computation
│       ├── export.py                 # HTML + CSV report generation
│       ├── eligibility.py            # per-baby activity/method gating
│       ├── intents.py                # Assist intent handlers (§10.2)
│       ├── diagnostics.py            # redacted JSON dump (§12 #33)
│       ├── importers/
│       │   ├── __init__.py
│       │   ├── base.py               # BaseImporter ABC
│       │   ├── procare.py            # subscribes to procare_activities sensor
│       │   └── procare_mappings.py   # thin loader for default + override (§15 #16)
│       ├── sensor.py
│       ├── binary_sensor.py
│       ├── services.yaml
│       ├── intents.yaml              # Assist sentence templates (§10.2)
│       ├── strings.json
│       ├── translations/en.json
│       ├── frontend/                 # bundled card artifact (auto-registered)
│       │   ├── babytracker-card.js   # built; committed; replaced on release
│       │   └── babytracker-card.js.map
│       └── data/
│           ├── lms/                  # vendored WHO + CDC reference tables
│           │   ├── SOURCES.md
│           │   ├── who_wfa_boys.json
│           │   ├── who_wfa_girls.json
│           │   ├── …
│           │   ├── cdc_wfa_boys.json
│           │   └── cdc_wfa_girls.json
│           ├── procare/
│           │   └── default_mappings.json   # (§15 #16)
│           └── vaccines/
│               ├── SOURCES.md
│               ├── us_cdc.json       # default schedule
│               └── uk_nhs.json       # future
├── frontend-src/                     # card source — not shipped to users
│   ├── package.json                  # build via vite
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── babytracker-card.ts       # main custom-element (lit)
│       ├── editor.ts                 # GUI editor for the card
│       ├── components/
│       │   ├── quick-log.ts
│       │   ├── session-tile.ts
│       │   ├── recent-entries.ts
│       │   ├── vaccines-due.ts
│       │   ├── photo-thumb.ts
│       │   └── growth-chart.ts
│       └── lib/
│           ├── ha-helpers.ts
│           └── chart.ts
├── tests/
│   ├── conftest.py
│   ├── test_config_flow.py
│   ├── test_services.py
│   ├── test_sensors.py
│   ├── test_percentiles.py           # known WHO/CDC sample values
│   ├── test_vaccines.py              # schedule lookup, due/overdue logic
│   ├── test_eligibility.py           # gated service validation
│   ├── test_export.py                # HTML + CSV smoke tests
│   └── frontend/                     # vitest unit tests for card components
└── .github/workflows/
    ├── validate.yml                  # hassfest + HACS action (type: integration)
    ├── tests.yml                     # pytest + npm test
    └── release.yml                   # builds card → commits artifact → tags release
```

Build / release workflow:

- Local dev: `cd frontend-src && npm install && npm run build` writes
  the built JS to `custom_components/babytracker/frontend/`.
- CI validates the committed artifact matches a fresh build (`npm run
  build && git diff --exit-code` on the artifact). PRs that change
  `frontend-src/` must include the rebuilt artifact.
- `release.yml` runs the same build on tag, commits the artifact if
  drifted, then creates the GitHub Release that HACS pulls from.
- Card version tracks integration version (no independent SemVer).

### 8.2 Runtime

- `async_setup_entry` loads stored data via `store.py`, instantiates
  the coordinator, registers services, and forwards setup to the
  `sensor` and `binary_sensor` platforms.
- All service handlers mutate the in-memory model through the
  coordinator, then schedule `store.async_save()`.
- After every mutation the coordinator calls
  `async_update_listeners()`, which causes all entities to refresh.
- Entities derive their state from the in-memory model — no per-entity
  storage reads.
- Configured importers are attached after platform setup. The Procare
  importer registers an `async_track_state_change_event` listener on
  the mapped `sensor.<child>_activities` entity and ingests previously
  unseen activity ids via the coordinator's normal mutation path.
  Importer detach is wired to `async_unload_entry`.

### 8.3 Storage migrations

`Store` is initialized with `version=1, minor_version=1`. A
`_migrate_func` is registered for future schema changes. Spec freezes
v1 at the model in §5; later versions must include a migration.

## 9. Lovelace card (`babytracker-card`)

**Bundled inside the integration** (§12 #9). No separate HACS
plugin install. On `async_setup_entry`, the integration registers
a static HTTP path for its `frontend/` directory and tells HA's
frontend to include `babytracker-card.js` on every page load —
making `type: custom:babytracker-card` available in Lovelace as
soon as the integration is configured. Registration mechanics
spelled out in §9.5.

### 9.1 Card configuration

```yaml
type: custom:babytracker-card
baby: ava                     # required, slug from the integration
sections:                     # optional, default = all
  - status                    # last-event chips + today's counts
  - quick_log                 # diaper / feeding / sleep / tummy buttons
  - active_session            # shown only when a timed session is open
  - vaccines                  # next-dose chip + overdue badge
  - growth                    # latest values + percentile chart
  - recent                    # last N entries with delete buttons
  - export                    # footer "Export for pediatrician" button
units:
  volume: ml                  # ml | oz, overrides integration default
  weight: kg
  length: cm
recent_limit: 10              # capped at the source sensor's cached size (50)
```

A GUI editor (`editor.ts`) renders this configuration so users on
HA's visual Lovelace editor don't have to write YAML.

### 9.2 Visual specification

- **Status row**: chips for "last diaper 1h 12m", "last feeding 45m",
  "sleeping" (live timer when a session is open). Tappable chips
  open a popover with the underlying entry.
- **Quick log**: 4-column grid of large buttons. Buttons are
  derived from the baby's `enabled_activities` and
  `enabled_feeding_methods` (§4.10) — a bottle-only baby shows no
  breast-side buttons; a baby with `tummy_time` disabled shows no
  start-tummy-time tile. Long-press opens a sheet with amount /
  side / notes / photo inputs before logging.
- **Active session**: when an open feeding, sleep, or tummy-time
  session exists, a banner shows elapsed time and an "End" action;
  "End feeding" opens an amount sheet.
- **Vaccines chip**: only when `vaccine` is enabled. Renders
  `sensor.<baby>_vaccines_due` — next-dose name with relative due
  date; red badge when `binary_sensor.<baby>_vaccines_overdue` is on.
- **Growth**: latest weight / height / head values with their
  percentile next to them ("7.2 kg · 62nd"). Tapping opens a
  full-bleed chart with the WHO/CDC 3/15/50/85/97 percentile bands
  and the baby's measurement history plotted across them.
- **Recent**: list of the last N entries with relative time and a
  swipe / kebab menu for edit / delete. Entries with `photo_path`
  show a thumbnail; Procare-origin entries are badged with the
  staff name. Hits the integration's `edit_entry` and `delete_entry`
  services.
- **Export**: a footer "Export for pediatrician" button opens a
  date-range sheet and calls `babytracker.export_report`; the
  returned URL is offered as a download link.

### 9.3 Implementation notes

- Lit-element custom element. No React, no heavy chart library —
  inline SVG for the growth chart keeps the bundle small.
- Reads entity state via the standard `hass` object passed by
  Lovelace; calls services via `hass.callService('babytracker', …)`.
- WebSocket commands (`babytracker/list_babies`,
  `babytracker/get_baby_config`, `babytracker/get_integration_options`,
  `babytracker/get_vaccine_schedule`) are reached via
  `hass.connection.subscribeMessage` with `subscribe: true` (§15 #24).
- All card copy is sourced through the same translation pipeline as
  the integration (§15 #30); the card reads `hass.locale` and falls
  back to English when a key is missing.

### 9.4 Alternative dashboard for users who skip `type: custom:babytracker-card`

The integration's README ships copy-paste Lovelace YAML using only
built-in cards (button + entity + markdown) for users who prefer
not to use the custom card (e.g. minimalist dashboards). Functionality
is reduced (no growth chart, no swipe-to-delete) but every service
is reachable. This is documentation, not a separate code path.

### 9.5 Registration mechanics

The integration registers the card during `async_setup_entry`:

```python
from pathlib import Path
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig

FRONTEND_URL = "/babytracker_static"
CARD_FILENAME = "babytracker-card.js"

async def async_setup_entry(hass, entry):
    # ... coordinator, storage, platforms setup ...

    frontend_dir = Path(__file__).parent / "frontend"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL, str(frontend_dir), cache_headers=False)]
    )
    # Cache-bust on integration version so upgrades reload cleanly
    add_extra_js_url(hass, f"{FRONTEND_URL}/{CARD_FILENAME}?v={VERSION}")
```

Notes:

- `cache_headers=False` lets us control cache via the `?v=` query
  string; we don't fight HA's default static caching.
- `add_extra_js_url` is idempotent across reloads — calling it on
  every `async_setup_entry` is fine.
- On **first install**, HA's frontend bundle was loaded by the
  browser before the JS URL was registered. The user sees the card
  available only after one hard-refresh of the dashboard tab. The
  README states this clearly under "Installation".
- On **integration upgrade**, the `?v=` query string changes with
  `VERSION` from `const.py`, so browsers re-fetch the new bundle
  automatically. No manual cache clearing.
- On **integration removal**, the static path and `extra_js_url`
  are torn down in `async_unload_entry`. Existing dashboards that
  used `type: custom:babytracker-card` show a "custom element not
  found" placeholder until the integration is reinstalled.

## 10. Notifications & chat integration

### 10.1 Philosophy

babytracker does **not** ship clients for messengers or chat apps. It
exposes services, sensors, and Assist intents so users wire whichever
notification surface they already have configured in HA. This keeps
the integration small and lets users pick a transport that suits
their region, account, and privacy preferences.

Two directions:

- **Outbound** (alerts, reminders, daily summaries) — an HA
  `automation` reads babytracker sensors and calls
  `notify.<service>` for whichever chat app the user has set up
  (`notify.telegram`, `notify.signal`, `notify.discord`,
  `notify.mobile_app_*`, `notify.matrix`, etc.).
- **Inbound** (log activities by sending a message) — an HA
  `automation` listens for incoming messages on a chat platform
  and calls a `babytracker.log_*` service. For surfaces that talk
  to HA's Assist (Companion app, voice satellites, supported
  chat-to-Assist bridges), the intent_scripts in §10.2 remove the
  need for any glue YAML.

### 10.2 Assist intents

The integration ships intent definitions in
`custom_components/babytracker/intents.yaml`, registered via
`homeassistant.helpers.intent.async_register`. Any surface that
already speaks to HA's Assist (LLM agent, conversation API,
Companion app voice, chat-to-Assist bridges) can drive babytracker
without bespoke YAML.

Shipped intents (v1):

| Intent              | Slots                                  | Result                           |
| ------------------- | -------------------------------------- | -------------------------------- |
| `LogDiaper`         | `baby`, `kind`                         | `babytracker.log_diaper`         |
| `StartSleep`        | `baby`, `location?`                    | `babytracker.start_sleep`        |
| `EndSleep`          | `baby`                                 | `babytracker.end_sleep`          |
| `StartFeeding`      | `baby`, `method`                       | `babytracker.start_feeding`      |
| `EndFeeding`        | `baby`, `amount?`, `unit?`             | `babytracker.end_feeding`        |
| `LogFeeding`        | `baby`, `method`, `amount?`, `unit?`   | `babytracker.log_feeding`        |
| `LogTummyTime`      | `baby`, `duration_minutes`             | retroactive `log_tummy_time`     |
| `LastFeedingTime`   | `baby`                                 | speech: "Ava fed 45 minutes ago" |
| `LastDiaperTime`    | `baby`                                 | speech: relative time + kind     |
| `IsSleeping`        | `baby`                                 | speech: yes/no + elapsed         |

Sentence templates live in `intents.yaml` and `strings.json` so
translations apply.

Eligibility (§4.10) is enforced — an intent for a disabled activity
on a given baby is answered with a polite "Bottle feeding isn't
enabled for Ava" speech response, not a stack trace.

### 10.3 Example automations (shipped in README)

The README ships copy-paste automations covering the most-asked
flows. None require modifying the integration:

- **No-feeding-in-4h alert** — trigger on the elapsed-time helper
  derived from `sensor.<baby>_last_feeding`; call `notify.<service>`.
- **White-noise on sleep** — trigger on
  `binary_sensor.<baby>_sleeping` turning on; call a scene.
- **Vaccine reminder one week before due** — trigger on
  `sensor.<baby>_vaccines_due` attribute `due_on`; call `notify.*`.
- **Daily summary at 8 pm** — template builds a message from the
  per-baby counter sensors; sends through `notify.*`.
- **Inbound from Telegram** — automation listens on
  `telegram_text` events for "diaper wet ava" and calls
  `babytracker.log_diaper`.
- **Inbound from Matrix / Signal / Discord** — same shape, with
  the relevant HA event/service names.

### 10.4 WhatsApp specifically

WhatsApp has no official HA integration. Community paths exist:

- `pywhatkit` (drives WhatsApp Web in a browser; fragile).
- Hosted gateways: Green API, Twilio WhatsApp, CallMeBot
  (account-dependent, may incur cost).
- WhatsApp Business API directly via Meta (business onboarding).

babytracker ships no WhatsApp-specific code. Users register one of
the above as a `notify` service or a `rest_command` and call it
from automations exactly like any other transport. The README
points at the current community options without endorsing one,
since the landscape changes faster than our release cadence.

### 10.5 What we *don't* do

- No bot tokens, API keys, or webhooks stored in `babytracker`'s
  configuration. Credentials belong to the user's chosen `notify`
  service.
- No outbound message templates beyond what the README example
  automations show. Content is the user's choice.
- No two-way conversational state ("are you sure?", "which baby?"
  follow-ups). Assist already handles disambiguation through slot
  prompts — we don't reinvent it.

## 11. HACS readiness

Single repository, single HACS listing (type: integration). The
Lovelace card is bundled and auto-registered — no separate HACS
entry (§12 #9).

- `hacs.json` with `name`, `render_readme: true`, `homeassistant: "2024.6"`,
  and explicitly **no** `filename` or `type: plugin` block.
- `manifest.json` with `domain`, `name`, `version`, `requirements: []`,
  `iot_class: local_push`, `config_flow: true`, `single_config_entry: true`
  (§12 #23), `documentation`, `issue_tracker`, `codeowners`,
  and an explicit `minimum_ha_version: "2024.6"` (§12 #29).
- `info.md` for the HACS info pane.
- `README.md` with screenshots, install instructions, service
  reference, the card's configuration reference, and the
  built-in-card fallback YAML (§9.4).
- GitHub Actions:
  - `validate.yml` — `hassfest` (official HA validator) plus
    `hacs/action` (type: integration) on push/PR.
  - `tests.yml` — `pytest` against
    `pytest-homeassistant-custom-component` for the Python side,
    `npm test` (vitest) for the card.
  - `release.yml` — runs `npm run build` in `frontend-src/`,
    fails if the built artifact differs from
    `custom_components/babytracker/frontend/babytracker-card.js`,
    then tags the release. HACS pulls from the resulting tag.
- Conventional Commits + SemVer.

## 12. Design decisions

All 35 questions were walked through and resolved on **2026-05-17**.
The list below is preserved (with original numbering, since other
sections cross-reference it) as the durable record of the chosen
behaviour. Items reading "leaning …" or "default …" are now
committed; deviations from earlier defaults are flagged inline.

1. **Default volume unit** — per-instance config (mL vs oz) or per-call?
   Leaning per-instance with per-call override.
2. **Age unit** — `sensor.<baby>_age_days` only, or also `_weeks` and
   `_months`? Probably one sensor with `unit_of_measurement` switching
   by age (days < 60, weeks < 16, then months) and attributes holding
   all three.
3. **Long-term statistics** — should daily-count sensors register as
   `state_class: total_increasing` so HA energy-dashboard-style graphs
   work? Default yes for counters and volume totals.
4. **Time zone for "today"** — use HA's configured TZ
   (`hass.config.time_zone`). Document this.
5. **Multiple open sessions** — block starting a second sleep / feeding
   while one is open, or allow and warn? Default: block; raise
   `ServiceValidationError`.
6. **Sex required for percentiles** — *decision changed from earlier
   draft.* `sex` is **required** at baby creation; the config flow
   rejects babies without it. This guarantees percentile sensors
   are always meaningful and removes the need for an "unknown"
   sentinel in the card. Future v1.x may add a non-binary option
   if a clinically meaningful reference set exists.
7. **WHO ↔ CDC handoff age** — AAP recommends WHO 0–24 mo, then CDC.
   Use 24 months as the exact cutover. Document and parameterize so
   non-US users can override.
8. **LMS data refresh policy** — vendored at integration release time;
   bump with a `data_version` tag. No runtime download.
9. **Card distribution** — *decision changed 2026-05-17 from a
   separate `babytracker-card` repo to **Option D: bundled inside
   the integration**.* The card source lives at `frontend-src/`,
   builds to `custom_components/babytracker/frontend/babytracker-card.js`,
   and the integration auto-registers it via
   `hass.http.register_static_path` + `frontend.add_extra_js_url`
   on `async_setup_entry`. One repo, one HACS listing (type:
   integration), one release per change. Trade-offs accepted:
   card cannot upgrade independently of the integration; card is
   not discoverable in the HACS plugin browser. Both are
   acceptable because the card and integration are tightly
   coupled (the card consumes integration-owned services and WS
   commands; they ship together anyway).
10. **Procare dependency** — `procare_activities` is *not* listed as
    a hard `dependencies` entry in `manifest.json`. It's optional; the
    importer activates only if the user maps a Procare entity. Document
    install order: install & sign-in to `procare_activities` first.
11. **Daycare sleep conflict** — *decision changed from earlier
    draft.* While a baby is checked in at daycare,
    `binary_sensor.<baby>_at_daycare` is on and the integration
    **rejects** non-Procare service calls with
    `ServiceValidationError`. This means there is no ambiguous
    "two parallel sleep sessions" state — Procare is authoritative
    during the checked-in window. Details in §4.6; opt-out via
    `block_local_while_checked_in = false`; manual override service
    `babytracker.set_daycare_presence`.
12. **Procare title formats** — titles vary across school configs and
    may not match the regexes in `procare_mappings.py`. Plan: log
    unrecognised titles at `WARNING` and surface them in a "needs
    mapping" diagnostic sensor so users can submit additions upstream.
13. **Default vaccine schedule** — ship `us_cdc.json` as the default
    because the broadest user base is US-based; non-US users select
    an alternative via options flow. Schedules are vendored data;
    user-supplied schedules are out of scope for v1.
14. **Vaccine "due" definition** — `due_on = birthday + target_age_days`
    of next un-administered dose. "Overdue" means `now > due_on + grace`,
    where `grace = 14 days` by default. Document and expose `grace_days`
    as an integration option.
15. **Photo path security** — `photo_path` (user-supplied) accepts
    only `media-source://` URLs whose resolved path lives under
    `/config/media/` (HA's default media folder) or `/config/www/`.
    Reject `file://` and arbitrary `http(s)` to keep entries from
    referencing private filesystem paths. The Procare-imported
    `photo_url` is a separate field carrying a remote `https://`
    URL and is **not** subject to this validation — it's data
    received from a trusted upstream integration.
16. **Export output location** — `/config/www/babytracker/` is publicly
    accessible at `/local/babytracker/…`; document this clearly. A
    v1.x can add a token-protected route if there's demand.
17. **Eligibility granularity** — v1 gates *activities* and
    *feeding methods*. `diaper.kind` and `sleep.location` stay
    universal (cheap, rarely worth hiding). Revisit if users ask.
18. **Pumping global toggle** — pumping is not a per-baby activity
    (it belongs to the parent). Provide a single global option
    `enable_pumping` (default `true`); the global pumping sensors
    are registered only when this is on.
19. **`edit_entry` mutable fields** — immutable: `id`, `type`,
    `baby_id`, `source`, `source_id`, `imported_at`. Mutable:
    `timestamp`, `ended_at`, `photo_path`, `notes`, and any field
    inside `data`. Every successful edit sets `revised_at` to the
    edit's wall-clock time. Editing a Procare-imported entry flips
    `readonly` to `false` so subsequent imports can't clobber it.
20. **Hard vs soft delete** — default: **hard delete** (simpler,
    no GDPR worry, and entries are already idempotent via `id`).
    The audit-trail story lives on the edit path only. Soft delete
    deferred to v1.x if users ask.
21. **Baby deletion cascade** — when a baby is removed via the
    options flow, **archive their entries**: `baby_id` stays,
    `archived: true` is set on the baby record (kept in `babies[]`
    with `name` preserved but hidden from selectors), and entities
    are unregistered. Hard purge requires a separate
    `babytracker.purge_baby` service. Preserves history for export
    and avoids accidental data loss.
22. **Slug collisions** — config flow rejects a name whose slugified
    form collides with an existing baby's slug; user is asked to
    pick a different display name. Renaming a baby keeps the
    original `slug` (entity ids) for stability — only the
    friendly name changes.
23. **One config entry per HA instance** — the integration declares
    `single_config_entry: true` in its manifest. All babies live
    under that one entry. Document.
24. **Storage scaling** — single JSON Store rewritten in full on
    each save. At ~50 entries/day × 365 days × ~0.5 KB/entry the
    blob is ~9 MB/year. Acceptable for v1. v2 will shard by year
    (`babytracker.<yyyy>.json`) once the v1 blob hits 20 MB or
    save latency exceeds 100 ms in profiling; gated behind a
    storage-migration version bump.
25. **Mutation concurrency** — coordinator holds an `asyncio.Lock`
    that wraps the read–mutate–write sequence so a Procare burst
    (state-change with multiple new ids) doesn't interleave with
    a user service call. Storage save remains debounced.
26. **Daily counter computation** — recompute on read from the
    in-memory entry list (cheap; sub-millisecond for ~50 entries).
    No midnight cron; entity state is invalidated when the local
    date rolls over via `async_track_time_change(hour=0, minute=0)`
    purely to fire entity updates, not to mutate state.
27. **DST handling** — counters are in *minutes*, never *hours*,
    so spring-forward and fall-back are accounted for naturally.
    Sleep sessions that straddle a DST transition split by
    wall-clock midnight using the relevant local times, which
    can produce a 23-hour or 25-hour "today" — documented.
28. **`state_class` matrix** — table per entity type:
    - Last-event timestamps: no `state_class` (timestamps).
    - Counters (`_diapers_today`, `_feedings_today`, etc.):
      `state_class: total_increasing` with `last_reset` at local
      midnight so HA's statistics handles daily reset.
    - Volume / minute totals (`_total_feeding_volume_today`,
      `_total_sleep_today`): `state_class: total_increasing`
      with `last_reset`.
    - Gauges (`_weight`, `_height`, `_weight_percentile`, `_bmi`):
      `state_class: measurement`.
    - Enum sensors (`_last_diaper_kind`, `_last_feeding_method`):
      no `state_class`.
29. **HA minimum version** — `2024.6` to cover
    `media_source/resolve_media`, `supports_response: True` service
    responses, modern `ServiceValidationError`, and
    `single_config_entry`. Declared in `hacs.json` and `manifest.json`.
30. **`get_baby_config` shape** — a WebSocket command, not a
    service: `babytracker/get_baby_config` registered via
    `homeassistant.components.websocket_api.async_register_command`.
    Card subscribes once and is notified of changes; a service
    would not support push and would be visible in Developer Tools
    where it doesn't belong.
31. **Sleep `location` vocabulary** — canonical values:
    `home | daycare | car | stroller | other`. Free-form strings
    accepted but the card filters/labels only the canonical set
    and groups unknown values under "other". Procare importer
    writes `daycare`.
32. **Long-term entry retention** — never auto-purge in v1.
    Storage scaling (§11 #24) determines when this changes.
33. **Diagnostics + Repairs** — ship `diagnostics.py` in v1
    (one-page redacted JSON dump for issue reports). Repairs
    (`repairs.py`) is deferred to v1.x; the first concrete repair
    issue is "Procare entity in importer config no longer exists".
34. **Card accessibility** — every icon button has an ARIA label
    sourced from the same translation strings as the integration.
    Long-press has a desktop equivalent (right-click) and a
    keyboard equivalent (Shift+Enter on the focused button).
    All colours derive from HA theme variables (`--primary-color`,
    `--warning-color`, etc.); no hard-coded hex.
35. **Vaccine name localisation** — vaccine `name` strings in
    `data/vaccines/<schedule>.json` stay in the source language
    (US CDC names in English, UK NHS names in English, …). The
    card translates the **label** shown to the user via a lookup
    in `translations/<locale>.json` keyed on the canonical name;
    untranslated entries fall back to the canonical string.

## 13. Milestones

Integration (`babytracker`):

| #  | Scope                                                                       |
| -- | --------------------------------------------------------------------------- |
| 1  | Scaffolding: manifest, config flow, baby registry (with eligibility), storage, no entities |
| 2  | Diaper + one-shot feeding services + their sensors + binary_sensors + `photo_path` on entries |
| 3  | Sleep + tummy-time start/end sessions, sensors, midnight-split logic        |
| 4  | Pumping + growth + medication services and sensors                          |
| 5  | Edit / delete services + recent-entries sensor + eligibility-gated entity registration |
| 6  | LMS percentile engine + WHO/CDC tables + percentile sensors                 |
| 7  | Vaccines (schedule + due/overdue sensors) + pediatrician export (HTML + CSV) |
| 8  | Importer framework + Procare importer (read-only daycare ingestion)         |
| 9  | Assist intents (§10.2) + README automation cookbook (§10.3)                 |
| 10 | HACS polish: README, screenshots, validators, tests, first release tag      |

Card (bundled inside the integration, §12 #9):

| #  | Scope                                                                       |
| -- | --------------------------------------------------------------------------- |
| C1 | `frontend-src/` scaffold + vite build, status row + eligibility-aware quick-log; registration mechanics in `__init__.py` (§9.5) |
| C2 | Active-session banner, recent-entries list with edit/delete + photo thumbnails |
| C3 | Growth chart with WHO/CDC percentile bands                                  |
| C4 | Vaccines chip, export sheet, Procare-origin badge with staff attribution    |
| C5 | GUI editor, translations, accessibility (§12 #34)                           |

C-track milestones ship as part of integration releases — there is
no separate card tag or HACS plugin entry. Each Cn must complete
before the integration release that depends on the corresponding
sensors/services exits. Built-in-card fallback YAML (§9.4) stays
usable when only the integration backend has shipped.

## 14. Acceptance criteria for v1.0.0

- `hassfest` and `hacs/action` (type: integration) pass on `main`.
- Python test suite covers: config flow happy path (incl. setting
  eligibility), each service call's success and validation-error
  paths (including eligibility rejections), sensor state after
  each service, storage round-trip (save → reload), percentile
  values against known WHO/CDC samples, vaccine schedule
  due/overdue logic, export HTML + CSV smoke, Assist intent
  registration and dispatch (including the eligibility-rejection
  speech path), and an upgrade-path test that loads a v1 fixture
  file.
- Card test suite (vitest) covers: section-toggle rendering,
  unit-conversion math (§15 #25), WS subscription teardown on
  card removal, and accessibility-baseline checks (ARIA labels,
  keyboard activation, theme-variable usage; §12 #34).
- `release.yml` build-drift check passes — committed
  `babytracker-card.js` matches a fresh `npm run build`.
- README has at least one screenshot of the dashboard, the
  exported pediatrician report, the card's GUI editor, and full
  service reference.
- Manual smoke test: install via HACS into a clean HA, add a baby
  (setting `sex`, toggling off `breast_left`/`breast_right`),
  attempt to add a second baby without `sex` and confirm the
  config flow rejects it, hard-refresh the dashboard tab, drop a
  `type: custom:babytracker-card` into Lovelace and confirm it
  resolves without any HACS plugin install, log one of each
  enabled activity, attach a photo to one, log a vaccine, run an
  export, fire one Assist intent through Developer Tools →
  Assist, simulate a Procare check-in and confirm local logs are
  rejected with the correct error, run
  `set_daycare_presence(value=false)` and confirm local logs work
  again, edit one entry, delete one, restart HA, verify all state
  persists, disabled methods stay hidden, and the card still
  loads (no extra resource configuration). Then update the
  integration version locally, restart, and confirm the browser
  re-fetches the card automatically (no manual cache clear).

## 15. Implementation TODOs per milestone

Surfaced from the 2026-05-17 code-readiness review. ✅ = resolved
inline in this spec; ⬜ = open work item to land inside the
relevant milestone's first PR.

### M1 — scaffolding, config flow, storage

- ✅ **#1** Step-by-step config flow and options flow design (§4.1).
- ✅ **#2** Slug rules + reserved slug + stability on rename (§4.1).
- ✅ **#3** UUID format — `str(uuid.uuid4())` stamped at config-flow exit (§4.1).
- ✅ **#4** `birthday` format `YYYY-MM-DD`, ≤ today, ≥ 25 years ago (§4.1).
- ✅ **#5** `archived` flag added to baby JSON (§5).
- ✅ **#6** `single_config_entry: true` + `minimum_ha_version: 2024.6` in manifest (§11.1).

### M4–M7 — percentiles, vaccines, export

- ✅ **#7** LMS file JSON schema fully defined; indicator/x_axis/y_axis matrix (§4.5).
- ✅ **#8** Vaccine schedule file JSON schema fully defined with worked example (§4.8).
- ✅ **#9** BMI formula and lb/in → kg/cm conversion rules; rounding decisions (§4.5).
- ✅ **#10** `Φ` via `math.erf`; **no scipy dependency** (§4.5).
- ✅ **#11** Weight-for-length and BMI-for-age require both weight and length on the same growth entry; if missing, derived sensors keep last value (§4.5).
- ✅ **#12** `dose_number` auto-inference rule on `log_vaccine` (§4.8).
- ✅ **#13** Free-form vaccines accepted but excluded from `vaccines_due` / `vaccines_overdue` (§4.8).
- ✅ **#14** `export_report` argument contract (resolved Q14):
  - `start` and `end` ISO `YYYY-MM-DD` strings; inclusive on both bounds.
  - Default range when omitted: last 90 days ending today.
  - Filename collision: deterministic name (`<baby>-<start>-<end>.<ext>`), overwrite without warning.
  - CSV encoding: UTF-8 with BOM (Excel-friendly).
  - Multi-baby export: deferred; v1 is single-baby per call.
- ✅ **#15** Age sensors (resolved Q15): two sensors per baby —
  `sensor.<baby>_age_days` with `native_unit_of_measurement: "d"`,
  `state_class: measurement`, no `device_class`; plus
  `sensor.<baby>_age_months` (float, no device_class) for older-baby UX.

### M8 — Procare importer

- ✅ **#16** Mappings split (resolved Q16): ship `data/procare/default_mappings.json`; `importers/procare_mappings.py` is a thin loader that merges the default with a user-supplied `options.procare_mapping_overrides` dict. Document override schema in §4.6.
- ✅ **#17** Sign-in / Sign-out regex set (resolved Q17), added to the §4.6 title→type table:
  - `^Sign(ed)? In( by .+)?$` → `daycare_presence: on`
  - `^Sign(ed)? Out( by .+)?$` → `daycare_presence: off`
  - These events do **not** create entries; they only update `binary_sensor.<baby>_at_daycare`.
- ✅ **#18** Stale `at_daycare` cleanup (resolved Q18, *diverged from earlier draft*):
  Each Procare importer carries optional `daycare_open_time`,
  `daycare_close_time`, and `daycare_days` config. When set, the
  importer registers `async_track_time_change` at `daycare_close_time`
  on operating days; if `at_daycare` is still on it flips off
  (logged `INFO`). Households that don't configure hours: no
  auto-clear; state persists until next sign event or manual
  override. The 16h-timeout idea from the earlier draft is dropped.
- ✅ **#19** Detection-mode auto-switch (resolved Q19): importer starts in `mode: inference_window`. The first time it observes a Sign-In title for the mapped entity, it switches permanently to `mode: title_events` for that mapping and persists the choice in storage.
- ✅ **#20** Bottle-amount parsing (resolved Q20): try regex `(\d+(?:\.\d+)?)\s*(ml|oz|mL|OZ)\b`; if no match, log the entry with `amount` and `unit` unset (entry still useful for count). Track unparseable details in a `WARNING` log.
- ✅ **#21** Diagnostic sensor (resolved Q21): `sensor.babytracker_unmapped_procare_titles`. State: count of unique unmapped titles seen since last restart. Attribute `titles` holds the list. Sensor registered only when at least one Procare importer is configured.

### M9 — Assist intents

- ✅ **#22** Intents split (resolved Q22): `intents.yaml` is HA's *custom sentences* YAML (sentence templates per intent). Intent **handlers** are Python classes (`homeassistant.helpers.intent.IntentHandler`) registered in `__init__.py` via `intent.async_register(hass, handler)`. `intents.py` added to §8.1 file layout.
- ✅ **#23** Intent-rejection translation keys (resolved Q23): three keys — `intents.eligibility_rejected` ("{method_label} isn't enabled for {baby_name}"), `intents.daycare_lockout` ("{baby_name} is checked in at daycare"), `intents.baby_not_found` ("I don't know a baby named {baby_name}"). Added to translation inventory (#30).

### C-track — Lovelace card

- ✅ **#24** WebSocket command family (resolved Q24):
  - `babytracker/list_babies` → `[{id, slug, name, sex, birthday, archived}]`
  - `babytracker/get_baby_config(baby)` → `{enabled_activities, enabled_feeding_methods, importer: {…}}`
  - `babytracker/get_integration_options` → `{volume_unit, weight_unit, length_unit, vaccine_schedule, enable_pumping, …}`
  - `babytracker/get_vaccine_schedule` → `{schedule_id, version, doses: […]}`
  - All four support `subscribe: true` and push diffs when the underlying state changes.
- ✅ **#25** Unit-conversion locus (resolved Q25): sensor states are emitted in the integration's configured unit; the card converts for display only. The card never re-issues service calls in a different unit; it always passes the original payload's unit through.
- ✅ **#26** `recent_limit` cap (resolved Q26): card silently clamps to 50 (the per-baby sensor's cached size). Document in card README, not in spec.

### Cross-cutting

- ✅ **#27** `edit_entry` shape (resolved Q27): `{entry_id: str, fields: dict}`. Keys limited to the mutable set (§12 #19); each value validated against its activity's vocabulary. Unknown keys raise `ServiceValidationError`. `services.yaml` uses an `object` selector for `fields` — limited HA UI usability is acceptable for a power-user surface.
- ✅ **#28** Eligibility-disable semantics (resolved Q28): call `entity_registry.async_update_entity(entity_id, disabled_by="integration")` rather than `async_remove`. `unique_id` and long-term-statistics history stay across toggles. Re-enabling restores via `async_update_entity(disabled_by=None)`. Same rule for both counter sensors and value-bearing sensors — uniform, no special-casing.
- ✅ **#29** Enum sensor `options` (resolved Q29):
  - `_last_diaper_kind`: `["wet", "dirty", "both"]`
  - `_last_feeding_method`: `["bottle", "breast_left", "breast_right", "solids"]`
  - `_vaccines_due`: `device_class: enum` with `options` populated dynamically at startup from the active schedule's distinct vaccine names plus `"none"`.
- ✅ **#30** Translation-key inventory (resolved Q30): seven categories
  shipped as the skeleton `translations/en.json` in M1, filled in
  as their owning milestones land:
  - `config.step.welcome.*`, `config.step.add_baby.*`, `config.step.eligibility.*`, `config.error.*`
  - `options.step.main.*`, `options.error.*`
  - `entity.sensor.<key>.*`, `entity.binary_sensor.<key>.*` for every entity name → friendly label
  - `services.<service_name>.name`, `services.<service_name>.description`, `services.<service_name>.fields.*`
  - `intents.eligibility_rejected`, `intents.daycare_lockout`, `intents.baby_not_found` (#23)
  - `vaccine_labels.*` (canonical name → locale label, §12 #35)
  - `exceptions.eligibility_rejected`, `exceptions.daycare_lockout`, `exceptions.unknown_baby`

### Bookkeeping

All thirty items #1–#30 resolved on **2026-05-17**. Spec is
implementation-ready end-to-end. The only item that diverged
from its initial draft proposal is #18 (daycare auto-sign-out
via configured operating hours instead of a fixed 16-hour
timeout); all others matched the reviewed defaults.

Open work going forward lives in commits and PRs, not in spec
items. Future deltas (e.g. a v1.1 wake-window predictor, a v1.x
soft-delete mode) get their own §-numbered subsections rather
than reopening §15.
