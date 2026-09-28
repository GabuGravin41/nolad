import Link from "next/link";
import { site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

export const nav = [
  { href: "/reports", label: "Reports" },
  { href: "/techniques", label: "Techniques" },
  { href: "/collections", label: "Collections" },
  { href: "/foundations", label: "Foundations" },
  { href: "/method", label: "Method" },
  { href: "/about", label: "About" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden>
        <circle cx="12" cy="16" r="9" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <circle cx="20" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className="font-semibold tracking-tight">{site.name}</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="text-fg no-underline" aria-label="Nolad home">
          <Logo />
        </Link>
        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted no-underline hover:bg-sunken hover:text-fg"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={site.parent.url}
            className="hidden text-xs text-faint no-underline hover:text-accent lg:inline"
            target="_blank"
            rel="noopener noreferrer"
          >
            A {site.parent.name} project ↗
          </a>
          <ThemeToggle />
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
