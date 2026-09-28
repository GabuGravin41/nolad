/**
 * Server-rendered function plots. Reports name a function from the registry
 * and its parameters; the curve is sampled at build time and drawn as SVG,
 * so it scales, prints and follows the colour theme.
 */

type Params = Record<string, number>;

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const plotFunctions: Record<string, (x: number, p: Params) => number> = {
  sigmoid: (x) => sigmoid(x),
  /** CT window: linear ramp from c - w/2 to c + w/2, clipped to [0, 1]. */
  window: (x, p) => Math.min(1, Math.max(0, (x - (p.c - p.w / 2)) / p.w)),
  /** -log(p) : loss for a positive example as a function of predicted probability. */
  "bce-pos": (x) => -Math.log(Math.max(x, 1e-6)),
  /** -log(1-p) : loss for a negative example. */
  "bce-neg": (x) => -Math.log(Math.max(1 - x, 1e-6)),
  /** Focal loss for a positive example, -(1-p)^gamma log p. */
  focal: (x, p) => -Math.pow(1 - x, p.gamma ?? 2) * Math.log(Math.max(x, 1e-6)),
  /** Weighted log loss for a positive example with weight w. */
  "weighted-bce-pos": (x, p) => -(p.w ?? 1) * Math.log(Math.max(x, 1e-6)),
  relu: (x) => Math.max(0, x),
  gelu: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
  swish: (x) => x * sigmoid(x),
  tanh: (x) => Math.tanh(x),
  /** Cosine learning-rate schedule with linear warmup; x = fraction of training. */
  "cosine-warmup": (x, p) => {
    const w = p.warmup ?? 0.05;
    const lo = p.min ?? 0;
    if (x < w) return (x / w) * (1 - lo) + lo;
    return lo + 0.5 * (1 - lo) * (1 + Math.cos((Math.PI * (x - w)) / (1 - w)));
  },
  /** Generalised (power) mean of two activations a and b as a function of the exponent p = x. */
  "gem-two": (x, p) => Math.pow((Math.pow(p.a ?? 0.2, x) + Math.pow(p.b ?? 1, x)) / 2, 1 / x),
  /** F-beta as a function of recall at fixed precision. */
  "fbeta-recall": (x, p) => {
    const b2 = (p.beta ?? 1) ** 2;
    const P = p.precision ?? 0.5;
    return ((1 + b2) * P * x) / (b2 * P + x || 1e-9);
  },
  /** Quadratic kappa weight for a disagreement of size x out of N-1 classes. */
  "qwk-weight": (x, p) => (x * x) / (((p.n ?? 5) - 1) ** 2),
  /** Soft-Dice loss for a single positive pixel vs predicted probability. */
  "dice-single": (x) => 1 - (2 * x) / (x + 1),
  /** Gaussian heat-map profile, sigma = s. */
  gaussian: (x, p) => Math.exp(-(x * x) / (2 * (p.s ?? 1) ** 2)),
  /** Keypoint similarity exp(-d^2 / 2r^2). */
  oks: (x, p) => Math.exp(-(x * x) / (2 * (p.r ?? 1) ** 2)),
  /** Two-class softmax with temperature t, as a function of the logit gap x. */
  "softmax-2": (x, p) => Math.exp(x / (p.t ?? 1)) / (Math.exp(x / (p.t ?? 1)) + 1),
  /** Mel scale. */
  mel: (x) => 2595 * Math.log10(1 + x / 700),
  /** Expected log loss of always predicting q = x when the positive rate is pi (minimised at q = pi). */
  "constant-logloss": (x, p) => {
    const pi = p.pi ?? 0.1;
    const q = Math.min(Math.max(x, 1e-6), 1 - 1e-6);
    return -(pi * Math.log(q) + (1 - pi) * Math.log(1 - q));
  },
  /** Triangular soft target around an event, half-width w. */
  "decay-target": (x, p) => Math.max(0, 1 - Math.abs(x) / (p.w ?? 1)),
};

export interface PlotSeries {
  fn: keyof typeof plotFunctions | string;
  params?: Params;
  label: string;
}

const palette = ["var(--plot-1)", "var(--plot-2)", "var(--plot-3)", "var(--plot-4)", "var(--plot-5)"];

function ticks(lo: number, hi: number, n = 5): number[] {
  const span = hi - lo;
  const raw = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n) ?? raw;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

function fmt(v: number): string {
  if (Math.abs(v) >= 1000) return v.toLocaleString("en-US");
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(Math.abs(v) < 1 ? 2 : 1).replace(/0+$/, "").replace(/\.$/, "");
}

export function Plot({
  series,
  x,
  y,
  xLabel,
  yLabel,
  caption,
  samples = 240,
  markers,
}: {
  series: PlotSeries[];
  x: [number, number];
  y: [number, number];
  xLabel?: string;
  yLabel?: string;
  caption?: string;
  samples?: number;
  markers?: { x: number; label: string }[];
}) {
  const W = 640;
  const H = 360;
  const m = { l: 56, r: 16, t: 16, b: 48 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const sx = (v: number) => m.l + ((v - x[0]) / (x[1] - x[0])) * iw;
  const sy = (v: number) => m.t + ih - ((v - y[0]) / (y[1] - y[0])) * ih;
  const clampY = (v: number) => Math.min(Math.max(v, y[0] - (y[1] - y[0]) * 0.05), y[1] + (y[1] - y[0]) * 0.05);

  const paths = series.map((s, i) => {
    const f = plotFunctions[s.fn];
    if (!f) return { d: "", s, i };
    const pts: string[] = [];
    for (let k = 0; k <= samples; k++) {
      const xv = x[0] + ((x[1] - x[0]) * k) / samples;
      const yv = f(xv, s.params ?? {});
      if (!Number.isFinite(yv)) continue;
      pts.push(`${pts.length ? "L" : "M"}${sx(xv).toFixed(2)},${sy(clampY(yv)).toFixed(2)}`);
    }
    return { d: pts.join(" "), s, i };
  });

  return (
    <figure className="plot">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption ?? series.map((s) => s.label).join(", ")}>
        <defs>
          <clipPath id="plot-area">
            <rect x={m.l} y={m.t} width={iw} height={ih} />
          </clipPath>
        </defs>
        {ticks(y[0], y[1]).map((t) => (
          <g key={`y${t}`}>
            <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} className="plot-grid" />
            <text x={m.l - 8} y={sy(t)} className="plot-tick" textAnchor="end" dominantBaseline="middle">
              {fmt(t)}
            </text>
          </g>
        ))}
        {ticks(x[0], x[1]).map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} x2={sx(t)} y1={m.t} y2={m.t + ih} className="plot-grid" />
            <text x={sx(t)} y={m.t + ih + 18} className="plot-tick" textAnchor="middle">
              {fmt(t)}
            </text>
          </g>
        ))}
        <line x1={m.l} x2={m.l} y1={m.t} y2={m.t + ih} className="plot-axis" />
        <line x1={m.l} x2={W - m.r} y1={m.t + ih} y2={m.t + ih} className="plot-axis" />
        {markers?.map((mk) => (
          <g key={`m${mk.x}`}>
            <line x1={sx(mk.x)} x2={sx(mk.x)} y1={m.t} y2={m.t + ih} className="plot-marker" />
            <text x={sx(mk.x) + 4} y={m.t + 12} className="plot-marker-label">
              {mk.label}
            </text>
          </g>
        ))}
        <g clipPath="url(#plot-area)">
          {paths.map(({ d, i }) => (
            <path key={i} d={d} fill="none" stroke={palette[i % palette.length]} strokeWidth={2.25} />
          ))}
        </g>
        {xLabel ? (
          <text x={m.l + iw / 2} y={H - 8} className="plot-label" textAnchor="middle">
            {xLabel}
          </text>
        ) : null}
        {yLabel ? (
          <text
            x={14}
            y={m.t + ih / 2}
            className="plot-label"
            textAnchor="middle"
            transform={`rotate(-90 14 ${m.t + ih / 2})`}
          >
            {yLabel}
          </text>
        ) : null}
      </svg>
      <div className="plot-legend">
        {series.map((s, i) => (
          <span key={i} className="plot-legend-item">
            <span className="plot-swatch" style={{ background: palette[i % palette.length] }} />
            {s.label}
          </span>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
