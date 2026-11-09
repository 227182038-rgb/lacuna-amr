// Phase 1 — billing (v0.5.0). Requires a signed-in organization (owner/admin
// role). The sandbox provider implements the full lifecycle deterministically:
// checkout → complete → active (entitlements granted) → simulate failure →
// dunning → suspension (entitlements revoked) → retry/cancel/resume. With
// STRIPE_SECRET_KEY set, checkout creates a real Stripe Checkout Session and
// completion is verified against the Stripe API instead of the local token.

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  PLANS,
  activateSubscription,
  cancelSubscription,
  createCheckout,
  paymentFailed,
  paymentRetrySucceeded,
  planById,
  providerMode,
  recordCheckoutStarted,
  resumeSubscription,
  topUpKey,
  verifySandboxCheckout,
  type LifecycleError,
} from "@/lib/lacuna/billing";
import { canManageBilling, getSession, membershipsOf, readSessionCookie, type OrgRole } from "@/lib/lacuna/auth";

export const dynamic = "force-dynamic";

function isLifecycleError(e: unknown): e is LifecycleError {
  return typeof e === "object" && e !== null && "error" in e && "status" in e;
}

const actionSchema = z.union([
  z.object({ action: z.literal("checkout"), plan: z.enum(["community", "lab", "enterprise"]) }),
  z.object({ action: z.literal("complete_checkout"), token: z.string().min(8) }),
  z.object({ action: z.literal("simulate_payment_failure") }),
  z.object({ action: z.literal("retry_payment") }),
  z.object({ action: z.literal("cancel"), immediate: z.boolean().default(false) }),
  z.object({ action: z.literal("resume") }),
  z.object({ action: z.literal("topup"), keyId: z.string().min(1), credits: z.number().int() }),
]);

export async function GET(req: Request) {
  const session = await getSession(readSessionCookie(req));
  const mode = providerMode();

  if (!session) {
    return NextResponse.json({
      provider: mode,
      plans: PLANS,
      subscription: null,
      invoices: [],
      events: [],
      notice:
        mode === "sandbox"
          ? "Sandbox billing: no real charges. Sign in to an organization workspace to manage a subscription."
          : "Stripe billing is configured. Sign in to an organization workspace to manage a subscription.",
    });
  }

  const memberships = await membershipsOf(session.userId);
  const active = session.activeOrgId ? memberships.find((m) => m.orgId === session.activeOrgId) : memberships[0];
  if (!active) {
    return NextResponse.json({
      provider: mode,
      plans: PLANS,
      subscription: null,
      invoices: [],
      events: [],
      notice: "You have no organization yet — create one in Workspace first.",
    });
  }

  const [subscription, invoices, events, keys] = await Promise.all([
    db.billingSubscription.findUnique({ where: { organizationId: active.orgId } }),
    db.billingInvoice.findMany({ where: { organizationId: active.orgId }, orderBy: { createdAt: "desc" }, take: 30 }),
    db.billingEvent.findMany({ where: { organizationId: active.orgId }, orderBy: { createdAt: "desc" }, take: 40 }),
    db.apiKey.findMany({ where: { organizationId: active.orgId, revokedAt: null } }),
  ]);

  return NextResponse.json({
    provider: mode,
    providerNotice:
      mode === "sandbox"
        ? "Sandbox billing provider is ACTIVE — the full lifecycle runs against the real database but NO money moves. Set STRIPE_SECRET_KEY to switch to real Stripe checkout (see DEVIATIONS.md D-042)."
        : "Stripe provider is configured (STRIPE_SECRET_KEY present).",
    plans: PLANS,
    organization: { id: active.orgId, name: active.orgName, slug: active.orgSlug, role: active.role },
    subscription: subscription
      ? {
          plan: subscription.plan,
          status: subscription.status,
          provider: subscription.provider,
          currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }
      : null,
    invoices: invoices.map((i) => ({
      id: i.id,
      number: i.number,
      plan: i.plan,
      amountCents: i.amountCents,
      currency: i.currency,
      status: i.status,
      attempts: i.attempts,
      dueAt: i.dueAt.toISOString(),
      paidAt: i.paidAt?.toISOString() ?? null,
      lastError: i.lastError,
      createdAt: i.createdAt.toISOString(),
    })),
    events: events.map((e) => ({ id: e.id, type: e.type, detail: e.detail, createdAt: e.createdAt.toISOString() })),
    entitlements: {
      keys: keys.map((k) => ({ id: k.id, label: k.label, keyPrefix: k.keyPrefix, credits: k.credits, scope: k.scope })),
    },
  });
}

export async function POST(req: Request) {
  const session = await getSession(readSessionCookie(req));
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const memberships = await membershipsOf(session.userId);
  const active = session.activeOrgId ? memberships.find((m) => m.orgId === session.activeOrgId) : memberships[0];
  if (!active) return NextResponse.json({ error: "No active organization — create one first." }, { status: 400 });
  const role = active.role as OrgRole;
  if (!canManageBilling(role)) {
    return NextResponse.json({ error: "Only owners or admins can manage billing." }, { status: 403 });
  }
  const orgId = active.orgId;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
      { status: 400 },
    );
  }
  const action = parsed.data;

  try {
    switch (action.action) {
      case "checkout": {
        const plan = planById(action.plan);
        if (!plan) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
        if (plan.id === "enterprise") {
          return NextResponse.json(
            {
              error:
                "Enterprise is per-engagement: use the Services section to request a scoped proposal (S2/S3) — no self-serve checkout.",
            },
            { status: 400 },
          );
        }
        const origin = new URL(req.url).origin;
        const checkout = await createCheckout(orgId, plan, origin);
        await recordCheckoutStarted(orgId, plan, checkout.token, checkout.expiresAt);
        return NextResponse.json({
          checkout,
          hint:
            checkout.provider === "sandbox"
              ? "Sandbox checkout: complete it with the token below — this simulates the Stripe redirect + webhook exactly (no charge)."
              : "Redirect to the Stripe-hosted checkout URL to complete payment.",
        });
      }
      case "complete_checkout": {
        const mode = providerMode();
        let planIdToActivate: string | null = null;
        if (mode === "sandbox") {
          const plan = await verifySandboxCheckout(orgId, action.token);
          if (!plan) {
            return NextResponse.json({ error: "Invalid or expired checkout token." }, { status: 400 });
          }
          planIdToActivate = plan.id;
        } else {
          // stripe: verify the session really exists and was completed
          const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(action.token)}`, {
            headers: { authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
            signal: AbortSignal.timeout(8000),
          });
          if (!res.ok) {
            return NextResponse.json({ error: `Stripe session lookup failed (HTTP ${res.status}).` }, { status: 502 });
          }
          const data = (await res.json()) as { payment_status?: string; status?: string; metadata?: Record<string, string> };
          if (data.status !== "complete" || data.payment_status !== "paid") {
            return NextResponse.json({ error: "Stripe session is not completed/paid." }, { status: 400 });
          }
          if (data.metadata?.organizationId !== orgId) {
            return NextResponse.json({ error: "Session belongs to a different organization." }, { status: 400 });
          }
          planIdToActivate = data.metadata?.plan ?? null;
        }
        const plan = (planIdToActivate ? planById(planIdToActivate) : null) ?? planById("community")!;
        const result = await activateSubscription(orgId, plan, { provider: mode });
        return NextResponse.json({ activated: true, plan: plan.id, ...result });
      }
      case "simulate_payment_failure": {
        if (providerMode() !== "sandbox") {
          return NextResponse.json(
            { error: "Payment failures arrive via Stripe webhooks in stripe mode — use the Stripe test card decline." },
            { status: 400 },
          );
        }
        const result = await paymentFailed(orgId);
        return NextResponse.json(result);
      }
      case "retry_payment": {
        const result = await paymentRetrySucceeded(orgId);
        return NextResponse.json(result);
      }
      case "cancel": {
        const status = await cancelSubscription(orgId, action.immediate);
        return NextResponse.json({ status });
      }
      case "resume": {
        const status = await resumeSubscription(orgId);
        return NextResponse.json({ status });
      }
      case "topup": {
        const balance = await topUpKey(orgId, action.keyId, action.credits);
        return NextResponse.json({ credits: balance });
      }
    }
  } catch (e) {
    if (isLifecycleError(e)) {
      return NextResponse.json({ error: e.error }, { status: e.status });
    }
    return NextResponse.json({ error: "Billing action failed." }, { status: 500 });
  }
}
