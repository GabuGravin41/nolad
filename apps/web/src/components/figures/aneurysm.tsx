import { Arrow, Box, Marker, Svg } from "./primitives";

const MID = 430; // width of the drawing area used for mirroring

/** Mirror an x coordinate about the midline of the drawing area. */
const m = (x: number) => MID - x;

/** One side of the Circle of Willis, drawn for the patient's right; mirrored for the left. */
function Side({ mirror = false }: { mirror?: boolean }) {
  const X = (x: number) => (mirror ? m(x) : x);
  const P = (d: string) =>
    mirror ? d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_s, x, y) => `${m(Number(x))},${y}`) : d;
  return (
    <g>
      {/* Internal carotid: supraclinoid above the clinoid level, infraclinoid below it (cut end) */}
      <path d={P("M170,210 L170,265")} className="dg-vessel" />
      <path d={P("M170,265 L170,312")} className="dg-vessel" />
      <line x1={X(161)} y1={316} x2={X(179)} y2={316} className="dg-guide-solid" />
      <line x1={X(152)} y1={265} x2={X(188)} y2={265} className="dg-guide" />
      {/* Middle cerebral artery with two branches */}
      <path d={P("M170,210 Q120,195 60,185")} className="dg-vessel" />
      <path d={P("M60,185 L25,160")} className="dg-vessel dg-vessel-thin" />
      <path d={P("M60,185 L25,212")} className="dg-vessel dg-vessel-thin" />
      {/* Anterior cerebral artery: A1 to the ACom junction, A2 onwards */}
      <path d={P("M170,210 L200,130")} className="dg-vessel" />
      <path d={P("M200,130 L200,40")} className="dg-vessel" />
      {/* Posterior communicating artery from the ICA to the posterior cerebral artery */}
      <path d={P("M170,250 L195,350")} className="dg-vessel dg-vessel-thin" />
      {/* Posterior cerebral artery: P1 from the basilar tip, P2 lateral */}
      <path d={P("M215,360 L195,350")} className="dg-vessel" />
      <path d={P("M195,350 Q140,360 70,400")} className="dg-vessel" />
      {/* Superior cerebellar artery */}
      <path d={P("M215,380 Q175,388 110,425")} className="dg-vessel dg-vessel-thin" />
      {/* Vertebral artery */}
      <path d={P("M185,478 L215,445")} className="dg-vessel" />
      {/* Paired label locations */}
      <Marker x={X(170)} y={293} n={1} />
      <Marker x={X(170)} y={230} n={2} />
      <Marker x={X(118)} y={196} n={3} />
      <Marker x={X(185)} y={170} n={4} />
      <Marker x={X(189)} y={326} n={5} />
      <Marker x={X(124)} y={373} n={8} />
    </g>
  );
}

export function AneurysmCircleOfWillis() {
  const key: [string, string, string][] = [
    ["1", "Infraclinoid ICA", "L, R"],
    ["2", "Supraclinoid ICA", "L, R"],
    ["3", "Middle cerebral artery (MCA)", "L, R"],
    ["4", "Anterior cerebral artery (ACA)", "L, R"],
    ["5", "Posterior communicating (PCom)", "L, R"],
    ["6", "Anterior communicating (ACom)", ""],
    ["7", "Basilar tip", ""],
    ["8", "Other posterior circulation", ""],
  ];
  return (
    <Svg
      id="cow"
      width={720}
      height={515}
      label="Schematic of the Circle of Willis viewed from below with the 13 aneurysm label locations marked: five paired locations and three unpaired."
    >
      <text x={215} y={18} className="dg-small" textAnchor="middle">anterior</text>
      <text x={215} y={510} className="dg-small" textAnchor="middle">posterior</text>
      <text x={14} y={24} className="dg-title">R</text>
      <text x={406} y={24} className="dg-title">L</text>

      <Side />
      <Side mirror />

      {/* Midline vessels */}
      <line x1={200} y1={130} x2={230} y2={130} className="dg-vessel" />
      <line x1={215} y1={445} x2={215} y2={360} className="dg-vessel" />
      <text x={223} y={420} className="dg-faint">basilar</text>
      <text x={146} y={269} className="dg-faint" textAnchor="end">clinoid level</text>
      <text x={215} y={494} className="dg-faint" textAnchor="middle">vertebral arteries</text>
      <Marker x={215} y={130} n={6} />
      <Marker x={215} y={360} n={7} />

      {/* Key */}
      <text x={452} y={48} className="dg-title">Label locations</text>
      {key.map(([n, name, side], i) => (
        <g key={n}>
          <Marker x={462} y={78 + i * 30} n={n} />
          <text x={480} y={82 + i * 30} className="dg-text">{name}</text>
          {side ? (
            <text x={712} y={82 + i * 30} className="dg-small" textAnchor="end">{side}</text>
          ) : null}
        </g>
      ))}
      <line x1={452} y1={322} x2={712} y2={322} className="dg-guide-solid" />
      <text x={452} y={344} className="dg-small">5 paired × 2 sides + 3 unpaired = 13 labels</text>
      <text x={452} y={364} className="dg-small">plus 1 label: aneurysm present anywhere</text>
    </Svg>
  );
}

export function AneurysmPipeline() {
  const W = 160;
  const xs = [0, 180, 360, 540];
  const total = 700;
  const sec = total / 18;
  return (
    <Svg
      id="anpipe"
      width={702}
      height={300}
      label="The four stages of the winning pipeline with their resolutions and outputs, and the time each takes per series: 4 s preprocessing, 11 s vessel segmentation, 3 s classification."
    >
      <Box x={xs[0]} y={16} w={W} h={150} title="0 · Preprocess" lines={["DICOM series", "→ NIfTI, reoriented", "z-score per volume", "CT and MR, one scale"]} />
      <Box x={xs[1]} y={16} w={W} h={150} title="1 · Coarse nnU-Net" lines={["1 mm isotropic", "whole head", "3 vessel groups", "DBSCAN → 140 mm cube"]} />
      <Box x={xs[2]} y={16} w={W} h={150} title="2 · Fine nnU-Nets ×2" lines={["0.80 × 0.45 × 0.44 mm", "≈ 175 × 311 × 318 voxels", "vessel masks", "bounding box → ROI"]} />
      <Box x={xs[3]} y={16} w={W} h={150} title="3 · Classifier" tone="accent" lines={["ROI 128 × 256 × 256", "+ vessel masks", "masked pooling", "→ 14 logits"]} />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} fig="anpipe" x1={xs[i] + W + 2} y1={91} x2={xs[i + 1] - 3} y2={91} />
      ))}

      <text x={0} y={212} className="dg-title">Time per series on one T4 GPU (≈ 18 s)</text>
      <rect x={0} y={226} width={4 * sec} height={24} className="dg-seg dg-seg-a" />
      <rect x={4 * sec} y={226} width={11 * sec} height={24} className="dg-seg dg-seg-b" />
      <rect x={15 * sec} y={226} width={3 * sec} height={24} className="dg-seg dg-seg-c" />
      <text x={2 * sec} y={242} className="dg-small" textAnchor="middle">preprocess 4 s</text>
      <text x={9.5 * sec} y={242} className="dg-small" textAnchor="middle">vessel segmentation, stages 1–2: 11 s</text>
      <text x={16.5 * sec} y={242} className="dg-small" textAnchor="middle">classify 3 s</text>
      {[0, 4, 15, 18].map((t) => (
        <g key={t}>
          <line x1={t * sec} y1={252} x2={t * sec} y2={258} className="dg-guide-solid" />
          <text x={Math.min(Math.max(t * sec, 6), total - 8)} y={274} className="dg-faint" textAnchor="middle">
            {t} s
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function AneurysmMaskedPooling() {
  const cell = 16;
  const cols = 10;
  const rows = 8;
  const gx = 34;
  const gy = 70;
  // A curved band of cells standing for one artery's mask.
  const on = new Set(
    [
      [0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5],
      [4, 5], [4, 6], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8],
    ].map(([r, c]) => `${r},${c}`),
  );
  const vx = 318;
  const vy = 78;
  const tokX = 396;
  const tokW = 12;
  return (
    <Svg
      id="mpool"
      width={720}
      height={260}
      label="Masked average pooling: the feature map is averaged over the voxels of one artery's mask to give one vector; repeating this for the 13 location masks gives 13 tokens for the transformer."
    >
      {/* Channel stack: two outlines behind the front grid */}
      <rect x={gx + 16} y={gy - 16} width={cols * cell} height={rows * cell} className="dg-grid-back" />
      <rect x={gx + 8} y={gy - 8} width={cols * cell} height={rows * cell} className="dg-grid-back" />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={gx + c * cell}
            y={gy + r * cell}
            width={cell}
            height={cell}
            className={on.has(`${r},${c}`) ? "dg-cell dg-cell-on" : "dg-cell"}
          />
        )),
      )}
      <text x={gx} y={30} className="dg-title">Feature map F</text>
      <text x={gx} y={46} className="dg-small">C channels on the voxel grid</text>
      <text x={gx} y={gy + rows * cell + 24} className="dg-small">shaded: mask M_k of artery k</text>

      <Arrow fig="mpool" x1={gx + cols * cell + 24} y1={gy + 64} x2={vx - 10} y2={gy + 64} label="mean over" labelDy={-22} />
      <text x={(gx + cols * cell + 24 + vx - 10) / 2} y={gy + 56} className="dg-small" textAnchor="middle">
        shaded voxels
      </text>

      {/* Pooled vector z_k */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={vx} y={vy + i * 14} width={14} height={14} className="dg-cell dg-cell-on" />
      ))}
      <text x={vx + 7} y={vy - 10} className="dg-text" textAnchor="middle">z_k</text>
      <text x={vx + 7} y={vy + 8 * 14 + 18} className="dg-small" textAnchor="middle">C values</text>

      <Arrow fig="mpool" x1={vx + 22} y1={gy + 64} x2={tokX - 8} y2={gy + 64} />

      {/* 13 tokens, one per location */}
      {Array.from({ length: 13 }).map((_, t) =>
        Array.from({ length: 8 }).map((__, i) => (
          <rect
            key={`${t}-${i}`}
            x={tokX + t * (tokW + 2)}
            y={vy + i * 14}
            width={tokW}
            height={14}
            className={t === 0 ? "dg-cell dg-cell-on" : "dg-cell"}
          />
        )),
      )}
      <text x={tokX} y={vy - 10} className="dg-text">13 tokens, one per location</text>
      <text x={tokX} y={vy + 8 * 14 + 18} className="dg-small">each concatenated with a global vector g</text>

      <Arrow fig="mpool" x1={tokX + 13 * (tokW + 2) + 4} y1={gy + 64} x2={594} y2={gy + 64} />
      <Box x={598} y={gy + 20} w={118} h={88} title="Transformer" tone="accent" lines={["over the 13 tokens", "→ MLP", "→ 13 logits"]} />
    </Svg>
  );
}
