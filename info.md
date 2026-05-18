# babytracker

A Home Assistant custom integration for logging and tracking infant
care activities (feeding, sleep, tummy time, diapers, pumping, growth,
medication, vaccines) entirely within HA, with data stored locally and
a printable pediatrician export.

Features include:

- Per-baby sensors and binary sensors for every tracked activity.
- WHO + CDC growth percentiles (LMS method, hand-rolled — no scipy).
- Vendored vaccine schedule with `vaccines_due` / `vaccines_overdue`.
- Pediatrician-friendly HTML + CSV export.
- Procare daycare ingestion via `procare_activities` (optional).
- Bundled Lovelace card auto-registered on integration setup.

See `README.md` for installation and full service reference.
