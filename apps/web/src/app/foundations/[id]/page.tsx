import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllReports, getFoundation, getFoundations, foundationRefs } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { PageHeader } from "@/components/PageHeader";

export function generateStaticParams() {
  return [...getFoundations().keys()].map((id) => ({ id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const f = getFoundation(id);
  return f ? { title: f.meta.title, description: f.meta.summary } : {};
}

export default async function FoundationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = getFoundation(id);
  if (!f) notFound();
  const content = await renderMDX(f.body);
  const usedIn = getAllReports().filter((r) => foundationRefs(r.body).includes(id));
  return (
    <>
      <PageHeader eyebrow="Foundation" title={f.meta.title}>
        {f.meta.summary}
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="prose">{content}</div>
        {usedIn.length ? (
          <section className="mt-14">
            <p className="eyebrow">Embedded in</p>
            <ul className="mt-3 grid gap-1 text-sm">
              {usedIn.map((r) => (
                <li key={r.meta.slug}>
                  <Link href={`/reports/${r.meta.slug}#foundation-${id}`}>{r.meta.shortTitle}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
