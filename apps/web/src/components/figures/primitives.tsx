import type { ReactNode } from "react";

/**
 * Shared drawing primitives for Nolad figures. All colours come from CSS
 * classes (see `.dg-*` in globals.css), so figures follow the light and dark
 * themes. Marker ids are prefixed per figure to stay unique on a page.
 */

export function Svg({
  id,
  width,
  height,
  label,
  minWidth = 560,
  children,
}: {
  id: string;
  width: number;
  height: number;
  label: string;
  minWidth?: number;
  children: ReactNode;
}) {
  return (
    <svg
      className="dg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      style={{ minWidth }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="dg-arrowhead" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function Arrow({
  fig,
  x1,
  y1,
  x2,
  y2,
  label,
  labelDy = -6,
}: {
  fig: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  labelDy?: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="dg-link" markerEnd={`url(#${fig}-arrow)`} />
      {label ? (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + labelDy} className="dg-small" textAnchor="middle">
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** A box with a bold title and lines of smaller text below it. */
export function Box({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  tone = "plain",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  tone?: "plain" | "accent";
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={tone === "accent" ? "dg-box dg-box-accent" : "dg-box"} />
      <text x={x + 12} y={y + 22} className="dg-title">
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 12} y={y + 42 + i * 17} className="dg-small">
          {l}
        </text>
      ))}
    </g>
  );
}

/** A numbered marker used to key locations to a list. */
export function Marker({ x, y, n }: { x: number; y: number; n: number | string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="dg-mark" />
      <text x={x} y={y + 4} className="dg-mark-text" textAnchor="middle">
        {n}
      </text>
    </g>
  );
}
