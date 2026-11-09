# DATA PROCESSING AGREEMENT — LACUNA·AMR Enterprise Engagements (TEMPLATE)

> **DRAFT — NOT LEGAL ADVICE, NOT EXECUTED.** Annex to an Enterprise engagement
> order form (S2/S3 service SKUs). Written for GDPR-style requirements; adapt
> with counsel per jurisdiction.

**Parties:** 【legal entity name】 ("Processor") and 【customer entity】
("Controller"). **Effective:** 【date】. **Services:** the LACUNA·AMR console,
API and audit services described in Order Form 【ref】.

## 1. Subject matter and duration

Processor processes Controller's antimicrobial-resistance research data
(isolate accessions, AST tables, run outputs) solely to provide the Services,
for the duration of the engagement plus 【90】 days of wind-down export.

## 2. Roles

Controller determines purposes and means; Processor acts on documented
instructions only (this DPA + the console's configured workflows). The
scientific core runs deterministically and offline; no run data is used to
train models for other customers.

## 3. Security measures (Art. 32)

- scrypt password hashing; httpOnly session cookies; per-organization data
  isolation enforced server-side (organization identity derives only from
  session cookies or API-key hashes, never request bodies)
- hash-chained, append-only audit trail with one-click verification
- HMAC-SHA256-signed webhooks both directions
- TLS in transit (Caddy/Let's Encrypt); at rest via managed-database
  encryption 【confirm per host】
- nightly encrypted backups with weekly restore drills
- structured request logs with request IDs for incident forensics

## 4. Sub-processors

Current list: 【hosting】, 【Stripe — payment metadata only】, 【error
tracking】. Controller is notified 【30】 days before changes and may object.

## 5. Controller rights and assistance

Export of Controller's data (CSV/FHIR/JSON) at any time from the console or on
request. Assistance with data-subject requests within 【10】 business days.

## 6. Personal data

The Services are designed for pathogen/AST research data, not personal data.
If Controller transmits personal data nevertheless, Controller warrants a
lawful basis and instructs Processor to treat it as Controller data under this
DPA; Processor applies the same security measures.

## 7. Breach notification

Without undue delay, within 48 hours of Processor becoming aware, to
【security contact of Controller】.

## 8. Deletion on termination

All Controller data (runs, keys, memberships, audit entries attributable to
the organization) deleted within 【90】 days of termination except where
retention is legally required; deletion certificate on request.

## 9. Audits

Annual audit summary (uptime, incident history, restore-drill results)
provided on request; on-site/regulatory audits by appointment.

## 10. Governing law

【jurisdiction】, matching the Master Terms.
