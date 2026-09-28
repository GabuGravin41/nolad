import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, collectionById } from "@nolad/content/data/collections";
import type { CollectionId } from "@nolad/content/schema";
import { getAllReports } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ReportCard } from "@/components/ReportCard";

export function generateStaticParams() {
  return collections.map((c) => ({ id: c.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = collectionById.get(id as CollectionId);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = collectionById.get(id as CollectionId);
  if (!c) notFound();
  const reports = getAllReports().filter((r) => r.meta.collection === c.id);
  return (
    <>
      <PageHeader eyebrow={c.tagline} title={c.name}>
        {c.description}
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {reports.map((r) => (
          <ReportCard key={r.meta.slug} report={r} />
        ))}
      </div>
    </>
  );
}
