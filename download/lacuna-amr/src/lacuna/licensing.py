"""Licence-compliance guards and the third-party inventory.

Rules enforced (audit trail in provenance/license_audit.tsv):
- CARD/RGI must not be installed in the running environment (commercial
  licence + fee) — :func:`check_environment` fails closed.
- No EUCAST/CLSI breakpoint table may live inside the lacuna package itself
  (EUCAST: free reuse with citation but never bundled; CLSI M100: paid
  standard) — :func:`check_no_bundled_breakpoints`.
- Every output carries the research-use-only notice.
"""
from __future__ import annotations

import re
from pathlib import Path

from .errors import LicenseError

RUO = "RESEARCH USE ONLY. Not for clinical decision-making."

# Distributions whose presence in the environment violates the licence posture.
FORBIDDEN_DISTRIBUTIONS = {
    "rgi": "Resistance Gene Identifier (CARD) — commercial licence required for CARD data",
    "card": "CARD data package — commercial licence required",
}

# (component, role, licence, posture). Mirrors provenance/license_audit.tsv.
LICENSE_INVENTORY: list[dict] = [
    {"component": "lacuna-amr", "role": "this package", "license": "Apache-2.0",
     "posture": "bundled"},
    {"component": "AMRFinderPlus (NCBI)", "role": "AMR determinants (external binary)",
     "license": "Public domain (US Government work)", "posture": "external, user-installed"},
    {"component": "pyseer", "role": "optional phase-B GWAS (external binary)",
     "license": "Apache-2.0", "posture": "external, optional"},
    {"component": "sourmash", "role": "optional sketching/QC (research pipeline)",
     "license": "BSD-3-Clause", "posture": "external, optional"},
    {"component": "numpy / scipy / scikit-learn / pandas", "role": "runtime deps",
     "license": "BSD-3-Clause / BSD-3-Clause / BSD-3-Clause / BSD-3-Clause",
     "posture": "bundled dependency"},
    {"component": "EUCAST breakpoint tables", "role": "S/R breakpoints (values)",
     "license": "EUCAST — free reuse with citation, no resale",
     "posture": "never bundled; user-supplied TSV"},
    {"component": "CLSI M100", "role": "breakpoints (alternative standard)",
     "license": "Paid standard", "posture": "excluded"},
    {"component": "CARD / RGI", "role": "resistance database",
     "license": "Commercial licence required", "posture": "excluded"},
    {"component": "NCBI assemblies + AST records", "role": "data (never redistributed raw)",
     "license": "NCBI places no restrictions on use/distribution",
     "posture": "per-record submitter provenance retained"},
]

_BUNDLED_BP_PATTERNS = re.compile(
    r"(eucast|clsi|m100|breakpoint[-_ ]?table)", re.IGNORECASE)


def check_environment() -> list[str]:
    """Fail-closed if a forbidden distribution is importable. Returns notes."""
    notes = []
    from importlib import metadata
    for dist, why in FORBIDDEN_DISTRIBUTIONS.items():
        try:
            metadata.distribution(dist)
        except metadata.PackageNotFoundError:
            continue
        raise LicenseError(
            f"Forbidden package '{dist}' is installed in this environment: {why}. "
            "lacuna's licence posture excludes it; remove it (or run outside this "
            "environment) before using lacuna.")
    notes.append("environment: no forbidden CARD/RGI distribution detected")
    return notes


def check_no_bundled_breakpoints(package_dir: str | Path | None = None) -> list[str]:
    """Fail-closed if a breakpoint-table-looking file ships inside the package."""
    if package_dir is None:
        package_dir = Path(__file__).resolve().parent
    package_dir = Path(package_dir)
    offenders = [str(p) for p in package_dir.rglob("*")
                 if p.is_file() and _BUNDLED_BP_PATTERNS.search(p.name)]
    if offenders:
        raise LicenseError(
            "Breakpoint-table file(s) found inside the lacuna package "
            f"(EUCAST/CLSI values must never be bundled): {offenders}. Remove them; "
            "users supply breakpoints at run time via --breakpoints.")
    return [f"package dir {package_dir}: no bundled breakpoint tables"]


def license_report() -> dict:
    """Machine-readable inventory for the CLI and reports."""
    return {"notice": RUO,
            "inventory": LICENSE_INVENTORY,
            "forbidden_distributions": sorted(FORBIDDEN_DISTRIBUTIONS)}
