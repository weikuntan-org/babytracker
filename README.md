# babytracker

A Home Assistant custom integration for logging and tracking infant
care activities — feeding, sleep, tummy time, diapers, pumping, growth,
medication, vaccines — entirely within HA. All data stays local in HA's
storage. A bundled Lovelace card is auto-registered when the integration
loads, so there is **no separate HACS plugin to install**.

> Status: v0.1 — implementation tracks the spec in `SPECS.md`.

## Highlights

- **Local-only.** No cloud sync, no third-party service. Storage is a
  single JSON Store rewritten on each change.
- **HA-native.** Every activity exposes sensors and binary_sensors;
  `binary_sensor.<baby>_sleeping` drives white-noise scenes,
  `sensor.<baby>_vaccines_due` drives reminder automations, and so on.
- **Twin-aware from day one.** All sensors namespaced per baby.
- **Eligibility-gated.** Per-baby activity + feeding-method toggles —
  a bottle-only baby gets no breast prompts.
- **Procare daycare ingestion** (optional). Subscribes to the
  [`procare_activities`](https://github.com/nmanclank/ha-procare-activity-fetcher)
  community integration's per-kid sensor (`sensor.<kid_slug>_latest_activity`);
  daycare events appear in babytracker without double entry.
- **WHO + CDC growth percentiles** via the LMS method, with the
  AAP-recommended handoff at 24 months. No `scipy` dependency.
- **Pediatrician-friendly export.** `babytracker.export_report` writes
  a printable HTML and CSV under `/config/www/babytracker/`.
- **Bundled Lovelace cards** — `type: custom:babytracker-card` for the
  main per-baby card (status, today's counts, quick-log, last 24 hours),
  and `type: custom:babytracker-summary-card` for a separate vaccines +
  growth + 7-day trend charts + pediatrician export panel. Both ship in
  the same JS bundle and register themselves when the integration loads.
  The older names `custom:babytracker-medical-card` and
  `custom:babytracker-growth-card` continue to work as aliases.

## Installation

### HACS

1. Add this repository as a custom HACS integration (category:
   integration).
2. Install **babytracker**.
3. Restart Home Assistant.
4. **Hard-refresh** your dashboard tab after first install. The
   integration auto-registers the Lovelace Resource for the bundled
   card on Storage-mode dashboards, but the HA frontend bundle was
   already in your browser before that ran — refresh to load it.
   On every integration update, the Resource URL is automatically
   cache-busted with the bundle's mtime, so subsequent updates pick
   up cleanly without manual Resource edits.
5. Add a `type: custom:babytracker-card` card to your dashboard. Add a
   `type: custom:babytracker-summary-card` card separately for a
   vaccines + growth + trends + export panel. The older type names
   `babytracker-medical-card` and `babytracker-growth-card` keep
   working as aliases.

### Manual

1. Copy `custom_components/babytracker/` into your HA config's
   `custom_components/` directory.
2. Restart HA.

## Configuration

The integration is single-entry. Settings → Devices & Services →
Add Integration → **babytracker** walks through:

1. Welcome.
2. Add baby (name, birthday, sex — required for percentiles).
3. Eligibility (which activities + feeding methods to enable).
4. Confirm.

Re-open the entry to add more babies, edit, archive, or unarchive,
manage Procare importers, or set integration-wide options
(default volume / weight / length units, vaccine schedule, vaccine
grace days, WHO ↔ CDC handoff age).

### Procare importer setup

1. Install and configure the
   [`procare_activities`](https://github.com/nmanclank/ha-procare-activity-fetcher)
   custom integration. It creates one sensor per kid named
   `sensor.<kid_slug>_latest_activity` (HA slugifies the kid's display
   name, so "Ava Smith" becomes `sensor.ava_smith_latest_activity`).
   Find the exact entity ID under **Developer Tools → States** by
   filtering on `latest_activity`.
2. In babytracker's **Configure → Manage importers**, pick the matching
   baby and paste that entity ID into `source_entity_id`, choose which
   activity types to import (feeding, diaper, sleep), keep
   `mark_readonly: true` so Procare-sourced entries aren't editable
   from the card, and save.
3. Restart Home Assistant — the importer subscribes to state-change
   events at integration load. After the restart, new Procare activities
   appear in the card's "Last 24 hours" list with a `via <staff>`
   annotation.

## Services

See `custom_components/babytracker/services.yaml` for the full
selector contracts. Highlights:

- `babytracker.log_feeding(baby, method, amount?, unit?, ...)`
- `babytracker.start_feeding(baby, method)` / `end_feeding(baby, ...)`
- `babytracker.start_sleep(baby, location?)` / `end_sleep(baby, ...)`
- `babytracker.start_tummy_time(baby)` / `end_tummy_time(baby, ...)`
- `babytracker.log_tummy_time(baby, started_at, ended_at, notes?)` *(retroactive)*
- `babytracker.log_diaper(baby, kind, notes?, photo_path?)`
- `babytracker.log_pumping(volume, unit, side?, ...)`
- `babytracker.log_growth(baby, weight?, height?, head_circumference?, ...)`
- `babytracker.log_medication(baby, name, dose, unit, notes?)`
- `babytracker.log_vaccine(baby, name, dose_number?, ...)`
- `babytracker.edit_entry(entry_id, fields)`
- `babytracker.delete_entry(entry_id)`
- `babytracker.purge_baby(baby_id)` — archived babies only
- `babytracker.export_report(baby, format, start?, end?, sections?)`
- `babytracker.set_daycare_presence(baby, value)`

## Assist intents

Voice / chat surfaces that talk to HA's Assist drive babytracker
without bespoke YAML:

| Intent | Example sentence |
| ------ | ---------------- |
| `BabytrackerLogDiaper` | "Log a wet diaper for Ava" |
| `BabytrackerStartSleep` / `BabytrackerEndSleep` | "Ava is going to sleep" / "Ava woke up" |
| `BabytrackerStartFeeding` / `BabytrackerEndFeeding` | "Start bottle for Ava" |
| `BabytrackerLogFeeding` | "Log 60 ml bottle for Ava" |
| `BabytrackerLogTummyTime` | "Ava did 15 minutes of tummy time" |
| `BabytrackerLastFeedingTime` | "When did Ava last eat?" |
| `BabytrackerLastDiaperTime` | "When was Ava's last diaper?" |
| `BabytrackerIsSleeping` | "Is Ava sleeping?" |

## Example automations

### Alert when no feeding for 4 hours

```yaml
automation:
  - alias: "Ava needs to eat"
    trigger:
      - platform: template
        value_template: >
          {{ (now() - states('sensor.ava_last_feeding')|as_datetime).total_seconds() > 4*60*60 }}
    action:
      - service: notify.mobile_app_phone
        data:
          message: "It's been over 4 hours since Ava ate."
```

### White-noise scene when sleeping

```yaml
automation:
  - alias: "White noise during Ava's nap"
    trigger:
      - platform: state
        entity_id: binary_sensor.ava_sleeping
        to: "on"
    action:
      - service: scene.turn_on
        target:
          entity_id: scene.ava_white_noise
```

### Vaccine reminder a week before due

```yaml
automation:
  - alias: "Ava vaccine reminder"
    trigger:
      - platform: template
        value_template: >
          {{ states('sensor.ava_vaccines_due') != 'none' and
             (state_attr('sensor.ava_vaccines_due', 'due_on')|as_datetime
              - now()).days <= 7 }}
    action:
      - service: notify.mobile_app_phone
        data:
          message: >
            {{ states('sensor.ava_vaccines_due') }} (dose
            {{ state_attr('sensor.ava_vaccines_due', 'dose_number') }})
            is due on
            {{ state_attr('sensor.ava_vaccines_due', 'due_on') }}.
```

### Daily summary at 8 PM

```yaml
automation:
  - alias: "Ava daily summary"
    trigger:
      - platform: time
        at: "20:00:00"
    action:
      - service: notify.mobile_app_phone
        data:
          message: >
            Today for Ava: {{ states('sensor.ava_feedings_today') }} feedings,
            {{ states('sensor.ava_diapers_today') }} diapers,
            {{ states('sensor.ava_total_sleep_today') }} min of sleep.
```

### Inbound logging from Telegram

```yaml
automation:
  - alias: "Telegram → diaper"
    trigger:
      - platform: event
        event_type: telegram_text
        event_data:
          text: "diaper wet ava"
    action:
      - service: babytracker.log_diaper
        data:
          baby: ava
          kind: wet
```

## Without the bundled card

If you prefer built-in Lovelace cards, you can build a dashboard
panel from the sensors directly:

```yaml
type: vertical-stack
cards:
  - type: entities
    title: Ava — today
    entities:
      - sensor.ava_feedings_today
      - sensor.ava_diapers_today
      - sensor.ava_total_sleep_today
      - sensor.ava_vaccines_due
  - type: glance
    entities:
      - sensor.ava_last_feeding
      - sensor.ava_last_diaper
      - binary_sensor.ava_sleeping
  - type: button
    name: Log wet diaper
    tap_action:
      action: call-service
      service: babytracker.log_diaper
      service_data:
        baby: ava
        kind: wet
```

## What's intentionally out of scope (v1)

- WhatsApp / Telegram / Signal / Discord clients (use HA's `notify.*`).
- AI photo-to-log (cloud-app value prop; we don't want that
  dependency).
- Multi-caregiver attribution.
- Sleep wake-window predictions, milestones, food database, freezer
  stash tracking — see `MARKET-RESEARCH.md` for the v1.x roadmap.

## License

This project follows the Home Assistant ecosystem conventions; the
vendored WHO and CDC datasets are public-domain. See
`custom_components/babytracker/data/lms/SOURCES.md` and
`custom_components/babytracker/data/vaccines/SOURCES.md`.
