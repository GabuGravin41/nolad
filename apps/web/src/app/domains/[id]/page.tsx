import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { domainById, domains, type DomainId } from "@nolad/content/data/taxonomy";
import { getAllReports } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ReportCard } from "@/components/ReportCard";

export function generateStaticParams() {
  const used = new Set(getAllReports().map((r) => r.meta.domain));
  return domains.filter((d) => used.has(d.id)).map((d) => ({ id: d.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = domainById.get(id as DomainId);
  return d ? { title: d.name, description: d.description } : {};
}

export default async function DomainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = domainById.get(id as DomainId);
  if (!d) notFound();
  const reports = getAllReports().filter((r) => r.meta.domain === d.id);
  return (
    <>
      <PageHeader eyebrow="Domain" title={d.name}>
        {d.description}
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {reports.map((r) => (
          <ReportCard key={r.meta.slug} report={r} />
        ))}
      </div>
    </>
  );
}
