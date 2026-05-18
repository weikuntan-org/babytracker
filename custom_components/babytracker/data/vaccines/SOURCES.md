# Vaccine schedules

Schedules in this directory are vendored from public,
public-domain sources:

- **`us_cdc.json`** — U.S. CDC immunization schedule for ages 0–18.
  Source: <https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html>.
- **`uk_nhs.json`** — NHS childhood vaccination schedule.
  Source: <https://www.nhs.uk/conditions/vaccinations/nhs-vaccinations-and-when-to-have-them/>.

Bump `version` when the upstream schedule changes. Vaccine names stay
in the source language; the card translates the user-facing label via
`vaccine_labels.<canonical-name>` in `translations/<locale>.json`
(§12 #35).
