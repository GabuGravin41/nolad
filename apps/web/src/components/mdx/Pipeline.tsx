export interface PipelineStep {
  title: string;
  detail?: string;
  tag?: string;
}

/** A left-to-right (top-to-bottom on phones) diagram of processing stages. */
export function Pipeline({ steps, caption }: { steps: PipelineStep[]; caption?: string }) {
  return (
    <figure className="pipeline">
      <ol className="pipeline-steps">
        {steps.map((s, i) => (
          <li key={i} className="pipeline-step">
            {s.tag ? <span className="pipeline-tag">{s.tag}</span> : null}
            <span className="pipeline-title">{s.title}</span>
            {s.detail ? <span className="pipeline-detail">{s.detail}</span> : null}
          </li>
        ))}
      </ol>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
