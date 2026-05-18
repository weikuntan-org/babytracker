"""Constants for the babytracker integration."""
from __future__ import annotations

from typing import Final

DOMAIN: Final = "babytracker"
VERSION: Final = "0.1.0"

FRONTEND_URL: Final = "/babytracker_static"
CARD_FILENAME: Final = "babytracker-card.js"

STORAGE_VERSION: Final = 1
STORAGE_MINOR_VERSION: Final = 1
STORAGE_KEY: Final = DOMAIN

RESERVED_SLUGS: Final = frozenset({DOMAIN})

ACTIVITY_FEEDING: Final = "feeding"
ACTIVITY_SLEEP: Final = "sleep"
ACTIVITY_TUMMY_TIME: Final = "tummy_time"
ACTIVITY_DIAPER: Final = "diaper"
ACTIVITY_GROWTH: Final = "growth"
ACTIVITY_MEDICATION: Final = "medication"
ACTIVITY_VACCINE: Final = "vaccine"
ACTIVITY_WALK: Final = "walk"

ALL_ACTIVITIES: Final = (
    ACTIVITY_FEEDING,
    ACTIVITY_SLEEP,
    ACTIVITY_TUMMY_TIME,
    ACTIVITY_DIAPER,
    ACTIVITY_GROWTH,
    ACTIVITY_MEDICATION,
    ACTIVITY_VACCINE,
    ACTIVITY_WALK,
)

FEEDING_METHOD_BOTTLE: Final = "bottle"
FEEDING_METHOD_BREAST_LEFT: Final = "breast_left"
FEEDING_METHOD_BREAST_RIGHT: Final = "breast_right"
FEEDING_METHOD_SOLIDS: Final = "solids"

ALL_FEEDING_METHODS: Final = (
    FEEDING_METHOD_BOTTLE,
    FEEDING_METHOD_BREAST_LEFT,
    FEEDING_METHOD_BREAST_RIGHT,
    FEEDING_METHOD_SOLIDS,
)

DIAPER_KIND_WET: Final = "wet"
DIAPER_KIND_DIRTY: Final = "dirty"
DIAPER_KIND_BOTH: Final = "both"
ALL_DIAPER_KINDS: Final = (DIAPER_KIND_WET, DIAPER_KIND_DIRTY, DIAPER_KIND_BOTH)

PUMPING_SIDE_LEFT: Final = "left"
PUMPING_SIDE_RIGHT: Final = "right"
PUMPING_SIDE_BOTH: Final = "both"
ALL_PUMPING_SIDES: Final = (PUMPING_SIDE_LEFT, PUMPING_SIDE_RIGHT, PUMPING_SIDE_BOTH)

VOLUME_UNIT_ML: Final = "ml"
VOLUME_UNIT_OZ: Final = "oz"
ALL_VOLUME_UNITS: Final = (VOLUME_UNIT_ML, VOLUME_UNIT_OZ)

WEIGHT_UNIT_KG: Final = "kg"
WEIGHT_UNIT_LB: Final = "lb"
ALL_WEIGHT_UNITS: Final = (WEIGHT_UNIT_KG, WEIGHT_UNIT_LB)

LENGTH_UNIT_CM: Final = "cm"
LENGTH_UNIT_IN: Final = "in"
ALL_LENGTH_UNITS: Final = (LENGTH_UNIT_CM, LENGTH_UNIT_IN)

VACCINE_SITES: Final = (
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal",
)

SLEEP_LOCATIONS: Final = ("home", "daycare", "car", "stroller", "other")

ENTRY_SOURCE_USER: Final = "user"
ENTRY_SOURCE_PROCARE: Final = "procare"

# Default integration options (§4.1 + §12)
OPT_VOLUME_UNIT: Final = "volume_unit"
OPT_WEIGHT_UNIT: Final = "weight_unit"
OPT_LENGTH_UNIT: Final = "length_unit"
OPT_ENABLE_PUMPING: Final = "enable_pumping"
OPT_VACCINE_SCHEDULE: Final = "vaccine_schedule"
OPT_VACCINE_GRACE_DAYS: Final = "vaccine_grace_days"
OPT_WHO_CDC_HANDOFF_MONTHS: Final = "who_cdc_handoff_months"
OPT_PRESENCE_INFERENCE_WINDOW_MINUTES: Final = "presence_inference_window_minutes"

DEFAULT_OPTIONS: Final = {
    OPT_VOLUME_UNIT: VOLUME_UNIT_OZ,
    OPT_WEIGHT_UNIT: WEIGHT_UNIT_KG,
    OPT_LENGTH_UNIT: LENGTH_UNIT_CM,
    OPT_ENABLE_PUMPING: True,
    OPT_VACCINE_SCHEDULE: "us_cdc",
    OPT_VACCINE_GRACE_DAYS: 14,
    OPT_WHO_CDC_HANDOFF_MONTHS: 24,
    OPT_PRESENCE_INFERENCE_WINDOW_MINUTES: 60,
}

# Maximum age allowed at config-flow (§4.1)
MAX_BIRTHDAY_AGE_YEARS: Final = 25

# Recent-entries sensor cap (§4.3, §15 #26)
RECENT_ENTRIES_CAP: Final = 50

# Signals
SIGNAL_DATA_UPDATED: Final = f"{DOMAIN}_data_updated"
