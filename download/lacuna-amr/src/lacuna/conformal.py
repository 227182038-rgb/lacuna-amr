"""Split-conformal prediction sets (target coverage 0.90).

Mondrian (per-class) and marginal variants. Calibration scores are
``1 - p[class]``; the finite-sample quantile is the ceil((n+1)(1-alpha))-th
order statistic. Quantiles are computed on a lineage-disjoint calibration
carve-out of the training data only — test labels are opened exactly once,
for scoring (single-opening rule).
"""
from __future__ import annotations

import math
from typing import Sequence

import numpy as np

DEFAULT_ALPHA = 0.10  # target coverage 0.90


def conformal_quantiles(scores: Sequence[float], alpha: float = DEFAULT_ALPHA) -> float:
    n = len(scores)
    if n == 0:
        return 2.0
    k = min(max(int(math.ceil((n + 1) * (1 - alpha))) - 1, 0), n - 1)
    return float(sorted(scores)[k])


def mondrian_quantiles(p_cal, y_cal, alpha: float = DEFAULT_ALPHA) -> dict:
    """Marginal + per-class (Mondrian) quantiles from calibration data."""
    p_cal = np.asarray(p_cal, dtype=float)
    y_cal = np.asarray(y_cal)
    if p_cal.ndim != 2 or p_cal.shape[0] != len(y_cal):
        raise ValueError("mondrian_quantiles: p_cal must be (n, 2) aligned with y_cal")
    scores = 1.0 - p_cal[np.arange(len(y_cal)), y_cal]
    return {"marginal": conformal_quantiles(scores, alpha),
            "mondrian": {c: conformal_quantiles(scores[y_cal == c], alpha) for c in (0, 1)}}


# backwards-compatible alias used by the pipeline/CLI
conformal_calibrate = mondrian_quantiles


def conformal_set(p_row, quantiles: dict, variant: str = "mondrian") -> list[int]:
    """Prediction set for one probability row [p_S, p_R].

    Handles both int and str class keys (JSON round-trips int dict keys to
    strings when an artefact is saved and reloaded)."""
    p_row = np.asarray(p_row, dtype=float).ravel()
    out = []
    for c in (0, 1):
        if variant == "marginal":
            thr = quantiles["marginal"]
        else:
            mond = quantiles["mondrian"]
            thr = mond[c] if c in mond else mond[str(c)]
        if 1.0 - p_row[c] <= thr:
            out.append(c)
    return out


def conformal_sets(p_rows, quantiles: dict, variant: str = "mondrian") -> list[list[int]]:
    return [conformal_set(row, quantiles, variant) for row in np.asarray(p_rows, dtype=float)]


def abstain_or_predict(sets: Sequence[Sequence[int]]) -> list[int | None]:
    """Single-element sets -> class; empty -> None (abstain)."""
    return [s[0] if len(s) == 1 else None for s in sets]


def set_label(s: Sequence[int]) -> str:
    """Human-readable set: S / R / S+R (uncertain) / ABSTAIN (empty)."""
    if len(s) == 0:
        return "ABSTAIN"
    if len(s) == 2:
        return "S+R"
    return "R" if s[0] == 1 else "S"
