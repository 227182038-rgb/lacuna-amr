"use client";

// Phase 1 — Billing section (v0.5.0). Three tiers mapped to scopes/credits;
// the sandbox provider runs the FULL lifecycle against the real database with
// NO money movement (labelled everywhere); STRIPE_SECRET_KEY switches checkout
// to the real Stripe REST path. Dunning progression is explicit and honest:
// fail → past_due → (retry) → suspended with entitlements revoked.

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Banknote, CheckCircle2, CreditCard, FileText, Loader2, RotateCcw, XCircle } from "lucide-react";
import { LoadingBlock, SectionHeader } from "./ui-bits";
import { useSession } from "@/lib/lacuna/session-store";

interface PlanDef {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  monthlyCredits: number;
  maxMembers: number;
  maxKeys: number;
  tagline: string;
  features: string[];
  cta: string;
}

interface InvoiceRow {
  id: string;
  number: string;
  plan: string;
  amountCents: number;
  currency: string;
  status: string;
  attempts: number;
  dueAt: string;
  paidAt: string | null;
  lastError: string | null;
  createdAt: string;
}

interface EventRow {
  id: string;
  type: string;
  detail: string;
  createdAt: string;
}

interface BillingState {
  provider: "sandbox" | "stripe";
  providerNotice?: string;
  notice?: string;
  plans: PlanDef[];
  organization?: { id: string; name: string; slug: string; role: string } | null;
  subscription?: {
    plan: string;
    status: string;
    provider: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  invoices: InvoiceRow[];
  events: EventRow[];
  entitlements?: { keys: { id: string; label: string; keyPrefix: string; credits: number; scope: string }[] };
}

function priceLabel(p: PlanDef): string {
  return p.priceCents < 0 ? "per engagement" : p.priceCents === 0 ? "Free" : `$${(p.priceCents / 100).toFixed(0)}/mo`;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "active":
    case "paid":
      return "border-emerald-800 bg-emerald-950/40 text-emerald-300";
    case "past_due":
      return "border-amber-800 bg-amber-950/40 text-amber-300";
    case "suspended":
    case "failed":
    case "canceled":
      return "border-red-900 bg-red-950/40 text-red-300";
    default:
      return "border-zinc-700 bg-zinc-900 text-zinc-400";
  }
}

export function BillingSection({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { status: sessionStatus, activeOrgId } = useSession();
  const [state, setState] = useState<BillingState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/billing", { cache: "no-store" });
    if (res.ok) setState(await res.json());
  }, []);

  useEffect(() => {
    void load();
  }, [load, activeOrgId]);

  async function act(action: string, extra: Record<string, unknown> = {}, successTitle: string, successDescription?: string) {
    setBusy(action);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = (await res.json()) as Record<string, unknown> & { error?: string };
      if (!res.ok) {
        toast({ title: "Billing action failed", description: data.error, variant: "destructive" });
        return null;
      }
      toast({ title: successTitle, description: successDescription ?? JSON.stringify(data).slice(0, 160) });
      await load();
      // NOTE: no bumpWorkspace() here — the remount key exists for TENANT
      // switches; billing actions refresh this section via load() and other
      // sections refetch on their own mount when navigated to. (A bump here
      // would remount this component and wipe the pending-checkout state.)
      return data;
    } finally {
      setBusy(null);
    }
  }

  async function handleCheckout(plan: PlanDef) {
    const data = await act("checkout", { plan: plan.id }, `Checkout started (${plan.name})`, "Sandbox mode: complete the checkout below — no charge is made.");
    if (data && typeof data.checkout === "object" && data.checkout !== null) {
      const checkout = data.checkout as { token: string; url: string | null };
      if (checkout.url) {
        window.open(checkout.url, "_blank", "noopener");
        return;
      }
      setPendingToken(checkout.token);
    }
  }

  const sub = state?.subscription ?? null;
  const canManage = state?.organization?.role === "owner" || state?.organization?.role === "admin";

  return (
    <div>
      <SectionHeader
        kicker="Phase 1 · production foundation"
        title="Billing & entitlements"
        description="Three tiers mapped onto the existing scopes and per-key credit system. Entitlements are real database state: activation tops up org keys to the plan level; suspension/cancellation revokes them."
        right={
          <Badge variant="outline" className={`font-mono text-[10px] ${state?.provider === "stripe" ? "border-emerald-800 bg-emerald-950/40 text-emerald-300" : "border-amber-800 bg-amber-950/40 text-amber-300"}`}>
            provider: {state?.provider ?? "…"} {state?.provider === "sandbox" ? "· no real charges" : ""}
          </Badge>
        }
      />

      {state?.providerNotice ? (
        <Alert className="mb-4 border-amber-900/60 bg-amber-950/20">
          <AlertDescription className="text-xs leading-relaxed text-amber-200/90">{state.providerNotice}</AlertDescription>
        </Alert>
      ) : null}

      {sessionStatus !== "signed_in" ? (
        <Alert className="mb-4 border-zinc-800 bg-zinc-950">
          <AlertDescription className="text-zinc-400">
            Billing applies to organization workspaces. Use the account button (top right) to sign in or create an
            organization — the open workspace stays free demo territory.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        {(state?.plans ?? []).map((p) => {
          const isCurrent = sub?.plan === p.id && sub.status !== "canceled";
          return (
            <Card key={p.id} className={`flex flex-col border-zinc-800 bg-zinc-900/60 ${isCurrent ? "ring-1 ring-emerald-700" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-zinc-100">{p.name}</CardTitle>
                  {isCurrent ? (
                    <Badge variant="outline" className={`font-mono text-[10px] ${statusBadgeClass(sub?.status ?? "")}`}>
                      {sub?.status}
                    </Badge>
                  ) : null}
                </div>
                <div className="font-mono text-2xl font-semibold text-emerald-300">{priceLabel(p)}</div>
                <CardDescription>{p.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-3">
                <ul className="space-y-1.5 text-xs text-zinc-400">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-1.5">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  disabled={!canManage || busy !== null || isCurrent}
                  onClick={() => handleCheckout(p)}
                  className="w-full bg-emerald-700 text-zinc-50 hover:bg-emerald-600 disabled:opacity-40"
                  variant="default"
                >
                  {busy === "checkout" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                  {p.id === "enterprise" ? "Request engagement" : isCurrent ? "Current plan" : p.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending sandbox checkout */}
      {pendingToken ? (
        <Card className="mt-4 border-amber-900/60 bg-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-200">Sandbox checkout pending</CardTitle>
            <CardDescription className="font-mono text-[10px] text-amber-200/70">
              token {pendingToken.slice(0, 14)}… · expires in 15 minutes · simulates the Stripe redirect + webhook
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-emerald-700 text-zinc-50 hover:bg-emerald-600"
              disabled={busy !== null}
              onClick={async () => {
                const ok = await act("complete_checkout", { token: pendingToken }, "Subscription activated", "Entitlements granted to all organization keys.");
                if (ok) setPendingToken(null);
              }}
            >
              {busy === "complete_checkout" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null} Complete checkout (simulate successful payment)
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300" onClick={() => setPendingToken(null)}>
              Abandon
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Subscription + lifecycle controls */}
      {state?.organization ? (
        <Card className="mt-4 border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <Banknote className="h-4 w-4 text-emerald-400" /> Subscription — {state.organization.name}
            </CardTitle>
            <CardDescription>
              The dunning machine: failed attempt → past_due; three failed attempts → suspended and every org key&apos;s
              credits revoked. Retry pays the open invoice and restores entitlements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state === null ? (
              <LoadingBlock lines={3} />
            ) : !sub ? (
              <p className="text-sm text-zinc-500">No subscription yet — start with Community (free) or Lab above.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <Badge variant="outline" className={`font-mono text-[10px] ${statusBadgeClass(sub.status)}`}>
                    {sub.status}
                  </Badge>
                  <span className="font-mono">plan: {sub.plan}</span>
                  <span className="font-mono">provider: {sub.provider}</span>
                  {sub.currentPeriodEnd ? <span className="font-mono">period ends {new Date(sub.currentPeriodEnd).toISOString().slice(0, 10)}</span> : null}
                  {sub.cancelAtPeriodEnd ? <Badge variant="outline" className="border-amber-800 bg-amber-950/40 font-mono text-[10px] text-amber-300">cancels at period end</Badge> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.provider === "sandbox" && (sub.status === "active" || sub.status === "past_due") ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-900/60 bg-red-950/30 text-red-300 hover:bg-red-950/50"
                      disabled={!canManage || busy !== null}
                      onClick={() => act("simulate_payment_failure", {}, "Payment failed (simulated)", "Dunning progression applied — see invoice + subscription status.")}
                    >
                      <XCircle className="mr-2 h-3.5 w-3.5" /> Simulate payment failure
                    </Button>
                  ) : null}
                  {sub.status === "past_due" || sub.status === "suspended" ? (
                    <Button
                      size="sm"
                      className="bg-emerald-700 text-zinc-50 hover:bg-emerald-600"
                      disabled={!canManage || busy !== null}
                      onClick={() => act("retry_payment", {}, "Payment succeeded on retry", "Invoice paid, subscription active, entitlements restored.")}
                    >
                      <RotateCcw className="mr-2 h-3.5 w-3.5" /> Retry payment (succeeds)
                    </Button>
                  ) : null}
                  {sub.status !== "canceled" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 bg-zinc-900 text-zinc-300"
                        disabled={!canManage || busy !== null}
                        onClick={() => act("cancel", { immediate: false }, "Cancellation scheduled", "Plan stays active until the period ends.")}
                      >
                        Cancel at period end
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-900/60 bg-red-950/30 text-red-300 hover:bg-red-950/50"
                        disabled={!canManage || busy !== null}
                        onClick={() => act("cancel", { immediate: true }, "Subscription canceled", "Entitlements revoked — all org keys zeroed.")}
                      >
                        Cancel immediately
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-emerald-700 text-zinc-50 hover:bg-emerald-600"
                      disabled={!canManage || busy !== null}
                      onClick={() => act("resume", {}, "Subscription resumed", "Entitlements re-granted.")}
                    >
                      Resume subscription
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* Entitlements */}
            {state.entitlements && state.entitlements.keys.length > 0 ? (
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Entitlements (org API keys)</div>
                <div className="max-h-40 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <tbody className="font-mono text-zinc-300">
                      {state.entitlements.keys.map((k) => (
                        <tr key={k.id} className="border-t border-zinc-800/60">
                          <td className="py-1.5 pr-2">{k.label}</td>
                          <td className="py-1.5 pr-2 text-zinc-500">{k.keyPrefix}…</td>
                          <td className="py-1.5 text-right tabular-nums">{k.credits} credits</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {/* Invoices + events */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <FileText className="h-4 w-4 text-emerald-400" /> Invoices
            </CardTitle>
            <CardDescription>Numbered ledger with attempts and honest failure reasons.</CardDescription>
          </CardHeader>
          <CardContent>
            {!state || state.invoices.length === 0 ? (
              <p className="text-sm text-zinc-500">No invoices yet.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="pb-2">Number</th>
                      <th className="pb-2">Plan</th>
                      <th className="pb-2 text-right">Amount</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-zinc-300">
                    {state.invoices.map((i) => (
                      <tr key={i.id} className="border-t border-zinc-800/60">
                        <td className="py-1.5 pr-2">{i.number}</td>
                        <td className="py-1.5 pr-2">{i.plan}</td>
                        <td className="py-1.5 pr-2 text-right tabular-nums">${(i.amountCents / 100).toFixed(0)}</td>
                        <td className="py-1.5 text-right">
                          <Badge variant="outline" className={`font-mono text-[10px] ${statusBadgeClass(i.status)}`}>
                            {i.status}
                            {i.status === "failed" ? ` ×${i.attempts}` : ""}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <FileText className="h-4 w-4 text-emerald-400" /> Billing event log
            </CardTitle>
            <CardDescription>Append-only lifecycle record — the same events fire signed webhooks (subscribe in Integrations).</CardDescription>
          </CardHeader>
          <CardContent>
            {!state || state.events.length === 0 ? (
              <p className="text-sm text-zinc-500">No billing events yet.</p>
            ) : (
              <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {state.events.map((e) => (
                  <li key={e.id} className="rounded-md border border-zinc-800/80 bg-zinc-950/60 px-2.5 py-1.5 font-mono text-[11px] text-zinc-400">
                    <span className="text-zinc-300">{e.type}</span>
                    <span className="text-zinc-600"> · {new Date(e.createdAt).toLocaleTimeString()}</span>
                    <div className="truncate text-[10px] text-zinc-600">{e.detail}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
        Honesty note: in sandbox provider mode no charge, card or external service is touched — the lifecycle runs entirely
        against this environment&apos;s database and mirrors the Stripe Checkout/subscription/invoice state machine. A live
        Stripe deployment additionally requires the legal entity from the roadmap&apos;s Phase 1 legal workstream (see
        DEVIATIONS.md D-042/D-047). Enterprise is per-engagement and not self-serve.
      </p>
    </div>
  );
}
