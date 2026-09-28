import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const content = await renderMDX(getPage("about"));
  return (
    <>
      <PageHeader eyebrow="About" title="Nothing Lost After Deadline" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="prose">{content}</div>
      </div>
    </>
  );
}
