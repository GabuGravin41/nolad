import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { techniques, techniqueById, techniqueGroups } from "@nolad/content/data/techniques";
import { reportsByTechnique } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ReportCard } from "@/components/ReportCard";

export function generateStaticParams() {
  return techniques.filter((t) => reportsByTechnique(t.id).length > 0).map((t) => ({ id: t.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = techniqueById.get(id);
  return t ? { title: t.name, description: t.description } : {};
}

export default async function TechniquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = techniqueById.get(id);
  if (!t) notFound();
  const reports = reportsByTechnique(id);
  const group = techniqueGroups.find((g) => g.id === t.group);
  const siblings = techniques.filter((x) => x.group === t.group && x.id !== t.id && reportsByTechnique(x.id).length);
  return (
    <>
      <PageHeader eyebrow={group?.name} title={t.name}>
        {t.description}
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-sm text-faint">
          Used in {reports.length} report{reports.length === 1 ? "" : "s"}, ordered by Nolad ranking.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <ReportCard key={r.meta.slug} report={r} />
          ))}
        </div>
        {siblings.length ? (
          <section className="mt-14">
            <p className="eyebrow">Other {group?.name.toLowerCase()}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <Link key={s.id} href={`/techniques/${s.id}`} className="chip">
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
