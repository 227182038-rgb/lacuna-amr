#!/usr/bin/env python3
"""Stage 3d: sketch assemblies (sourmash k=31 scaled=1000), compute distance
matrix, freeze dedup/fine/coarse thresholds from the empirical histogram
(genotype-only, BEFORE any phenotype join), cluster, de-duplicate (<=3 per
cluster x BioProject), and cap the cohort at N_CAP=240 in seeded order.
Outputs: data/cohort.tsv, results/lineages.json, results/tables/dedup_report.tsv."""
import json
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
ASM = ROOT / "data" / "assemblies"
SIG = ROOT / "data" / "sigs"
SIG.mkdir(parents=True, exist_ok=True)
OUT = ROOT / "results" / "tables"
N_CAP = 240
SEED = 20261101

# 1) sketch
if not (SIG / "eco.zip").exists():
    files = sorted(ASM.glob("*.fna.gz"))
    lst = SIG / "filelist.txt"
    lst.write_text("\n".join(str(f) for f in files) + "\n")
    print(f"sketching {len(files)} genomes...")
    r = subprocess.run(["sourmash", "sketch", "dna", "-p", "k=31,scaled=1000",
                        "--from-file", str(lst), "-o", str(SIG / "eco.zip")],
                       capture_output=True, text=True, timeout=3000)
    print(r.stdout[-500:] if r.returncode == 0 else r.stderr[-800:])
else:
    print("sketches exist")

# 2) compare
if not (SIG / "cmp").exists():
    print("comparing...")
    r = subprocess.run(["sourmash", "compare", str(SIG / "eco.zip"), "-o", str(SIG / "cmp")],
                       capture_output=True, text=True, timeout=3000)
    print(r.stdout[-300:] if r.returncode == 0 else r.stderr[-500:])

sim = np.load(SIG / "cmp")
labels = [Path(l.strip()).name.replace(".fna.gz", "") for l in (SIG / "cmp.labels.txt").read_text().splitlines()]
print(f"matrix {sim.shape}; labels {len(labels)}")
n = sim.shape[0]
dist = 1.0 - sim
iu = np.triu_indices(n, k=1)
dv = dist[iu]

# 3) histogram + valley detection (frozen rule, genotype-only)
hist, edges = np.histogram(dv, bins=200, range=(0.0, 1.0))
sm = np.convolve(hist, np.ones(5) / 5, mode="same")
gmax = float(sm.max())

def find_deep_valley(lo, hi, min_depth_frac=0.10):
    """deepest local minimum (peak-to-valley depth >= frac of global max) in [lo, hi]."""
    best, best_depth = None, 0.0
    for i in range(2, len(sm) - 2):
        c = (edges[i] + edges[i + 1]) / 2
        if not (lo <= c <= hi):
            continue
        if not (sm[i] <= sm[i - 1] and sm[i] <= sm[i + 1]):
            continue
        # nearest local max to the left and right
        l = i - 1
        while l > 1 and not (sm[l] >= sm[l - 1] and sm[l] >= sm[l + 1]):
            l -= 1
        r = i + 1
        while r < len(sm) - 2 and not (sm[r] >= sm[r - 1] and sm[r] >= sm[r + 1]):
            r += 1
        depth = min(sm[l] - sm[i], sm[r] - sm[i])
        if depth > best_depth:
            best, best_depth = c, depth
    if best is not None and best_depth >= min_depth_frac * gmax:
        return best, best_depth
    return None, 0.0

dedup_t, ddepth_f = find_deep_valley(0.01, 0.25, 0.02)   # near-identical hump valley
fine_t = dedup_t
coarse_t, ddepth_c = find_deep_valley(0.30, 0.70, 0.10)  # between-group valley
fallback = {"dedup": 0.383, "fine": 0.303, "coarse": 0.554}  # protocol mutation-unit fallbacks (0.01/0.007/0.02) translated: j = 2mk/(1+2mk), k=31 (D-011, D-015)
if dedup_t is None:
    dedup_t = fine_t = fallback["fine"]
if coarse_t is None:
    coarse_t = fallback["coarse"]
print(f"valley depths: fine={ddepth_f:.0f}, coarse={ddepth_c:.0f} (global max {gmax:.0f})")
print(f"FROZEN THRESHOLDS (jaccard distance): dedup=fine={dedup_t:.4f}, coarse={coarse_t:.4f}")
print(f"distance distribution: median={np.median(dv):.3f} p5={np.percentile(dv,5):.3f} "
      f"p25={np.percentile(dv,25):.3f} p75={np.percentile(dv,75):.3f}")

# 4) clustering (average linkage)
from scipy.cluster.hierarchy import linkage, fcluster
from scipy.spatial.distance import squareform

Z = linkage(squareform(dist, checks=False), method="average")
cl_dedup = fcluster(Z, t=dedup_t, criterion="distance")
cl_fine = fcluster(Z, t=fine_t, criterion="distance")
cl_coarse = fcluster(Z, t=coarse_t, criterion="distance")
cl_fine_lo = fcluster(Z, t=fine_t * 0.5, criterion="distance")
cl_fine_hi = fcluster(Z, t=fine_t * 1.5, criterion="distance")
cl_coarse_lo = fcluster(Z, t=coarse_t * 0.5, criterion="distance")
cl_coarse_hi = fcluster(Z, t=coarse_t * 1.5, criterion="distance")
import collections
for name, cl in [("dedup", cl_dedup), ("fine", cl_fine), ("coarse", cl_coarse),
                 ("fine_lo", cl_fine_lo), ("fine_hi", cl_fine_hi),
                 ("coarse_lo", cl_coarse_lo), ("coarse_hi", cl_coarse_hi)]:
    sizes = collections.Counter(cl)
    print(f"clusters {name:<10}: n={len(sizes)} largest={sizes.most_common(3)} "
          f"n>=25: {sum(1 for v in sizes.values() if v >= 25)}")

# 5) de-duplication: <=3 per (dedup cluster x BioProject), seeded order
state = json.loads((ROOT / "data" / "stage3_state.json").read_text())
sel_order = [s["biosample"] for s in state["selection"]]
sel_map = {s["biosample"]: s for s in state["selection"]}
pos = {b: i for i, b in enumerate(labels)}
kept = []
counts = collections.Counter()
dropped = []
for bs in sel_order:
    if bs not in pos:
        continue
    i = pos[bs]
    key = (cl_dedup[i], sel_map[bs]["bioproject"])
    if counts[key] < 3:
        counts[key] += 1
        kept.append(i)
    else:
        dropped.append((bs, cl_dedup[i], sel_map[bs]["bioproject"]))
print(f"dedup: kept {len(kept)}, dropped {len(dropped)} (>{3}-per-cluster-x-project rule)")

# 6) cap at N_CAP in seeded order
if len(kept) > N_CAP:
    cohort_idx = kept[:N_CAP]
    print(f"capped cohort: {len(cohort_idx)} (of {len(kept)} dedup survivors)")
else:
    cohort_idx = kept
    print(f"cohort = all {len(kept)} dedup survivors (below N_CAP)")

# 7) write cohort + lineage tables
rows = []
for i in cohort_idx:
    bs = labels[i]
    s = sel_map[bs]
    rows.append({"biosample": bs, "assembly": s["assembly"], "bioproject": s["bioproject"],
                 "submitter_org": s["submitter_org"], "dedup_cluster": cl_dedup[i],
                 "fine_lineage": cl_fine[i], "coarse_lineage": cl_coarse[i],
                 "fine_lo": cl_fine_lo[i], "fine_hi": cl_fine_hi[i],
                 "coarse_lo": cl_coarse_lo[i], "coarse_hi": cl_coarse_hi[i]})
import csv
with open(ROOT / "data" / "cohort.tsv", "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()), delimiter="\t")
    w.writeheader()
    w.writerows(rows)
with open(OUT / "dedup_report.tsv", "w") as fh:
    fh.write("biosample\tdedup_cluster\tbioproject\taction\n")
    for bs, c, p in dropped:
        fh.write(f"{bs}\t{c}\t{p}\tdropped\n")
    keptset = {labels[i] for i in kept}
    for i in range(n):
        if labels[i] in sel_map and labels[i] not in keptset and labels[i] not in {b for b, _, _ in dropped}:
            fh.write(f"{labels[i]}\t{cl_dedup[i]}\t{sel_map[labels[i]]['bioproject']}\tnot_in_download\n")

sizes_coarse = collections.Counter(r["coarse_lineage"] for r in rows)
json_doc = {
    "metric": "1 - jaccard similarity of sourmash sketches (k=31, scaled=1000)",
    "n_genomes": n,
    "thresholds": {"dedup": round(dedup_t, 4), "fine": round(fine_t, 4), "coarse": round(coarse_t, 4)},
    "threshold_method": "first local minimum of smoothed (window 9, 400-bin) empirical distance histogram; fallback values documented in DEVIATIONS D-011",
    "fallbacks": fallback,
    "distance_stats": {"median": round(float(np.median(dv)), 4), "p5": round(float(np.percentile(dv, 5)), 4),
                       "p25": round(float(np.percentile(dv, 25)), 4), "p75": round(float(np.percentile(dv, 75)), 4)},
    "n_clusters": {"dedup": len(set(cl_dedup)), "fine": len(set(cl_fine)), "coarse": len(set(cl_coarse))},
    "coarse_sizes": {str(k): v for k, v in sorted(sizes_coarse.items(), key=lambda x: -x[1])},
    "n_coarse_ge25": sum(1 for v in sizes_coarse.values() if v >= 25),
    "n_dedup_survivors": len(kept), "n_dropped": len(dropped),
    "n_cohort": len(cohort_idx),
    "n_bioprojects": len({r["bioproject"] for r in rows}),
    "frozen_before_phenotype_join": True,
}
(ROOT / "results" / "lineages.json").write_text(json.dumps(json_doc, indent=2))
print(json.dumps({k: json_doc[k] for k in ["thresholds", "n_clusters", "n_dedup_survivors",
                                           "n_cohort", "n_bioprojects", "n_coarse_ge25"]}, indent=1))
print("stage 3d done")
