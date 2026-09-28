import type { Metadata } from "next";
import Link from "next/link";
import { collections } from "@nolad/content/data/collections";
import { getAllReports } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  const reports = getAllReports();
  return (
    <>
      <PageHeader eyebrow="Shelves" title="Collections">
        Reports grouped by field. MedLab was the starting point; the other two collections hold competitions that share
        its techniques or its constraints.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
        {collections.map((c) => {
          const list = reports.filter((r) => r.meta.collection === c.id);
          return (
            <Link key={c.id} href={`/collections/${c.id}`} className="card group p-6 text-fg no-underline hover:border-accent">
              <p className="eyebrow">{list.length} reports</p>
              <h2 className="mt-2 text-xl font-semibold group-hover:text-accent">{c.name}</h2>
              <p className="mt-1 text-sm font-medium text-muted">{c.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{c.description}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
