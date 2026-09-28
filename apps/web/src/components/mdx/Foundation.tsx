import { getFoundation } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";

const kindLabel = {
  math: "Mathematics",
  ml: "Machine learning",
  domain: "Domain knowledge",
  engineering: "Engineering",
} as const;

/**
 * Embeds a complete first-principles explanation inline, collapsed by
 * default. The same block can appear in many reports so each report stays
 * self-contained; it is written once so corrections reach every report.
 */
export async function Foundation({ id, open = false }: { id: string; open?: boolean }) {
  const f = getFoundation(id);
  if (!f) {
    return (
      <div className="callout callout-caution">
        <p className="callout-title">Missing foundation block</p>
        <div className="callout-body">No foundation with id “{id}”.</div>
      </div>
    );
  }
  const content = await renderMDX(f.body);
  return (
    <details className={`deep deep-foundation deep-foundation-${f.meta.kind}`} data-deep open={open} id={`foundation-${id}`}>
      <summary>
        <span className="deep-badge">{kindLabel[f.meta.kind]}</span>
        <span className="deep-title">{f.meta.title}</span>
        <span className="deep-chevron" aria-hidden>
          ▸
        </span>
      </summary>
      <div className="deep-body">
        <p className="foundation-summary">{f.meta.summary}</p>
        {content}
      </div>
    </details>
  );
}
