import type { ReactNode } from "react";

const titles = {
  note: "Note",
  key: "Key point",
  caution: "Caution",
  credit: "Credit",
  deploy: "Deployment",
} as const;

export function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: keyof typeof titles;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout-${kind}`}>
      <p className="callout-title">{title ?? titles[kind]}</p>
      <div className="callout-body">{children}</div>
    </aside>
  );
}
