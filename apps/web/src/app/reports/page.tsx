import type { Metadata } from "next";
import { getAllReports } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ReportBrowser } from "@/components/ReportBrowser";
import { collections } from "@nolad/content/data/collections";
import { techniqueById } from "@nolad/content/data/techniques";

export const metadata: Metadata = {
  title: "Reports",
  description: "Every documented competition, filterable by field, modality, technique and deployability.",
};

export default function ReportsPage() {
  const reports = getAllReports().map((r) => ({
    slug: r.meta.slug,
    title: r.meta.shortTitle,
    year: r.meta.year,
    collection: r.meta.collection,
    field: r.meta.field,
    modality: r.meta.modality,
    tasks: r.meta.tasks,
    techniques: r.meta.techniques,
    winningIdea: r.meta.winningIdea,
    summary: r.meta.summary,
    deployability: r.meta.deployability.score,
    minutes: r.minutes,
    priority: r.meta.priority,
  }));
  const techniqueNames = Object.fromEntries(
    [...new Set(reports.flatMap((r) => r.techniques))].map((t) => [t, techniqueById.get(t)?.name ?? t]),
  );
  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Reports">
        {reports.length} competitions, each documented from the domain problem through the winning solution to what it
        would take to deploy it. Search or filter below.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ReportBrowser
          reports={reports}
          collections={collections.map((c) => ({ id: c.id, name: c.name }))}
          techniqueNames={techniqueNames}
        />
      </div>
    </>
  );
}
