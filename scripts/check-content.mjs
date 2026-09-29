// Usage: node scripts/check-content.mjs [file.mdx ...]
// Compiles MDX, renders all maths with KaTeX in strict error mode, and checks
// technique and foundation ids. Exits non-zero on any problem.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const content = path.join(root, "packages/content");
const foundationIds = new Set(fs.readdirSync(path.join(content, "foundations")).map((f) => f.replace(/\.mdx$/, "")));
const techSrc = fs.readFileSync(path.join(content, "data/techniques.ts"), "utf8");
const techIds = new Set([...techSrc.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]));
const reportIds = new Set(fs.readdirSync(path.join(content, "reports")).map((f) => f.replace(/\.mdx$/, "")));
const figSrc = fs.readFileSync(path.join(root, "apps/web/src/components/figures/index.tsx"), "utf8");
const figIds = new Set([...figSrc.matchAll(/^\s*"([a-z0-9-]+)":/gm)].map((m) => m[1]));

let files = process.argv.slice(2);
if (!files.length) {
  files = [
    ...fs.readdirSync(path.join(content, "reports")).map((f) => path.join(content, "reports", f)),
    ...fs.readdirSync(path.join(content, "foundations")).map((f) => path.join(content, "foundations", f)),
  ];
}

let bad = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const problems = [];
  let fm, body;
  try {
    ({ data: fm, content: body } = matter(raw));
  } catch (e) {
    problems.push("frontmatter: " + e.message);
  }
  if (fm && file.includes("/reports/")) {
    for (const t of fm.techniques ?? []) if (!techIds.has(t)) problems.push(`unknown technique id ${t}`);
    for (const r of fm.related ?? []) if (!reportIds.has(r)) problems.push(`unknown related report ${r}`);
    if (/:/.test(fm.title ?? "")) problems.push("title has a subtitle (contains ':')");
  }
  if (body) {
    for (const m of body.matchAll(/<Foundation\s+id="([^"]+)"/g)) if (!foundationIds.has(m[1])) problems.push(`unknown foundation ${m[1]}`);
    for (const m of body.matchAll(/<Diagram\s+id="([^"]+)"/g)) if (!figIds.has(m[1])) problems.push(`unknown figure ${m[1]}`);
    try {
      await compile(body, {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: true }]],
      });
    } catch (e) {
      problems.push("mdx/katex: " + String(e.message).split("\n")[0]);
    }
  }
  if (problems.length) {
    bad++;
    console.log(`✗ ${path.relative(root, file)}`);
    for (const p of problems) console.log(`    ${p}`);
  }
}
console.log(bad ? `${bad} file(s) with problems` : `✓ ${files.length} file(s) OK`);
process.exit(bad ? 1 : 0);
