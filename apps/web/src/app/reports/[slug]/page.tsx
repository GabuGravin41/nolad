import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllReports, getReport, getFoundation, foundationRefs } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { techniqueById } from "@nolad/content/data/techniques";
import { collectionById } from "@nolad/content/data/collections";
import { DeployabilityCard } from "@/components/DeployabilityCard";
import { Toc } from "@/components/Toc";
import { DepthControls } from "@/components/DepthControls";
import { ReportCard } from "@/components/ReportCard";

export function generateStaticParams() {
  return getAllReports().map((r) => ({ slug: r.meta.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getReport(slug);
  if (!r) return {};
  return {
    title: r.meta.shortTitle,
    description: r.meta.summary,
    openGraph: { title: r.meta.title, description: r.meta.summary, type: "article" },
  };
}

function fmtDate(s: string) {
  const d = new Date(s + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) notFound();
  const m = report.meta;
  const content = await renderMDX(report.body);
  const related = m.related.map((s) => getReport(s)).filter(Boolean) as NonNullable<ReturnType<typeof getReport>>[];
  const foundations = foundationRefs(report.body)
    .map((id) => getFoundation(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getFoundation>>[];
  const winner = m.solutions[0];

  const facts: [string, string][] = [
    ["Host", m.host],
    ["Ran", `${fmtDate(m.dates.start)} – ${fmtDate(m.dates.end)}`],
    ["Metric", m.metric.name],
    ["Compute limit", `${m.constraints.runtime} · ${m.constraints.hardware}${m.constraints.internet ? "" : " · no internet"}`],
  ];

  return (
    <article className="pb-8">
      <header className="border-b border-line bg-sunken/50">
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6">
          <nav className="text-sm text-faint" aria-label="Breadcrumb">
            <Link href="/reports" className="text-faint no-underline hover:text-accent">
              Reports
            </Link>{" "}
            /{" "}
            <Link href={`/collections/${m.collection}`} className="text-faint no-underline hover:text-accent">
              {collectionById.get(m.collection)?.name}
            </Link>
          </nav>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{m.title}</h1>
          <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-muted">{m.summary}</p>
          <dl className="mt-6 grid max-w-5xl gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1 leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <a className="chip chip-accent" href={m.kaggleUrl} target="_blank" rel="noopener noreferrer">
              Competition on Kaggle ↗
            </a>
            <a className="chip" href={winner.writeup} target="_blank" rel="noopener noreferrer">
              Winning write-up ↗
            </a>
            {winner.code.map((c) => (
              <a key={c.url} className="chip" href={c.url} target="_blank" rel="noopener noreferrer">
                {c.label} ↗
              </a>
            ))}
            <span className="chip">{report.minutes} min read</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid gap-6 lg:max-w-[var(--measure)]">
            <section className="card p-5">
              <p className="eyebrow">The winning idea</p>
              <p className="mt-2 font-serif text-[1.05rem] leading-relaxed">{m.winningIdea}</p>
              <p className="mt-3 text-sm text-muted">
                1st place: <strong className="text-fg">{winner.team}</strong>
                {winner.members.length ? ` (${winner.members.map((p) => p.name).join(", ")})` : ""}.
              </p>
            </section>
            <DeployabilityCard d={m.deployability} />
            <div className="no-print flex flex-wrap items-center gap-3 text-sm text-muted">
              <DepthControls />
              <span>
                Coloured boxes are optional depth: <span style={{ color: "var(--math)" }}>derivations</span>,{" "}
                <span style={{ color: "var(--code)" }}>code</span>, <span style={{ color: "var(--domain)" }}>background</span>,{" "}
                <span style={{ color: "var(--accent)" }}>first principles</span>.
              </span>
            </div>
          </div>

          <div className="prose mt-4">{content}</div>

          <section className="prose mt-4" aria-labelledby="credits">
            <h2 id="credits">Solutions, credits and links</h2>
            <p>
              Every method described above belongs to the people listed here. Nolad reproduces no code or data; follow the
              links for the originals.
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Write-up</th>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {m.solutions.map((s) => (
                    <tr key={`${s.rank}-${s.team}`}>
                      <td>{s.rank}</td>
                      <td>
                        <strong>{s.team}</strong>
                        {s.members.length ? (
                          <>
                            <br />
                            <span className="text-muted">{s.members.map((p) => p.name).join(", ")}</span>
                          </>
                        ) : null}
                        {s.note ? (
                          <>
                            <br />
                            <span className="text-muted">{s.note}</span>
                          </>
                        ) : null}
                      </td>
                      <td>
                        <a href={s.writeup} target="_blank" rel="noopener noreferrer">
                          Kaggle
                        </a>
                      </td>
                      <td>
                        {s.code.length
                          ? s.code.map((c, i) => (
                              <span key={c.url}>
                                {i ? ", " : ""}
                                <a href={c.url} target="_blank" rel="noopener noreferrer">
                                  {c.label}
                                </a>
                              </span>
                            ))
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {m.papers.length ? (
              <>
                <h3 id="papers">Papers and further reading</h3>
                <ul>
                  {m.papers.map((p) => (
                    <li key={p.url}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {m.dataLinks.length ? (
              <>
                <h3 id="data">Data</h3>
                <ul>
                  {m.dataLinks.map((p) => (
                    <li key={p.url}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="text-sm text-muted">Last reviewed {fmtDate(m.updated)}.</p>
          </section>

          <section className="mt-12 lg:max-w-[var(--measure)]">
            <p className="eyebrow">Techniques in this report</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.techniques.map((t) => (
                <Link key={t} href={`/techniques/${t}`} className="chip">
                  {techniqueById.get(t)?.name ?? t}
                </Link>
              ))}
            </div>
            {foundations.length ? (
              <>
                <p className="eyebrow mt-6">First-principles blocks used</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {foundations.map((f) => (
                    <Link key={f.meta.id} href={`/foundations/${f.meta.id}`} className="chip">
                      {f.meta.title}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </section>

          {related.length ? (
            <section className="mt-12">
              <p className="eyebrow">Related reports</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <ReportCard key={r.meta.slug} report={r} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="no-print hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8">
            <Toc items={[...report.headings, { id: "credits", text: "Solutions, credits and links", depth: 2 }]} />
          </div>
        </aside>
      </div>
    </article>
  );
}
