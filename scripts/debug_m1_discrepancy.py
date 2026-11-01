#!/usr/bin/env python3
"""Localise the M1 S0 AUROC discrepancy: stage6 code path vs lacuna pipeline
on ciprofloxacin S0 rep0 fold0 (same inputs, same seed)."""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import GridSearchCV, StratifiedGroupKFold

ROOT = Path("/home/z/my-project/download/lacuna-amr")
sys.path.insert(0, str(ROOT / "src"))

SEED = 20261101
feats = pd.read_csv(ROOT / "results/features.tsv", sep="\t", index_col=0)
cohort = pd.read_csv(ROOT / "data/cohort.tsv", sep="\t")
coarse = dict(zip(cohort["biosample"], cohort["coarse_lineage"]))
labels = pd.read_csv(ROOT / "results/tables/ast_labels_all.tsv", sep="\t")
sp = json.loads((ROOT / "results/splits/ciprofloxacin.json").read_text())
ymap = {r.biosample: int(r.label_eucast == "R") for r in labels.itertuples()
        if r.drug == "ciprofloxacin" and r.label_eucast in ("S", "R")
        and r.biosample in feats.index}

fold = sp["S0"]["rep0"][0]
rest = [i for jj, ff in enumerate(sp["S0"]["rep0"]) if jj != 0 for i in ff]
test_ids = [i for i in fold if i in ymap]
train_ids = [i for i in rest if i in ymap]
print(f"fold0: test={len(test_ids)} train={len(train_ids)}")

# ---------------- stage6 exact path ----------------
def tune_fit_stage6(Xtr, ytr, gtr):
    inner = min(3, len(set(gtr)))
    cv = StratifiedGroupKFold(n_splits=inner, shuffle=True, random_state=SEED)
    grid = {"C": [0.01, 0.1, 1, 10]}
    base = LogisticRegression(max_iter=5000, class_weight="balanced", random_state=SEED)
    gs = GridSearchCV(base, grid, scoring="roc_auc", cv=cv, n_jobs=1, refit=True)
    gs.fit(Xtr, ytr, groups=gtr)
    return gs.best_estimator_

from collections import defaultdict
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
tr_ids_s6 = [i for g in tr_g for i in groups_tr[g]]
cal_ids_s6 = [i for g in cal_g for i in groups_tr[g]]
Xtr = feats.loc[tr_ids_s6].values
ytr = np.array([ymap[i] for i in tr_ids_s6])
Xcal = feats.loc[cal_ids_s6].values
ycal = np.array([ymap[i] for i in cal_ids_s6])
Xte = feats.loc[test_ids].values
yte = np.array([ymap[i] for i in test_ids])
base = tune_fit_stage6(Xtr, ytr, [coarse[i] for i in tr_ids_s6])
cal_m = CalibratedClassifierCV(base, method="sigmoid", cv="prefit")
cal_m.fit(Xcal, ycal)
p_s6 = cal_m.predict_proba(Xte)[:, 1]
print("stage6 path AUROC:", round(roc_auc_score(yte, p_s6), 4))

# ---------------- lacuna pipeline path ----------------
from lacuna.features import load_feature_matrix
from lacuna.pipeline import evaluate_splits
mat = load_feature_matrix(ROOT / "results/features.tsv")
meta = {"lineage": coarse,
        "cluster": dict(zip(cohort["biosample"], cohort["dedup_cluster"]))}
m0 = json.loads((ROOT / "results/m0_mapping.json").read_text())["feature_sets"]
splits = {"ciprofloxacin": sp}
labels_in = {"ciprofloxacin": ymap}
doc = evaluate_splits(mat, labels_in, splits, meta, m0,
                      model_types=("M1",), seed=SEED, boot=0)
aucs = [b["M1"]["metrics"]["AUROC"] for b in doc["results"]["ciprofloxacin"]["S0"]]
print("lacuna pipeline S0 M1 AUROCs:", [round(a, 4) for a in aucs])
print("mean:", round(float(np.mean(aucs)), 4))

# ---------------- research recorded values ----------------
mr = json.loads((ROOT / "results/evaluation/main_results.json").read_text())
aucs_r = [b["M1"]["metrics"]["AUROC"] for b in mr["ciprofloxacin"]["S0"]]
print("research S0 M1 AUROCs:", [round(a, 4) for a in aucs_r])
print("mean:", round(float(np.mean(aucs_r)), 4))
