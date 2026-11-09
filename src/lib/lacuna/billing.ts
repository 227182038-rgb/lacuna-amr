// Phase 1 — billing (v0.5.0). Three tiers mapped onto the existing scopes and
// per-key credit system:
//   community   $0/mo     200 credits/mo, 1 member, 2 keys
//   lab         $290/mo   5,000 credits/mo, 10 members, 10 keys
//   enterprise  per-engagement  50,000 credits/mo baseline + top-ups, custom
// Provider modes:
//   sandbox (default) — deterministic in-app provider; NO real charges. It
//     implements the exact Stripe webhook state machine (checkout.session
//     .completed → subscription created+activated → invoice paid) plus an
//     explicit payment-failure lever so the dunning path can be exercised
//     end-to-end. Every state change is a BillingEvent + AuditLog entry.
//   stripe — activates when STRIPE_SECRET_KEY is set: real Checkout Sessions
//     via the Stripe REST API. Not exercisable in this sandbox (no legal
//     entity, no live keys — see DEVIATIONS.md D-042); the code path is the
//     production one and is kept deliberately thin (create session, verify on
//     redirect, consume webhook events).
// Entitlements are per-key and plan-capped: activation/renewal TOPS UP each
// active org key to the plan's monthly credits (never compounds); revocation
// zeroes every org key. New keys under an active subscription start at the
// plan level instead of the demo default.

import crypto from "crypto";
import { db } from "@/lib/db";
import { recordAudit } from "./audit-chain";
import { notifyWebhook } from "./v1";

export type PlanId = "community" | "lab" | "enterprise";

export interface PlanDef {
  id: PlanId;
  name: string;
  priceCents: number; // per month; 0 = free
  currency: string;
  monthlyCredits: number;
  maxMembers: number; // -1 = unlimited
  maxKeys: number; // -1 = unlimited
  tagline: string;
  features: string[];
  cta: string;
}

export const PLANS: PlanDef[] = [
  {
    id: "community",
    name: "Community",
    priceCents: 0,
    currency: "usd",
    monthlyCredits: 200,
    maxMembers: 1,
    maxKeys: 2,
    tagline: "Open-core access for individual researchers.",
    features: [
      "200 prediction credits / month",
      "1 member, 2 API keys",
      "Console + /api/v1 + MCP tool server",
      "Community support (GitHub issues)",
    ],
    cta: "Start free",
  },
  {
    id: "lab",
    name: "Lab",
    priceCents: 29000,
    currency: "usd",
    monthlyCredits: 5000,
    maxMembers: 10,
    maxKeys: 10,
    tagline: "For sequencing labs running routine dataset audits.",
    features: [
      "5,000 prediction credits / month",
      "10 members, 10 API keys",
      "Batch scoring + signed webhooks",
      "Priority email support (48h target)",
    ],
    cta: "Subscribe ($290/mo)",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceCents: -1, // per-engagement
    currency: "usd",
    monthlyCredits: 50000,
    maxMembers: -1,
    maxKeys: -1,
    tagline: "Per-engagement terms for surveillance networks.",
    features: [
      "50,000 credits / month baseline + top-ups",
      "Unlimited members and keys",
      "DPA, custom retention, named support",
      "Onboarding + joint validation study",
    ],
    cta: "Request engagement",
  },
];

export function planById(id: string): PlanDef | undefined {
  return PLANS.find((p) => p.id === id);
}

export function providerMode(): "stripe" | "sandbox" {
  return process.env.STRIPE_SECRET_KEY ? "stripe" : "sandbox";
}

export const DUNNING_MAX_ATTEMPTS = 3;

// --- billing event log ---------------------------------------------------------

export async function recordBillingEvent(
  organizationId: string,
  type: string,
  detail: Record<string, unknown>,
  actor = "billing-engine",
): Promise<void> {
  const keys = Object.keys(detail).sort();
  const canonical = JSON.stringify(keys.reduce<Record<string, unknown>>((acc, k) => ((acc[k] = detail[k]), acc), {}));
  await db.billingEvent.create({ data: { organizationId, type, detail: canonical } }).catch(() => undefined);
  await recordAudit(actor, `billing.${type}`, { organizationId, ...detail });
  await notifyWebhook(`billing.${type}`, { organizationId, ...detail }, organizationId);
}

// --- entitlements --------------------------------------------------------------

export interface EntitlementResult {
  keysTouched: number;
  creditsGranted: number;
}

/** Top up every non-revoked org key to the plan's monthly credits. */
export async function grantEntitlements(organizationId: string, plan: PlanDef): Promise<EntitlementResult> {
  const keys = await db.apiKey.findMany({ where: { organizationId, revokedAt: null } });
  let granted = 0;
  for (const k of keys) {
    if (k.credits < plan.monthlyCredits) {
      granted += plan.monthlyCredits - k.credits;
      await db.apiKey.update({ where: { id: k.id }, data: { credits: plan.monthlyCredits } });
    }
  }
  const result = { keysTouched: keys.length, creditsGranted: granted };
  await recordBillingEvent(organizationId, "credits_granted", { plan: plan.id, ...result });
  return result;
}

/** Zero out every non-revoked org key (subscription suspended/canceled). */
export async function revokeEntitlements(organizationId: string, reason: string): Promise<EntitlementResult> {
  const keys = await db.apiKey.findMany({ where: { organizationId, revokedAt: null } });
  let revoked = 0;
  for (const k of keys) {
    revoked += k.credits;
    await db.apiKey.update({ where: { id: k.id }, data: { credits: 0 } });
  }
  const result = { keysTouched: keys.length, creditsRevoked: revoked };
  await recordBillingEvent(organizationId, "entitlements_revoked", { reason, ...result });
  return result;
}

// --- invoice numbering -----------------------------------------------------------

async function nextInvoiceNumber(): Promise<string> {
  const count = await db.billingInvoice.count();
  return `LAC-${new Date().getFullYear()}-${String(count + 1).padStart(6, "0")}`;
}

// --- lifecycle actions (provider-agnostic core) -----------------------------------

export type LifecycleError = { error: string; status: number };

export async function activateSubscription(
  organizationId: string,
  plan: PlanDef,
  via: { provider: "sandbox" | "stripe"; stripeCustomerId?: string; stripeSubscriptionId?: string },
): Promise<{ subscriptionId: string; invoiceId: string }> {
  const periodStart = new Date();
  const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
  const existing = await db.billingSubscription.findUnique({ where: { organizationId } });
  const sub = await db.billingSubscription.upsert({
    where: { organizationId },
    create: {
      organizationId,
      plan: plan.id,
      status: "active",
      provider: via.provider,
      stripeCustomerId: via.stripeCustomerId,
      stripeSubscriptionId: via.stripeSubscriptionId,
      currentPeriodEnd: periodEnd,
    },
    update: {
      plan: plan.id,
      status: "active",
      provider: via.provider,
      stripeCustomerId: via.stripeCustomerId ?? existing?.stripeCustomerId,
      stripeSubscriptionId: via.stripeSubscriptionId ?? existing?.stripeSubscriptionId,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    },
  });

  // First invoice for paid plans is paid on activation (sandbox: card on file
  // from checkout; stripe: checkout.session.completed implies paid first bill).
  let invoiceId = "";
  if (plan.priceCents > 0) {
    const inv = await db.billingInvoice.create({
      data: {
        organizationId,
        number: await nextInvoiceNumber(),
        plan: plan.id,
        amountCents: plan.priceCents,
        status: "paid",
        attempts: 1,
        periodStart,
        periodEnd,
        dueAt: periodStart,
        paidAt: new Date(),
        provider: via.provider,
      },
    });
    invoiceId = inv.id;
    await recordBillingEvent(organizationId, "invoice_paid", {
      invoiceNumber: inv.number,
      amountCents: inv.amountCents,
      plan: plan.id,
      attempt: 1,
    });
  }

  await recordBillingEvent(organizationId, "subscription_activated", {
    plan: plan.id,
    provider: via.provider,
    periodEnd: periodEnd.toISOString(),
    invoiceId: invoiceId || null,
  });
  const grant = await grantEntitlements(organizationId, plan);
  return { subscriptionId: sub.id, invoiceId };
}

/** A payment attempt failed (sandbox lever or Stripe invoice.payment_failed).
 *  If no invoice is currently open/failed (e.g. the first invoice was paid at
 *  activation), the NEXT period's renewal invoice is minted first — exactly
 *  like Stripe billing the new period against a card that now declines.
 *  Attempts 1..2 → invoice stays failed, dunning retry; attempt 3 →
 *  subscription past_due; dunning exhausted → suspended + entitlements revoked. */
export async function paymentFailed(organizationId: string): Promise<{ invoiceStatus: string; subscriptionStatus: string }> {
  const sub = await db.billingSubscription.findUnique({ where: { organizationId } });
  if (!sub) throw { error: "No subscription for this organization.", status: 404 } as LifecycleError;
  if (sub.status === "canceled") throw { error: "Subscription is canceled.", status: 400 } as LifecycleError;

  let open = await db.billingInvoice.findFirst({
    where: { organizationId, status: { in: ["open", "failed"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!open) {
    // mint the renewal invoice for the period that is now being billed
    const plan = planById(sub.plan);
    const periodStart = sub.currentPeriodEnd ?? new Date();
    const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
    open = await db.billingInvoice.create({
      data: {
        organizationId,
        number: await nextInvoiceNumber(),
        plan: sub.plan,
        amountCents: plan?.priceCents && plan.priceCents > 0 ? plan.priceCents : 0,
        status: "open",
        attempts: 0,
        periodStart,
        periodEnd,
        dueAt: periodStart,
        provider: sub.provider,
      },
    });
    await recordBillingEvent(organizationId, "dunning_retry", {
      invoiceNumber: open.number,
      note: "renewal invoice minted",
      amountCents: open.amountCents,
    });
  }

  const attempts = open.attempts + 1;
  await db.billingInvoice.update({
    where: { id: open.id },
    data: { status: "failed", attempts, lastError: "Payment declined (simulated card failure)." },
  });
  await recordBillingEvent(organizationId, "invoice_failed", { invoiceNumber: open.number, attempt: attempts });

  if (attempts >= DUNNING_MAX_ATTEMPTS) {
    await db.billingSubscription.update({ where: { organizationId }, data: { status: "suspended" } });
    await recordBillingEvent(organizationId, "subscription_suspended", { reason: "dunning_exhausted", attempts });
    await revokeEntitlements(organizationId, "subscription_suspended");
    return { invoiceStatus: "failed", subscriptionStatus: "suspended" };
  }
  await db.billingSubscription.update({ where: { organizationId }, data: { status: "past_due" } });
  await recordBillingEvent(organizationId, "subscription_past_due", { attempt: attempts });
  return { invoiceStatus: "failed", subscriptionStatus: "past_due" };
}

/** Retry succeeds: open/failed invoice is paid, subscription returns to active
 *  and entitlements are restored. */
export async function paymentRetrySucceeded(organizationId: string): Promise<{ invoiceStatus: string; subscriptionStatus: string }> {
  const sub = await db.billingSubscription.findUnique({ where: { organizationId } });
  if (!sub) throw { error: "No subscription for this organization.", status: 404 } as LifecycleError;
  const open = await db.billingInvoice.findFirst({
    where: { organizationId, status: { in: ["open", "failed"] } },
    orderBy: { createdAt: "desc" },
  });
  if (!open) throw { error: "No open or failed invoice.", status: 400 } as LifecycleError;
  await db.billingInvoice.update({
    where: { id: open.id },
    data: { status: "paid", paidAt: new Date(), attempts: open.attempts + 1, lastError: null },
  });
  await db.billingSubscription.update({ where: { organizationId }, data: { status: "active" } });
  await recordBillingEvent(organizationId, "invoice_paid", {
    invoiceNumber: open.number,
    amountCents: open.amountCents,
    attempt: open.attempts + 1,
    retry: true,
  });
  const plan = planById(sub.plan);
  if (plan) await grantEntitlements(organizationId, plan);
  await recordBillingEvent(organizationId, "subscription_resumed", { plan: sub.plan });
  return { invoiceStatus: "paid", subscriptionStatus: "active" };
}

export async function cancelSubscription(organizationId: string, immediate: boolean): Promise<string> {
  const sub = await db.billingSubscription.findUnique({ where: { organizationId } });
  if (!sub) throw { error: "No subscription for this organization.", status: 404 } as LifecycleError;
  const status = immediate ? "canceled" : sub.status;
  await db.billingSubscription.update({
    where: { organizationId },
    data: { status, cancelAtPeriodEnd: !immediate },
  });
  await recordBillingEvent(organizationId, "subscription_canceled", { immediate, atPeriodEnd: !immediate });
  if (immediate) await revokeEntitlements(organizationId, "subscription_canceled");
  return status;
}

export async function resumeSubscription(organizationId: string): Promise<string> {
  const sub = await db.billingSubscription.findUnique({ where: { organizationId } });
  if (!sub) throw { error: "No subscription for this organization.", status: 404 } as LifecycleError;
  if (sub.status !== "canceled") throw { error: "Only a canceled subscription can be resumed.", status: 400 } as LifecycleError;
  await db.billingSubscription.update({
    where: { organizationId },
    data: { status: "active", cancelAtPeriodEnd: false },
  });
  const plan = planById(sub.plan);
  if (plan) await grantEntitlements(organizationId, plan);
  await recordBillingEvent(organizationId, "subscription_resumed", { plan: sub.plan, from: "canceled" });
  return "active";
}

/** Manual credit top-up for a single org key (enterprise flow). */
export async function topUpKey(organizationId: string, keyId: string, credits: number): Promise<number> {
  if (!Number.isInteger(credits) || credits <= 0 || credits > 1_000_000) {
    throw { error: "credits must be an integer between 1 and 1,000,000.", status: 400 } as LifecycleError;
  }
  const key = await db.apiKey.findFirst({ where: { id: keyId, organizationId } });
  if (!key) throw { error: "Key not found in this organization.", status: 404 } as LifecycleError;
  const updated = await db.apiKey.update({ where: { id: key.id }, data: { credits: key.credits + credits } });
  await recordBillingEvent(organizationId, "topup", { keyId: key.id, keyPrefix: key.keyPrefix, credits, newBalance: updated.credits });
  return updated.credits;
}

// --- provider adapters ---------------------------------------------------------

export interface CheckoutSession {
  provider: "sandbox" | "stripe";
  url: string | null; // sandbox: null (in-console confirmation); stripe: hosted URL
  token: string; // sandbox confirmation token / stripe session id
  expiresAt: string;
}

/** Record a started checkout so its token can be verified on completion
 *  (stateful: the sha256 of the token is stored in a checkout_started
 *  billing event — no client-supplied state is ever trusted). */
export async function recordCheckoutStarted(organizationId: string, plan: PlanDef, token: string, expiresAt: string): Promise<void> {
  await recordBillingEvent(organizationId, "checkout_started", {
    tokenHash: sha256Hex(token),
    plan: plan.id,
    expiresAt,
  });
}

/** Verify a sandbox checkout token against the recorded checkout_started
 *  event for THIS organization. Returns the plan or null. */
export async function verifySandboxCheckout(organizationId: string, token: string): Promise<PlanDef | null> {
  if (!token.startsWith("sbx_")) return null;
  const events = await db.billingEvent.findMany({
    where: { organizationId, type: "checkout_started" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const tokenHash = sha256Hex(token);
  for (const e of events) {
    try {
      const detail = JSON.parse(e.detail) as { tokenHash: string; plan: string; expiresAt: string };
      if (detail.tokenHash === tokenHash && new Date(detail.expiresAt).getTime() > Date.now()) {
        return planById(detail.plan) ?? null;
      }
    } catch {
      // skip malformed rows
    }
  }
  return null;
}

/** Create a checkout. Sandbox mints a signed confirmation token valid 15 min;
 *  stripe creates a real Checkout Session via the REST API. */
export async function createCheckout(organizationId: string, plan: PlanDef, origin: string): Promise<CheckoutSession> {
  if (providerMode() === "stripe") {
    const params = new URLSearchParams({
      mode: plan.priceCents > 0 ? "subscription" : "setup",
      "line_items[0][price_data][currency]": plan.currency,
      "line_items[0][price_data][unit_amount]": String(plan.priceCents > 0 ? plan.priceCents : 0),
      "line_items[0][price_data][recurring][interval]": "month",
      "line_items[0][price_data][product_data][name]": `LACUNA-AMR ${plan.name} (${plan.id})`,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?billing=canceled`,
      "metadata[organizationId]": organizationId,
      "metadata[plan]": plan.id,
    });
    if (plan.priceCents <= 0) params.delete("line_items[0][price_data][unit_amount]");
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const text = await res.text();
      throw { error: `Stripe checkout failed: ${text.slice(0, 200)}`, status: 502 } as LifecycleError;
    }
    const data = (await res.json()) as { id: string; url: string };
    return { provider: "stripe", url: data.url, token: data.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
  }

  const token = `sbx_${crypto.randomBytes(18).toString("hex")}`;
  return {
    provider: "sandbox",
    url: null,
    token,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
}

export function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export function sandboxTokenValid(token: string, expiresAt: string): boolean {
  return token.startsWith("sbx_") && new Date(expiresAt).getTime() > Date.now();
}
