import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Method",
  description: "How competitions are chosen, how deployability is scored and how each report is built.",
};

export default async function MethodPage() {
  const content = await renderMDX(getPage("method"));
  return (
    <>
      <PageHeader eyebrow="Method" title="How reports are made">
        Selection criteria, the deployability score, the structure every report follows, and the writing standard.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="prose">{content}</div>
        <p className="mt-10">
          <Link href="/method/ranking">See the full ranking →</Link>
        </p>
      </div>
    </>
  );
}
