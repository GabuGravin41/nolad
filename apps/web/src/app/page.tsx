import Link from "next/link";
import { getAllReports, getFoundations } from "@/lib/content";
import { domains } from "@nolad/content/data/taxonomy";
import { techniques, techniqueGroups } from "@nolad/content/data/techniques";
import { ReportCard } from "@/components/ReportCard";
import { site } from "@/lib/site";

export default function Home() {
  const reports = getAllReports();
  const foundations = getFoundations();
  const featured = reports.slice(0, 6);
  const usedTechniques = new Set(reports.flatMap((r) => r.meta.techniques));
  const totalWords = reports.reduce((s, r) => s + r.words, 0);

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 pb-14 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:pt-24">
          <div>
            <p className="eyebrow">{site.expansion}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              The best solutions from Kaggle, documented so they outlive the deadline.
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-muted">
              When a competition closes, its winning solutions sit in forum threads and notebooks, written for people who
              already understand them. Many of them are among the strongest methods available for their problem, and
              most were built under hard limits on compute and inference time. Nolad selects the deployable ones and
              explains each from the domain problem and the mathematics up, with links to the original code and credit
              to the people who wrote it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reports" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] no-underline hover:opacity-90">
                Browse the reports
              </Link>
              <Link href="/method" className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg no-underline hover:border-accent">
                How reports are made
              </Link>
            </div>
          </div>
          <div className="card grid content-start gap-5 p-6">
            <p className="eyebrow">How to read a report</p>
            <ol className="grid gap-4 text-sm leading-relaxed">
              <li>
                <strong className="text-fg">Skim.</strong>{" "}
                <span className="text-muted">The summary, the method in brief and the deployability card give the result in two minutes.</span>
              </li>
              <li>
                <strong className="text-fg">Read.</strong>{" "}
                <span className="text-muted">The main text explains the problem, the data, the metric and the solution in plain language.</span>
              </li>
              <li>
                <strong className="text-fg">Open the boxes.</strong>{" "}
                <span className="text-muted">
                  Coloured boxes hold derivations, code walk-throughs, domain background, and
                  first-principles explanations of every technique. Open only the ones you need.
                </span>
              </li>
            </ol>
            <dl className="grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
              <div>
                <dt className="eyebrow">Reports</dt>
                <dd className="mt-1 text-2xl font-semibold">{reports.length}</dd>
              </div>
              <div>
                <dt className="eyebrow">Techniques</dt>
                <dd className="mt-1 text-2xl font-semibold">{usedTechniques.size}</dd>
              </div>
              <div>
                <dt className="eyebrow">Words</dt>
                <dd className="mt-1 text-2xl font-semibold">{Math.round(totalWords / 1000)}k</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Highest-ranked reports</h2>
          </div>
          <Link href="/method/ranking" className="text-sm">
            How the ranking works →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <ReportCard key={r.meta.slug} report={r} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <p className="eyebrow">Domains</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Competitions by field</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((d) => {
            const n = reports.filter((r) => r.meta.domain === d.id).length;
            if (!n) return null;
            return (
              <Link key={d.id} href={`/domains/${d.id}`} className="card group p-5 text-fg no-underline hover:border-accent">
                <p className="eyebrow">
                  {n} {n === 1 ? "report" : "reports"}
                </p>
                <h3 className="mt-2 text-lg font-semibold group-hover:text-accent">{d.name}</h3>
                <p className="mt-1 text-sm text-muted">{d.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Techniques</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Organised by method as well as by problem</h2>
            <p className="mt-4 font-serif text-lg leading-relaxed text-muted">
              The same idea often wins in unrelated fields. Stacking neighbouring CT slices as image channels won in
              haemorrhage detection, reappeared in spine fracture and abdominal trauma, and has a close relative in
              ink detection on carbonised papyrus. Each technique page lists every report that uses it and how the use
              differed.
            </p>
            <Link href="/techniques" className="mt-4 inline-block text-sm">
              All techniques →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {techniqueGroups.map((g) => {
              const items = techniques.filter((t) => t.group === g.id && usedTechniques.has(t.id));
              return (
                <div key={g.id} className="card p-4">
                  <p className="text-sm font-semibold">{g.name}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {items.slice(0, 7).map((t) => (
                      <Link key={t.id} href={`/techniques/${t.id}`} className="chip">
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="card grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow">Foundations</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              {foundations.size} first-principles explanations, embedded where they are needed
            </h2>
            <p className="mt-2 max-w-3xl text-muted">
              Cross-entropy from maximum likelihood, convolution, attention, the Dice coefficient, Hounsfield units,
              gradient boosting and more. Each report embeds the ones it relies on, so a report can be read on its own.
            </p>
          </div>
          <Link href="/foundations" className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-fg no-underline hover:border-accent">
            Browse foundations
          </Link>
        </div>
      </section>
    </>
  );
}
