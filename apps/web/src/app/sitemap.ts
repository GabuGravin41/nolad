import type { MetadataRoute } from "next";
import { getAllReports, getFoundations } from "@/lib/content";
import { techniques } from "@nolad/content/data/techniques";
import { collections } from "@nolad/content/data/collections";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const reports = getAllReports();
  const used = new Set(reports.flatMap((r) => r.meta.techniques));
  return [
    ...["", "/reports", "/techniques", "/collections", "/foundations", "/method", "/method/ranking", "/about"].map((p) => ({
      url: `${base}${p}`,
    })),
    ...reports.map((r) => ({ url: `${base}/reports/${r.meta.slug}`, lastModified: r.meta.updated })),
    ...techniques.filter((t) => used.has(t.id)).map((t) => ({ url: `${base}/techniques/${t.id}` })),
    ...collections.map((c) => ({ url: `${base}/collections/${c.id}` })),
    ...[...getFoundations().keys()].map((id) => ({ url: `${base}/foundations/${id}` })),
  ];
}
