"use client";

// Phase 1 — client-side session store (v0.5.0). Single zustand store shared by
// the header account widget and every section that renders workspace-scoped
// data. `bumpWorkspace()` increments a counter the page uses as a remount key,
// so switching organizations refetches all section data with the new tenant
// context (no stale cross-org views).

import { create } from "zustand";

export interface SessionOrg {
  orgId: string;
  orgName: string;
  orgSlug: string;
  role: "owner" | "admin" | "member";
}

interface SessionState {
  status: "loading" | "signed_out" | "signed_in";
  user: { id: string; email: string; name: string } | null;
  organizations: SessionOrg[];
  activeOrgId: string | null;
  workspaceName: string;
  workspaceKey: number; // increments on any workspace identity change
  error: string | null;
  fetchSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string, orgName: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  switchOrg: (orgId: string) => Promise<boolean>;
  createOrg: (name: string) => Promise<boolean>;
  bumpWorkspace: () => void;
}

export const useSession = create<SessionState>((set, get) => ({
  status: "loading",
  user: null,
  organizations: [],
  activeOrgId: null,
  workspaceName: "Open workspace",
  workspaceKey: 0,
  error: null,

  fetchSession: async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await res.json()) as {
        authenticated: boolean;
        user?: { id: string; email: string; name: string };
        organizations?: SessionOrg[];
        activeOrganization?: { id: string; name: string } | null;
        workspace?: { id: string | null; name: string };
      };
      if (data.authenticated && data.user) {
        set({
          status: "signed_in",
          user: data.user,
          organizations: data.organizations ?? [],
          activeOrgId: data.activeOrganization?.id ?? null,
          workspaceName: data.workspace?.name ?? "Open workspace",
          error: null,
        });
      } else {
        set({ status: "signed_out", user: null, organizations: [], activeOrgId: null, workspaceName: "Open workspace" });
      }
    } catch {
      set({ status: "signed_out", user: null, organizations: [], activeOrgId: null, workspaceName: "Open workspace" });
    }
  },

  signIn: async (email, password) => {
    set({ error: null });
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        set({ error: data.error ?? "Sign-in failed." });
        return false;
      }
      await get().fetchSession();
      set((s) => ({ workspaceKey: s.workspaceKey + 1 }));
      return true;
    } catch {
      set({ error: "Sign-in failed — network error." });
      return false;
    }
  },

  signUp: async (email, password, name, orgName) => {
    set({ error: null });
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, name, orgName }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        set({ error: data.error ?? "Sign-up failed." });
        return false;
      }
      await get().fetchSession();
      set((s) => ({ workspaceKey: s.workspaceKey + 1 }));
      return true;
    } catch {
      set({ error: "Sign-up failed — network error." });
      return false;
    }
  },

  signOut: async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch {
      // best-effort
    }
    set({ status: "signed_out", user: null, organizations: [], activeOrgId: null, workspaceName: "Open workspace" });
    set((s) => ({ workspaceKey: s.workspaceKey + 1 }));
  },

  switchOrg: async (orgId) => {
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "switch", orgId }),
      });
      if (!res.ok) return false;
      await get().fetchSession();
      set((s) => ({ workspaceKey: s.workspaceKey + 1 }));
      return true;
    } catch {
      return false;
    }
  },

  createOrg: async (name) => {
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", name }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        set({ error: data.error ?? "Create failed." });
        return false;
      }
      await get().fetchSession();
      set((s) => ({ workspaceKey: s.workspaceKey + 1 }));
      return true;
    } catch {
      set({ error: "Create failed — network error." });
      return false;
    }
  },

  bumpWorkspace: () => set((s) => ({ workspaceKey: s.workspaceKey + 1 })),
}));
