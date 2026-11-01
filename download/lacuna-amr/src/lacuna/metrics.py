"""Evaluation metrics. Every number lacuna reports is computed here — never
typed by hand anywhere else (integrity rule R3).

Metrics: AUROC, AUPRC, Brier, ECE (10 equal-width bins), CA/VME/ME at a frozen
threshold, conformal coverage (overall / R / S, set size, abstention).
Uncertainty: 95% cluster-bootstrap CIs (resampling dedup clusters / coarse
lineages, never isolates — clonal structure is the whole point).
"""
from __future__ import annotations

from typing import Sequence

import numpy as np


def ca_vme_me(y: Sequence[int], pred: Sequence[int]) -> dict:
    """Categorical agreement, very major error (R called S), major error."""
    y, pred = list(y), list(pred)
    r = [i for i in range(len(y)) if y[i] == 1]
    s = [i for i in range(len(y)) if y[i] == 0]
    return {
        "CA": sum(pred[i] == y[i] for i in range(len(y))) / max(1, len(y)),
        "VME": (sum(pred[i] == 0 for i in r) / len(r)) if r else None,
        "ME": (sum(pred[i] == 1 for i in s) / len(s)) if s else None,
        "n_R": len(r), "n_S": len(s),
    }


def ece(y, p, bins: int = 10) -> float:
    """Expected calibration error over equal-width probability bins."""
    y, p = np.asarray(y, dtype=float), np.asarray(p, dtype=float)
    edges = np.linspace(0, 1, bins + 1)
    e = 0.0
    for i in range(bins):
        hi = edges[i + 1]
        m = (p >= edges[i]) & ((p < hi) if i < bins - 1 else (p <= hi))
        if m.sum() > 0:
            e += m.mean() * abs(y[m].mean() - p[m].mean())
    return float(e)


def metrics_block(y, p, thr: float) -> dict:
    """Full metric block at threshold ``thr`` (only when both classes present
    do AUROC/AUPRC exist)."""
    from sklearn.metrics import average_precision_score, brier_score_loss, roc_auc_score

    y = np.asarray(y)
    p = np.asarray(p, dtype=float)
    pred = (p >= thr).astype(int)
    out: dict = {}
    if len(set(y.tolist())) == 2:
        out["AUROC"] = float(roc_auc_score(y, p))
        out["AUPRC"] = float(average_precision_score(y, p))
    out["Brier"] = float(brier_score_loss(y, p))
    out["ECE"] = ece(y, p)
    out["CA"] = float((pred == y).mean())
    r = y == 1
    s = y == 0
    out["VME"] = float((pred[r] == 0).mean()) if r.sum() else None
    out["ME"] = float((pred[s] == 1).mean()) if s.sum() else None
    out["n_R"] = int(r.sum())
    out["n_S"] = int(s.sum())
    return out


def coverage_block(y, sets: Sequence[Sequence[int]]) -> dict:
    """Conformal coverage statistics from prediction sets."""
    y = np.asarray(y)
    cov = [int(y[i] in sets[i]) for i in range(len(y))]
    out = {"coverage_overall": float(np.mean(cov))}
    r = y == 1
    s = y == 0
    out["coverage_R"] = float(np.mean([cov[i] for i in np.where(r)[0]])) if r.sum() else None
    out["coverage_S"] = float(np.mean([cov[i] for i in np.where(s)[0]])) if s.sum() else None
    out["mean_set_size"] = float(np.mean([len(s_) for s_ in sets]))
    out["abstention"] = float(np.mean([len(s_) == 0 for s_ in sets]))
    out["VME_nonabstained"] = None
    na = [i for i in range(len(y)) if len(sets[i]) == 1]
    if na:
        pred = [sets[i][0] for i in na]
        rr = [i for i in na if y[i] == 1]
        out["VME_nonabstained"] = (float(np.mean([pred[na.index(i)] == 0 for i in rr]))
                                   if rr else None)
    return out


def cluster_bootstrap(y, p, thr: float, cluster: Sequence, B: int = 2000,
                      seed: int = 20261101) -> dict:
    """95% CIs for AUROC/VME/ME by resampling clusters (coarse lineages)."""
    from sklearn.metrics import roc_auc_score

    rng = np.random.default_rng(seed)
    y = np.asarray(y)
    p = np.asarray(p, dtype=float)
    cluster = np.asarray(cluster)
    vals: dict[str, list[float]] = {"AUROC": [], "VME": [], "ME": []}
    uniq = np.unique(cluster)
    idx_by = {c: np.where(cluster == c)[0] for c in uniq}
    for _ in range(B):
        pick = rng.choice(uniq, size=len(uniq), replace=True)
        idx = np.concatenate([idx_by[c] for c in pick])
        yy, pp = y[idx], p[idx]
        if len(set(yy.tolist())) < 2:
            continue
        pred = (pp >= thr).astype(int)
        r = yy == 1
        s = yy == 0
        try:
            vals["AUROC"].append(roc_auc_score(yy, pp))
        except ValueError:
            pass
        if r.sum():
            vals["VME"].append(float((pred[r] == 0).mean()))
        if s.sum():
            vals["ME"].append(float((pred[s] == 1).mean()))
    out = {}
    for k, v in vals.items():
        if v:
            out[k] = [float(np.percentile(v, 2.5)), float(np.percentile(v, 97.5))]
    return out


def risk_coverage_curve(y: Sequence[int], p: Sequence[float]) -> list[dict]:
    """Risk-coverage curve (selective-prediction audit)."""
    order = sorted(range(len(p)), key=lambda i: -p[i])
    out = []
    errors = 0
    for k, i in enumerate(order, 1):
        if p[i] >= 0.5 and y[i] == 0:
            errors += 1
        out.append({"coverage": k / len(p), "risk": errors / k})
    return out
