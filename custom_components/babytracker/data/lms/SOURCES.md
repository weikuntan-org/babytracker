# LMS reference tables

The vendored JSON tables in this directory are derived from public,
public-domain growth-reference datasets:

- **WHO Child Growth Standards (2006)** — weight-for-age, length-for-age,
  head-circumference-for-age, weight-for-length, BMI-for-age. Covers 0–24
  months. Source: <https://www.who.int/tools/child-growth-standards/standards>.
- **CDC Growth Charts (2000)** — weight-for-age, stature-for-age,
  weight-for-stature, BMI-for-age. Covers 24 months – 20 years.
  Source: <https://www.cdc.gov/growthcharts/percentile_data_files.htm>.

The babytracker integration treats the **WHO** dataset as authoritative
from 0 to `who_cdc_handoff_months` (default 24, AAP guidance), then
switches to the **CDC** dataset. The switch is parameterised in
integration options (§4.5).

## File schema

```jsonc
{
  "indicator": "weight_for_age",
  "sex": "female" | "male",
  "source": "WHO" | "CDC",
  "data_version": "who_2006_v1",
  "x_axis": "age_days" | "length_cm" | "stature_cm",
  "y_axis": "weight_kg" | "length_cm" | "head_kg" | "bmi",
  "rows": [
    { "x": 0, "L": ..., "M": ..., "S": ... }
  ]
}
```

`rows` is sorted by `x`. The percentile module linearly interpolates
between integer rows for inputs that don't land on an exact `x`.

## Coverage note

The vendored tables in this repository include validated anchor points
covering the most common age and length ranges. For a production
deployment we recommend periodically refreshing them from the WHO/CDC
sources above; the `data_version` field is bumped whenever the underlying
publication changes. Bumps require a storage migration only if the
shape changes; values can be updated in place.
