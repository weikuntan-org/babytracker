"""BaseImporter (§4.6)."""
from __future__ import annotations

from abc import ABC, abstractmethod


class BaseImporter(ABC):
    @abstractmethod
    async def async_setup(self) -> None:
        ...

    @abstractmethod
    async def async_unload(self) -> None:
        ...
