import type { Metadata } from "next";
import Link from "next/link";
import { getAllReports, getFoundations, foundationRefs } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Foundations",
  description: "First-principles explanations embedded in the reports: mathematics, machine learning, domain knowledge and engineering.",
};

const kinds = [
  { id: "math", name: "Mathematics" },
  { id: "ml", name: "Machine learning" },
  { id: "domain", name: "Domain knowledge" },
  { id: "engineering", name: "Engineering" },
] as const;

export default function FoundationsPage() {
  const all = [...getFoundations().values()];
  const usage = new Map<string, number>();
  for (const r of getAllReports()) for (const id of foundationRefs(r.body)) usage.set(id, (usage.get(id) ?? 0) + 1);
  return (
    <>
      <PageHeader eyebrow="Built once, embedded everywhere" title="Foundations">
        Each block explains one idea from the beginning. Reports embed the blocks they rely on, collapsed, so a reader
        with a weak background in machine learning or in the field can open them in place. They can also be read here
        on their own.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6">
        {kinds.map((k) => {
          const items = all.filter((f) => f.meta.kind === k.id).sort((a, b) => a.meta.title.localeCompare(b.meta.title));
          if (!items.length) return null;
          return (
            <section key={k.id}>
              <h2 className="text-xl font-semibold tracking-tight">{k.name}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((f) => (
                  <Link key={f.meta.id} href={`/foundations/${f.meta.id}`} className="card group p-4 text-fg no-underline hover:border-accent">
                    <h3 className="font-semibold group-hover:text-accent">{f.meta.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{f.meta.summary}</p>
                    <p className="mt-2 text-xs text-faint">
                      Used in {usage.get(f.meta.id) ?? 0} report{usage.get(f.meta.id) === 1 ? "" : "s"} · {Math.max(1, Math.round(f.words / 230))} min
                    </p>
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
