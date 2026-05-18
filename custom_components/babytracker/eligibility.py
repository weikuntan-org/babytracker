"""Centralised eligibility + daycare lockout (§4.10, §12 #11)."""
from __future__ import annotations

try:
    from homeassistant.exceptions import ServiceValidationError
except ImportError:  # pragma: no cover — tests run without HA installed

    class ServiceValidationError(Exception):  # type: ignore[no-redef]
        def __init__(
            self,
            message: str = "",
            *,
            translation_domain: str | None = None,
            translation_key: str | None = None,
            translation_placeholders: dict | None = None,
        ) -> None:
            super().__init__(message or translation_key or "ServiceValidationError")
            self.translation_domain = translation_domain
            self.translation_key = translation_key
            self.translation_placeholders = translation_placeholders


try:
    from .const import DOMAIN
    from .models import Baby
except ImportError:  # pragma: no cover
    from const import DOMAIN  # type: ignore[no-redef]
    from models import Baby  # type: ignore[no-redef]


def _exc(translation_key: str, placeholders: dict[str, str]) -> ServiceValidationError:
    return ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key=translation_key,
        translation_placeholders=placeholders,
    )


def find_baby_by_slug(babies: list[Baby], slug: str) -> Baby:
    norm = slug.strip().lower()
    for baby in babies:
        if baby.slug == norm and not baby.archived:
            return baby
    raise _exc("unknown_baby", {"baby": slug})


def ensure_activity_enabled(baby: Baby, activity: str) -> None:
    if activity not in baby.enabled_activities:
        raise _exc(
            "eligibility_rejected",
            {"baby_name": baby.name, "method_label": activity},
        )


def ensure_feeding_method_enabled(baby: Baby, method: str) -> None:
    if method not in baby.enabled_feeding_methods:
        raise _exc(
            "eligibility_rejected",
            {"baby_name": baby.name, "method_label": method},
        )


def ensure_local_not_locked_out(baby: Baby, at_daycare: bool, source: str) -> None:
    """Block non-Procare writes while a baby is checked in at daycare (§4.6)."""
    if source == "procare":
        return
    if not at_daycare:
        return
    block = True
    if baby.importer:
        block = baby.importer.get("block_local_while_checked_in", True)
    if not block:
        return
    raise _exc("daycare_lockout", {"baby_name": baby.name})
