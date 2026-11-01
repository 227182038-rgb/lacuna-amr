"""Training and evaluation engine.

This module is the library form of the frozen analysis protocol (stages 5-7 of
the research pipeline): everything the CLI's ``train``/``validate`` commands do
happens here, with test labels opened exactly once, for scoring only.

Label loading supports two schemas:
- pre-derived labels TSV (``biosample, drug, <label column in {S,R,...}>``),
  e.g. ``results/tables/ast_labels_all.tsv`` with ``label_eucast``;
- a raw AST table + user-supplied breakpoint table -> labels derived by the
  censored-interval rules (see ``lacuna.ast``).
"""
from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path
from typing import Mapping, Sequence

import numpy as np

from .ast import labels_from_ast_table, load_ast_table
from .breakpoints import Breakpoints
from .conformal import DEFAULT_ALPHA, conformal_set
from .errors import SchemaError
from .features import matrix_to_arrays
from .metrics import ca_vme_me, cluster_bootstrap, coverage_block, metrics_block
from .models import (ModelArtefact, calibration_carveout, encode_model,
                     fit_calibrated, group_keys, training_hash, tune_fit,
                     youden_threshold)
from .splits import check_split_document, make_splits

LABEL_SCHEMA_COLUMNS = ("biosample", "drug")
DEFAULT_LABEL_COLUMN = "label_eucast"


# ---------------------------------------------------------------- labels
def load_labels(path: str | Path, breakpoints: Breakpoints | str | Path | None = None,
                label_column: str | None = None,
                drugs: Sequence[str] | None = None) -> tuple[dict[str, dict[str, int]], dict]:
    """Load per-drug labels. Pre-derived TSV if a label column is present;
    otherwise derive from the raw AST table (requires ``breakpoints``)."""
    path = Path(path)
    if not path.is_file():
        raise SchemaError(f"labels table not found: {path}")
    with open(path, newline="") as fh:
        rdr = csv.DictReader(fh, delimiter="\t")
        fields = rdr.fieldnames or []
        rows = [{k: (v or "").strip() for k, v in r.items()} for r in rdr]
    if not rows:
        raise SchemaError(f"{path}: labels table contains no rows")
    col = label_column or ("label_eucast" if "label_eucast" in fields else None)
    info = {"path": str(path), "mode": None, "label_column": col}
    year_map = {r["biosample"]: r["year"] for r in rows if r.get("year")} \
        if "year" in fields else {}
    if year_map:
        info["year_map"] = year_map
    if col is None:
        if {"sign", "measurement", "unit"} <= set(fields):
            if breakpoints is None:
                raise SchemaError(
                    f"{path}: raw AST table detected (sign/measurement/unit columns) "
                    "but no --breakpoints table was given; labels cannot be derived "
                    "without user-supplied breakpoints.")
            bps = (Breakpoints.load(breakpoints) if isinstance(breakpoints, (str, Path))
                   else breakpoints)
            derived = labels_from_ast_table(rows, bps, drugs)
            info["mode"] = "derived_from_ast"
            info["n_per_drug"] = {d: len(v) for d, v in derived.items()}
            return derived, info
        raise SchemaError(
            f"{path}: labels table has neither a label column (e.g. 'label_eucast') "
            "nor raw AST columns (sign/measurement/unit); cannot load labels.")
    want = [d.lower() for d in drugs] if drugs else None
    out: dict[str, dict[str, int]] = defaultdict(dict)
    for r in rows:
        drug = r["drug"].lower()
        if want and drug not in want:
            continue
        lab = r.get(col, "")
        if lab in ("S", "R"):
            out[drug][r["biosample"]] = int(lab == "R")
    info["mode"] = "pre_derived"
    info["n_per_drug"] = {d: len(v) for d, v in out.items()}
    return dict(out), info


# ---------------------------------------------------------------- training
def train_artefact(mat: Mapping[str, Mapping[str, int]],
                   labels: Mapping[str, Mapping[str, int]],
                   meta: Mapping[str, Mapping[str, str]],
                   m0_map: Mapping[str, Sequence[str]],
                   model_types: Sequence[str] = ("M0", "M1"),
                   seed: int = 20261101,
                   calibration_fraction: float = 0.2,
                   alpha: float = DEFAULT_ALPHA) -> tuple[ModelArtefact, list[str]]:
    """Train per-drug models and package them into a ModelArtefact.

    ``meta`` supplies, per isolate: coarse lineage (groups), dedup cluster,
    bioproject, submitter org, year — all stored in the artefact so that
    ``validate`` can rebuild/verify splits without extra inputs.
    """
    notes: list[str] = []
    feature_order = sorted({f for d in mat.values() for f in d})
    lineage = meta.get("lineage", {})
    cluster = meta.get("cluster", {})
    drugs_doc: dict[str, dict] = {}
    for drug in sorted(labels):
        y = {i: v for i, v in labels[drug].items() if i in mat and v in (0, 1)}
        if not y:
            notes.append(f"{drug}: no labelled isolates with features; skipped")
            continue
        n_r, n_s = sum(y.values()), len(y) - sum(y.values())
        if min(n_r, n_s) == 0:
            notes.append(f"{drug}: single-class labels (R={n_r}, S={n_s}); skipped "
                         "(audit-dataset gate would flag this)")
            continue
        ids = sorted(y)
        groups = {i: str(lineage.get(i, "NA")) for i in ids}
        _, X = matrix_to_arrays({i: mat[i] for i in ids}, feature_order)
        yv = np.array([y[i] for i in ids], dtype=int)
        entry: dict = {
            "m0_features": sorted(m0_map.get(drug, [])),
            "features": feature_order,
            "n_labelled": len(ids), "n_R": n_r, "n_S": n_s,
            "training_hash": training_hash([(i, y[i]) for i in ids]),
            "models": {},
        }
        if not m0_map.get(drug):
            notes.append(f"{drug}: no M0 features mapped — the catalogue rule will "
                         "call every isolate S (check --m0-mapping covers this drug)")
        for mt in model_types:
            if mt == "M0":
                continue  # catalogue rule is implicit (m0_features)
            try:
                fit = fit_calibrated(mt, X, yv, [groups[i] for i in ids], seed,
                                     calibration_fraction, alpha)
            except Exception as e:  # noqa: BLE001 - report and continue fail-closed per drug
                notes.append(f"{drug} {mt}: training failed ({e}); model not stored")
                continue
            b64, sha = encode_model(fit["model"])
            entry["models"][mt] = {
                "model_b64": b64, "model_sha256": sha,
                "threshold": fit["threshold"], "quantiles": fit["quantiles"],
                "calibration": fit["calibration"], "n_train": fit["n_train"],
                "features": feature_order,
            }
        prob = [m for m in model_types if m in entry["models"]]
        # M1 is the reference model (calibrated, stable at small n); M2 is the
        # comparison model. Prefer M1 as the artefact default when both exist.
        entry["default_model"] = ("M1" if "M1" in entry["models"]
                                  else (prob[-1] if prob else None))
        drugs_doc[drug] = entry
        notes.append(f"{drug}: n={len(ids)} R={n_r} S={n_s}; stored models "
                     f"{prob or ['M0 only']}")
    artefact = ModelArtefact.build(drugs_doc, {
        "seed": seed, "alpha": alpha,
        "calibration_fraction": calibration_fraction,
        "sklearn_version": __import__("sklearn").__version__,
        "numpy_version": np.__version__,
        "lineage": lineage, "cluster": cluster,
        "bioproject": meta.get("bioproject", {}),
        "org": meta.get("org", {}), "year": meta.get("year", {}),
        "training_notes": notes,
    })
    return artefact, notes


def meta_from_cohort(cohort: Mapping[str, dict]) -> dict[str, dict[str, str]]:
    """cohort table -> the per-isolate metadata maps the artefact stores."""
    def pick(key, *alts):
        out = {}
        for bs, row in cohort.items():
            v = row.get(key, "")
            if not v and alts:
                v = next((row.get(a, "") for a in alts if row.get(a)), "")
            out[bs] = str(v)
        return out
    return {"lineage": pick("coarse_lineage"),
            "cluster": pick("dedup_cluster"),
            "bioproject": pick("bioproject"),
            "org": pick("submitter_org"),
            "year": pick("year")}


# ---------------------------------------------------------------- evaluation
def _arrays_in_order(mat, ids, feature_order):
    """(X, y-placeholder-free) rows in the GIVEN id order (unlike
    matrix_to_arrays, which sorts). X, y and groups built from one id list in
    one order are aligned by construction — and preserving the frozen
    pipeline's carve-out order lets `validate` reproduce the recorded
    research evaluation exactly (inner grouped-CV shuffles are
    order-sensitive; that sensitivity is itself documented by gate G5)."""
    import numpy as np
    fpos = {f: j for j, f in enumerate(feature_order)}
    X = np.zeros((len(ids), len(feature_order)), dtype=np.float64)
    for i, iso in enumerate(ids):
        row = mat[iso]
        pairs = row.items() if isinstance(row, dict) else ((f, 1) for f in row)
        for f, v in pairs:
            j = fpos.get(f)
            if j is not None:
                X[i, j] = float(v)
    return X


def _m0_predictions(m0_feats: Sequence[str], mat: Mapping[str, Mapping[str, int]],
                    ids: Sequence[str]) -> dict[str, int]:
    """Catalogue rule: R iff any mapped determinant is present. Rows may be
    dicts (feature -> value) or sets (presence)."""
    m0 = set(m0_feats)
    out = {}
    for i in ids:
        row = mat[i]
        if isinstance(row, dict):
            out[i] = int(any(f in m0 and row[f] for f in row))
        else:
            out[i] = int(any(f in m0 for f in row))
    return out


def evaluate_splits(mat: Mapping[str, Mapping[str, int]],
                    labels: Mapping[str, Mapping[str, int]],
                    splits_per_drug: Mapping[str, Mapping],
                    meta: Mapping[str, Mapping[str, str]],
                    m0_map: Mapping[str, Sequence[str]],
                    model_types: Sequence[str] = ("M0", "M1"),
                    seed: int = 20261101,
                    boot: int = 200,
                    alpha: float = DEFAULT_ALPHA) -> dict:
    """S0-S3 split evaluation (single-opening rule; test labels touched only
    for scoring). Returns the results document used by ``validate``."""
    feature_order = sorted({f for d in mat.values() for f in d})
    lineage = meta.get("lineage", {})
    cluster = meta.get("cluster", {})
    results: dict = {}
    pred_rows: list[dict] = []
    sanity: dict = {}

    def eval_split(drug, split_name, test_ids, train_ids, ymap):
        test_ids = [i for i in test_ids if i in ymap and i in mat]
        train_ids = [i for i in train_ids if i in ymap and i in mat]
        out: dict = {}
        if not test_ids:
            return out
        # lineage-disjoint calibration carve-out from the training side only;
        # the carve-out (group-concatenation) ORDER is preserved so the frozen
        # pipeline's sample order — and hence its recorded results — reproduce
        tr_ids, cal_ids = calibration_carveout(
            train_ids, {i: str(lineage.get(i, "NA")) for i in train_ids}, 0.2)
        m0_pred = _m0_predictions(m0_map.get(drug, []), mat, sorted(ymap))
        yte = np.array([ymap[i] for i in test_ids], dtype=int)
        for mt in model_types:
            if mt == "M0":
                p_test = np.array([float(m0_pred[i]) for i in test_ids])
                thr = 0.5
                sets = [[1] if m0_pred[i] == 1 else [0] for i in test_ids]
                sets_marg = None
            else:
                ytr_all = [ymap[i] for i in tr_ids]
                if len(set(ytr_all)) < 2 or len(tr_ids) < 10:
                    continue
                Xtr = _arrays_in_order(mat, tr_ids, feature_order)
                Xcal = _arrays_in_order(mat, cal_ids, feature_order)
                Xte = _arrays_in_order(mat, test_ids, feature_order)
                ytr = np.array([ymap[i] for i in tr_ids], dtype=int)
                ycal = np.array([ymap[i] for i in cal_ids], dtype=int)
                # numeric lineage ids -> int group keys: the frozen pipeline's
                # grouped-CV order (and therefore its tuned C) depends on it
                gtr = group_keys([lineage.get(i, "NA") for i in tr_ids])
                base = tune_fit(mt, Xtr, ytr, gtr, seed)
                from sklearn.calibration import CalibratedClassifierCV
                if len(set(ycal.tolist())) < 2:
                    continue
                n1, n0 = int((ycal == 1).sum()), int((ycal == 0).sum())
                method = "sigmoid" if min(n1, n0) < 200 else "isotonic"
                cal_m = CalibratedClassifierCV(base, method=method, cv="prefit")
                cal_m.fit(Xcal, ycal)
                p_tr = cal_m.predict_proba(Xtr)[:, 1]
                thr = youden_threshold(ytr, p_tr)
                proba_te = cal_m.predict_proba(Xte)
                p_test = proba_te[:, 1]
                from .conformal import mondrian_quantiles
                qd = mondrian_quantiles(cal_m.predict_proba(Xcal), ycal, alpha)
                sets = [conformal_set(row, qd, "mondrian") for row in proba_te]
                sets_marg = [conformal_set(row, qd, "marginal") for row in proba_te]
            mb = metrics_block(yte, p_test, thr)
            cb = cluster_bootstrap(yte, p_test, thr,
                                   [str(lineage.get(i, "NA")) for i in test_ids],
                                   B=boot, seed=seed)
            out[mt] = {
                "metrics": mb, "ci95": cb, "threshold": thr,
                "conformal_mondrian": coverage_block(yte, sets),
                "sets_marginal": (coverage_block(yte, sets_marg)
                                  if sets_marg is not None else None),
                "n_test": len(test_ids),
            }
            for k, (i, pi) in enumerate(zip(test_ids, p_test)):
                pred_rows.append({"drug": drug, "split": split_name, "model": mt,
                                  "biosample": i, "y": int(ymap[i]),
                                  "p": float(pi), "set": _set_str(sets, k)})
        return out

    for drug in sorted(labels):
        ymap = {i: v for i, v in labels[drug].items() if i in mat and v in (0, 1)}
        if not ymap:
            continue
        sp = splits_per_drug.get(drug)
        if sp is None:
            continue
        doc = {"n": len(ymap), "n_R": sum(ymap.values()),
               "S2_note": sp.get("S2_note", "")}
        # catalogue sanity (G4-style): carrier vs non-carrier R rates
        m0p = _m0_predictions(m0_map.get(drug, []), mat, sorted(ymap))
        carriers = [i for i in ymap if m0p[i] == 1]
        noncar = [i for i in ymap if m0p[i] == 0]
        doc["m0_sanity"] = {
            "r_rate_carriers": (float(np.mean([ymap[i] for i in carriers]))
                                if carriers else None),
            "r_rate_noncarriers": (float(np.mean([ymap[i] for i in noncar]))
                                   if noncar else None),
            "n_carriers": len(carriers), "n_noncarriers": len(noncar),
        }
        # S0
        s0_res = []
        for rep, folds in (sp.get("S0") or {}).items():
            for j, fold in enumerate(folds):
                rest = [i for jj, ff in enumerate(folds) if jj != j for i in ff]
                s0_res.append(eval_split(drug, f"S0_{rep}_fold{j}", fold, rest, ymap))
        doc["S0"] = s0_res
        # S1
        doc["S1"] = {k: eval_split(drug, f"S1_{k}", v,
                                   [i for kk, vv in (sp.get("S1") or {}).items()
                                    if kk != k for i in vv], ymap)
                     for k, v in (sp.get("S1") or {}).items()}
        # S2
        doc["S2"] = (eval_split(drug, "S2_forward_time", sp["S2"]["test"],
                                sp["S2"]["train"], ymap)
                     if sp.get("S2") else None)
        # S3
        doc["S3"] = {k: eval_split(drug, f"S3_{k}", v,
                                   [i for kk, vv in (sp.get("S3") or {}).items()
                                    if kk != k for i in vv], ymap)
                     for k, v in (sp.get("S3") or {}).items()}
        # split-integrity audit + S0 mean coverage (G6-style)
        doc["split_audit_problems"] = check_split_document(
            sp, sorted(ymap), cluster) if cluster else []
        for mt in model_types:
            if mt == "M0":
                continue
            covs = [r[mt]["conformal_mondrian"]["coverage_overall"]
                    for r in s0_res if mt in r]
            if covs:
                doc.setdefault("S0_mean_coverage", {})[mt] = float(np.mean(covs))
        results[drug] = doc
    return {"results": results, "predictions": pred_rows}


def _set_str(sets, idx):
    s = sets[idx]
    return "+".join("SR"[c] for c in s) if s else "ABSTAIN"


def auto_splits(labels: Mapping[str, Mapping[str, int]],
                meta: Mapping[str, Mapping[str, str]],
                seed: int = 20261101) -> dict[str, dict]:
    """Protocol-frozen S0-S3 split documents generated from the label table +
    artefact metadata (used when no sealed splits file is supplied)."""
    out = {}
    for drug, y in labels.items():
        ids = sorted(i for i in y if i in meta.get("lineage", {}))
        if len(ids) < 20:
            continue
        out[drug] = make_splits(
            ids, y, meta.get("lineage", {}), meta.get("cluster", {}),
            meta.get("bioproject", {}), meta.get("org", {}),
            meta.get("year", {}), seed=seed)
    return out


def write_evaluation_outputs(eval_doc: dict, out_json: Path, pred_tsv: Path,
                             summary_txt: Path | None = None,
                             meta: dict | None = None) -> dict:
    """Persist the evaluation document + predictions + human summary.
    JSON layout: {"_meta": ..., "drugs": {drug: results}}."""
    out_json.parent.mkdir(parents=True, exist_ok=True)
    res = eval_doc["results"]
    out_json.write_text(json.dumps({"_meta": meta or {}, "drugs": res},
                                    indent=1, default=str))
    with open(pred_tsv, "w", newline="") as fh:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["drug", "split", "model", "biosample", "y", "p", "set"])
        for r in eval_doc["predictions"]:
            w.writerow([r["drug"], r["split"], r["model"], r["biosample"],
                        r["y"], f"{r['p']:.6f}", r["set"]])
    lines = []
    for drug, doc in res.items():
        lines.append(f"== {drug}: n={doc['n']} R={doc['n_R']} "
                     f"({doc['n_R'] / max(1, doc['n']):.1%})")
        s = doc.get("m0_sanity", {})
        if s.get("r_rate_carriers") is not None:
            lines.append(f"   M0 sanity: carrier R-rate {s['r_rate_carriers']:.3f} vs "
                         f"non-carrier {s['r_rate_noncarriers']:.3f} "
                         f"(n={s['n_carriers']}/{s['n_noncarriers']})")
        if doc.get("split_audit_problems"):
            lines.append(f"   SPLIT PROBLEMS: {doc['split_audit_problems'][:4]}")
        for mt in ("M0", "M1", "M2"):
            aucs = [b[mt]["metrics"].get("AUROC") for b in doc.get("S0") or []
                    if mt in b and b[mt]["metrics"].get("AUROC") is not None]
            if aucs:
                lines.append(f"   S0 {mt}: mean AUROC {np.mean(aucs):.3f} "
                             f"over {len(aucs)} folds")
        for mt, cov in (doc.get("S0_mean_coverage") or {}).items():
            lines.append(f"   S0 {mt}: mean Mondrian coverage {cov:.3f} "
                         "(target 0.90)")
        for split in ("S1", "S3"):
            for k, b in sorted((doc.get(split) or {}).items()):
                for mt, blk in sorted(b.items()):
                    m = blk["metrics"]
                    ci = blk.get("ci95", {}).get("AUROC")
                    ci_s = (f" [{ci[0]:.3f}, {ci[1]:.3f}]" if ci else "")
                    cov = blk.get("conformal_mondrian", {}).get("coverage_overall")
                    lines.append(
                        f"   {split} {k} {mt}: n={blk['n_test']} "
                        f"AUROC={m.get('AUROC') if m.get('AUROC') is None else round(m['AUROC'], 3)}"
                        f"{ci_s} CA={m['CA']:.3f} "
                        f"VME={m['VME'] if m['VME'] is None else round(m['VME'], 3)} "
                        f"ME={m['ME'] if m['ME'] is None else round(m['ME'], 3)}"
                        + (f" cov={cov:.3f}" if cov is not None else ""))
        if doc.get("S2"):
            for mt, blk in sorted(doc["S2"].items()):
                m = blk["metrics"]
                lines.append(f"   S2 forward-time {mt}: n={blk['n_test']} "
                             f"AUROC={m.get('AUROC') if m.get('AUROC') is None else round(m['AUROC'], 3)} "
                             f"cov={blk.get('conformal_mondrian', {}).get('coverage_overall')}")
        if doc.get("S2_note"):
            lines.append(f"   S2: {doc['S2_note']}")
    summary = "\n".join(lines)
    if summary_txt is not None:
        summary_txt.write_text(summary + "\n")
    return {"results_json": str(out_json), "predictions_tsv": str(pred_tsv),
            "summary": summary}
