"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ScoreDots } from "./ScoreDots";

export interface BrowserReport {
  slug: string;
  title: string;
  year: number;
  collection: string;
  field: string;
  modality: string[];
  tasks: string[];
  techniques: string[];
  winningIdea: string;
  summary: string;
  deployability: number;
  minutes: number;
  priority: number;
}

type Sort = "priority" | "year" | "deployability" | "title";

export function ReportBrowser({
  reports,
  collections,
  techniqueNames,
}: {
  reports: BrowserReport[];
  collections: { id: string; name: string }[];
  techniqueNames: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const [collection, setCollection] = useState<string>("all");
  const [technique, setTechnique] = useState<string>("all");
  const [minDeploy, setMinDeploy] = useState(1);
  const [sort, setSort] = useState<Sort>("priority");

  const techniqueOptions = useMemo(
    () => Object.entries(techniqueNames).sort((a, b) => a[1].localeCompare(b[1])),
    [techniqueNames],
  );

  const shown = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = reports.filter((r) => {
      if (collection !== "all" && r.collection !== collection) return false;
      if (technique !== "all" && !r.techniques.includes(technique)) return false;
      if (r.deployability < minDeploy) return false;
      if (!terms.length) return true;
      const hay = [
        r.title,
        r.field,
        r.summary,
        r.winningIdea,
        ...r.modality,
        ...r.tasks,
        ...r.techniques.map((t) => techniqueNames[t] ?? t),
        String(r.year),
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    const sorters: Record<Sort, (a: BrowserReport, b: BrowserReport) => number> = {
      priority: (a, b) => a.priority - b.priority,
      year: (a, b) => b.year - a.year || a.priority - b.priority,
      deployability: (a, b) => b.deployability - a.deployability || a.priority - b.priority,
      title: (a, b) => a.title.localeCompare(b.title),
    };
    return [...list].sort(sorters[sort]);
  }, [reports, q, collection, technique, minDeploy, sort, techniqueNames]);

  const selectCls =
    "rounded-lg border border-line bg-raised px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none";

  return (
    <div>
      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.4fr_1fr_1fr]">
        <label className="grid gap-1 text-xs text-faint">
          Search
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="CT, segmentation, RNA, EEG, 2021…"
            className={selectCls}
          />
        </label>
        <label className="grid gap-1 text-xs text-faint">
          Collection
          <select value={collection} onChange={(e) => setCollection(e.target.value)} className={selectCls}>
            <option value="all">All</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-faint">
          Technique
          <select value={technique} onChange={(e) => setTechnique(e.target.value)} className={selectCls}>
            <option value="all">Any</option>
            {techniqueOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-faint">
          Deployability at least
          <select value={minDeploy} onChange={(e) => setMinDeploy(Number(e.target.value))} className={selectCls}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-faint">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
            <option value="priority">Nolad ranking</option>
            <option value="year">Newest</option>
            <option value="deployability">Most deployable</option>
            <option value="title">A–Z</option>
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-faint" aria-live="polite">
        {shown.length} of {reports.length} reports
      </p>

      <ul className="mt-3 grid gap-3">
        {shown.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/reports/${r.slug}`}
              className="card group grid gap-2 p-5 text-fg no-underline transition-colors hover:border-accent md:grid-cols-[1fr_auto]"
            >
              <div className="min-w-0">
                <p className="eyebrow">
                  #{r.priority} · {collections.find((c) => c.id === r.collection)?.name} · {r.year} · {r.field}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight group-hover:text-accent">{r.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.winningIdea}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.modality.map((x) => (
                    <span key={x} className="chip">
                      {x}
                    </span>
                  ))}
                  {r.techniques.slice(0, 4).map((t) => (
                    <span key={t} className="chip">
                      {techniqueNames[t] ?? t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-4 text-xs text-faint md:flex-col md:items-end">
                <span className="flex items-center gap-2" title="Deployability">
                  <ScoreDots score={r.deployability} label="Deployability" />
                </span>
                <span>{r.minutes} min read</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {!shown.length ? <p className="mt-8 text-muted">No reports match these filters.</p> : null}
    </div>
  );
}
