"use client";

import { useEffect, type MouseEvent } from "react";

function collapse(e: MouseEvent<HTMLElement>) {
  const details = e.currentTarget.closest("details");
  if (details) details.open = false;
}

/** Full-height clickable strip on the left border of an open section. */
export function DeepRail() {
  return (
    <button type="button" className="deep-rail" onClick={collapse} aria-label="Collapse this section" title="Collapse">
      <span className="deep-rail-bar" aria-hidden />
    </button>
  );
}

/** Control at the end of an open section. */
export function DeepFooter() {
  return (
    <div className="deep-footer">
      <button type="button" className="deep-collapse" onClick={collapse}>
        <span aria-hidden>▴</span> Collapse
      </button>
    </div>
  );
}

/**
 * Mounted once per page. When a collapsible section closes while its header
 * is above the viewport (it was closed from the sticky header, the rail or
 * the footer), the header is scrolled back to the top of the viewport, so
 * reading continues with the text that follows the section.
 */
export function DeepPlaceKeeper() {
  useEffect(() => {
    function onToggle(ev: Event) {
      const d = ev.target;
      if (!(d instanceof HTMLDetailsElement) || !d.hasAttribute("data-deep") || d.open) return;
      const summary = d.querySelector(":scope > summary");
      if (summary && summary.getBoundingClientRect().top < 0) {
        summary.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
      }
    }
    document.addEventListener("toggle", onToggle, true);
    return () => document.removeEventListener("toggle", onToggle, true);
  }, []);
  return null;
}
