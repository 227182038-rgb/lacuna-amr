"""Self-contained audit reports (HTML or Markdown).

No external assets, no JavaScript, no network: a single portable file with
inline styling. Every section states its source file, and every report carries
the research-use-only notice and the tool version.
"""
from __future__ import annotations

import html
import json
from datetime import datetime, timezone
from pathlib import Path

from ._version import __version__
from .licensing import RUO, license_report

_CSS = """
body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;margin:0;background:#f5f5f4;color:#1c1917}
main{max-width:1000px;margin:0 auto;padding:2rem 1.5rem}
h1{font-size:1.6rem;margin:0 0 .25rem} h2{font-size:1.15rem;margin:2.2rem 0 .6rem;border-bottom:2px solid #d6d3d1;padding-bottom:.25rem}
table{border-collapse:collapse;width:100%;font-size:.85rem;margin:.6rem 0}
th,td{border:1px solid #d6d3d1;padding:.3rem .5rem;text-align:left;vertical-align:top}
th{background:#e7e5e4} tr:nth-child(even) td{background:#fafaf9}
code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem}
pre{background:#1c1917;color:#fafaf9;padding:.8rem;border-radius:6px;overflow-x:auto}
.ruo{background:#fef3c7;border:1px solid #f59e0b;padding:.6rem .9rem;border-radius:6px;font-size:.9rem}
.meta{color:#57534e;font-size:.85rem}
.badge{display:inline-block;padding:.1rem .5rem;border-radius:999px;font-size:.75rem;background:#dcfce7;border:1px solid #16a34a}
.warn{background:#fee2e2;border-color:#dc2626}
"""


def _esc(x) -> str:
    return html.escape(str(x))


def _fmt(v) -> str:
    if isinstance(v, float):
        return f"{v:.4g}" if abs(v) < 1e6 else f"{v:.2e}"
    return _esc(v)


def _table(headers: list[str], rows: list[list]) -> str:
    h = "".join(f"<th>{_esc(c)}</th>" for c in headers)
    body = "".join("<tr>" + "".join(f"<td>{_fmt(c)}</td>" for c in r) + "</tr>"
                   for r in rows)
    return f"<table><thead><tr>{h}</tr></thead><tbody>{body}</tbody></table>"


def _kv_table(d: dict, skip: tuple = ()) -> str:
    rows = [[k, v] for k, v in d.items() if k not in skip]
    return _table(["key", "value"], rows)


def _json_to_tables(doc: dict, depth=0) -> str:
    """Render (nested) JSON as stacked tables without hand-curating keys."""
    out = []
    for k, v in doc.items():
        if isinstance(v, dict):
            scal = {kk: vv for kk, vv in v.items()
                    if not isinstance(vv, (dict, list))}
            nested = {kk: vv for kk, vv in v.items() if isinstance(vv, (dict, list))}
            if scal or nested:
                out.append(f"<h3>{_esc(k)}</h3>")
            if scal:
                out.append(_kv_table(scal))
            for kk, vv in nested.items():
                if isinstance(vv, dict):
                    out.append(f"<h4>{_esc(k)} · {_esc(kk)}</h4>")
                    out.append(_json_to_tables(vv, depth + 1))
                elif isinstance(vv, list) and vv and isinstance(vv[0], dict):
                    hdrs = sorted({k2 for r2 in vv for k2 in r2})
                    out.append(f"<h4>{_esc(k)} · {_esc(kk)} ({len(vv)} entries)</h4>")
                    out.append(_table(hdrs, [[r2.get(h2, "") for h2 in hdrs] for r2 in vv]))
                elif isinstance(vv, list):
                    out.append(f"<p><b>{_esc(kk)}:</b> " +
                               ", ".join(_fmt(x) for x in vv[:40]) +
                               (" …" if len(vv) > 40 else "") + "</p>")
        elif isinstance(v, list) and v and isinstance(v[0], dict):
            hdrs = sorted({k2 for r2 in v for k2 in r2})
            out.append(f"<h3>{_esc(k)} ({len(v)} entries)</h3>")
            out.append(_table(hdrs, [[r2.get(h2, "") for h2 in hdrs] for r2 in v]))
        else:
            out.append(f"<p><b>{_esc(k)}:</b> {_fmt(v)}</p>")
    return "\n".join(out)


# --------------------------------------------------------------- section AI
def detect_and_render(path: str | Path) -> tuple[str, str]:
    """(section_title, html_body) for one input file, auto-detected by shape."""
    p = Path(path)
    text = p.read_text(errors="replace")
    title = p.name
    body: str
    if p.suffix == ".json":
        try:
            doc = json.loads(text)
        except json.JSONDecodeError:
            body = f"<pre>{_esc(text[:20000])}</pre>"
            return title, body
        if doc.get("lacuna_artefact", "").startswith("lacuna-model"):
            title = f"Model artefact — {p.name}"
            meta = {k: doc.get(k) for k in
                    ("lacuna_artefact", "created_utc", "lacuna_version",
                     "sklearn_version", "seed", "alpha")}
            drugs = []
            for d, e in doc.get("drugs", {}).items():
                drugs.append([d, e.get("n_labelled"), e.get("n_R"), e.get("n_S"),
                              len(e.get("m0_features", [])),
                              ", ".join(sorted(e.get("models", {}))) or "M0 only",
                              e.get("default_model") or "—",
                              e.get("training_hash", "")[:12]])
            body = (_kv_table(meta)
                    + "<h3>Drugs</h3>"
                    + _table(["drug", "n labelled", "R", "S", "M0 features",
                              "stored models", "default", "training hash"],
                             drugs)
                    + "<p class='meta'>Artefact payload SHA-256: <code>"
                      + _esc(doc.get("payload_sha256", "")) + "</code></p>")
        elif "drugs" in doc and all(isinstance(v, dict) for v in doc["drugs"].values()) \
                and doc["drugs"] and "n_rows" in next(iter(doc["drugs"].values())):
            title = f"Dataset audit — {p.name}"
            rows = []
            for d, e in doc["drugs"].items():
                rows.append([d, e.get("n_rows"), e.get("n_isolates"),
                             e.get("n_bioprojects"), e.get("n_R"), e.get("n_S"),
                             e.get("derived_labels_primary_rule"),
                             e.get("dg_verdict", "")])
            body = (_kv_table({k: v for k, v in doc.items() if k != "drugs"})
                    + _table(["drug", "rows", "isolates", "bioprojects", "R", "S",
                              "derived labels", "DG verdict"], rows))
        elif "_meta" in doc and "drugs" in doc and isinstance(doc["drugs"], dict) \
                and doc["drugs"] and isinstance(next(iter(doc["drugs"].values())), dict) \
                and "S0" in next(iter(doc["drugs"].values())):
            title = f"Validation results — {p.name}"
            rows = []

            def _mrow(drug, split, mt, blk):
                m = blk.get("metrics", {})
                cov = blk.get("conformal_mondrian", {}) or {}
                ci = (blk.get("ci95", {}) or {}).get("AUROC")
                return [drug, split, mt, blk.get("n_test"),
                        m.get("AUROC"), f"[{ci[0]:.3f}, {ci[1]:.3f}]" if ci else "—",
                        m.get("CA"), m.get("VME"), m.get("ME"),
                        cov.get("coverage_overall"), cov.get("coverage_R"),
                        cov.get("mean_set_size"), cov.get("abstention")]

            for drug, d in doc["drugs"].items():
                for i, b in enumerate(d.get("S0") or []):
                    for mt, blk in sorted(b.items()):
                        rows.append(_mrow(drug, f"S0[{i}]", mt, blk))
                for k, b in sorted((d.get("S1") or {}).items()):
                    for mt, blk in sorted(b.items()):
                        rows.append(_mrow(drug, f"S1:{k}", mt, blk))
                if d.get("S2"):
                    for mt, blk in sorted(d["S2"].items()):
                        rows.append(_mrow(drug, "S2:forward-time", mt, blk))
                for k, b in sorted((d.get("S3") or {}).items()):
                    for mt, blk in sorted(b.items()):
                        rows.append(_mrow(drug, f"S3:{k}", mt, blk))
            body = (_kv_table({k: v for k, v in doc["_meta"].items()
                               if isinstance(v, (str, int, float))})
                    + _table(["drug", "split", "model", "n", "AUROC", "AUROC 95% CI",
                              "CA", "VME", "ME", "coverage", "coverage R",
                              "set size", "abstention"], rows)
                    + "<p class='meta'>Coverage target 0.90 (Mondrian conformal). "
                      "CIs are cluster-bootstrap 95%. S1/S3 evaluate shift: coverage "
                      "below target there is the audit finding, not a bug.</p>")
        else:
            title = f"Results — {p.name}"
            body = _json_to_tables(doc)
    else:  # TSV / txt
        lines = text.splitlines()
        title = f"{p.name}"
        if lines and lines[0].startswith(("drug\tsplit\tmodel", "biosample\t")):
            hdr = lines[0].split("\t")
            rows = [ln.split("\t") for ln in lines[1:2001]]
            body = (_table(hdr, rows)
                    + (f"<p class='meta'>Showing first 2000 of "
                       f"{max(0, len(lines) - 1)} rows.</p>"
                       if len(lines) > 2001 else ""))
        else:
            body = f"<pre>{_esc(text[:40000])}</pre>"
    return title, body


def render_html(inputs, out_path: str | Path, title: str = "lacuna audit report") -> Path:
    sections = []
    for p in inputs:
        try:
            t, b = detect_and_render(p)
        except Exception as e:  # noqa: BLE001 — a report must not die on one input
            t, b = Path(p).name, f"<p class='ruo warn'>Could not render: {_esc(e)}</p>"
        sections.append((t, b, str(p)))
    lic = license_report()
    parts = [
        "<!doctype html><html lang='en'><head><meta charset='utf-8'>",
        f"<title>{_esc(title)}</title><style>{_CSS}</style></head><body><main>",
        f"<h1>{_esc(title)}</h1>",
        f"<p class='meta'>Generated {datetime.now(timezone.utc).isoformat(timespec='seconds')} "
        f"by lacuna {_esc(__version__)} (fully offline).</p>",
        f"<p class='ruo'><b>{_esc(RUO)}</b> Not a diagnostic output. Breakpoint values "
        "are user-supplied (EUCAST/CLSI never bundled).</p>",
        "<h2>Contents</h2><ul>",
        *[f"<li><a href='#s{i}'>{_esc(t)}</a></li>" for i, (t, _, _) in enumerate(sections)],
        "</ul>",
    ]
    for i, (t, b, src) in enumerate(sections):
        parts.append(f"<h2 id='s{i}'>{_esc(t)}</h2>"
                     f"<p class='meta'>source: <code>{_esc(src)}</code></p>{b}")
    parts.append("<h2>Licence inventory</h2>")
    parts.append(_table(["component", "role", "licence", "posture"],
                        [[_esc(x["component"]), _esc(x["role"]), _esc(x["license"]),
                          _esc(x["posture"])] for x in lic["inventory"]]))
    parts.append("<h2>Notes</h2><ul>"
                 "<li>All numbers in this report are computed programmatically from the "
                 "cited files; none are hand-entered.</li>"
                 "<li>Conformal sets target 90% coverage; under lineage/origin shift "
                 "coverage can fall below target — see the S1/S3 sections.</li>"
                 "<li>This tool makes no clinical claims and must not guide patient care."
                 "</li></ul>")
    parts.append("</main></body></html>")
    out_path = Path(out_path)
    out_path.write_text("\n".join(parts))
    return out_path


def render_markdown(inputs, out_path: str | Path,
                    title: str = "lacuna audit report") -> Path:
    lines = [f"# {title}", "",
             f"Generated by lacuna {__version__} (fully offline).",
             "", f"> **{RUO}** Not a diagnostic output.", ""]
    for p in inputs:
        p = Path(p)
        lines += [f"## {p.name}", "", "```", p.read_text(errors="replace")[:20000], "```", ""]
    lines += ["## Licence inventory", "",
              "| component | role | licence | posture |", "|---|---|---|---|"]
    for x in license_report()["inventory"]:
        lines.append(f"| {x['component']} | {x['role']} | {x['license']} | {x['posture']} |")
    out_path = Path(out_path)
    out_path.write_text("\n".join(lines))
    return out_path
