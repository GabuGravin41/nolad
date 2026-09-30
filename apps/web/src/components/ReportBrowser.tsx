"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ScoreDots } from "./ScoreDots";

export interface BrowserReport {
  slug: string;
  title: string;
  year: number;
  domain: string;
  dataTypes: string[];
  taskTypes: string[];
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
type Names = Record<string, string>;

interface Filters {
  q: string;
  domain: string;
  data: string;
  task: string;
  technique: string;
  minDeploy: number;
  sort: Sort;
}

const initial: Filters = { q: "", domain: "all", data: "all", task: "all", technique: "all", minDeploy: 1, sort: "priority" };

/** Options that occur in at least one report, with counts, ordered by name. */
function optionsFor(reports: BrowserReport[], pick: (r: BrowserReport) => string[], names: Names) {
  const counts = new Map<string, number>();
  for (const r of reports) for (const v of pick(r)) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, n]) => ({ id, n, name: names[id] ?? id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function ReportBrowser({
  reports,
  domainNames,
  dataTypeNames,
  taskTypeNames,
  techniqueNames,
}: {
  reports: BrowserReport[];
  domainNames: Names;
  dataTypeNames: Names;
  taskTypeNames: Names;
  techniqueNames: Names;
}) {
  const [f, setF] = useState<Filters>(initial);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));

  // Filters are mirrored in the URL so a filtered view can be shared.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setF((prev) => ({
      ...prev,
      q: p.get("q") ?? prev.q,
      domain: p.get("domain") ?? prev.domain,
      data: p.get("data") ?? prev.data,
      task: p.get("task") ?? prev.task,
      technique: p.get("technique") ?? prev.technique,
      minDeploy: Number(p.get("deploy") ?? prev.minDeploy),
      sort: (p.get("sort") as Sort) ?? prev.sort,
    }));
  }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    if (f.q) p.set("q", f.q);
    if (f.domain !== "all") p.set("domain", f.domain);
    if (f.data !== "all") p.set("data", f.data);
    if (f.task !== "all") p.set("task", f.task);
    if (f.technique !== "all") p.set("technique", f.technique);
    if (f.minDeploy > 1) p.set("deploy", String(f.minDeploy));
    if (f.sort !== "priority") p.set("sort", f.sort);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [f]);

  const domainOpts = useMemo(() => optionsFor(reports, (r) => [r.domain], domainNames), [reports, domainNames]);
  const dataOpts = useMemo(() => optionsFor(reports, (r) => r.dataTypes, dataTypeNames), [reports, dataTypeNames]);
  const taskOpts = useMemo(() => optionsFor(reports, (r) => r.taskTypes, taskTypeNames), [reports, taskTypeNames]);
  const techOpts = useMemo(() => optionsFor(reports, (r) => r.techniques, techniqueNames), [reports, techniqueNames]);

  const shown = useMemo(() => {
    const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = reports.filter((r) => {
      if (f.domain !== "all" && r.domain !== f.domain) return false;
      if (f.data !== "all" && !r.dataTypes.includes(f.data)) return false;
      if (f.task !== "all" && !r.taskTypes.includes(f.task)) return false;
      if (f.technique !== "all" && !r.techniques.includes(f.technique)) return false;
      if (r.deployability < f.minDeploy) return false;
      if (!terms.length) return true;
      const hay = [
        r.title,
        r.field,
        r.summary,
        r.winningIdea,
        domainNames[r.domain] ?? r.domain,
        ...r.dataTypes.map((t) => dataTypeNames[t] ?? t),
        ...r.taskTypes.map((t) => taskTypeNames[t] ?? t),
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
    return [...list].sort(sorters[f.sort]);
  }, [reports, f, domainNames, dataTypeNames, taskTypeNames, techniqueNames]);

  const active =
    f.q !== "" || f.domain !== "all" || f.data !== "all" || f.task !== "all" || f.technique !== "all" || f.minDeploy > 1;

  const selectCls =
    "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-fg focus:border-accent focus:outline-none";

  const facet = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts: { id: string; n: number; name: string }[],
  ) => (
    <label className="grid gap-1 text-xs text-faint">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        <option value="all">All</option>
        {opts.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name} ({o.n})
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div>
      <div className="card grid gap-3 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="grid gap-1 text-xs text-faint">
            Search
            <input
              type="search"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="CT, segmentation, RNA, EEG, curriculum, 2021…"
              className={selectCls}
            />
          </label>
          <label className="grid gap-1 text-xs text-faint sm:w-48">
            Sort
            <select value={f.sort} onChange={(e) => set("sort", e.target.value as Sort)} className={selectCls}>
              <option value="priority">Nolad ranking</option>
              <option value="year">Newest</option>
              <option value="deployability">Most deployable</option>
              <option value="title">A–Z</option>
            </select>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {facet("Domain", f.domain, (v) => set("domain", v), domainOpts)}
          {facet("Data", f.data, (v) => set("data", v), dataOpts)}
          {facet("Task", f.task, (v) => set("task", v), taskOpts)}
          {facet("Technique", f.technique, (v) => set("technique", v), techOpts)}
          <label className="grid gap-1 text-xs text-faint">
            Deployability at least
            <select value={f.minDeploy} onChange={(e) => set("minDeploy", Number(e.target.value))} className={selectCls}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-faint" aria-live="polite">
        <span>
          {shown.length} of {reports.length} reports
        </span>
        {active ? (
          <button type="button" className="chip cursor-pointer" onClick={() => setF({ ...initial, sort: f.sort })}>
            Clear filters
          </button>
        ) : null}
      </div>

      <ul className="mt-3 grid gap-3">
        {shown.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/reports/${r.slug}`}
              className="card group grid gap-2 p-5 text-fg no-underline transition-colors hover:border-accent md:grid-cols-[1fr_auto]"
            >
              <div className="min-w-0">
                <p className="eyebrow">
                  #{r.priority} · {domainNames[r.domain] ?? r.domain} · {r.year} · {r.field}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight group-hover:text-accent">{r.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{r.winningIdea}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.dataTypes.map((x) => (
                    <span key={x} className="chip">
                      {dataTypeNames[x] ?? x}
                    </span>
                  ))}
                  {r.taskTypes.map((x) => (
                    <span key={x} className="chip">
                      {taskTypeNames[x] ?? x}
                    </span>
                  ))}
                  {r.techniques
                    .filter((t) => {
                      const n = (techniqueNames[t] ?? t).toLowerCase();
                      return !r.taskTypes.some((x) => (taskTypeNames[x] ?? x).toLowerCase() === n || n.endsWith(" " + (taskTypeNames[x] ?? x).toLowerCase()));
                    })
                    .slice(0, 3)
                    .map((t) => (
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
