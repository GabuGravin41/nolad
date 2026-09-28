"use client";

import { useState } from "react";

/** Open or close every collapsible derivation, code walk-through and background block at once. */
export function DepthControls() {
  const [open, setOpen] = useState(false);
  function toggle() {
    const next = !open;
    document.querySelectorAll<HTMLDetailsElement>("details[data-deep]").forEach((d) => {
      d.open = next;
    });
    setOpen(next);
  }
  return (
    <button type="button" onClick={toggle} className="chip cursor-pointer" aria-pressed={open}>
      {open ? "Collapse all details" : "Expand all details"}
    </button>
  );
}
