import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-sunken/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted">
            {site.expansion}. Solutions stay with their authors: Nolad links to their code and data and credits the people
            who built them.
          </p>
          <p className="text-sm text-muted">
            A project of{" "}
            <a href={site.parent.url} target="_blank" rel="noopener noreferrer">
              {site.parent.name}
            </a>
            , {site.parent.description.replace(/^A /, "a ")}.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="eyebrow">Read</p>
            <Link className="block text-muted no-underline hover:text-fg" href="/reports">Reports</Link>
            <Link className="block text-muted no-underline hover:text-fg" href="/techniques">Techniques</Link>
            <Link className="block text-muted no-underline hover:text-fg" href="/domains">Domains</Link>
            <Link className="block text-muted no-underline hover:text-fg" href="/foundations">Foundations</Link>
          </div>
          <div className="space-y-2">
            <p className="eyebrow">Project</p>
            <Link className="block text-muted no-underline hover:text-fg" href="/method">Method</Link>
            <Link className="block text-muted no-underline hover:text-fg" href="/method/ranking">Ranking</Link>
            <Link className="block text-muted no-underline hover:text-fg" href="/about">About</Link>
            <a className="block text-muted no-underline hover:text-fg" href={site.repo} target="_blank" rel="noopener noreferrer">Source</a>
          </div>
        </div>
        <div className="space-y-2 text-sm text-muted">
          <p className="eyebrow">Licences</p>
          <p>
            Nolad&apos;s own writing and diagrams: CC BY 4.0. Site code: MIT. Competition data, solution code and model
            weights belong to their owners under their own licences, which each report states.
          </p>
          <p>
            Contact:{" "}
            {site.emails.map((email, idx) => (
              <span key={email}>
                {idx > 0 && ", "}
                <a href={`mailto:${email}`}>{email}</a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
