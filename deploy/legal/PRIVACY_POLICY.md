# PRIVACY POLICY — LACUNA·AMR Console (TEMPLATE, NOT IN FORCE)

> **DRAFT — NOT LEGAL ADVICE, NOT EXECUTED.** Effective only when published by
> the registered entity. Written for a GDPR-style regime; adapt per the final
> jurisdiction with counsel.

**Last updated: 2026-11-09 (template revision 1)**

## 1. Controller

【legal entity name】, 【address】, 【privacy@ contact】.

## 2. What we store and why (data minimisation by design)

| Data | Stored where | Purpose | Retention |
|---|---|---|---|
| Account email, name, scrypt password hash | `User` table | Sign-in, organization membership | Until account closure |
| Session token hashes | `Session` table | httpOnly cookie sessions (7 days) | 7 days, sliding |
| Organization names/slugs, roles | `Organization`, `Membership` | Multi-tenant isolation | Until org deletion |
| Run records (drug, isolate accession, model outputs — **no personal data**) | `PredictRun`, `AuditRun`, `ValidateRun`, `BatchJob` | Traceability of every result | Until org deletion |
| API-key hashes (never the key) | `ApiKey` | Programmatic access | Until revocation + 【30 days】 |
| Audit-chain entries (action names, org slugs — deliberately NO names/emails in action details) | `AuditLog` | Tamper-evident record keeping | Until org deletion |
| Billing records (plan, invoice amounts, statuses — **no card data**) | `Billing*` tables | Subscription management | Statutory 【6/10】 years |
| Metrics (route, status, latency, request id — no payloads) | `MetricSample` | Operational monitoring | 【30】 days rolling |

Card data never touches our systems: in sandbox provider mode no payment data
exists; with Stripe, payment data is handled entirely by Stripe (PCI-DSS).

Isolate accessions (e.g. `SAMN…`) and AST labels are research data, not
personal data, but are treated with the same care.

## 3. Legal bases

- Contract: account, subscription and run data (Art. 6(1)(b)).
- Legitimate interest: security audit trail, metrics (Art. 6(1)(f)).
- Legal obligation: billing records.

## 4. Processors

【entity list — Stripe (payments), hosting provider, error tracking】 each
under a data-processing agreement. Current sandbox deployment processes
nothing externally.

## 5. Your rights

Access, rectification, erasure, portability, restriction, objection — email
【privacy@】. Organization owners can export run data (CSV/FHIR) from the
console. Security research is welcomed via 【security contact】.

## 6. International transfers

【describe hosting region and transfer mechanisms】.

## 7. Children

The Service is not directed at children under 【16/13】.

## 8. Breaches

Notified to the competent authority within 72 hours of becoming aware, and to
affected users where the risk is high.

## 9. Complaints

You may lodge a complaint with 【supervisory authority】.
