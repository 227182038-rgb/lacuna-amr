# INCORPORATION CHECKLIST — LACUNA·AMR Phase 1 Legal Entity (v0.5.0)

Purpose: roadmap Table 6, Legal entity workstream — exit criterion
**"Stripe can legally accept charges."** This is a real-world action list; the
code side (sandbox → Stripe switch) is already shipped and needs only the
entity + live keys.

## 1. Decide the vehicle (founder decision, ~1 week)

- [ ] Pick jurisdiction. Default candidate: 【e.g. a Delaware C-Corp or an EU
      equivalent】. Considerations: who the design partners are (Phase 2),
      where grants/procurement money can land, GDPR exposure of the hosted
      console.
- [ ] Pick entity name (keep "LACUNA" trademarkable: search 【tm database】).
- [ ] Cap table + founders' agreement signed before any Stripe account.

## 2. Register (2–6 weeks, jurisdiction-dependent)

- [ ] File formation documents; get registration number.
- [ ] Registered agent + address.
- [ ] Open a business bank account (needed for Stripe payouts).
- [ ] Book an accountant for VAT/sales-tax obligations (EU: OSS or local VAT
      for SaaS; US: sales-tax nexus review).

## 3. Legal documents (with counsel, 2–4 weeks, can overlap)

- [ ] Counsel review of `TERMS_OF_SERVICE.md`, `PRIVACY_POLICY.md`,
      `DATA_PROCESSING_AGREEMENT.md` (templates in this folder).
- [ ] Fill every 【…】 placeholder; publish ToS + Privacy at the console domain.
- [ ] Export compliance check (pathogen data is usually not export-controlled,
      but counsel confirms per jurisdiction; document the analysis).
- [ ] RUO positioning statement reviewed against local medical-device rules
      (EU AI Act / MDR timelines from the roadmap's Phase 3).

## 4. Billing go-live (days, after entity exists)

- [ ] Create Stripe account as the legal entity; accept ToS; verify bank.
- [ ] Enable Checkout + webhooks (endpoint: `https://<domain>/api/webhooks/vecura`
      pattern — actually `/api/billing` actions; Stripe webhook receiver wiring
      is the remaining code task, see DEVIATIONS D-042).
- [ ] Set `STRIPE_SECRET_KEY` in production `.env` (test-mode keys first).
- [ ] Run the Phase 1 billing E2E (`scripts/phase1-e2e.sh`) with the provider
      badge confirming `stripe` mode, using Stripe test cards.
- [ ] Price book: Community $0, Lab $290/mo, Enterprise per-engagement
      (matches `src/lib/lacuna/billing.ts` PLANS).

## 5. Track in the roadmap

Once items 1–4 are done, update `protocol/DEVIATIONS.md` D-042/D-047 from
"blocked on entity" to "live", and flip the roadmap Phase 1 exit criterion.

**Honest status (2026-11-09):** none of the above has been executed — the
sandbox cannot register companies. Billing therefore runs in sandbox provider
mode with the full lifecycle exercised against the real database.
