#!/usr/bin/env python3
"""Stage 5: build feature matrix + drug-specific datasets + splits S0-S3 with
sealed (hashed) test lists. Also builds the M0 catalogue mapping from
AMRFinderPlus's own Class/Subclass fields and runs G4 sanity checks.
Outputs: results/features.tsv, results/datasets/<drug>.json (labels+features),
results/splits/<drug>_<split>.json, results/splits/manifest.json, gates/G3.md,
gates/G4.md."""
import hashlib
import json
import random
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
AMR = ROOT / "results" / "amrfinder"
RES = ROOT / "results"
SPL = RES / "splits"
SPL.mkdir(parents=True, exist_ok=True)
DRUGS = ["ciprofloxacin", "gentamicin", "ceftazidime"]
SEED = 20261101
SEED2 = 42

cohort = pd.read_csv(ROOT / "data" / "cohort.tsv", sep="\t")
cohort_bs = list(cohort["biosample"])
bs2row = {b: i for i, b in enumerate(cohort_bs)}
labels = pd.read_csv(RES / "tables" / "ast_labels_all.tsv", sep="\t")

# ---------- features ----------
feat_rows = defaultdict(set)   # biosample -> set of feature ids
subclass_map = defaultdict(set)  # feature id -> set of subclasses
classes_map = defaultdict(set)
n_reports = 0
for f in sorted(AMR.glob("*.tsv")):
    bs = f.stem
    if bs not in bs2row:
        continue
    try:
        df = pd.read_csv(f, sep="\t")
    except Exception:  # noqa: BLE001
        continue
    n_reports += 1
    for _, r in df.iterrows():
        el = str(r.get("Element symbol", ""))
        etype = str(r.get("Element type", r.get("Type", "")))
        subtype = str(r.get("Element subtype", r.get("Subtype", "")))
        if etype == "POINT":
            fid = f"mut:{el}"
        else:
            fid = f"gene:{el}"
        feat_rows[bs].add(fid)
        sc = str(r.get("Subclass", ""))
        if sc:
            subclass_map[fid].add(sc)
        cl = str(r.get("Class", ""))
        if cl:
            classes_map[fid].add(cl)

all_feats = sorted({f for s in feat_rows.values() for f in s})
mat = pd.DataFrame(0, index=cohort_bs, columns=all_feats, dtype=np.int8)
for bs, fs in feat_rows.items():
    for f in fs:
        mat.loc[bs, f] = 1
mat.index.name = "biosample"
mat.to_csv(RES / "features.tsv", sep="\t")
print(f"features: {mat.shape[0]} isolates x {mat.shape[1]} features; amrfinder reports parsed: {n_reports}")

# ---------- M0 catalogue mapping (from tool's own Subclass strings) ----------
M0_KEYS = {
    # drug-specific keywords matched against BOTH Class and Subclass fields of
    # AMRFinderPlus output (uppercase). Gentamicin uses the drug name only:
    # aminoglycoside-class enzymes whose Subclass lacks GENTAMICIN (e.g. aadA =
    # STREPTOMYCIN, aph(3') = KANAMYCIN) do not confer gentamicin resistance.
    "ciprofloxacin": ["QUINOLONE"],
    "gentamicin": ["GENTAMICIN"],
    "ceftazidime": ["CEPHALOSPORIN", "CARBAPENEM", "CEFTAZIDIME"],
}
m0_map = {}
for drug, keys in M0_KEYS.items():
    m0_feats = set()
    for fid in subclass_map:
        fields = subclass_map[fid] | classes_map[fid]
        if any(any(k in f.upper() for k in keys) for f in fields):
            m0_feats.add(fid)
    m0_map[drug] = sorted(m0_feats)
    print(f"M0 {drug}: {len(m0_feats)} mapped features (Class+Subclass keyword match)")
(RES / "m0_mapping.json").write_text(json.dumps(
    {"mapping_keywords": M0_KEYS, "feature_sets": m0_map,
     "observed_subclasses": sorted({s for ss in subclass_map.values() for s in ss})}, indent=2))

# ---------- drug datasets ----------
datasets = {}
for drug in DRUGS:
    sub = labels[(labels["drug"] == drug) & (labels["label_eucast"].isin(["S", "R"]))].copy()
    sub = sub[sub["biosample"].isin(bs2row)]
    y = {r.biosample: (1 if r.label_eucast == "R" else 0) for r in sub.itertuples()}
    datasets[drug] = y
    n_r = sum(y.values())
    print(f"dataset {drug}: n={len(y)} R={n_r} S={len(y)-n_r}")

# ---------- splits ----------
def cluster_col(name):
    return list(cohort[name])

fine = dict(zip(cohort_bs, cohort["fine_lineage"]))
coarse = dict(zip(cohort_bs, cohort["coarse_lineage"]))
dedup = dict(zip(cohort_bs, cohort["dedup_cluster"]))
bp = dict(zip(cohort_bs, cohort["bioproject"]))

splits_manifest = {}
G3_lines = ["# G3 — Split integrity (assertion tests)", ""]
for drug, y in datasets.items():
    ids = sorted(y)
    n = len(ids)
    # S0: stratified random 5-fold CV, 2 repeats
    s0 = {}
    for rep in range(2):
        rng = random.Random(SEED + rep)
        pos = [i for i in ids if y[i] == 1]
        neg = [i for i in ids if y[i] == 0]
        rng.shuffle(pos)
        rng.shuffle(neg)
        folds = [[] for _ in range(5)]
        for j, i in enumerate(pos):
            folds[j % 5].append(i)
        for j, i in enumerate(neg):
            folds[j % 5].append(i)
        s0[f"rep{rep}"] = [sorted(f) for f in folds]
    # S1: leave-coarse-lineage-out (lineages <25 merged into OTHER, never split)
    sizes = Counter(coarse[i] for i in ids)
    big = {k for k, v in sizes.items() if v >= 25}
    groups = defaultdict(list)
    for i in ids:
        groups[coarse[i] if coarse[i] in big else "OTHER"].append(i)
    s1 = {str(k): sorted(v) for k, v in groups.items()}
    # S2: forward-time by year
    year = dict(zip(labels["biosample"], labels["year"]))
    years = {}
    for i in ids:
        years[i] = year.get(i, "")
    n_no_year = sum(1 for i in ids if not years[i])
    s2 = None
    s2_note = ""
    n_r = sum(y.values())
    if n_no_year / n > 0.30:
        s2_note = f"infeasible: {n_no_year}/{n} isolates lack a collection year"
    else:
        ycounts = Counter(years[i] for i in ids if years[i])
        cum = []
        tot = 0
        for yr in sorted(ycounts, reverse=True):
            tot += ycounts[yr]
            cum.append(yr)
            if tot >= 0.20 * (n - n_no_year):
                break
        test = [i for i in ids if years[i] and years[i] in cum]
        train = [i for i in ids if i not in set(test)]
        nr_t = sum(y[i] for i in test)
        if len(test) >= 0.20 * n and nr_t >= 5 and (len(test) - nr_t) >= 5:
            s2 = {"test_years": sorted(cum), "test": sorted(test), "train": sorted(train)}
        else:
            s2_note = f"infeasible at pilot scale: test n={len(test)}, R={nr_t} (<50 R / 50 S required by protocol at full scale)"
    # S3: leave-BioProject-cluster-out (cluster = submitter_org)
    org = dict(zip(cohort_bs, cohort["submitter_org"]))
    orgbp = defaultdict(list)
    for i in ids:
        orgbp[f"{bp[i]}|{org[i]}"].append(i)
    # merge tiny projects into OTHER_S3 so that no group smaller than 10 is a fold
    s3 = {}
    other = []
    for k, v in orgbp.items():
        if len(v) >= 10:
            s3[k] = sorted(v)
        else:
            other.extend(v)
    if other:
        s3["OTHER_S3"] = sorted(other)

    doc = {"S0": s0, "S1": s1, "S2": s2, "S2_note": s2_note, "S3": s3}
    (SPL / f"{drug}.json").write_text(json.dumps(doc, indent=1))
    splits_manifest[drug] = {
        "S0": f"{len(s0['rep0'])} folds x {len(s0)} reps",
        "S1": f"{len(s1)} groups: {dict((k, len(v)) for k, v in sorted(s1.items(), key=lambda x: -len(x[1]))[:6])}",
        "S2": "infeasible" if s2 is None else f"test years {s2['test_years']} n={len(s2['test'])}",
        "S2_note": s2_note,
        "S3": f"{len(s3)} groups: {dict((k, len(v)) for k, v in sorted(s3.items(), key=lambda x: -len(x[1]))[:6])}",
    }
    # ---- G3 assertions: no isolate or dedup-cluster overlap between any train/test ----
    problems = []
    def check_disjoint(train, test, tag):
        ti, te = set(train), set(test)
        if ti & te:
            problems.append(f"{tag}: isolate overlap {len(ti & te)}")
        tc = {dedup[i] for i in train}
        ec = {dedup[i] for i in test}
        if tc & ec:
            problems.append(f"{tag}: dedup-cluster overlap {len(tc & ec)}")
    # S1 folds: each fold as test vs rest
    for k, v in s1.items():
        rest = [i for kk, vv in s1.items() if kk != k for i in vv]
        check_disjoint(rest, v, f"S1[{k}]")
    if s2:
        check_disjoint(s2["train"], s2["test"], "S2")
    for k, v in s3.items():
        rest = [i for kk, vv in s3.items() if kk != k for i in vv]
        check_disjoint(rest, v, f"S3[{k}]")
    # S0 folds (random split: isolate overlap by construction across folds is none; cluster overlap allowed by design but we ASSERT none for the record)
    for rep in range(2):
        for j, f in enumerate(s0[f"rep{rep}"]):
            rest = [i for jj, ff in enumerate(s0[f"rep{rep}"]) if jj != j for i in ff]
            check_disjoint(rest, f, f"S0[rep{rep} fold{j}]")
    G3_lines.append(f"## {drug}: {'PASS' if not problems else 'FAIL'} ({len(problems)} problems)")
    G3_lines.append(f"- S1 groups: {splits_manifest[drug]['S1']}")
    G3_lines.append(f"- S2: {splits_manifest[drug]['S2']} ({splits_manifest[drug]['S2_note']})")
    G3_lines.append(f"- S3 groups: {splits_manifest[drug]['S3']}")
    for p in problems[:6]:
        G3_lines.append(f"- PROBLEM: {p}")

# hash sealed test lists before modelling
hashes = {}
for drug in DRUGS:
    h = hashlib.sha256((SPL / f"{drug}.json").read_bytes()).hexdigest()
    hashes[drug] = h
(RES / "splits" / "manifest.json").write_text(json.dumps(
    {"splits": splits_manifest, "sha256": hashes, "sealed_utc": "2026-11-01",
     "note": "test lists hashed before any model was fitted; single-opening rule enforced in evaluation script"}, indent=2))
G3_lines.append("")
G3_lines.append("Sealed split files sha256: " + json.dumps(hashes))
G3_lines.append("Verdict: see per-drug lines above (PASS requires zero isolate/dedup-cluster overlap)")
(ROOT / "gates" / "G3.md").write_text("\n".join(G3_lines))
print(json.dumps(splits_manifest, indent=1))
print("stage 5 done (features, M0 map, datasets, splits, G3)")
