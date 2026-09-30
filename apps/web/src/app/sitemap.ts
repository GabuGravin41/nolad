import type { MetadataRoute } from "next";
import { getAllReports, getFoundations } from "@/lib/content";
import { techniques } from "@nolad/content/data/techniques";
import { domains } from "@nolad/content/data/taxonomy";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const reports = getAllReports();
  const used = new Set(reports.flatMap((r) => r.meta.techniques));
  return [
    ...["", "/reports", "/techniques", "/domains", "/foundations", "/method", "/method/ranking", "/about"].map((p) => ({
      url: `${base}${p}`,
    })),
    ...reports.map((r) => ({ url: `${base}/reports/${r.meta.slug}`, lastModified: r.meta.updated })),
    ...techniques.filter((t) => used.has(t.id)).map((t) => ({ url: `${base}/techniques/${t.id}` })),
    ...domains
      .filter((d) => reports.some((r) => r.meta.domain === d.id))
      .map((d) => ({ url: `${base}/domains/${d.id}` })),
    ...[...getFoundations().keys()].map((id) => ({ url: `${base}/foundations/${id}` })),
  ];
}
