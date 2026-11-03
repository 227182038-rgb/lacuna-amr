"use client";

// Shared UI building blocks for the LACUNA-AMR console.

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function VerdictBadge({ verdict, className }: { verdict: string; className?: string }) {
  const v = verdict.toUpperCase();
  const styles =
    v === "PASS"
      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
      : v === "FAIL"
        ? "bg-red-950/60 text-red-300 border-red-800"
        : v === "NOT ATTEMPTED"
          ? "bg-zinc-800 text-zinc-400 border-zinc-700"
          : "bg-amber-950/60 text-amber-300 border-amber-800";
  return (
    <Badge variant="outline" className={cn("font-mono text-[11px] tracking-wide", styles, className)}>
      {v}
    </Badge>
  );
}

export function LabelBadge({ label }: { label: string }) {
  const styles: Record<string, string> = {
    R: "bg-red-950/60 text-red-300 border-red-800",
    S: "bg-emerald-950/60 text-emerald-300 border-emerald-800",
    I: "bg-amber-950/60 text-amber-300 border-amber-800",
    INDETERMINATE_CENSORED: "bg-zinc-800 text-zinc-400 border-zinc-700",
    "S+R": "bg-amber-950/60 text-amber-300 border-amber-800",
    ABSTAIN: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  return (
    <Badge variant="outline" className={cn("font-mono text-[11px]", styles[label] ?? "bg-zinc-800 text-zinc-300 border-zinc-700")}>
      {label}
    </Badge>
  );
}

export function StatCard({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: ReactNode; accent?: "emerald" | "amber" | "red" | "zinc" }) {
  const accentClass =
    accent === "emerald" ? "text-emerald-300" : accent === "amber" ? "text-amber-300" : accent === "red" ? "text-red-300" : "text-zinc-100";
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardContent className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</div>
        <div className={cn("mt-1 font-mono text-2xl font-semibold tabular-nums", accentClass)}>{value}</div>
        {sub ? <div className="mt-1 text-xs text-zinc-500">{sub}</div> : null}
      </CardContent>
    </Card>
  );
}

export function SectionHeader({ title, kicker, description, right }: { title: string; kicker?: string; description?: string; right?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker ? <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-500">{kicker}</div> : null}
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
        {description ? <p className="mt-1 max-w-3xl text-sm text-zinc-400">{description}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function LoadingBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-busy="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-full bg-zinc-800/80" />
      ))}
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">
      {message}
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded bg-zinc-800/80 px-1 py-0.5 font-mono text-[12px] text-emerald-300">{children}</code>;
}

export function KeyValue({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-zinc-800/60 py-1.5 last:border-0">
      <span className="text-xs text-zinc-500">{k}</span>
      <span className="text-right font-mono text-xs text-zinc-200">{v}</span>
    </div>
  );
}

export function fmt(n: number | null | undefined, digits = 3): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return `${(n * 100).toFixed(digits)}%`;
}

// ---------------------------------------------------------------------------
// Lightweight markdown renderer (headings, bold, inline code, lists, tables,
// blockquotes, hr) — enough for the gate evidence files and the final report.
// ---------------------------------------------------------------------------

function renderInline(text: string, keyBase: string): ReactNode[] {
  // inline code, bold, links — order: code first to avoid formatting inside
  const parts: ReactNode[] = [];
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("`")) {
      parts.push(
        <code key={`${keyBase}-c${i}`} className="rounded bg-zinc-800/80 px-1 py-0.5 font-mono text-[12px] text-emerald-300">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={`${keyBase}-b${i}`} className="font-semibold text-zinc-100">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      const label = token.slice(1, token.indexOf("]"));
      const href = token.slice(token.indexOf("(") + 1, -1);
      parts.push(
        <a key={`${keyBase}-a${i}`} href={href} className="text-emerald-400 underline underline-offset-2" rel="noreferrer noopener">
          {label}
        </a>
      );
    }
    last = m.index + token.length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function MarkdownLite({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let tableBuffer: string[] = [];
  let paraBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={key} className="my-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
          {listBuffer.map((li, i) => (
            <li key={i}>{renderInline(li, `${key}-${i}`)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };
  const flushTable = (key: string) => {
    if (tableBuffer.length) {
      const rows = tableBuffer.map((r) => r.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));
      const header = rows[0];
      const body = rows.slice(2);
      blocks.push(
        <div key={key} className="my-3 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-700 text-left text-zinc-400">
                {header.map((h, i) => (
                  <th key={i} className="px-2 py-1.5 font-medium">
                    {renderInline(h, `${key}-h${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono text-zinc-300">
              {body.map((r, ri) => (
                <tr key={ri} className="border-b border-zinc-800/60">
                  {r.map((c, ci) => (
                    <td key={ci} className="px-2 py-1.5">
                      {renderInline(c, `${key}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableBuffer = [];
    }
  };
  const flushPara = (key: string) => {
    if (paraBuffer.length) {
      blocks.push(
        <p key={key} className="my-2 text-sm leading-relaxed text-zinc-300">
          {renderInline(paraBuffer.join(" "), key)}
        </p>
      );
      paraBuffer = [];
    }
  };

  lines.forEach((raw, li) => {
    const line = raw.replace(/\s+$/, "");
    if (/^\|/.test(line)) {
      flushPara(`p${li}`);
      flushList(`l${li}`);
      tableBuffer.push(line);
      return;
    }
    if (tableBuffer.length) flushTable(`t${li}`);

    if (/^#{1,4}\s/.test(line)) {
      flushPara(`p${li}`);
      flushList(`l${li}`);
      const level = line.match(/^#+/)![0].length;
      const content = line.replace(/^#+\s/, "");
      const sizes = ["text-lg", "text-base", "text-sm", "text-sm"];
      blocks.push(
        <div key={`h${li}`} className={cn("mt-4 mb-1 font-semibold text-zinc-100", sizes[level - 1])}>
          {renderInline(content, `h${li}`)}
        </div>
      );
      return;
    }
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      flushPara(`p${li}`);
      listBuffer.push(line.replace(/^([-*]|\d+\.)\s/, ""));
      return;
    }
    if (listBuffer.length) flushList(`l${li}`);

    if (/^>\s?/.test(line)) {
      flushPara(`p${li}`);
      blocks.push(
        <blockquote key={`q${li}`} className="my-2 border-l-2 border-emerald-800 pl-3 text-sm text-zinc-400">
          {renderInline(line.replace(/^>\s?/, ""), `q${li}`)}
        </blockquote>
      );
      return;
    }
    if (/^---+$/.test(line)) {
      flushPara(`p${li}`);
      blocks.push(<hr key={`hr${li}`} className="my-4 border-zinc-800" />);
      return;
    }
    if (line.trim() === "") {
      flushPara(`p${li}`);
      return;
    }
    paraBuffer.push(line);
  });
  flushPara("p-end");
  flushList("l-end");
  flushTable("t-end");

  return <div className={className}>{blocks}</div>;
}
