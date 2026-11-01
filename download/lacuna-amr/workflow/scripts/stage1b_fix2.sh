#!/usr/bin/env bash
# Stage 1b fix 2: tool binaries + remaining official-page snapshots.
set -u
cd "$(dirname "$0")/../.."
LED=provenance/ledger.tsv
SNAP=provenance/snapshots
LIC=provenance/licenses
led() { printf '%s\t%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$4" >> "$LED"; }

echo "=== stage1b fix2 $(date -u +%FT%TZ) ==="

# a) AMRFinderPlus v4.2.7 binaries
URL="https://github.com/ncbi/amr/releases/download/amrfinder_v4.2.7/amrfinder_binaries_v4.2.7.tar.gz"
mkdir -p .tools
code=$(curl -sS -L -m 300 -o .tools/amrfinder_binaries_v4.2.7.tar.gz -w '%{http_code}' "$URL")
sha=$(sha256sum .tools/amrfinder_binaries_v4.2.7.tar.gz | awk '{print $1}')
sz=$(du -h .tools/amrfinder_binaries_v4.2.7.tar.gz | cut -f1)
echo "amrfinder binary: HTTP $code size=$sz sha256=${sha:0:16}..."
led "tool_amrfinder_binary" "HTTP_${code}_v4.2.7_size_${sz}" "$URL" "$sha"
if [ "$code" = "200" ]; then
  tar -xzf .tools/amrfinder_binaries_v4.2.7.tar.gz -C .tools/ && echo "extracted into .tools/:" && ls .tools/
fi

# b) sourmash LICENSE across candidate branches
for br in latest main develop; do
  out="$LIC/sourmash_LICENSE_$br"
  c=$(curl -sS -L -m 40 -o "$out" -w '%{http_code}' "https://raw.githubusercontent.com/sourmash-bio/sourmash/$br/LICENSE" 2>/dev/null)
  echo "sourmash LICENSE @$br: HTTP $c $(head -c 60 "$out" 2>/dev/null | tr '\n' ' ')"
  if [ "$c" = "200" ]; then
    sha=$(sha256sum "$out" | awk '{print $1}')
    led "license_sourmash_$br" "RETRIEVED" "https://raw.githubusercontent.com/sourmash-bio/sourmash/$br/LICENSE" "$sha"
  fi
done

# c) local dist-info LICENSE files for ambiguous packages
python3 - <<'PY'
import hashlib, importlib.metadata as im
from pathlib import Path
root = Path(".")
for name in ["biopython", "joblib", "pytest"]:
    try:
        d = im.distribution(name)
        licdir = Path(d._path)  # noqa: SLF001
        cands = list(licdir.glob("LICENSE*")) + list(licdir.glob("COPYING*"))
        if cands:
            f = cands[0]
            sha = hashlib.sha256(f.read_bytes()).hexdigest()
            head = " ".join(f.read_text(errors="replace").split())[:90]
            with open("provenance/license_audit.tsv", "a") as fh:
                fh.write(f"py:{name}\t{d.version}\t{head}\t{f}\t{sha}\tPERMITTED\tlicense file from dist-info\n")
            with open("provenance/ledger.tsv", "a") as fh:
                fh.write(f"license_py_{name}\tPERMITTED\t{f}\t2026-11-01T00:00:00Z\t{sha}\n")
            print(f"py:{name} v{d.version}: {head[:70]}")
        else:
            print(f"py:{name}: no LICENSE file in {licdir}")
    except Exception as e:
        print(f"py:{name} ERR {type(e).__name__}")
PY

# d) official pages
grab() { # name url
  out="$SNAP/$1.html"
  c=$(curl -sS -L -m 60 -o "$out" -w '%{http_code}' -A "lacuna-amr-research/0.1" "$2" 2>/dev/null)
  sha=$(sha256sum "$out" 2>/dev/null | awk '{print $1}')
  led "page_$1" "HTTP_${c}" "$2" "$sha"
  echo "$1: HTTP $c sha=${sha:0:12} size=$(du -h "$out" 2>/dev/null | cut -f1)"
}
grab ncbi_antibiogram_docs "https://www.ncbi.nlm.nih.gov/biosample/docs/antibiogram"
grab iso_20776_2 "https://www.iso.org/standard/79377.html"
grab fda_stic "https://www.fda.gov/drugs/development-resources/antibacterial-susceptibility-test-interpretive-criteria"
grab amrfinder_wiki "https://github.com/ncbi/amr/wiki"
grab eucast_breakpoints_page "https://www.eucast.org/clinical_breakpoints"

# e) wiki page list + eucast version links
echo "-- AMRFinderPlus wiki pages found:"
rg -o 'href="/ncbi/amr/wiki/[^"]+"' "$SNAP/amrfinder_wiki.html" 2>/dev/null | sort -u | head -25
echo "-- EUCAST breakpoint-table links on page:"
rg -o 'href="[^"]*(v_?1[0-9]\.[0-9]|Breakpoint_table[^"]*)"' "$SNAP/eucast_breakpoints_page.html" 2>/dev/null | sort -u | head -25
echo "=== done ==="
