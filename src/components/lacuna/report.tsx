"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBox, LoadingBlock, MarkdownLite, SectionHeader } from "./ui-bits";

interface ReportResponse {
  notice: string;
  finalReport: string;
  modelCard: string;
  cliReference: string;
}

export function ReportSection() {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/report")
      .then((r) => r.json())
      .then((d: ReportResponse) => setData(d))
      .catch(() => setError("Failed to load report."));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!data) return <LoadingBlock lines={8} />;

  return (
    <div className="space-y-6">
      <SectionHeader
        kicker="lacuna report"
        title="Final report, model card & CLI reference"
        description="The research run's final report rendered verbatim from FINAL_REPORT.md — including its FAILs and UNVERIFIED items. The model card documents intended use and limitations of the released artefact."
      />

      <Tabs defaultValue="final">
        <TabsList className="bg-zinc-800/60">
          <TabsTrigger value="final" className="text-xs">
            Final report
          </TabsTrigger>
          <TabsTrigger value="model" className="text-xs">
            Model card
          </TabsTrigger>
          <TabsTrigger value="cli" className="text-xs">
            CLI reference
          </TabsTrigger>
        </TabsList>
        <TabsContent value="final" className="mt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="py-4">
              <MarkdownLite text={data.finalReport} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="model" className="mt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Model card — lacuna-amr pilot models</CardTitle>
              <CardDescription>models/MODEL_CARD.md, rendered verbatim.</CardDescription>
            </CardHeader>
            <CardContent>
              <MarkdownLite text={data.modelCard} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cli" className="mt-4">
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="py-4">
              <MarkdownLite text={data.cliReference} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
