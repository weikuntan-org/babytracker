# Market research — baby tracker apps vs. `babytracker` spec

Date: 2026-05-17. Sources at the end. Scope: feature comparison only —
no pricing analysis beyond what shapes the feature set.

## 1. Landscape at a glance

| App                | Model                        | Why parents pick it                                        |
| ------------------ | ---------------------------- | ---------------------------------------------------------- |
| **Baby Buddy**     | Open-source, self-hosted Django + HA integration | Privacy, free, multi-caregiver, the closest analogue to our spec |
| **Huckleberry**    | Cloud, freemium ($)          | SweetSpot AI sleep predictions, AI photo-to-log, sleep consultant content |
| **Nara Baby**      | Cloud, fully free, ad-free   | Calm UX, wake-window naps, solids database, medication reminders |
| **Baby Connect**   | Cloud, ~$5/mo                | Unlimited caregivers, daycare-friendly web entry, deep reports |
| **Glow Baby**      | Cloud, freemium              | Pregnancy → baby continuity                                |
| **Talli**          | Hardware + app               | One-tap physical button by the changing table              |
| **Child Growth Tracker / Boston Children's Pediatric Growth Charts** | Growth-only apps | Pediatrician-grade WHO+CDC+Fenton preterm + PDF export |
| **`babytracker` (us)** | HA-native custom_component + HACS card | Local-only, HA automation citizen, Procare daycare ingestion |

## 2. Feature matrix

Legend: ✅ first-class · 🟡 partial / via workaround · ❌ not supported · ⭐ unique to that app

| Capability                                | Baby Buddy | Huckleberry | Nara | Baby Connect | Growth-only apps | **babytracker (spec)** |
| ----------------------------------------- | :---: | :---: | :---: | :---: | :---: | :---: |
| Multi-baby / twins                        | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Feeding (bottle / breast / solids)        | ✅ | ✅ | ✅ + foods DB | ✅ | ❌ | ✅ (no foods DB) |
| Sleep start/stop sessions                 | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Sleep predictions (wake windows / AI)** | ❌ | ⭐ SweetSpot | ✅ wake windows | 🟡 reports | ❌ | ❌ |
| Diapers (wet / dirty / both)              | ✅ | ✅ | ✅ + rashes | ✅ | ❌ | ✅ |
| Pumping                                   | ✅ + stash inventory | ✅ | ✅ | ✅ | ❌ | ✅ (no stash) |
| Tummy time                                | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Milestones**                            | 🟡 | ✅ | ✅ | ✅ | ❌ | ❌ |
| Growth: weight / height / head            | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WHO + CDC LMS percentile charts           | 🟡 basic | ✅ | ✅ | ✅ | ⭐ + Fenton preterm + many countries | ✅ WHO 0-24mo, CDC 24mo+ |
| **PDF / CSV export for pediatrician**     | 🟡 CSV via Django admin | ✅ | 🟡 | ✅ reports | ⭐ PDF | ❌ |
| Medications                               | 🟡 | ✅ | ✅ + reminders | ✅ | ❌ | ✅ (reminders deferred to HA automations) |
| Vaccines (structured)                     | ❌ | 🟡 | ✅ | ✅ | ❌ | 🟡 fits in medication |
| Photos on entries                         | 🟡 | ✅ | ✅ | ✅ | ❌ | 🟡 only via Procare import |
| Notes / journal                           | ✅ | ✅ | ✅ | ✅ | ❌ | 🟡 notes field, no card |
| Multi-caregiver sharing                   | ✅ users | ✅ | ✅ | ⭐ unlimited + web | ❌ | 🟡 via HA users — **out of v1 scope** |
| Reminders & nudges                        | 🟡 | ✅ | ✅ | ✅ | ❌ | 🟡 user builds HA automations |
| **Daycare data ingestion (Procare etc.)** | ❌ | ⭐ AI photo of paper log | ❌ | 🟡 daycare staff log via web | ❌ | ⭐⭐ **structured Procare import** |
| Mobile-first UI                           | 🟡 web | ✅ native | ✅ native | ✅ native | ✅ native | 🟡 mobile-responsive HA dashboard |
| One-tap physical button                   | 🟡 via HA | ❌ | ❌ | ❌ | ❌ | 🟡 user wires Zigbee → service |
| **Local-only, no cloud**                  | ⭐ | ❌ | ❌ | ❌ | mixed | ⭐ |
| **HA-native sensors / automations**       | 🟡 via API integration | ❌ | ❌ | ❌ | ❌ | ⭐ |
| Subscription required                     | ❌ | for premium | ❌ | ❌ | varies | ❌ |
| AI logging                                | ❌ | ⭐ photo → entries | 🟡 | ❌ | ❌ | ❌ (not planned) |

## 3. Where we beat the field

These are features no competitor has, or that only Baby Buddy partially does:

1. **Procare daycare auto-ingestion** — no commercial app pulls in daycare events. Huckleberry's "AI photo of paper log" is the nearest, and that still requires the parent to receive and photograph the log. Our spec turns it into a state-change subscription. This is the standout differentiator.
2. **Local-only, HA-native** — only Baby Buddy is also self-hosted, but it's a separate Django service the parent must run, back up, and update. We piggyback on HA, which most target users already maintain.
3. **Sensors as automation primitives** — `binary_sensor.<baby>_sleeping` can drive white-noise scenes, no-feeding-in-4h alerts, "is the baby room dark?" checks. Cloud apps treat tracking as a destination, not a signal.
4. **Pluggable importer framework** — Procare is just the first. Brightwheel, Tadpoles, Lillio (formerly HiMama), kinderlime — all conceivable next importers. Architecturally we're the only one set up for this.
5. **Twin-aware data model from day one** — competitors retrofit this. Our entity-per-baby with namespaced sensors is clean.
6. **No subscription, ever** — only Baby Buddy and Nara match this; we don't lose features behind a paywall.

## 4. Gaps worth considering for SPECS.md

Categorised by whether they're worth adding **now (v1)**, **soon (v1.x)**, or **decline (out of scope)**.

### 4.1 Recommend adding to v1

These are table-stakes in every competitor and cheap to spec now.

- **Tummy time** as a tracked activity (timed session like sleep). Baby Buddy, Huckleberry, Nara, Baby Connect all have it. Trivial — add to `4.2` activities table, mirror sleep's start/end pattern, add `binary_sensor.<baby>_tummy_time` and `sensor.<baby>_total_tummy_time_today`.
- **Photos on any entry** (not just Procare). Most parents want to attach a snap to a meal or milestone. Lowest-effort spec: optional `photo_path` field that points at HA's media folder; card renders inline. Avoids running our own image server.
- **Pediatrician export (CSV + printable HTML)**. Service `babytracker.export_report(baby, format, start, end)` that writes to `/config/www/babytracker/<baby>-<date>.{csv,html}`. The growth-focused apps make their living off this feature and our percentile data already supports it.
- **Vaccines as a distinct entry type** with a pre-seeded CDC/WHO schedule. Currently shoehorned into medication. Small spec addition; big value for parents.

### 4.2 Recommend for v1.x (not v1)

Bigger lifts but obvious next steps once v1 is solid.

- **Wake-window prediction / next-nap suggestion**. Huckleberry and Nara's killer feature. Computable from sleep history; no ML required for a v1 of it (age-banded wake-window tables are publicly documented). Spec as `sensor.<baby>_next_nap_window` with attributes for confidence and basis.
- **Milestones** (rolled over, first words, etc.) with age-banded prompts. Mostly a config table + a list-state sensor. Add to importer subsystem as Procare may emit them.
- **Pumped-milk stash tracking** (Baby Buddy unique). `sensor.<baby>_freezer_stash_oz`, `babytracker.consume_stash(amount)`. Niche but loved.
- **Solids food database** with allergen flags. Nara's secret weapon. Spec a vendored `data/foods.json` analogous to LMS tables.
- **Mobile-app-friendly entry sheets**. The card already targets Lovelace; ensure the GUI is tested on the HA companion app and consider a "sheet" pattern that's thumb-reachable one-handed at 3 a.m.
- **Additional importers**: Brightwheel, Tadpoles, Lillio, generic CSV. Already architecturally possible — just needs mappings.

### 4.3 Decline — keep out of scope

- **Cloud sync / multi-device caregiver sharing as a feature of `babytracker`**. Defer to HA's own user/device model and remote-access story (Nabu Casa, Tailscale, reverse proxy). Documenting "how to share with grandma over HA" is enough.
- **AI photo-to-log** (Huckleberry's headline feature). Costs API budget, ships a model dependency, and is squarely a cloud-app value prop. Out of scope.
- **Sleep consulting content / coaching modules**. Editorial product; not our shape.
- **Pregnancy-mode** (Nara, Glow). Different lifecycle, separate integration if anyone wants it.
- **Vaccines push-notification reminders as a managed schedule**. We can expose the data; let users build the HA automation.

## 5. Recommended SPECS.md updates (concrete diffs)

If we accept §4.1 in full, the surgical changes are:

1. **§4.2 activities table** — add row `tummy_time`, timed (start/end), required `baby`, optional `notes`. Update enum vocabularies and the sleep-conflict guard to cover tummy time too.
2. **§4.5 / new §4.7** — add `photo_path` as an optional field on every entry. Document storage in HA's `media_source` (no upload UI in v1; user pastes path from HA Media browser).
3. **§4.8 (new) Vaccines** — distinct type with `name`, `dose_number`, `scheduled_age_months`. Ship a `data/vaccines/us_cdc.json` reference schedule. Sensor `sensor.<baby>_vaccines_due` whose state is the next overdue/upcoming vaccine.
4. **§7 services** — add `babytracker.log_tummy_time`, `babytracker.log_vaccine`, `babytracker.export_report(baby, format, start, end)`. Update sleep services note to "and tummy time".
5. **§6 entities** — add `binary_sensor.<baby>_tummy_time`, `sensor.<baby>_total_tummy_time_today`, `sensor.<baby>_vaccines_due`.
6. **§8.1 file layout** — add `data/vaccines/us_cdc.json` and an `export.py` module.
7. **§12 milestones** — slot tummy time and photo into M2/M3 (cheap), vaccines + export into a new **M7 Pediatric extras**, push current M7 (importers) to M8, HACS polish to M9. Or fold tummy time into M3 sleep without renumbering.
8. **§3 user stories** — add 2 new stories covering the pediatrician-visit export and the daycare-photo attachment.

If we also accept §4.2 picks (wake-windows, milestones, stash, foods DB), that's another spec section best titled "v1.x roadmap" — keep them out of milestone numbering until v1 ships.

## 6. Open positioning questions

- **What's our headline?** Three candidates: "the HA-native baby tracker", "the only baby tracker that ingests daycare data", "the privacy-first open-source baby tracker". I'd lead with #2 in the README — it's specific, demonstrably true, and addresses a real pain point no cloud app solves.
- **Are we trying to replace Baby Buddy or coexist?** They're more mature. Coexistence story: Baby Buddy users who want HA-native automations + Procare ingestion install us *additionally*; we ship a one-way Baby Buddy importer in v1.x to ease migration.
- **Is the card a hard prerequisite for adoption?** Probably yes for first-time HA users. The fallback Lovelace YAML in the README needs to be excellent, not minimal.

## Sources

- [Baby Buddy (GitHub)](https://github.com/babybuddy/babybuddy)
- [Baby Buddy Home Assistant integration (jcgoette)](https://github.com/jcgoette/baby_buddy_homeassistant)
- [Baby Buddy HomeAssistant Addon](https://github.com/OttPeterR/addon-babybuddy)
- [Baby Buddy → HA setup guide (SmartHomeScene)](https://smarthomescene.com/guides/how-to-setup-baby-buddy-in-home-assistant/)
- [Huckleberry (App Store)](https://apps.apple.com/us/app/huckleberry-baby-child/id1169136078)
- [Huckleberry product page](https://huckleberrycare.com/)
- [Nara Baby (Google Play)](https://play.google.com/store/apps/details?id=com.naraorganics.nara)
- [Nara Baby tracker FAQ](https://nara.com/pages/nara-baby-tracker-faq)
- [Baby Connect](https://en.babyconnect.com/)
- [Best Baby Tracker Apps 2026 (Tottli)](https://tottli.com/blog/best-baby-tracker-apps-2026.html)
- [Best Baby Tracker Apps 2026 (Pebbi)](https://pebbi.co/blog/best-baby-tracker-apps-2026)
- [Nara vs Huckleberry 2026 (Pebbi)](https://pebbi.co/blog/nara-vs-huckleberry-2026)
- [10 Best Baby Tracker Apps 2026 (OutreachZ)](https://outreachz.com/blog/best-baby-tracker-ai-apps/)
- [Best Baby Tracker App 2026 (tinylog)](https://tinylog.app/guides/best-baby-tracker-app)
- [Child Growth Tracker](https://childgrowthtracker.com/)
- [Pediatric Growth Charts (Boston Children's, App Store)](https://apps.apple.com/us/app/pediatric-growth-charts-by-boston-childrens-hospital/id617601789)
- [Growth: baby & child charts](https://apps.apple.com/us/app/growth-baby-child-charts/id446639811)
- [6 Best Baby Growth Tracker Apps 2026 (tinylog)](https://tinylog.app/guides/best-baby-growth-tracker-apps)
