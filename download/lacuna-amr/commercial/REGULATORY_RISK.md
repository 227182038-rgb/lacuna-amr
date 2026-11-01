# REGULATORY POSITIONING MEMO, RISK REGISTER, DATA-PROTECTION CHECKLIST

## 1. Regulatory-positioning memo (RUO status)

Position: LACUNA-AMR and its services are **research use only (RUO)**. No diagnostic claims, no
clinical use, no regulatory pass/fail statements. This memo lists the questions a regulatory
consultant must answer; it makes no regulatory determinations.

Statements grounded in pages retrieved during this run (see provenance/ledger.tsv for hashes and
timestamps):
- ISO 20776-2:2021 (Edition 2, published 2021-12; retrieved via web gateway from
  https://www.iso.org/standard/79377.html): establishes acceptable performance criteria and
  evaluation procedures for AST devices determining MICs, against reference broth microdilution;
  the 2007 edition is withdrawn. Our descriptive metrics (CA, VME, ME) are reported with stated
  definitions only; the actual acceptance criteria are inside the paid standard and were NOT
  retrieved — therefore no pass/fail claims are made anywhere in this project.
- EUCAST v16.1 breakpoint tables (retrieved; "Version 16.1, valid from 2026-06-24"): used as
  user-supplied reference input; EUCAST documents remain EUCAST copyright (free reuse with
  citation; no resale) — never bundled.
- FDA "Antibacterial Susceptibility Test Interpretive Criteria" resource exists (search result
  retrieved 2026-11-01); the FDA page itself was bot-blocked (HTTP 401) and its content was NOT
  retrieved → details UNVERIFIED.
- NOT retrieved and therefore UNVERIFIED (consultant questions): (a) India: CDSCO /
  Medical Devices Rules 2017 classification of RUO software and audit services; whether an AMR
  audit service to pharma/diagnostics clients is a "clinical establishment" or "medical device"
  activity; (b) EU: MDR 2017/75 qualification rules for software providing diagnostic information
  vs RUO research tools; GDPR implications for isolate-linked data (country, year, source);
  (c) US: FDA position on RUO lab-developed software services; CLIA context for labs; whether S2
  audit reports could be construed as clinical decision support. Each question must be answered
  from the applicable official text before any commercial claim in that jurisdiction.

## 2. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Data licensing (submitter claims on GenBank records; EUCAST/CLSI terms) | medium | high | per-record provenance retained; no raw redistribution; license audit (provenance/license_audit.tsv); lawyer review before launch |
| R2 | Label quality of public AST (submitter-supplied, mixed standards, censored values) | high | high | the product measures this (S1 audits); analysis-label framing; H2 sensitivity |
| R3 | Liability for misread audit outputs | low | high | RUO framing, contract caps, no clinical claims |
| R4 | Reproducibility failures (seed sensitivity seen at pilot scale, gates/G5.md) | medium | medium | G5 gate in every engagement; report uncertainty honestly |
| R5 | Competition (free tools, in-house teams) | high | medium | independent-audit positioning; license-clean posture; publish methods |
| R6 | Single-founder / key-person risk | high | high | documented pipeline + frozen protocol + provenance ledger reduce bus factor; recruit second engineer before scaling |
| R7 | Regulatory reclassification of RUO software/services | low | high | consultant review (questions above); jurisdiction-specific claims deferred |
| R8 | Client data breach | low | high | local processing, deletion rules, checklist below |

## 3. Data-protection and security checklist

- [x] Store only fields needed: organism, collection year, country, source category, submitter,
      BioProject (protocol §13; data/cohort.tsv schema).
- [x] No re-identification attempts; public de-identified isolates only (protocol §13).
- [ ] Client-data retention/deletion schedule operationalised in the contract template (30-day
      default; service/SKU_SHEETS.md) — implement deletion SOP before first client.
- [ ] Local processing environment: disk encryption at rest for client data — NOT yet implemented
      on the pilot machine (documented gap).
- [ ] Access control list for client projects — single-founder setup documented; formalise before
      first client.
- [ ] Breach-notification procedure — to be drafted with counsel.
- [x] No network access required at run time by the toolkit (README; CLI design).
- [x] Provenance ledger for every retrieved artifact (provenance/ledger.tsv).
