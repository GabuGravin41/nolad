import type { Metadata } from "next";
import Link from "next/link";
import { domains } from "@nolad/content/data/taxonomy";
import { getAllReports } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Domains",
  description: "Reports grouped by the field each competition comes from.",
};

export default function DomainsPage() {
  const reports = getAllReports();
  const present = domains
    .map((d) => ({ d, n: reports.filter((r) => r.meta.domain === d.id).length }))
    .filter((x) => x.n > 0);
  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Domains">
        Reports grouped by the field each competition comes from. The same competitions can also be browsed by data
        type, task and technique on the reports page.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {present.map(({ d, n }) => (
          <Link key={d.id} href={`/domains/${d.id}`} className="card group p-6 text-fg no-underline hover:border-accent">
            <p className="eyebrow">
              {n} {n === 1 ? "report" : "reports"}
            </p>
            <h2 className="mt-2 text-xl font-semibold group-hover:text-accent">{d.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
