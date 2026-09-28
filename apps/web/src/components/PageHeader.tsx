import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {children ? <div className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{children}</div> : null}
    </header>
  );
}
