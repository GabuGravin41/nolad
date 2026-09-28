import type { ReactNode } from "react";

const labels = {
  math: "Derivation",
  code: "Code",
  domain: "Background",
  detail: "Detail",
  scratch: "From scratch",
} as const;

export type DeepKind = keyof typeof labels;

/**
 * A collapsible section. Readers who want the short version skip it;
 * readers who want every step open it.
 */
export function Deep({
  title,
  kind = "detail",
  open = false,
  children,
}: {
  title: string;
  kind?: DeepKind;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details className={`deep deep-${kind}`} data-deep open={open}>
      <summary>
        <span className="deep-badge">{labels[kind]}</span>
        <span className="deep-title">{title}</span>
        <span className="deep-chevron" aria-hidden>
          ▸
        </span>
      </summary>
      <div className="deep-body">{children}</div>
    </details>
  );
}
