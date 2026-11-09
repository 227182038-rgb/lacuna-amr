"use client";

// Phase 1 — Workspace section (v0.5.0): organizations, memberships, roles and
// the per-plan quotas that govern members and API keys. The isolation model is
// stated up-front: the open workspace is shared demo data; every organization
// sees only its own runs, keys, batches, service requests and webhooks.

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { KeyRound, Loader2, Plus, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { LoadingBlock, SectionHeader, StatCard } from "./ui-bits";
import { useSession } from "@/lib/lacuna/session-store";

interface MemberRow {
  userId: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "member";
  addedAt: string;
}

interface Quota {
  maxMembers: number; // -1 unlimited
  plan: string;
}

export function WorkspaceSection({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { status, user, organizations, activeOrgId, createOrg, switchOrg } = useSession();
  const [members, setMembers] = useState<MemberRow[] | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [keysInfo, setKeysInfo] = useState<{ keys: { id: string; label: string; keyPrefix: string; credits: number; revokedAt: string | null }[]; quota: { plan: string; maxKeys: number | null; monthlyCredits: number } } | null>(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<"admin" | "member">("member");
  const [busy, setBusy] = useState(false);

  const activeOrg = organizations.find((o) => o.orgId === activeOrgId) ?? null;

  const load = useCallback(() => {
    const keysP = fetch("/api/keys", { cache: "no-store" }).then(async (r) => (r.ok ? ((await r.json()) as NonNullable<typeof keysInfo>) : null));
    if (!activeOrg) {
      void keysP.then((info) => setKeysInfo(info));
      return;
    }
    const membersP = fetch(`/api/orgs/members?orgId=${activeOrg.orgId}`, { cache: "no-store" }).then(async (r) => {
      if (!r.ok) return null;
      const data = (await r.json()) as { members: MemberRow[]; quota: Quota };
      return data;
    });
    void Promise.all([membersP, keysP]).then(([m, k]) => {
      if (m) {
        setMembers(m.members);
        setQuota(m.quota);
      }
      if (k) setKeysInfo(k);
    });
  }, [activeOrg]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    setBusy(true);
    const ok = await createOrg(newOrgName.trim());
    setBusy(false);
    if (ok) {
      toast({ title: "Organization created", description: `You are the owner of “${newOrgName.trim()}” — it is now active.` });
      setNewOrgName("");
    } else {
      toast({ title: "Could not create organization", description: useSession.getState().error ?? "Try a different name.", variant: "destructive" });
    }
  }

  async function handleSwitch(orgId: string) {
    const ok = await switchOrg(orgId);
    if (ok) toast({ title: "Workspace switched", description: "All console data is now scoped to the new organization." });
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!activeOrg || !addEmail.trim()) return;
    setBusy(true);
    const res = await fetch("/api/orgs/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "add", orgId: activeOrg.orgId, email: addEmail.trim(), role: addRole }),
    });
    setBusy(false);
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      toast({ title: "Could not add member", description: data.error, variant: "destructive" });
      return;
    }
    toast({ title: "Member added", description: `${addEmail.trim()} joined as ${addRole}.` });
    setAddEmail("");
    void load();
  }

  async function handleRemoveMember(userId: string, email: string) {
    if (!activeOrg) return;
    const res = await fetch("/api/orgs/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "remove", orgId: activeOrg.orgId, userId }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      toast({ title: "Could not remove member", description: data.error, variant: "destructive" });
      return;
    }
    toast({ title: "Member removed", description: `${email} no longer has access.` });
    void load();
  }

  const activeKeys = keysInfo?.keys.filter((k) => !k.revokedAt) ?? [];

  return (
    <div>
      <SectionHeader
        kicker="Phase 1 · production foundation"
        title="Workspace & organizations"
        description="Multi-tenant isolation: every organization owns its runs, API keys, batch jobs, service requests and webhook configs. The open workspace (no sign-in) keeps the v0.4.x demo behavior and its own data."
        right={
          <Badge variant="outline" className="border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-400">
            {status === "signed_in" ? `signed in · ${user?.email}` : "open workspace · not signed in"}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Your organizations" value={organizations.length} sub="workspaces you belong to" />
        <StatCard label="Active workspace" value={activeOrg ? activeOrg.orgName : "Open (shared)"} accent={activeOrg ? "emerald" : "zinc"} sub={activeOrg ? `role: ${activeOrg.role}` : "unauthenticated demo tenant"} />
        <StatCard
          label="Members"
          value={members ? (quota && quota.maxMembers !== -1 ? `${members.length} / ${quota.maxMembers}` : members.length) : "—"}
          sub={quota ? `plan: ${quota.plan}` : "open workspace"}
        />
        <StatCard
          label="Active API keys"
          value={keysInfo ? (keysInfo.quota.maxKeys ? `${activeKeys.length} / ${keysInfo.quota.maxKeys}` : activeKeys.length) : "—"}
          sub={keysInfo ? `plan: ${keysInfo.quota.plan}` : undefined}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Organizations */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <Users className="h-4 w-4 text-emerald-400" /> Your organizations
            </CardTitle>
            <CardDescription>
              Switching rescopes every console section and API key to that tenant. Organization identity is never accepted
              from request bodies — only from the session cookie or key hash.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {status === "loading" ? (
              <LoadingBlock lines={2} />
            ) : organizations.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No organizations yet — create one below or from the account dialog (top right). Until then you are working
                in the shared open workspace.
              </p>
            ) : (
              <ul className="space-y-2">
                {organizations.map((o) => (
                  <li
                    key={o.orgId}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 ${
                      o.orgId === activeOrgId ? "border-emerald-800 bg-emerald-950/30" : "border-zinc-800 bg-zinc-950/60"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm text-zinc-100">{o.orgName}</div>
                      <div className="font-mono text-[10px] text-zinc-500">
                        {o.orgSlug} · {o.role}
                      </div>
                    </div>
                    {o.orgId === activeOrgId ? (
                      <Badge variant="outline" className="border-emerald-800 bg-emerald-950/40 font-mono text-[10px] text-emerald-300">
                        active
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 border-zinc-700 bg-zinc-900 text-xs text-zinc-300" onClick={() => handleSwitch(o.orgId)}>
                        Switch
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleCreateOrg} className="flex gap-2 pt-1">
              <Input
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="New organization name"
                maxLength={120}
                className="border-zinc-800 bg-zinc-950 text-zinc-100"
              />
              <Button type="submit" disabled={busy || !newOrgName.trim()} className="bg-emerald-700 text-zinc-50 hover:bg-emerald-600">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Create
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="border-zinc-800 bg-zinc-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Members & roles
            </CardTitle>
            <CardDescription>
              {activeOrg
                ? "Owners/admins manage members. Emails must belong to existing accounts (no invitation emails are sent in this demo). Plan quotas apply."
                : "Sign in and select an organization to manage its members."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!activeOrg ? (
              <Alert className="border-zinc-800 bg-zinc-950">
                <AlertDescription className="text-zinc-400">
                  The open workspace has no membership list — it is the shared, unauthenticated demo tenant.{" "}
                  {onNavigate ? (
                    <button className="text-emerald-400 underline underline-offset-2" onClick={() => onNavigate("billing")}>
                      See Billing
                    </button>
                  ) : null}{" "}
                  for plan limits once you create an organization.
                </AlertDescription>
              </Alert>
            ) : members === null ? (
              <LoadingBlock lines={3} />
            ) : (
              <>
                <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {members.map((m) => (
                    <li key={m.userId} className="flex items-center justify-between gap-2 rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm text-zinc-100">{m.name}</div>
                        <div className="truncate font-mono text-[10px] text-zinc-500">{m.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] ${
                            m.role === "owner" ? "border-amber-800 bg-amber-950/40 text-amber-300" : "border-zinc-700 bg-zinc-900 text-zinc-400"
                          }`}
                        >
                          {m.role}
                        </Badge>
                        {m.role !== "owner" && (activeOrg.role === "owner" || activeOrg.role === "admin") ? (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400" onClick={() => handleRemoveMember(m.userId, m.email)} aria-label={`Remove ${m.email}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
                {(activeOrg.role === "owner" || activeOrg.role === "admin") && (
                  <form onSubmit={handleAddMember} className="flex gap-2">
                    <Input type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="colleague@lab.org (existing account)" className="border-zinc-800 bg-zinc-950 text-zinc-100" />
                    <Select value={addRole} onValueChange={(v) => setAddRole(v as "admin" | "member")}>
                      <SelectTrigger className="w-28 border-zinc-800 bg-zinc-950 text-zinc-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-200">
                        <SelectItem value="member">member</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="submit" disabled={busy || !addEmail.trim()} className="bg-emerald-700 text-zinc-50 hover:bg-emerald-600">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                <p className="text-[11px] text-zinc-500">
                  Quota: {quota?.maxMembers === -1 ? "unlimited members" : `${quota?.maxMembers} member(s)`} on plan “{quota?.plan}”. Upgrade in Billing.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API keys snapshot */}
      <Card className="mt-4 border-zinc-800 bg-zinc-900/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-zinc-100">
            <KeyRound className="h-4 w-4 text-emerald-400" /> API keys in this workspace
          </CardTitle>
          <CardDescription>
            Keys are scoped to the active workspace and draw per-key credits (plan-governed once subscribed). Issue and
            revoke keys in the{" "}
            {onNavigate ? (
              <button className="text-emerald-400 underline underline-offset-2" onClick={() => onNavigate("compliance")}>
                Compliance
              </button>
            ) : (
              "Compliance"
            )}{" "}
            section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keysInfo === null ? (
            <LoadingBlock lines={2} />
          ) : keysInfo.keys.length === 0 ? (
            <p className="text-sm text-zinc-500">No API keys in this workspace yet.</p>
          ) : (
            <div className="max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="pb-2">Label</th>
                    <th className="pb-2">Prefix</th>
                    <th className="pb-2 text-right">Credits</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-zinc-300">
                  {keysInfo.keys.map((k) => (
                    <tr key={k.id} className="border-t border-zinc-800/60">
                      <td className="py-1.5 pr-2">{k.label}</td>
                      <td className="py-1.5 pr-2 text-zinc-500">{k.keyPrefix}…</td>
                      <td className="py-1.5 pr-2 text-right tabular-nums">{k.credits}</td>
                      <td className="py-1.5 text-right">
                        {k.revokedAt ? <span className="text-red-400">revoked</span> : <span className="text-emerald-400">active</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
