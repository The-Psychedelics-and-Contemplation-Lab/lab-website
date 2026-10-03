import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/** Long-form research pages: src/content/research/<slug>.md */
const research = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    description: z.string().max(160),
    lead: z.string(),
    image: z.string().optional(),        // "/uploads/…" — the strand image, shown as a Figure at the top of the page
    imageAlt: z.string().optional(),
    imageCaption: z.string().optional(),
    imageRatio: z.enum(['wide', 'cinema', 'square', 'tall']).default('wide'),  // 'cinema' = shown whole, no drift (schematics)
    pullquote: z.string().optional(),    // a sentence taken verbatim from the page text
    pullquoteCite: z.string().optional(),
    sections: z.array(z.object({ id: z.string(), label: z.string() })),
  }),
});

/** Lab members: one Markdown file per person, the body is the bio. */
const people = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.enum(['directors', 'postdocs', 'phd', 'masters', 'alumni']),
    order: z.number(),
    photo: z.string().optional(),       // "/uploads/2025/04/….jpg" (served from public/)
    summary: z.string(),                // one line for the card
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  }),
});

/** Publications: src/content/publications.json, grouped by year on the page. */
const publications = defineCollection({
  loader: file('./src/content/publications.json'),
  schema: z.object({
    order: z.number(),             // position in the list (lower first), as on the original site
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().optional(),          // bare DOI, e.g. "10.1038/s41591-025-03685-9"
    url: z.string().optional(),          // used when there is no DOI
    pdf: z.string().optional(),          // "/uploads/…pdf"
    note: z.string().optional(),         // e.g. "Advance online publication"
  }),
});

/** Simple prose pages (Contact, Media). */
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), eyebrow: z.string(), description: z.string().max(160), lead: z.string().optional() }),
});

export const collections = { research, people, publications, pages };
