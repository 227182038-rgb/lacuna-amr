"""Exception types. lacuna fails closed: bad input, license violations and
offline-guard breaches raise immediately with an actionable message."""
from __future__ import annotations


class LacunaError(Exception):
    """Base class for all lacuna errors."""


class SchemaError(LacunaError):
    """Input file does not match a documented schema (fail-closed)."""


class LicenseError(LacunaError):
    """A licence-compliance guard was tripped (e.g. CARD/RGI present)."""


class OfflineViolation(LacunaError):
    """A network socket was created while the offline guard was active."""


class ArtefactError(LacunaError):
    """Model artefact is missing, tampered with, or version-incompatible."""
