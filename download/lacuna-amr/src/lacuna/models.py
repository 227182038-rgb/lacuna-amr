"""Model training, calibration, and the versioned model artefact.

Models (frozen protocol):
- M0 — catalogue rule: R iff any AMRFinderPlus Class/Subclass-mapped
  determinant for the drug is present. No training data needed.
- M1 — L2 logistic regression on the presence/absence matrix, class-weighted,
  inner grouped 3-fold CV over C.
- M2 — histogram gradient boosting, inner grouped CV over depth/learning-rate,
  approximate class weighting via sample weights.

M1/M2 are probability-calibrated (sigmoid when the calibration set has <200
isolates in either class, else isotonic) on a **lineage-disjoint** calibration
carve-out of the training data, from which the Mondrian/marginal conformal
quantiles are also computed. The decision threshold is the Youden index on the
training predictions.

Artefact integrity: the trained-model payload is pickled, base64-encoded and
SHA-256-checksummed inside a JSON envelope; loading verifies the checksum and
the sklearn/numpy versions and refuses on mismatch (fail-closed, overridable
with an explicit flag for the user who knows better). Pickle can execute code:
only load artefacts you trained yourself or otherwise trust.
"""
from __future__ import annotations

import base64
import datetime as _dt
import hashlib
import json
import pickle
from pathlib import Path
from typing import Mapping, Sequence

import numpy as np

from ._version import __version__
from .conformal import DEFAULT_ALPHA, mondrian_quantiles
from .errors import ArtefactError

ARTEFACT_FORMAT = "lacuna-model/1"
RUO = "RESEARCH USE ONLY. Not for clinical decision-making."


def group_keys(vals):
    """Normalise group labels for grouped CV.

    All-numeric labels become ints, anything else strings. This is not
    cosmetic: StratifiedGroupKFold orders groups differently for int vs str
    labels, which changes the inner CV and hence the tuned hyperparameters —
    the frozen research pipeline passed pandas int64 lineage ids, so numeric
    lineages MUST be ints for its recorded results to reproduce (verified
    fold-for-fold on the pilot cohort)."""
    vals = list(vals)
    if vals and all(str(v).lstrip("-").isdigit() for v in vals):
        return [int(v) for v in vals]
    return [str(v) for v in vals]


# ---------------------------------------------------------------- training
def tune_fit(model_type: str, Xtr, ytr, gtr, seed: int):
    """Inner grouped 3-fold CV tuning on training data only."""
    from sklearn.ensemble import HistGradientBoostingClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import GridSearchCV, StratifiedGroupKFold

    inner = min(3, len(set(gtr)))
    cv = StratifiedGroupKFold(n_splits=inner, shuffle=True, random_state=seed) if inner > 1 else None
    if model_type == "M1":
        grid = {"C": [0.01, 0.1, 1, 10]}
        base = LogisticRegression(max_iter=5000, class_weight="balanced", random_state=seed)
    elif model_type == "M2":
        grid = {"max_depth": [3, 6], "learning_rate": [0.05, 0.1]}
        base = HistGradientBoostingClassifier(max_iter=300, early_stopping=False,
                                              random_state=seed)
    else:
        raise ArtefactError(f"unknown model type {model_type!r} (expected M0/M1/M2)")
    if cv is None:
        base.set_params(**{k: v[1] for k, v in grid.items()})
        base.fit(Xtr, ytr)
        return base
    gs = GridSearchCV(base, grid, scoring="roc_auc", cv=cv, n_jobs=1, refit=True)
    sw = None
    if model_type == "M2":
        sw = np.where(ytr == 1, (len(ytr) / (2 * max(1, (ytr == 1).sum()))),
                      len(ytr) / (2 * max(1, (ytr == 0).sum())))
    gs.fit(Xtr, ytr, groups=gtr, **({"sample_weight": sw} if sw is not None else {}))
    return gs.best_estimator_


def youden_threshold(y_true, p) -> float:
    """Youden-index threshold, clamped to [0, 1]. sklearn's roc_curve can
    return +inf as its first threshold (degenerate/constant scores); a clamped
    threshold keeps downstream calls and serialised artefacts well-formed."""
    from sklearn.metrics import roc_curve
    if len(set(np.asarray(y_true).tolist())) < 2:
        return 0.5
    fpr, tpr, th = roc_curve(y_true, p)
    j = int(np.argmax(tpr - fpr))
    thr = float(th[j]) if j < len(th) else 0.5
    return min(max(thr, 0.0), 1.0)


def calibration_carveout(ids: Sequence[str], groups: Mapping[str, str],
                         fraction: float = 0.2) -> tuple[list[str], list[str]]:
    """Lineage-disjoint carve-out: whole coarse-lineage groups are moved to the
    calibration set (largest groups first) until ~``fraction`` of isolates."""
    from collections import defaultdict
    by_g = defaultdict(list)
    for i in ids:
        by_g[groups[i]].append(i)
    gkeys = sorted(by_g, key=lambda g: -len(by_g[g]))
    cal_g, tr_g = [], []
    cal_target = fraction * len(ids)
    for g in gkeys:
        if sum(len(by_g[x]) for x in cal_g) < cal_target and len(gkeys) > 2:
            cal_g.append(g)
        else:
            tr_g.append(g)
    tr = [i for g in tr_g for i in by_g[g]]
    cal = [i for g in cal_g for i in by_g[g]]
    if not tr or not cal:  # degenerate tiny data: fall back to identical sets
        tr, cal = list(ids), list(ids)
    return tr, cal


def fit_calibrated(model_type: str, X, y, groups: Sequence[str], seed: int,
                   calibration_fraction: float = 0.2, alpha: float = DEFAULT_ALPHA):
    """Fit + calibrate + conformal-calibrate one model.

    Returns dict with the fitted calibrated pipeline, threshold, quantiles and
    calibration bookkeeping. Only training-side data may be passed here.
    """
    from sklearn.calibration import CalibratedClassifierCV

    n = len(y)
    idx = np.arange(n)
    tr_idx, cal_idx = calibration_carveout(list(idx), {i: groups[i] for i in idx},
                                           calibration_fraction)
    ytr, ycal = np.asarray(y)[tr_idx], np.asarray(y)[cal_idx]
    Xtr, Xcal = np.asarray(X)[tr_idx], np.asarray(X)[cal_idx]
    gtr = [groups[i] for i in tr_idx]
    if len(set(ytr.tolist())) < 2:
        raise ArtefactError(
            "training carve-out contains a single class; need both S and R isolates "
            "in the training groups (check the audit-dataset drug gate)")
    base = tune_fit(model_type, Xtr, ytr, group_keys([groups[i] for i in tr_idx]), seed)
    n1 = int((ycal == 1).sum())
    n0 = int((ycal == 0).sum())
    method = "sigmoid" if min(n1, n0) < 200 else "isotonic"
    if len(set(ycal.tolist())) < 2:
        cal_m = base  # cannot calibrate; conformal quantiles degenerate
        quantiles = {"marginal": 2.0, "mondrian": {0: 2.0, 1: 2.0}, "alpha": alpha}
    else:
        cal_m = CalibratedClassifierCV(base, method=method, cv="prefit")
        cal_m.fit(Xcal, ycal)
        quantiles = mondrian_quantiles(cal_m.predict_proba(Xcal), ycal, alpha)
        quantiles["alpha"] = alpha
    p_train = cal_m.predict_proba(Xtr)[:, 1]
    thr = youden_threshold(ytr, p_train)
    return {
        "model": cal_m, "threshold": thr, "quantiles": quantiles,
        "calibration": {"method": method, "n_cal": int(len(cal_idx)),
                        "n_cal_R": n1, "n_cal_S": n0,
                        "cal_groups": sorted({groups[i] for i in cal_idx})},
        "n_train": int(len(tr_idx)),
    }


# ---------------------------------------------------------------- artefact
def _payload_hash(doc: dict) -> str:
    body = {k: doc[k] for k in sorted(doc) if k != "payload_sha256"}
    return hashlib.sha256(json.dumps(body, sort_keys=True,
                                     default=str).encode()).hexdigest()


class ModelArtefact:
    """Versioned, checksummed container for trained per-drug models."""

    def __init__(self, doc: dict):
        self.doc = doc
        self._cache: dict[tuple[str, str], object] = {}

    # -- construction ------------------------------------------------------
    @classmethod
    def build(cls, drugs: Mapping[str, dict], meta: Mapping) -> "ModelArtefact":
        doc = {
            "lacuna_artefact": ARTEFACT_FORMAT,
            "created_utc": _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds"),
            "lacuna_version": __version__,
            "notice": RUO,
            "drugs": {d: v for d, v in drugs.items()},
            **{k: v for k, v in meta.items()},
        }
        doc["payload_sha256"] = _payload_hash(doc)
        return cls(doc)

    def save(self, path: str | Path) -> Path:
        path = Path(path)
        path.write_text(json.dumps(self.doc, indent=1, default=str))
        return path

    @classmethod
    def load(cls, path: str | Path, allow_version_mismatch: bool = False) -> "ModelArtefact":
        path = Path(path)
        if not path.is_file():
            raise ArtefactError(f"model artefact not found: {path}")
        try:
            doc = json.loads(path.read_text())
        except json.JSONDecodeError as e:
            raise ArtefactError(f"{path}: not valid JSON ({e})")
        if doc.get("lacuna_artefact") != ARTEFACT_FORMAT:
            raise ArtefactError(
                f"{path}: unknown artefact format {doc.get('lacuna_artefact')!r}; "
                f"expected {ARTEFACT_FORMAT}")
        if doc.get("payload_sha256") != _payload_hash(doc):
            raise ArtefactError(
                f"{path}: payload checksum mismatch — the artefact was modified after "
                "training or is corrupted. Refusing to load (fail-closed).")
        import sklearn
        for key, cur in (("sklearn_version", sklearn.__version__),
                         ("numpy_version", np.__version__)):
            got = doc.get(key)
            if got and got != cur and not allow_version_mismatch:
                raise ArtefactError(
                    f"{path}: artefact was built with {key.replace('_version', '')} "
                    f"{got} but {cur} is installed. Re-train, or pass "
                    "--allow-version-mismatch if you accept the risk (fail-closed "
                    "default).")
        return cls(doc)

    # -- accessors ---------------------------------------------------------
    @property
    def drugs(self) -> dict:
        return self.doc["drugs"]

    def drug(self, drug: str) -> dict:
        if drug not in self.drugs:
            raise ArtefactError(
                f"drug {drug!r} not in artefact (trained drugs: {sorted(self.drugs)})")
        return self.drugs[drug]

    def model_types(self, drug: str) -> list[str]:
        """Model types stored for a drug (M0 always implied via m0_features)."""
        entry = self.drug(drug)
        return sorted(entry.get("models", {}))

    def _model(self, drug: str, model_type: str | None = None):
        entry = self.drug(drug)
        models = entry.get("models", {})
        mt = model_type or entry.get("default_model")
        if mt is None or mt not in models:
            return None
        slot = models[mt]
        key = (drug, mt, slot["model_b64"])
        if key not in self._cache:
            raw = base64.b64decode(slot["model_b64"])
            if hashlib.sha256(raw).hexdigest() != slot.get("model_sha256"):
                raise ArtefactError(
                    f"model payload checksum mismatch for drug {drug!r} ({mt})")
            self._cache[key] = pickle.loads(raw)  # noqa: S301 (documented trust model)
        return self._cache[key]

    # -- prediction --------------------------------------------------------
    def predict_drug(self, drug: str, X, model_type: str | None = None) -> list[dict]:
        """Probabilities + thresholded call + Mondrian conformal set per row of
        ``X`` (columns aligned with the stored feature order of that model)."""
        from .conformal import conformal_set
        entry = self.drug(drug)
        models = entry.get("models", {})
        mt = model_type or entry.get("default_model")
        if mt is None or mt not in models:
            raise ArtefactError(
                f"drug {drug!r} has no trained probabilistic model (available: "
                f"{sorted(models)}); train with --models M1 or M2 for calibrated "
                "predictions")
        slot = models[mt]
        model = self._model(drug, mt)
        proba = model.predict_proba(np.asarray(X))
        thr = float(slot["threshold"])
        out = []
        for row in proba:
            out.append({
                "p_S": float(row[0]), "p_R": float(row[1]),
                "call": int(row[1] >= thr),
                "set": conformal_set(row, slot["quantiles"], "mondrian"),
            })
        return out

    def feature_order(self, drug: str, model_type: str | None = None) -> list[str]:
        """The exact column order a stored model expects."""
        entry = self.drug(drug)
        mt = model_type or entry.get("default_model")
        if mt and mt in entry.get("models", {}):
            return list(entry["models"][mt]["features"])
        return list(entry.get("features", []))


def encode_model(model) -> tuple[str, str]:
    """(base64 pickle, sha256) for the artefact envelope."""
    raw = pickle.dumps(model, protocol=5)
    return base64.b64encode(raw).decode("ascii"), hashlib.sha256(raw).hexdigest()


def training_hash(label_rows: Sequence[tuple[str, int]]) -> str:
    """Deterministic hash of the (isolate, label) pairs a model was fit on."""
    body = "\n".join(f"{i}\t{y}" for i, y in sorted(label_rows))
    return hashlib.sha256(body.encode()).hexdigest()
