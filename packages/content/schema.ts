import { z } from "zod";

/**
 * Frontmatter schema for a Nolad report. Every report in `reports/*.mdx`
 * must satisfy this schema; the site build fails otherwise.
 */

export const collectionIds = ["medicine", "molecular", "beyond"] as const;
export type CollectionId = (typeof collectionIds)[number];

const person = z.object({
  name: z.string(),
  handle: z.string().optional(),
});

const link = z.object({
  label: z.string(),
  url: z.string().url(),
});

const solution = z.object({
  rank: z.number().int().positive(),
  team: z.string(),
  members: z.array(person).default([]),
  writeup: z.string().url(),
  code: z.array(link).default([]),
  note: z.string().optional(),
});

export const deployabilitySchema = z.object({
  /** 1 (research artefact) to 5 (ready to wrap in a product) */
  score: z.number().int().min(1).max(5),
  /** One sentence: the reason for the score. */
  verdict: z.string(),
  inference: z.string(),
  models: z.string(),
  training: z.string(),
  externalData: z.string(),
  licences: z.object({
    code: z.string(),
    data: z.string(),
    weights: z.string(),
  }),
  risks: z.array(z.string()).default([]),
});

export const reportFrontmatterSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  kaggleSlug: z.string(),
  kaggleUrl: z.string().url(),
  year: z.number().int(),
  dates: z.object({ start: z.string(), end: z.string() }),
  host: z.string(),
  collection: z.enum(collectionIds),
  field: z.string(),
  modality: z.array(z.string()),
  tasks: z.array(z.string()),
  techniques: z.array(z.string()),
  metric: z.object({ name: z.string(), summary: z.string() }),
  constraints: z.object({
    runtime: z.string(),
    hardware: z.string(),
    internet: z.boolean(),
    other: z.string().optional(),
  }),
  summary: z.string(),
  winningIdea: z.string(),
  solutions: z.array(solution).min(1),
  deployability: deployabilitySchema,
  related: z.array(z.string()).default([]),
  dataLinks: z.array(link).default([]),
  papers: z.array(link).default([]),
  priority: z.number().int().positive(),
  status: z.enum(["complete", "draft"]).default("complete"),
  updated: z.string(),
});

export type ReportFrontmatter = z.infer<typeof reportFrontmatterSchema>;
export type Solution = z.infer<typeof solution>;
export type Deployability = z.infer<typeof deployabilitySchema>;

export const foundationFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** Which kind of knowledge this block builds. */
  kind: z.enum(["math", "ml", "domain", "engineering"]),
  summary: z.string(),
});

export type FoundationFrontmatter = z.infer<typeof foundationFrontmatterSchema>;
