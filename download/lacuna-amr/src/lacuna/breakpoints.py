"""User-supplied breakpoint tables.

EUCAST/CLSI breakpoint values are NEVER bundled with lacuna (licence and
terms-of-use constraints). The user supplies a TSV with the documented schema:

    drug  organism_group  S_le_mg_L  R_gt_mg_L  source  version

Semantics (protocol S5, EUCAST-style):
- ``S_le_mg_L``: MICs at or below this value are Susceptible.
- ``R_gt_mg_L``: MICs strictly above this value are Resistant.
- Values in between are Intermediate.
- Censored measurements (``>``, ``>=``, ``<``, ``<=`` signs) that do not
  resolve to a decisive interval are INDETERMINATE_CENSORED, never guessed.
"""
from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

from .errors import SchemaError

REQUIRED_COLUMNS = ("drug", "S_le_mg_L", "R_gt_mg_L")


@dataclass
class Breakpoints:
    """Validated breakpoint table (documented schema above)."""

    rows: dict[str, tuple[float, float, str, str]]  # drug -> (S<=, R>, source, version)

    @classmethod
    def load(cls, path: str | Path) -> "Breakpoints":
        path = Path(path)
        if not path.is_file():
            raise SchemaError(f"breakpoint table not found: {path}. lacuna bundles no "
                              "breakpoint values; export your own copy (e.g. EUCAST "
                              "breakpoint tables) to this TSV schema.")
        rows: dict[str, tuple[float, float, str, str]] = {}
        with open(path, newline="") as fh:
            rdr = csv.DictReader(fh, delimiter="\t")
            missing = [c for c in REQUIRED_COLUMNS if c not in (rdr.fieldnames or [])]
            if missing:
                raise SchemaError(
                    f"{path}: breakpoint table is missing column(s) {missing}; "
                    f"required schema: drug, organism_group, S_le_mg_L, R_gt_mg_L, "
                    f"source, version (tab-separated, with header).")
            for ln, r in enumerate(rdr, start=2):
                drug = (r.get("drug") or "").strip()
                if not drug:
                    continue
                key = drug.lower()
                if key in rows:
                    raise SchemaError(f"{path}:{ln}: duplicate drug row for {drug!r}")
                try:
                    s_bp = float(r["S_le_mg_L"])
                    r_bp = float(r["R_gt_mg_L"])
                except (TypeError, ValueError) as e:
                    raise SchemaError(f"{path}:{ln}: non-numeric breakpoint for {drug!r}: {e}")
                if s_bp > r_bp:
                    raise SchemaError(
                        f"{path}:{ln}: S breakpoint ({s_bp}) above R breakpoint ({r_bp}) "
                        f"for {drug!r}; expected S_le_mg_L <= R_gt_mg_L.")
                rows[key] = (s_bp, r_bp, r.get("source", "") or "", r.get("version", "") or "")
        if not rows:
            raise SchemaError(f"{path}: breakpoint table contains no drug rows")
        return cls(rows)

    def label(self, drug: str, sign: str, measurement: float | str) -> str:
        """EUCAST label with censored-interval semantics (protocol S5)."""
        if drug.lower() not in self.rows:
            return "NO_BREAKPOINT"
        s_bp, r_bp, _, _ = self.rows[drug.lower()]
        try:
            v = float(measurement)
        except (TypeError, ValueError):
            return "NOT_QUANTITATIVE"
        s = (sign or "").strip()
        if s in ("=", "", "=="):
            if v <= s_bp:
                return "S"
            if v > r_bp:
                return "R"
            return "I"
        if s == ">":
            return "R" if v >= r_bp else "INDETERMINATE_CENSORED"
        if s == ">=":
            return "R" if v > r_bp else "INDETERMINATE_CENSORED"
        if s in ("<", "<="):
            return "S" if v <= s_bp else "INDETERMINATE_CENSORED"
        return "INVALID_SIGN"
