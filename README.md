# Nolad — Nothing Lost After Deadline

Deployable machine-learning solutions from Kaggle competitions, documented from the mathematics up.
A project of [Hausdorff Space](https://hausdorff-space.vercel.app).

Nolad hosts **no data, code or model weights**. Every report explains a competition's problem, data, metric and
winning solutions in depth, links to the competition data and the authors' write-ups and repositories, and credits
the people who built them.

## Repository layout

```
apps/web            Next.js 16 site (App Router, TypeScript, Tailwind CSS 4), fully static
packages/content    Everything a reader sees
  reports/          One MDX file per competition (frontmatter validated by schema.ts)
  foundations/      First-principles explanation blocks embedded in reports with <Foundation id="…" />
  pages/            Method and About pages
  data/             Technique taxonomy, collections, ranking scores
  schema.ts         Zod schemas for report and foundation frontmatter
```

npm workspaces tie the two together. There is no database: every page is generated at build time, so hosting
costs nothing on Vercel's free tier. (Neon was considered and is not needed for the current feature set.)

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build; fails on invalid frontmatter
```

Node 20.9 or newer is required.

## Deploy on Vercel (free)

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository.
3. Set **Root Directory** to `apps/web`. Leave "Include files outside the root directory" enabled (the default);
   the build reads `packages/content`.
4. Framework preset: Next.js. No environment variables are required. Optional:
   - `NEXT_PUBLIC_SITE_URL` — the canonical URL once you have a domain (defaults to `https://nolad.vercel.app`).
   - `NEXT_PUBLIC_REPO_URL` — link shown in the footer.
5. Deploy. If the project name `nolad` is taken on Vercel, choose another and update `noladUrl` in the
   Hausdorff Space site (`App.tsx`) to match.

## Writing a report

Copy an existing file in `packages/content/reports/`, keep the frontmatter fields, and follow the structure on the
site's Method page. MDX components available in reports:

| Component | Use |
| --- | --- |
| `<Deep title kind="math\|code\|domain\|detail\|scratch">` | Collapsible depth section |
| `<Foundation id="…" />` | Embed a first-principles block from `foundations/` |
| `<Pipeline steps={[{tag, title, detail}]} caption />` | Stage diagram |
| `<Plot series={[{fn, params, label}]} x y xLabel yLabel />` | Function plot (see `apps/web/src/components/mdx/Plot.tsx` for `fn` names) |
| `<Bars data={[[label, value]]} domain highlight />` | Ablation and comparison bars |
| `<Callout kind="note\|key\|caution\|credit\|deploy">` | Highlighted note |
| `<Source href>` | Link to the original code under an excerpt |

Maths uses KaTeX (`$…$`, `$$…$$`). Code fences get syntax highlighting; add `title="path/to/file.py"`.

Writing standard: plain scientific prose; state results and derivations directly; attribute every number to its
source; no rhetorical questions or announcements of what the text will do.

## Licences

Nolad's own text and diagrams: CC BY 4.0. Site code: MIT. Competition data, solution code and weights remain under
their owners' licences, stated in each report.
