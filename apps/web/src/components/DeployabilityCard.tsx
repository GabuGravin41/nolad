import type { Deployability } from "@nolad/content/schema";
import { ScoreDots } from "./ScoreDots";

const scale = [
  "",
  "Research artefact",
  "Needs substantial engineering",
  "Deployable with work",
  "Close to deployable",
  "Deployable as released",
];

export function DeployabilityCard({ d }: { d: Deployability }) {
  const rows: [string, string][] = [
    ["Inference", d.inference],
    ["Models", d.models],
    ["Training cost", d.training],
    ["External data", d.externalData],
    ["Code licence", d.licences.code],
    ["Data licence", d.licences.data],
    ["Weights", d.licences.weights],
  ];
  return (
    <section className="card p-5" aria-labelledby="deploy-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="deploy-heading" className="text-base font-semibold">
          Deployability
        </h2>
        <span className="flex items-center gap-2 text-sm text-muted">
          <ScoreDots score={d.score} label="Deployability" />
          <span>
            {d.score}/5 · {scale[d.score]}
          </span>
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{d.verdict}</p>
      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-0.5 leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      {d.risks.length ? (
        <div className="mt-4">
          <p className="eyebrow">Risks before deployment</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
            {d.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
