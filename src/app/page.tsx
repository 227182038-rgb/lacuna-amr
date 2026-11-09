"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Briefcase, Boxes, CreditCard, Dna, FileCheck2, FileText, FlaskConical, GitBranch, Layers, Lock, Plug, ScrollText, ShieldCheck, TrendingUp, Users, Workflow, type LucideIcon } from "lucide-react";
import { OverviewSection } from "@/components/lacuna/overview";
import { WorkflowSection } from "@/components/lacuna/workflow";
import { CohortSection } from "@/components/lacuna/cohort";
import { AuditSection } from "@/components/lacuna/audit";
import { PredictSection } from "@/components/lacuna/predict";
import { BatchSection } from "@/components/lacuna/batch";
import { ValidateSection } from "@/components/lacuna/validate";
import { GatesSection } from "@/components/lacuna/gates";
import { ProvenanceSection } from "@/components/lacuna/provenance";
import { MarketSection } from "@/components/lacuna/market";
import { ServicesSection } from "@/components/lacuna/services";
import { IntegrationsSection } from "@/components/lacuna/integrations";
import { ComplianceSection } from "@/components/lacuna/compliance";
import { ReportSection } from "@/components/lacuna/report";
import { WorkspaceSection } from "@/components/lacuna/workspace";
import { BillingSection } from "@/components/lacuna/billing";
import { ObservabilitySection } from "@/components/lacuna/observability";
import { AccountWidget } from "@/components/lacuna/account-widget";
import { useSession } from "@/lib/lacuna/session-store";
import { cn } from "@/lib/utils";

type SectionComponent = ComponentType<{ onNavigate: (id: string) => void }>;

const SECTION_IDS = ["overview", "workflow", "cohort", "audit", "predict", "batch", "validate", "gates", "provenance", "workspace", "billing", "market", "services", "integrations", "observability", "compliance", "report"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTIONS: { id: SectionId; label: string; icon: LucideIcon; component: SectionComponent }[] = [
  { id: "overview", label: "Overview", icon: FlaskConical, component: OverviewSection },
  { id: "workflow", label: "Workflow", icon: Workflow, component: WorkflowSection },
  { id: "cohort", label: "Cohort", icon: GitBranch, component: CohortSection },
  { id: "audit", label: "Dataset Audit", icon: FileCheck2, component: AuditSection },
  { id: "predict", label: "Predict", icon: Dna, component: PredictSection },
  { id: "batch", label: "Batch", icon: Boxes, component: BatchSection },
  { id: "validate", label: "Validate", icon: ShieldCheck, component: ValidateSection },
  { id: "gates", label: "Gates", icon: Layers, component: GatesSection },
  { id: "provenance", label: "Provenance", icon: ScrollText, component: ProvenanceSection },
  { id: "workspace", label: "Workspace", icon: Users, component: WorkspaceSection },
  { id: "billing", label: "Billing", icon: CreditCard, component: BillingSection },
  { id: "market", label: "Market", icon: TrendingUp, component: MarketSection },
  { id: "services", label: "Services", icon: Briefcase, component: ServicesSection },
  { id: "integrations", label: "Integrations", icon: Plug, component: IntegrationsSection },
  { id: "observability", label: "Observability", icon: Activity, component: ObservabilitySection },
  { id: "compliance", label: "Compliance", icon: Lock, component: ComplianceSection },
  { id: "report", label: "Report", icon: FileText, component: ReportSection },
];

export default function Home() {
  const [active, setActive] = useState<SectionId>("overview");
  const Active = SECTIONS.find((s) => s.id === active)!.component;
  // Workspace identity key: changing organization (or signing in/out) remounts
  // the active section so every fetch is re-scoped to the new tenant.
  const workspaceKey = useSession((s) => s.workspaceKey);

  useEffect(() => {
    if (useSession.getState().status === "loading") void useSession.getState().fetchSession();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600/20 border border-emerald-800">
              <Dna className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-mono text-sm font-semibold tracking-tight text-zinc-100">LACUNA·AMR</div>
              <div className="hidden font-mono text-[10px] text-zinc-500 sm:block">audit console · v0.5.0 · Apache-2.0</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AccountWidget onNavigate={(id) => setActive(id as SectionId)} />
            <Badge variant="outline" className="border-amber-800 bg-amber-950/40 font-mono text-[10px] text-amber-300">
              <AlertTriangle className="mr-1 h-3 w-3" /> RUO
            </Badge>
            <Badge variant="outline" className="hidden border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-400 sm:inline-flex">
              pilot · exploratory
            </Badge>
          </div>
        </div>
        {/* Section nav — horizontally scrollable on all sizes */}
        <nav aria-label="Sections" className="border-t border-zinc-800/60">
          <div className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-3 py-1.5 [scrollbar-width:thin]">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-current={active === s.id ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors",
                  active === s.id ? "bg-emerald-600/15 text-emerald-300" : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                )}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Content — keyed by workspace identity so tenant switches rescope all data */}
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6">
        <Active key={`${active}-${workspaceKey}`} onNavigate={(id) => setActive(id as SectionId)} />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-3 text-[11px] text-zinc-600">
          <span>
            LACUNA·AMR — audited genome-based AMR prediction. Apache-2.0. Research Use Only; not for clinical
            decision-making. EUCAST tables user-supplied, never bundled.
          </span>
          <span className="font-mono">pilot run 2026-11-01 · seeds 20261101 / 42 · gates 9 PASS · 2 FAIL · 1 blocked · Phase 1 production foundation 2026-11-09</span>
        </div>
      </footer>
    </div>
  );
}
