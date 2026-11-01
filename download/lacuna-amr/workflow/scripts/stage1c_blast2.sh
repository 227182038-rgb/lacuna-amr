#!/usr/bin/env bash
# Stage 1c-3b: fix BLAST path, compile HMMER from eddylab.org, index AMRFinderPlus DB.
set -u
cd "$(dirname "$0")/../.."
led() { printf '%s\t%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$4" >> provenance/ledger.tsv; }
echo "=== stage1c-3b $(date -u +%FT%TZ) ==="
rm -f .tools/ncbi-blast-2.17.0+-x64-linux.tar.gz .tools/hmmer-3.4.tar.gz
export PATH="$PWD/.tools/ncbi-blast-2.17.0+/bin:$PATH"
echo "makeblastdb: $(command -v makeblastdb)"

echo "-- fetching HMMER from eddylab.org"
curl -sS -L -m 300 -o .tools/hmmer-3.4.tar.gz "http://eddylab.org/software/hmmer/hmmer-3.4.tar.gz" || \
  curl -sS -L -m 300 -o .tools/hmmer-3.4.tar.gz "https://eddylab.org/software/hmmer/hmmer-3.4.tar.gz"
echo "hmmer tarball: $(du -h .tools/hmmer-3.4.tar.gz | cut -f1)"
if tar -tzf .tools/hmmer-3.4.tar.gz >/dev/null 2>&1; then
  led tool_hmmer_tarball "DOWNLOADED_3.4_eddylab" "http://eddylab.org/software/hmmer/hmmer-3.4.tar.gz" "$(sha256sum .tools/hmmer-3.4.tar.gz | awk '{print $1}')"
  tar -xzf .tools/hmmer-3.4.tar.gz -C .tools/
  (cd .tools/hmmer-3.4 && ./configure --prefix="$PWD/../hmmer-local" > /tmp/hmmer_conf.log 2>&1 && make -j2 > /tmp/hmmer_make.log 2>&1 && make install > /tmp/hmmer_inst.log 2>&1 && echo "hmmer compiled and installed") || { echo "hmmer build FAILED"; tail -5 /tmp/hmmer_make.log 2>/dev/null; }
  export PATH="$PWD/.tools/hmmer-local/bin:$PATH"
else
  echo "hmmer tarball invalid"
  head -c 200 .tools/hmmer-3.4.tar.gz; echo
fi
echo "hmmscan: $(command -v hmmscan || echo MISSING)"

echo "-- indexing AMRFinderPlus DB"
./.tools/amrfinder_update --force_update --database .tools/amrdb 2>&1 | tail -4
DB=$(ls -d .tools/amrdb/*/ | tail -1)
echo "DB dir: $DB"
./.tools/amrfinder --database "$DB" --database_version 2>&1 | head -2
led amrfinder_db_version "$(.tools/amrfinder --database "$DB" --database_version 2>&1 | head -1)" "NCBI AMRFinderPlus FTP $DB" "$(sha256sum "$DB/version.txt" 2>/dev/null | awk '{print $1}')"
echo "-- curated organisms (target genera):"
./.tools/amrfinder --database "$DB" --list_organisms 2>&1 | tee .tools/amrfinder_organisms.txt | rg -i 'kleb|escher|acinet' | head
echo "-- total curated organisms: $(wc -l < .tools/amrfinder_organisms.txt)"
echo "=== done ==="
