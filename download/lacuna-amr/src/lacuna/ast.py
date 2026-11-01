"""AST (antimicrobial susceptibility test) parsing and label derivation.

Two input routes:
1. Raw BioSample antibiogram XML (verbatim NCBI efetch records) —
   :func:`parse_biosample_antibiogram`.
2. A flat AST table TSV with the documented schema (columns ``biosample,
   drug, sign, measurement, unit, method, platform, standard,
   submitter_phenotype, year, country, bioproject``) — :func:`load_ast_table`
   plus :func:`labels_from_ast_table`.

Only dilution-method MICs in mg/L qualify for the primary rule (protocol S5);
automated platforms and gradient tests are excluded_platform, non-quantitative
rows are not_quantitative. No label is ever guessed: censored measurements that
cannot resolve to S/R become INDETERMINATE_CENSORED.
"""
from __future__ import annotations

import csv
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path
from typing import Sequence

from .breakpoints import Breakpoints
from .errors import SchemaError

AST_COLUMNS = ("biosample", "drug", "sign", "measurement", "unit", "method",
               "platform", "standard", "submitter_phenotype", "year", "country",
               "bioproject")

DILUTION_METHODS = {
    "broth dilution", "broth microdilution", "frozen broth microdilution", "macrodilution",
    "microbroth dilution", "microdilution", "minimal inhibitory concentration", "agar dilution",
    "mic", "dilution"}
AUTOMATED_PLATFORMS = ("vitek", "phoenix", "microscan")
GRADIENT_MARKERS = ("e-test", "etest", "gradient")
TRAY_PLATFORMS = {"sensititre", "96-well plate", "96 well plate"}


def classify_ast_row(method: str, platform: str, unit: str, measurement: str) -> str:
    """primary_rule | excluded_platform | not_quantitative (protocol S5)."""
    m, p = (method or "").lower().strip(), (platform or "").lower().strip()
    if (unit or "").lower() != "mg/l" or not (measurement or "").strip():
        return "not_quantitative"
    if any(a in m or a in p for a in AUTOMATED_PLATFORMS):
        return "excluded_platform"
    if any(g in m or g in p for g in GRADIENT_MARKERS):
        return "excluded_platform"
    if m in DILUTION_METHODS or p in TRAY_PLATFORMS or (not m and not p):
        return "primary_rule"
    return "excluded_platform" if not m else "primary_rule"


def parse_biosample_antibiogram(xml_text: str) -> dict:
    """Parse one BioSampleSet (or single BioSample) XML document into metadata
    + AST rows. Verbatim-compatible with NCBI efetch output (Table class
    Antibiogram.*)."""
    root = ET.fromstring(xml_text)
    if root.tag == "BioSample":
        samples = [root]
    else:
        samples = root.findall(".//BioSample")
    out = []
    for bs in samples:
        rec = {"accession": bs.get("accession", ""), "rows": [], "attributes": {}}
        for attr in bs.findall(".//Attribute"):
            rec["attributes"][attr.get("harmonized_name") or ""] = (attr.text or "").strip()
        for table in bs.findall(".//Table"):
            if "antibiogram" not in (table.get("class") or "").lower():
                continue
            header = ["".join(c.itertext()).strip().lower()
                      for c in table.findall(".//Header/Cell")]
            idx = {}
            for j, h in enumerate(header):
                if "antibiotic" in h:
                    idx["ab"] = j
                elif "resistance phenotype" in h:
                    idx["phen"] = j
                elif "measurement sign" in h:
                    idx["sign"] = j
                elif h == "measurement":
                    idx["meas"] = j
                elif "unit" in h:
                    idx["unit"] = j
                elif "typing method" in h and "version" not in h:
                    idx["method"] = j
                elif "testing standard" in h:
                    idx["std"] = j
                elif "platform" in h:
                    idx["plat"] = j
            for row in table.findall(".//Row"):
                cells = ["".join(c.itertext()).strip() for c in row.findall("./Cell")]

                def g(k):
                    j = idx.get(k)
                    return cells[j] if j is not None and j < len(cells) else ""

                rec["rows"].append({
                    "antibiotic": g("ab"), "phenotype": g("phen"), "sign": g("sign"),
                    "measurement": g("meas"), "unit": g("unit"), "method": g("method"),
                    "platform": g("plat"), "standard": g("std"),
                    "row_class": classify_ast_row(g("method"), g("plat"), g("unit"), g("meas"))})
        out.append(rec)
    return {"samples": out}


def derive_labels(sample: dict, bps: Breakpoints,
                  drugs: Sequence[str]) -> dict[str, dict]:
    """Per-drug analysis labels + submitter labels (agreement rule, protocol S5)."""
    res = {}
    for drug in drugs:
        rows = [r for r in sample["rows"] if r["antibiotic"].lower().strip() == drug.lower()]
        prim = [r for r in rows if r["row_class"] == "primary_rule"]
        entry = {"n_rows": len(rows), "n_primary": len(prim), "label": None,
                 "submitter_labels": sorted({r["phenotype"] for r in rows if r["phenotype"]}),
                 "standards": sorted({r["standard"] for r in rows if r["standard"]})}
        if prim:
            labs = {bps.label(drug, r["sign"], r["measurement"]) for r in prim}
            entry["label"] = labs.pop() if len(labs) == 1 else "CONFLICTED"
        res[drug] = entry
    return res


# ---------------------------------------------------------------- flat table
def load_ast_table(path: str | Path) -> list[dict]:
    """Load + schema-validate a flat AST table (documented schema, AST_COLUMNS)."""
    path = Path(path)
    if not path.is_file():
        raise SchemaError(f"AST table not found: {path}")
    with open(path, newline="") as fh:
        rdr = csv.DictReader(fh, delimiter="\t")
        missing = [c for c in ("biosample", "drug", "sign", "measurement", "unit")
                   if c not in (rdr.fieldnames or [])]
        if missing:
            raise SchemaError(
                f"{path}: AST table missing column(s) {missing}. Documented schema: "
                + ", ".join(AST_COLUMNS) + " (tab-separated with header).")
        rows = []
        for r in rdr:
            rows.append({k: (r.get(k) or "").strip() for k in AST_COLUMNS})
    if not rows:
        raise SchemaError(f"{path}: AST table contains no data rows")
    return rows


def labels_from_ast_table(rows: Sequence[dict], bps: Breakpoints,
                          drugs: Sequence[str] | None = None,
                          keep_intermediate: bool = False
                          ) -> dict[str, dict[str, int]]:
    """Derive EUCAST labels from a flat AST table.

    Returns ``{drug: {biosample: 0/1}}`` using primary-rule rows only; a
    biosample with conflicting primary rows for a drug is dropped (counted in
    the audit command, never silently resolved). With ``keep_intermediate``,
    I/INDETERMINATE_CENSORED isolates are kept as ``-1`` (predict without
    labels uses only 0/1).
    """
    if drugs is None:
        drugs = sorted({r["drug"].lower() for r in rows})
    out: dict[str, dict[str, int]] = {}
    for drug in drugs:
        per_iso: dict[str, list[tuple[str, int | None]]] = defaultdict(list)
        for r in rows:
            if r["drug"].lower() != drug.lower():
                continue
            if classify_ast_row(r.get("method", ""), r.get("platform", ""),
                                r.get("unit", ""), r.get("measurement", "")) != "primary_rule":
                continue
            lab = bps.label(drug, r.get("sign", ""), r["measurement"])
            code = {"S": 0, "R": 1}.get(lab, -1)
            per_iso[r["biosample"]].append((lab, code))
        d = {}
        for iso, labs in per_iso.items():
            codes = {c for _, c in labs if c is not None}
            if len(codes) != 1:
                continue  # CONFLICTED -> excluded, counted by audit-dataset
            c = codes.pop()
            if c in (0, 1):
                d[iso] = c
            elif keep_intermediate:
                d[iso] = -1
        out[drug.lower()] = d
    return out


def audit_table(rows: Sequence[dict], bps: Breakpoints | None,
                drugs: Sequence[str] | None = None) -> dict:
    """Label-heterogeneity audit of a flat AST table (powers ``audit-dataset``)."""
    if drugs is None:
        drugs = sorted({r["drug"] for r in rows})
    report: dict = {}
    for drug in drugs:
        rs = [r for r in rows if r["drug"].lower() == drug.lower()]
        cls = Counter(classify_ast_row(r.get("method", ""), r.get("platform", ""),
                                       r.get("unit", ""), r.get("measurement", ""))
                      for r in rs)
        entry = {
            "n_rows": len(rs),
            "n_isolates": len({r["biosample"] for r in rs}),
            "n_bioprojects": len({r["bioproject"] for r in rs if r["bioproject"]}),
            "row_classes": dict(cls.most_common()),
            "testing_standards": dict(Counter(r["standard"] or "missing" for r in rs).most_common(6)),
            "methods": dict(Counter(r["method"] or "missing" for r in rs).most_common(6)),
            "platforms": dict(Counter(r["platform"] or "missing" for r in rs).most_common(6)),
            "submitter_phenotypes": dict(
                Counter(r["submitter_phenotype"] or "missing" for r in rs).most_common(8)),
            "signs": dict(Counter(r["sign"] or "missing" for r in rs).most_common(8)),
        }
        if bps is not None and drug.lower() in bps.rows:
            labs = Counter()
            for r in rs:
                if classify_ast_row(r.get("method", ""), r.get("platform", ""),
                                    r.get("unit", ""), r.get("measurement", "")) == "primary_rule":
                    labs[bps.label(drug, r.get("sign", ""), r["measurement"])] += 1
            entry["derived_labels_primary_rule"] = dict(labs.most_common())
            labs_s = {k: v for k, v in labs.items() if k in ("S", "R")}
            entry["n_labelled_S_R"] = sum(labs_s.values())
            entry["n_R"] = labs.get("R", 0)
            entry["n_S"] = labs.get("S", 0)
        report[drug] = entry
    return report
