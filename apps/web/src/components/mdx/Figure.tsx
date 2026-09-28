import type { ReactNode } from "react";

export function Figure({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="figure">
      <div className="figure-body">{children}</div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="facts">
      {items.map(([k, v]) => (
        <div key={k} className="fact">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Source({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="source-link">
      Source:{" "}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </p>
  );
}
