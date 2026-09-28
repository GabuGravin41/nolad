import type { Metadata } from "next";
import Link from "next/link";
import { techniques, techniqueGroups } from "@nolad/content/data/techniques";
import { reportsByTechnique } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Techniques",
  description: "Every technique used by the documented solutions, grouped by role, with the competitions that used it.",
};

export default function TechniquesPage() {
  return (
    <>
      <PageHeader eyebrow="Clusters" title="Techniques">
        Solutions grouped by method rather than by problem. Each page lists the competitions that used a technique and
        what varied between them.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6">
        {techniqueGroups.map((g) => {
          const items = techniques
            .filter((t) => t.group === g.id)
            .map((t) => ({ t, n: reportsByTechnique(t.id).length }))
            .filter((x) => x.n > 0)
            .sort((a, b) => b.n - a.n);
          if (!items.length) return null;
          return (
            <section key={g.id}>
              <h2 className="text-xl font-semibold tracking-tight">{g.name}</h2>
              <p className="mt-1 max-w-3xl text-sm text-muted">{g.description}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(({ t, n }) => (
                  <Link key={t.id} href={`/techniques/${t.id}`} className="card group p-4 text-fg no-underline hover:border-accent">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold group-hover:text-accent">{t.name}</h3>
                      <span className="text-xs text-faint">{n} report{n === 1 ? "" : "s"}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
