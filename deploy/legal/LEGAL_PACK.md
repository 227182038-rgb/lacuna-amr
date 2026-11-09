# LACUNA-AMR — Legal Pack (Phase 1, v0.5.0)

**Status: TEMPLATES ONLY.** These documents are working drafts for counsel review.
They are not legal advice, are not executed, and create no obligations. The
Phase 1 legal-entity workstream (roadmap Table 6) ends with an entity that can
legally accept Stripe charges; until then billing stays in sandbox provider
mode (see `protocol/DEVIATIONS.md` D-042/D-047).

| File | Purpose | Blocked on |
|---|---|---|
| `TERMS_OF_SERVICE.md` | Console + API terms (RUO, no diagnostic use) | Entity registration, counsel review |
| `PRIVACY_POLICY.md` | What the console stores and why | Entity registration, counsel review |
| `DATA_PROCESSING_AGREEMENT.md` | DPA template for enterprise engagements (S2/S3) | Entity registration, counsel review |
| `INCORPORATION_CHECKLIST.md` | Concrete next actions to unblock the above | Founder decision (jurisdiction) |

## Placement in the console

The Compliance section of the console links to these filenames; the sign-up
dialog states that accounts are stored in this environment only.

## Hard boundaries these documents must preserve

1. **Research Use Only.** No clinical, diagnostic or treatment claims anywhere.
2. **No breakpoint redistribution.** EUCAST tables are user-supplied; the terms
   must not imply a license to redistribute breakpoint tables through us.
3. **Open-core honesty.** The Apache-2.0 package is the reference
   implementation; paid tiers buy orchestration, support and entitlements —
   never a "better" science core.
4. **Data minimisation.** The audit trail already avoids storing names/emails
   in action details; the privacy policy documents this.
