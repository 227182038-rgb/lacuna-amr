#!/usr/bin/env bash
# LACUNA-AMR stage 0: network reachability probe.
# Saves raw snapshots + SHA-256 into provenance/ and appends to provenance/ledger.tsv
set -u
cd "$(dirname "$0")/../.."
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LED=provenance/ledger.tsv
SNAP=provenance/snapshots
mkdir -p "$SNAP" logs
[ -f "$LED" ] || printf 'key\tvalue\tsource\tretrieved_utc\tsha256\n' > "$LED"
{
echo "=== stage 0 network probe $TS ==="
probe() {
  local name="$1" url="$2"
  local out="$SNAP/stage0_${name}.out"
  local code
  code=$(curl -sS -L -m 40 -o "$out" -w '%{http_code}' \
        -A 'lacuna-amr-research-probe/0.1 (automated provenance-capture; single run)' "$url" 2>"$out.err") || code="ERR"
  local sha
  sha=$(sha256sum "$out" 2>/dev/null | awk '{print $1}')
  [ -z "$sha" ] && sha="EMPTY"
  printf 'stage0_probe_%s\tHTTP_%s\t%s\t%s\t%s\n' "$name" "$code" "$url" "$TS" "$sha" >> "$LED"
  echo "$code  $url  sha256=${sha:0:12}..."
  sleep 0.6
}
probe eutils_einfo        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi"
probe crossref_sample     "https://api.crossref.org/works/10.1038/s41598-021-91456-0"
probe pypi_index          "https://pypi.org/simple/"
probe pypi_lacuna         "https://pypi.org/pypi/lacuna/json"
probe github_api          "https://api.github.com"
probe eucast_home         "https://www.eucast.org/"
probe ncbi_ftp_results    "https://ftp.ncbi.nlm.nih.gov/pathogen/Results/"
probe biosample_antibiogram "https://www.ncbi.nlm.nih.gov/biosample/?term=antibiogram%5bfilter%5d"
probe ncbi_policies       "https://www.ncbi.nlm.nih.gov/home/about/policies/"
echo "=== stage 0 network probe done $TS ==="
} 2>&1 | tee logs/stage0_network.log
