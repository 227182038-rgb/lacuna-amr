"""Provenance manifest (SHA-256 per file) and SPDX SBOM generation.

All artefact integrity in lacuna flows through :func:`provenance_hash`; the
SBOM is generated programmatically from the *installed* environment at run
time (never hand-typed).
"""
from __future__ import annotations

import csv
import datetime as _dt
import hashlib
import json
from pathlib import Path
from typing import Iterable

from ._version import __version__

RUNTIME_DEPS = ("numpy", "scipy", "scikit-learn", "pandas", "joblib")


def provenance_hash(path: str | Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def write_manifest(paths: Iterable[Path], out_path: str | Path,
                   base: Path | None = None) -> None:
    base = base or Path(".")
    with open(out_path, "w", newline="") as fh:
        w = csv.writer(fh, delimiter="\t")
        w.writerow(["path", "sha256", "bytes"])
        for p in sorted(paths):
            w.writerow([str(Path(p).relative_to(base)), provenance_hash(p),
                        Path(p).stat().st_size])


def generate_sbom(out_path: str | Path, name: str = "lacuna-amr",
                  extra_files: Iterable[Path] = ()) -> dict:
    """SPDX 2.3 JSON SBOM for the package + its runtime dependencies, built
    from importlib.metadata (programmatic, R3: no hand-typed versions)."""
    from importlib import metadata

    def _pkg(pid: str) -> dict:
        try:
            m = metadata.distribution(pid)
        except metadata.PackageNotFoundError:
            return {"name": pid, "versionInfo": "NOT-INSTALLED"}
        lic_lines = (m.metadata.get("License") or "").strip().splitlines()
        lic = lic_lines[0][:80] if lic_lines else ""
        return {
            "name": m.metadata["Name"],
            "versionInfo": m.version,
            **({"licenseConcluded": lic} if lic else {}),
            "downloadLocation": f"https://pypi.org/project/{pid}/",
            "filesAnalyzed": False,
        }

    created = _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")
    doc = {
        "spdxVersion": "SPDX-2.3",
        "dataLicense": "CC0-1.0",
        "SPDXID": "SPDXRef-DOCUMENT",
        "name": name,
        "documentNamespace": f"https://lacuna.invalid/spdx/{name}-{__version__}",
        "creationInfo": {
            "created": created,
            "creators": [f"Tool: lacuna {__version__}"],
            "licenseListVersion": "not-used",
        },
        "packages": [
            {
                "SPDXID": "SPDXRef-Package-lacuna",
                "name": name,
                "versionInfo": __version__,
                "licenseConcluded": "Apache-2.0",
                "licenseDeclared": "Apache-2.0",
                "downloadLocation": "NOASSERTION",
                "filesAnalyzed": False,
                "copyrightText": "NOASSERTION",
                "summary": ("License-clean local auditing of genome-based "
                            "antimicrobial-resistance predictions (RUO)"),
            },
            *({"SPDXID": f"SPDXRef-Package-{i}", **_pkg(d)}  # type: ignore[misc]
              for i, d in enumerate(sorted(RUNTIME_DEPS))),
        ],
        "relationships": [
            {"spdxElementId": "SPDXRef-DOCUMENT",
             "relatedSpdxElement": "SPDXRef-Package-lacuna",
             "relationshipType": "DESCRIBES"},
            *({"spdxElementId": "SPDXRef-Package-lacuna",
               "relatedSpdxElement": f"SPDXRef-Package-{i}",
               "relationshipType": "DEPENDS_ON"}  # type: ignore[misc]
              for i in range(len(RUNTIME_DEPS))),
        ],
        "annotations": [
            {"annotationDate": created, "annotationType": "REVIEW",
             "annotator": f"Tool: lacuna {__version__}",
             "comment": ("External binaries deliberately not distributed: AMRFinderPlus "
                         "(public domain), pyseer (Apache-2.0). EUCAST/CLSI breakpoint "
                         "values are never bundled.")},
        ],
    }
    extra = [str(p) for p in extra_files]
    if extra:
        doc["annotations"].append({
            "annotationDate": created, "annotationType": "OTHER",
            "annotator": f"Tool: lacuna {__version__}",
            "comment": "Manifested files: " + ", ".join(sorted(extra))})
    Path(out_path).write_text(json.dumps(doc, indent=2))
    return doc
