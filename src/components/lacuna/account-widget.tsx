"use client";

// Phase 1 — header account widget (v0.5.0). Signed-out visitors see the shared
// open workspace (v0.4.x demo behavior); the dialog offers sign-in/sign-up.
// Signed-in users can switch between their organizations (which rescopes all
// console data) and sign out.

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Loader2, LogOut, UserRound, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "@/lib/lacuna/session-store";

export function AccountWidget({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { status, user, organizations, activeOrgId, workspaceName, error, fetchSession, signIn, signUp, signOut, switchOrg } = useSession();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // sign-in form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // sign-up form
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suOrg, setSuOrg] = useState("");

  useEffect(() => {
    if (status === "loading") void fetchSession();
  }, [status, fetchSession]);

  const activeOrg = organizations.find((o) => o.orgId === activeOrgId) ?? null;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await signIn(email, password);
    setBusy(false);
    if (ok) {
      toast({ title: "Signed in", description: `Workspace data now scoped to your organization.` });
      setOpen(false);
      setEmail("");
      setPassword("");
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await signUp(suEmail, suPassword, suName, suOrg);
    setBusy(false);
    if (ok) {
      toast({ title: "Account created", description: `Organization “${suOrg}” is ready — you are its owner.` });
      setOpen(false);
      setSuName("");
      setSuEmail("");
      setSuPassword("");
      setSuOrg("");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100"
        aria-label="Account and workspace"
      >
        {status === "signed_in" ? (
          <Users className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <UserRound className="h-3.5 w-3.5 text-zinc-500" />
        )}
        <span className="max-w-[130px] truncate font-mono">{workspaceName}</span>
        <ChevronDown className="h-3 w-3 text-zinc-600" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">
              {status === "signed_in" ? "Account & workspaces" : "Sign in to LACUNA·AMR"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {status === "signed_in"
                ? "Switching organization rescopes every console view and API key to that tenant."
                : "Without an account you keep using the shared open workspace — a demo tenant with its own data. Signing in creates an isolated organization workspace."}
            </DialogDescription>
          </DialogHeader>

          {status === "signed_in" && user ? (
            <div className="space-y-4">
              <Card className="border-zinc-800 bg-zinc-900/60">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-zinc-100">{user.name}</div>
                      <div className="font-mono text-[11px] text-zinc-500">{user.email}</div>
                    </div>
                    <Badge variant="outline" className="border-emerald-800 bg-emerald-950/40 font-mono text-[10px] text-emerald-300">
                      {activeOrg?.role ?? "member"}
                    </Badge>
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div>
                    <Label className="text-[11px] uppercase tracking-wider text-zinc-500">Active organization</Label>
                    <Select value={activeOrgId ?? ""} onValueChange={async (v) => { const ok = await switchOrg(v); if (ok) toast({ title: "Workspace switched", description: "Console data rescoped." }); }}>
                      <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-200">
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-200">
                        {organizations.map((o) => (
                          <SelectItem key={o.orgId} value={o.orgId}>
                            {o.orgName} · {o.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Manage members, API keys and subscriptions in the{" "}
                    <button
                      className="text-emerald-400 underline underline-offset-2"
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.("workspace");
                      }}
                    >
                      Workspace
                    </button>{" "}
                    and{" "}
                    <button
                      className="text-emerald-400 underline underline-offset-2"
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.("billing");
                      }}
                    >
                      Billing
                    </button>{" "}
                    sections.
                  </p>
                </CardContent>
              </Card>
              <Button
                variant="outline"
                className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100"
                onClick={async () => {
                  await signOut();
                  toast({ title: "Signed out", description: "Back in the shared open workspace." });
                }}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
                <TabsTrigger value="signin" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                  Sign in
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                  Create account + organization
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-4">
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div>
                    <Label htmlFor="si-email" className="text-zinc-400">Email</Label>
                    <Input id="si-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100" placeholder="you@lab.org" />
                  </div>
                  <div>
                    <Label htmlFor="si-password" className="text-zinc-400">Password</Label>
                    <Input id="si-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100" placeholder="••••••••" />
                  </div>
                  {error ? <p className="text-xs text-red-400">{error}</p> : null}
                  <Button type="submit" disabled={busy} className="w-full bg-emerald-700 text-zinc-50 hover:bg-emerald-600">
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Sign in
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div>
                    <Label htmlFor="su-name" className="text-zinc-400">Your name</Label>
                    <Input id="su-name" required maxLength={120} value={suName} onChange={(e) => setSuName(e.target.value)} className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100" placeholder="Dr. Jane Okafor" />
                  </div>
                  <div>
                    <Label htmlFor="su-email" className="text-zinc-400">Email</Label>
                    <Input id="su-email" type="email" required maxLength={200} value={suEmail} onChange={(e) => setSuEmail(e.target.value)} className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100" placeholder="you@lab.org" />
                  </div>
                  <div>
                    <Label htmlFor="su-password" className="text-zinc-400">Password (min 8 chars)</Label>
                    <Input id="su-password" type="password" required minLength={8} value={suPassword} onChange={(e) => setSuPassword(e.target.value)} className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100" placeholder="••••••••" />
                  </div>
                  <div>
                    <Label htmlFor="su-org" className="text-zinc-400">Organization name</Label>
                    <Input id="su-org" required maxLength={120} value={suOrg} onChange={(e) => setSuOrg(e.target.value)} className="mt-1 border-zinc-800 bg-zinc-900 text-zinc-100" placeholder="National Reference Lab" />
                  </div>
                  {error ? <p className="text-xs text-red-400">{error}</p> : null}
                  <Button type="submit" disabled={busy} className="w-full bg-emerald-700 text-zinc-50 hover:bg-emerald-600">
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Create account
                  </Button>
                  <p className="text-[11px] leading-relaxed text-zinc-500">
                    The account is stored in this environment&apos;s database only (scrypt password hash, httpOnly session
                    cookie). RUO demo — do not reuse a real password.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
