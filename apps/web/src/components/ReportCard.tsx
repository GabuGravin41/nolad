import Link from "next/link";
import type { Report } from "@/lib/content";
import { domainById } from "@nolad/content/data/taxonomy";
import { ScoreDots } from "./ScoreDots";

export function ReportCard({ report }: { report: Report }) {
  const m = report.meta;
  return (
    <Link
      href={`/reports/${m.slug}`}
      className="card group flex h-full flex-col gap-3 p-5 text-fg no-underline transition-colors hover:border-accent"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">
          {domainById.get(m.domain)?.name} · {m.year}
        </span>
        <span className="flex items-center gap-2 text-xs text-faint" title="Deployability">
          <ScoreDots score={m.deployability.score} label="Deployability" />
        </span>
      </div>
      <h3 className="text-lg font-semibold leading-snug tracking-tight group-hover:text-accent">{m.shortTitle}</h3>
      <p className="text-sm leading-relaxed text-muted">{m.winningIdea}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        <span className="chip">{m.field}</span>
        {m.modality.slice(0, 2).map((x) => (
          <span key={x} className="chip">
            {x}
          </span>
        ))}
        <span className="chip">{report.minutes} min</span>
      </div>
    </Link>
  );
}
