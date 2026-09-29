import type { ReactNode } from "react";
import { AneurysmCircleOfWillis, AneurysmMaskedPooling, AneurysmPipeline } from "./aneurysm";

/** Figures drawn for Nolad, referenced from MDX by id. */
const registry: Record<string, () => ReactNode> = {
  "aneurysm-circle-of-willis": AneurysmCircleOfWillis,
  "aneurysm-pipeline": AneurysmPipeline,
  "aneurysm-masked-pooling": AneurysmMaskedPooling,
};

export const diagramIds = Object.keys(registry);

export function Diagram({ id, caption, credit }: { id: string; caption: string; credit?: string }) {
  const Draw = registry[id];
  if (!Draw) {
    return (
      <div className="callout callout-caution">
        <p className="callout-title">Missing figure</p>
        <div className="callout-body">No figure with id “{id}”.</div>
      </div>
    );
  }
  return (
    <figure className="figure">
      <div className="figure-body">
        <Draw />
      </div>
      <figcaption>
        {caption}
        {credit ? <span className="figure-credit"> {credit}</span> : null}
      </figcaption>
    </figure>
  );
}
