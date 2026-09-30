import type { Metadata } from "next";
import { getAllReports } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ReportBrowser } from "@/components/ReportBrowser";
import { dataTypes, domains, taskTypes } from "@nolad/content/data/taxonomy";
import { techniqueById } from "@nolad/content/data/techniques";

export const metadata: Metadata = {
  title: "Reports",
  description: "Every documented competition, filterable by domain, data type, task, technique and deployability.",
};

export default function ReportsPage() {
  const reports = getAllReports().map((r) => ({
    slug: r.meta.slug,
    title: r.meta.shortTitle,
    year: r.meta.year,
    domain: r.meta.domain,
    dataTypes: r.meta.dataTypes,
    taskTypes: r.meta.taskTypes,
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
          domainNames={Object.fromEntries(domains.map((d) => [d.id, d.name]))}
          dataTypeNames={Object.fromEntries(dataTypes.map((d) => [d.id, d.name]))}
          taskTypeNames={Object.fromEntries(taskTypes.map((d) => [d.id, d.name]))}
          techniqueNames={techniqueNames}
        />
      </div>
    </>
  );
}
