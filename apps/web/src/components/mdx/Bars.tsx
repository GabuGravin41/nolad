/**
 * Horizontal bar chart for ablations and comparisons. Values are drawn
 * relative to `domain`; labels and values are always printed as text.
 */
export function Bars({
  data,
  domain,
  unit = "",
  caption,
  highlight,
  decimals = 3,
}: {
  data: [string, number][];
  domain?: [number, number];
  unit?: string;
  caption?: string;
  highlight?: string;
  decimals?: number;
}) {
  const values = data.map((d) => d[1]);
  const lo = domain?.[0] ?? Math.min(0, ...values);
  const hi = domain?.[1] ?? Math.max(...values);
  const span = hi - lo || 1;
  return (
    <figure className="bars">
      <div className="bars-rows">
        {data.map(([label, v]) => (
          <div key={label} className={`bars-row${highlight === label ? " is-highlight" : ""}`}>
            <span className="bars-label">{label}</span>
            <span className="bars-track">
              <span className="bars-fill" style={{ width: `${Math.max(0, Math.min(1, (v - lo) / span)) * 100}%` }} />
            </span>
            <span className="bars-value">
              {v.toFixed(decimals)}
              {unit}
            </span>
          </div>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
