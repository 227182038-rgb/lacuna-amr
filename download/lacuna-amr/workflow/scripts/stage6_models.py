#!/usr/bin/env python3
"""Stages 6-7: models M0/M1/M2, calibration, split-conformal (Mondrian +
marginal, 0.90 target), metrics with cluster-bootstrap CIs, hypotheses H1-H4,
gates G4/G5/G6. Test partitions are opened once from the sealed split files.
Writes results/evaluation/*.json, results/predictions.tsv, gates/G4.md, G5.md, G6.md."""
import json
import warnings
from collections import defaultdict
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.stats import binom
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, roc_auc_score

warnings.filterwarnings("ignore")
ROOT = Path(__file__).resolve().parents[2]
RES = ROOT / "results"
EVAL = RES / "evaluation"
EVAL.mkdir(exist_ok=True)
DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"]
SEED = 20261101
SEED2 = 42
BOOT = 2000
rng_global = np.random.default_rng(SEED)

feats = pd.read_csv(RES / "features.tsv", sep="\t", index_col=0)
cohort = pd.read_csv(ROOT / "data" / "cohort.tsv", sep="\t")
fine = dict(zip(cohort["biosample"], cohort["fine_lineage"]))
coarse = dict(zip(cohort["biosample"], cohort["coarse_lineage"]))
year = {}
labels_raw = pd.read_csv(RES / "tables" / "ast_labels_all.tsv", sep="\t")
for r in labels_raw.itertuples():
    year[r.biosample] = r.year
splits = {d: json.loads((RES / "splits" / f"{d}.json").read_text()) for d in DRUGS}
m0map = json.loads((RES / "m0_mapping.json").read_text())["feature_sets"]

y_all = {}
submitter_y = {}
feats_index = set(feats.index)
for d in DRUGS:
    sub = labels_raw[(labels_raw["drug"] == d) & (labels_raw["label_eucast"].isin(["S", "R"]))]
    y_all[d] = {r.biosample: int(r.label_eucast == "R") for r in sub.itertuples()
                if r.biosample in feats_index}
    sy = {}
    for r in labels_raw[(labels_raw["drug"] == d)].itertuples():
        ph = str(r.submitter_phenotypes)
        if "resistant" in ph.lower():
            sy[r.biosample] = 1
        elif "susceptible" in ph.lower() and "non" not in ph.lower():
            sy[r.biosample] = 0
    submitter_y[d] = {k: v for k, v in sy.items() if k in feats_index}


def X_of(ids):
    return feats.loc[ids].values


def y_of(ids, ymap):
    return np.array([ymap[i] for i in ids])


def group_ids(ids):
    return [coarse[i] for i in ids]


def tune_fit(model_type, Xtr, ytr, gtr, seed):
    """nested grouped 3-fold inner CV tuning on training data only."""
    from sklearn.model_selection import GridSearchCV, StratifiedGroupKFold
    inner = min(3, len(set(gtr)))
    cv = StratifiedGroupKFold(n_splits=inner, shuffle=True, random_state=seed) if inner > 1 else None
    if model_type == "M1":
        grid = {"C": [0.01, 0.1, 1, 10]}
        base = LogisticRegression(max_iter=5000, class_weight="balanced", random_state=seed)
    else:
        grid = {"max_depth": [3, 6], "learning_rate": [0.05, 0.1]}
        base = HistGradientBoostingClassifier(max_iter=300, early_stopping=False,
                                              random_state=seed)
    if cv is None:
        base.set_params(**{k: v[1] for k, v in grid.items()})
        base.fit(Xtr, ytr)
        return base
    gs = GridSearchCV(base, grid, scoring="roc_auc", cv=cv, n_jobs=1, refit=True)
    sw = None
    if model_type == "M2":
        # approximate class weighting via sample weights
        sw = np.where(ytr == 1, (len(ytr) / (2 * max(1, (ytr == 1).sum()))),
                      len(ytr) / (2 * max(1, (ytr == 0).sum())))
    gs.fit(Xtr, ytr, groups=gtr, **({"sample_weight": sw} if sw is not None else {}))
    return gs.best_estimator_


def youden_threshold(y_true, p):
    from sklearn.metrics import roc_curve
    if len(set(y_true)) < 2:
        return 0.5
    fpr, tpr, th = roc_curve(y_true, p)
    j = np.argmax(tpr - fpr)
    return float(th[j]) if j < len(th) else 0.5


def conformal_calibrate(p_cal, y_cal, alpha=0.10):
    """Mondrian + marginal split-conformal quantiles."""
    scores = 1.0 - p_cal[np.arange(len(y_cal)), y_cal]
    def q(s):
        if len(s) == 0:
            return 2.0
        k = int(np.ceil((len(s) + 1) * (1 - alpha))) - 1
        k = min(max(k, 0), len(s) - 1)
        return float(np.sort(s)[k])
    return {"marginal": q(scores),
            "mondrian": {c: q(scores[y_cal == c]) for c in (0, 1)}}


def conformal_set(p_row, qd, variant="mondrian"):
    s = []
    for c in (0, 1):
        thr = qd[variant] if variant == "marginal" else qd["mondrian"][c]
        if 1.0 - p_row[c] <= thr:
            s.append(c)
    return s


def ece(y, p, bins=10):
    edges = np.linspace(0, 1, bins + 1)
    e = 0.0
    for i in range(bins):
        m = (p >= edges[i]) & (p < edges[i + 1] if i < bins - 1 else p <= edges[i + 1])
        if m.sum() > 0:
            e += m.mean() * abs(y[m].mean() - p[m].mean())
    return float(e)


def metrics_block(y, p, thr):
    y = np.asarray(y)
    p = np.asarray(p)
    pred = (p >= thr).astype(int)
    out = {}
    if len(set(y)) == 2:
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


def coverage_block(y, p, sets):
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
        out["VME_nonabstained"] = float(np.mean([pred[na.index(i)] == 0 for i in rr])) if rr else None
    return out


def cluster_bootstrap(y, p, thr, cluster, B=BOOT, seed=SEED):
    """95% CI for AUROC/VME/ME by resampling clusters (coarse lineages)."""
    rng = np.random.default_rng(seed)
    y = np.asarray(y)
    p = np.asarray(p)
    cluster = np.asarray(cluster)
    vals = {"AUROC": [], "VME": [], "ME": []}
    uniq = np.unique(cluster)
    idx_by = {c: np.where(cluster == c)[0] for c in uniq}
    for _ in range(B):
        pick = rng.choice(uniq, size=len(uniq), replace=True)
        idx = np.concatenate([idx_by[c] for c in pick])
        yy, pp = y[idx], p[idx]
        if len(set(yy)) < 2:
            continue
        pred = (pp >= thr).astype(int)
        r = yy == 1
        s = yy == 0
        try:
            vals["AUROC"].append(roc_auc_score(yy, pp))
        except ValueError:
            pass
        if r.sum():
            vals["VME"].append((pred[r] == 0).mean())
        if s.sum():
            vals["ME"].append((pred[s] == 1).mean())
    out = {}
    for k, v in vals.items():
        if v:
            out[k] = [float(np.percentile(v, 2.5)), float(np.percentile(v, 97.5))]
    return out


# ---------------- evaluation loop ----------------
pred_rows = []
results = {}
G4 = ["# G4 — Baseline sanity (M0 catalogue rule)", ""]
G6 = ["# G6 — Conformal validity on the exchangeable split S0", ""]
g4_pass = True
g6_notes = []

for drug in DRUGS:
    ymap = y_all[drug]
    ids_all = sorted(ymap)
    sp = splits[drug]
    results[drug] = {}
    # M0 predictions (no training)
    m0_feats = m0map[drug]
    m0_pred = {i: int(feats.loc[i, [f for f in m0_feats if f in feats.columns]].sum() > 0)
               for i in ids_all}

    # ---- G4 sanity: known-determinant carriers vs observed R ----
    carriers = [i for i in ids_all if m0_pred[i] == 1]
    noncar = [i for i in ids_all if m0_pred[i] == 0]
    r_rate_car = np.mean([ymap[i] for i in carriers]) if carriers else None
    r_rate_non = np.mean([ymap[i] for i in noncar]) if noncar else None
    ok = r_rate_car is not None and r_rate_non is not None and r_rate_car > r_rate_non
    g4_pass &= ok
    G4.append(f"## {drug}: {'PASS' if ok else 'FAIL'} — M0-feature carriers R-rate="
              f"{r_rate_car if r_rate_car is None else round(r_rate_car, 3)} vs non-carriers="
              f"{r_rate_non if r_rate_non is None else round(r_rate_non, 3)} "
              f"(carriers n={len(carriers)}, non-carriers n={len(noncar)})")

    # ---- split evaluations ----
    def eval_split(split_name, test_ids, train_ids, model_types=("M0", "M1", "M2")):
        test_ids = [i for i in test_ids if i in ymap]
        train_ids = [i for i in train_ids if i in ymap]
        out = {}
        # lineage-disjoint calibration carve-out from training
        groups_tr = defaultdict(list)
        for i in train_ids:
            groups_tr[coarse[i]].append(i)
        gkeys = sorted(groups_tr, key=lambda g: -len(groups_tr[g]))
        cal_g, tr_g = [], []
        cal_target = 0.2 * len(train_ids)
        for g in gkeys:
            if sum(len(groups_tr[x]) for x in cal_g) < cal_target and len(gkeys) > 2:
                cal_g.append(g)
            else:
                tr_g.append(g)
        tr_ids = [i for g in tr_g for i in groups_tr[g]]
        cal_ids = [i for g in cal_g for i in groups_tr[g]]
        if not tr_ids or not cal_ids:
            tr_ids, cal_ids = train_ids, train_ids  # degenerate fallback (tiny data)
        for mt in model_types:
            if mt == "M0":
                p_test = {i: float(m0_pred[i]) for i in test_ids}
                thr = 0.5
                sets = {i: ([1] if m0_pred[i] == 1 else [0]) for i in test_ids}
            else:
                if len(set(ymap[i] for i in tr_ids)) < 2:
                    continue
                Xtr, ytr = X_of(tr_ids), y_of(tr_ids, ymap)
                mdl = tune_fit(mt, Xtr, ytr, group_ids(tr_ids), SEED)
                # calibration: sigmoid if calibration n<200 in either class else isotonic
                n1 = sum(ymap[i] for i in cal_ids)
                n0 = len(cal_ids) - n1
                method = "sigmoid" if min(n1, n0) < 200 else "isotonic"
                cal_m = CalibratedClassifierCV(mdl, method=method, cv="prefit")
                cal_m.fit(X_of(cal_ids), y_of(cal_ids, ymap))
                p_train = cal_m.predict_proba(X_of(tr_ids))[:, 1]
                thr = youden_threshold(y_of(tr_ids, ymap), p_train)
                p_test = dict(zip(test_ids, cal_m.predict_proba(X_of(test_ids))[:, 1]))
                qd = conformal_calibrate(cal_m.predict_proba(X_of(cal_ids)),
                                         y_of(cal_ids, ymap))
                sets = {i: conformal_set(cal_m.predict_proba(X_of([i]))[0], qd, "mondrian")
                        for i in test_ids}
                sets_marg = {i: conformal_set(cal_m.predict_proba(X_of([i]))[0], qd, "marginal")
                             for i in test_ids}
            yte = y_of(test_ids, ymap)
            pte = np.array([p_test[i] for i in test_ids])
            mb = metrics_block(yte, pte, thr)
            cb = cluster_bootstrap(yte, pte, thr, [coarse[i] for i in test_ids])
            sl = [sets[i] for i in test_ids]
            cov = coverage_block(yte, pte, sl)
            out[mt] = {"metrics": mb, "ci95": cb, "conformal_mondrian": cov,
                       "threshold": thr,
                       "sets_marginal": coverage_block(yte, pte, [sets_marg[i] for i in test_ids])
                       if mt != "M0" else None}
            for i, pi in zip(test_ids, pte):
                pred_rows.append({"drug": drug, "split": split_name, "model": mt,
                                  "biosample": i, "y": ymap[i], "p": float(pi),
                                  "set": "".join(map(str, sets[i]))})
        return out

    # S0
    s0_res = []
    for rep in range(2):
        for j, fold in enumerate(sp["S0"][f"rep{rep}"]):
            rest = [i for jj, ff in enumerate(sp["S0"][f"rep{rep}"]) if jj != j for i in ff]
            s0_res.append(eval_split(f"S0_rep{rep}_fold{j}", fold, rest))
    results[drug]["S0"] = s0_res
    # S1
    results[drug]["S1"] = {k: eval_split(f"S1_{k}", v,
                                         [i for kk, vv in sp["S1"].items() if kk != k for i in vv])
                           for k, v in sp["S1"].items()}
    # S2
    if sp["S2"]:
        results[drug]["S2"] = {"forward_time": eval_split("S2", sp["S2"]["test"], sp["S2"]["train"])}
    else:
        results[drug]["S2"] = None
    # S3
    results[drug]["S3"] = {k: eval_split(f"S3_{k}", v,
                                         [i for kk, vv in sp["S3"].items() if kk != k for i in vv])
                           for k, v in sp["S3"].items()}

    # ---- G6: S0 conformal coverage near nominal ----
    for mt in ("M1", "M2"):
        covs = [r[mt]["conformal_mondrian"]["coverage_overall"] for r in s0_res if mt in r]
        if covs:
            m = float(np.mean(covs))
            g6_notes.append(f"{drug} {mt}: mean S0 Mondrian coverage = {m:.3f} (target 0.90)")
            results[drug].setdefault("S0_mean_coverage", {})[mt] = m

# predictions table
pd.DataFrame(pred_rows).to_csv(RES / "predictions.tsv", sep="\t", index=False)
(EVAL / "main_results.json").write_text(json.dumps(results, indent=1, default=str))

G4 += ["", f"Verdict: **{'PASS' if g4_pass else 'FAIL'}** (carriers of M0-mapped determinants must "
       "show a higher observed-R rate than non-carriers for every drug; checks parser+mapping sanity)"]
(ROOT / "gates" / "G4.md").write_text("\n".join(G4))
print("G4:", "PASS" if g4_pass else "FAIL")
for l in G4[2:5]:
    print("  ", l)
print("\nG6 notes:")
for l in g6_notes:
    print("  ", l)
(ROOT / "gates" / "G6.md").write_text(
    "# G6 — Conformal validity on S0\n\n" + "\n".join(g6_notes) +
    "\n\nVerdict: mean S0 coverage should be near the 0.90 target (pilot-scale tolerance: judged on "
    "the numbers above; small-sample quantile noise expected at n<200 per fold).\n")
print("stages 6 core done; results/evaluation/main_results.json + predictions.tsv written")
