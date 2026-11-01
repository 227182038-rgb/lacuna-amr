#!/usr/bin/env bash
# Stage 1c-3: install BLAST+ and HMMER for AMRFinderPlus, then index the DB and
# record database version + curated organism list.
set -u
cd "$(dirname "$0")/../.."
led() { printf '%s\t%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$4" >> provenance/ledger.tsv; }
echo "=== stage1c-3 blast/hmmer setup $(date -u +%FT%TZ) ==="
echo "uid: $(id -u 2>/dev/null || echo '?')"

# 1) try apt
if command -v apt-get >/dev/null 2>&1; then
  if apt-get -s install -y ncbi-blast+ hmmer >/dev/null 2>&1; then
    echo "apt simulation OK -> installing"
    if apt-get install -y ncbi-blast+ hmmer >/dev/null 2>&1; then
      echo "apt install OK: makeblastdb=$(command -v makeblastdb) hmmscan=$(command -v hmmscan)"
    else
      echo "apt install FAILED (no root?)"
    fi
  else
    echo "apt simulation failed"
  fi
fi

# 2) fallback: NCBI FTP BLAST+ + GitHub HMMER
if ! command -v makeblastdb >/dev/null 2>&1; then
  echo "downloading BLAST+ from NCBI FTP..."
  curl -sS -m 30 https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/ 2>/dev/null | rg -o 'ncbi-blast-[0-9.]+\+-x64-linux\.tar\.gz' | sort -u | head -3
  BL=$(curl -sS -m 30 https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/ 2>/dev/null | rg -o 'ncbi-blast-[0-9.]+\+-x64-linux\.tar\.gz' | sort -u | tail -1)
  if [ -n "$BL" ]; then
    curl -sS -L -m 480 -o ".tools/$BL" "https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/$BL"
    echo "blast tarball: $(du -h ".tools/$BL" | cut -f1)"
    led tool_blast_tarball "DOWNLOADED_$BL" "https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/$BL" "$(sha256sum ".tools/$BL" | awk '{print $1}')"
    tar -xzf ".tools/$BL" -C .tools/
    BLDIR=$(echo ".tools/ncbi-blast-"*"-x64-linux/bin")
    export PATH="$BLDIR:$PATH"
    echo "blast at: $BLDIR makeblastdb=$(command -v makeblastdb)"
  fi
fi

if ! command -v hmmscan >/dev/null 2>&1; then
  echo "downloading HMMER 3.4 from GitHub releases..."
  curl -sS -L -m 300 -o .tools/hmmer-3.4.tar.gz "https://github.com/EddyRivasLab/hmmer/releases/download/v3.4/hmmer-3.4.tar.gz" \
    && echo "hmmer tarball: $(du -h .tools/hmmer-3.4.tar.gz | cut -f1)"
  if [ -f .tools/hmmer-3.4.tar.gz ] && [ "$(du -h .tools/hmmer-3.4.tar.gz | cut -f1 | tr -d 'M ')" -gt 1 ] 2>/dev/null; then
    led tool_hmmer_tarball "DOWNLOADED_3.4" "https://github.com/EddyRivasLab/hmmer/releases/download/v3.4/hmmer-3.4.tar.gz" "$(sha256sum .tools/hmmer-3.4.tar.gz | awk '{print $1}')"
    tar -xzf .tools/hmmer-3.4.tar.gz -C .tools/
    (cd .tools/hmmer-3.4 && ./configure --prefix="$PWD/../hmmer-local" >/dev/null 2>&1 && make -j2 >/dev/null 2>&1 && make install >/dev/null 2>&1 && echo "hmmer compiled")
    [ -d .tools/hmmer-local/bin ] && export PATH="$PWD/.tools/hmmer-local/bin:$PATH"
    echo "hmmscan=$(command -v hmmscan)"
  fi
fi

echo "makeblastdb: $(command -v makeblastdb || echo MISSING)"
echo "hmmscan:    $(command -v hmmscan || echo MISSING)"

# 3) re-run amrfinder update to index the DB
if command -v makeblastdb >/dev/null 2>&1 && command -v hmmscan >/dev/null 2>&1; then
  ./.tools/amrfinder_update --force_update --database .tools/amrdb 2>&1 | tail -4
  DB=$(ls -d .tools/amrdb/*/ 2>/dev/null | tail -1)
  echo "DB dir: $DB"
  ./.tools/amrfinder --database "$DB" --database_version 2>&1 | head -3
  led amrfinder_db_version "$(.tools/amrfinder --database "$DB" --database_version 2>&1 | head -1)" "NCBI AMRFinderPlus FTP" "$(sha256sum "$DB/version.txt" 2>/dev/null | awk '{print $1}')"
  echo "--- curated organisms (Klebsiella-related rows):"
  ./.tools/amrfinder --database "$DB" --list_organisms 2>&1 | tee .tools/amrfinder_organisms.txt | rg -i 'kleb|escher|acinet|salmon' | head
  echo "--- total curated organisms: $(wc -l < .tools/amrfinder_organisms.txt 2>/dev/null)"
fi
echo "=== done ==="
