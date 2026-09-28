import type { Metadata } from "next";
import Link from "next/link";
import { criteria, ranked, rejected, weightedScore } from "@nolad/content/data/ranking";
import { getReport } from "@/lib/content";
import { PageHeader } from "@/components/PageHeader";
import { ScoreDots } from "@/components/ScoreDots";

export const metadata: Metadata = {
  title: "Ranking",
  description: "The scores and reasons behind the order in which competitions were documented.",
};

export default function RankingPage() {
  const rows = [...ranked]
    .map((r, i) => ({ ...r, total: weightedScore(r.scores), i }))
    .sort((a, b) => b.total - a.total || a.i - b.i);
  return (
    <>
      <PageHeader eyebrow="Method" title="Ranking">
        The first {ranked.length} competitions, scored on five weighted criteria. The total sets the order in which
        reports were written and the default order of the catalogue.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="bg-sunken text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Competition</th>
                {criteria.map((c) => (
                  <th key={c.id} className="px-3 py-3 font-semibold" title={c.question}>
                    {c.name}
                    <span className="block text-xs font-normal text-faint">{Math.round(c.weight * 100)}%</span>
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => {
                const has = Boolean(getReport(r.slug));
                return (
                  <tr key={r.slug} className="border-t border-line align-top">
                    <td className="px-4 py-3 text-faint">{idx + 1}</td>
                    <td className="px-4 py-3">
                      {has ? <Link href={`/reports/${r.slug}`}>{r.name}</Link> : r.name}
                      <p className="mt-1 max-w-md text-xs leading-relaxed text-muted">{r.reason}</p>
                    </td>
                    {criteria.map((c) => (
                      <td key={c.id} className="px-3 py-3">
                        <ScoreDots score={r.scores[c.id]} label={c.name} />
                      </td>
                    ))}
                    <td className="px-4 py-3 font-semibold tabular-nums">{r.total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight">Considered and set aside</h2>
          <ul className="mt-4 grid gap-4">
            {rejected.map((r) => (
              <li key={r.slug} className="card p-4">
                <p className="font-semibold">{r.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
