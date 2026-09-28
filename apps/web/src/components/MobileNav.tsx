"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        className="chip cursor-pointer"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <nav
          id="mobile-nav"
          className="card absolute right-4 left-4 top-16 z-50 grid gap-1 p-2"
          aria-label="Main"
          onClick={() => setOpen(false)}
        >
          {items.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-fg no-underline hover:bg-sunken">
              {n.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
