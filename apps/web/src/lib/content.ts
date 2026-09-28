import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import {
  reportFrontmatterSchema,
  foundationFrontmatterSchema,
  type ReportFrontmatter,
  type FoundationFrontmatter,
} from "@nolad/content/schema";

function resolveContentDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "../../packages/content"),
    path.resolve(process.cwd(), "packages/content"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "reports"))) return c;
  }
  throw new Error(`Could not find packages/content from ${process.cwd()}`);
}

const CONTENT_DIR = resolveContentDir();
const REPORTS_DIR = path.join(CONTENT_DIR, "reports");
const FOUNDATIONS_DIR = path.join(CONTENT_DIR, "foundations");

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface Report {
  meta: ReportFrontmatter;
  body: string;
  words: number;
  minutes: number;
  headings: Heading[];
}

export interface Foundation {
  meta: FoundationFrontmatter;
  body: string;
  words: number;
}

function countWords(md: string): number {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " formula ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Extract h2/h3 headings the same way rehype-slug will id them. */
function extractHeadings(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const depth = m[1].length as 2 | 3;
    const text = m[2].replace(/\*\*|`|\*/g, "").trim();
    out.push({ depth, text, id: slugger.slug(text) });
  }
  return out;
}

let reportCache: Report[] | null = null;

export function getAllReports(): Report[] {
  if (reportCache) return reportCache;
  const files = fs.existsSync(REPORTS_DIR)
    ? fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith(".mdx"))
    : [];
  const reports = files.map((file) => {
    const raw = fs.readFileSync(path.join(REPORTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = reportFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in ${file}:\n${parsed.error.toString()}`);
    }
    const words = countWords(content);
    return {
      meta: parsed.data,
      body: content,
      words,
      minutes: Math.max(1, Math.round(words / 230)),
      headings: extractHeadings(content),
    } satisfies Report;
  });
  reports.sort((a, b) => a.meta.priority - b.meta.priority);
  reportCache = reports;
  return reports;
}

export function getReport(slug: string): Report | undefined {
  return getAllReports().find((r) => r.meta.slug === slug);
}

let foundationCache: Map<string, Foundation> | null = null;

export function getFoundations(): Map<string, Foundation> {
  if (foundationCache) return foundationCache;
  const map = new Map<string, Foundation>();
  if (fs.existsSync(FOUNDATIONS_DIR)) {
    for (const file of fs.readdirSync(FOUNDATIONS_DIR).filter((f) => f.endsWith(".mdx"))) {
      const raw = fs.readFileSync(path.join(FOUNDATIONS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = foundationFrontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid foundation frontmatter in ${file}:\n${parsed.error.toString()}`);
      }
      map.set(parsed.data.id, { meta: parsed.data, body: content, words: countWords(content) });
    }
  }
  foundationCache = map;
  return map;
}

export function getFoundation(id: string): Foundation | undefined {
  return getFoundations().get(id);
}

/** Reports that use a technique id. */
export function reportsByTechnique(id: string): Report[] {
  return getAllReports().filter((r) => r.meta.techniques.includes(id));
}

/** Foundation ids referenced from a report body. */
export function foundationRefs(body: string): string[] {
  const ids = new Set<string>();
  for (const m of body.matchAll(/<Foundation\s+id="([^"]+)"/g)) ids.add(m[1]);
  return [...ids];
}

export function getPage(name: string): string {
  const file = path.join(CONTENT_DIR, "pages", `${name}.mdx`);
  return fs.readFileSync(file, "utf8");
}
