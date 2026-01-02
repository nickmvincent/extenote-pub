import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sharedReferences = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../../content/shared-references' }),
  schema: z.object({
    title: z.string(),
    // Support both type formats
    type: z.string().optional(),
    // Support both citation_key and citekey
    citation_key: z.string().optional(),
    citekey: z.string().optional(),
    // entry_type is optional for some formats
    entry_type: z.string().optional(),
    // Support both authors (array) and author (string)
    authors: z.array(z.string()).optional(),
    author: z.string().optional(),
    year: z.string().optional(),
    venue: z.string().optional(),
    journal: z.string().optional(),
    url: z.string().optional(),
    abstract: z.string().optional(),
    tags: z.array(z.string()).optional(),
    keywords: z.union([z.array(z.string()), z.string()]).optional(),
    doi: z.string().optional(),
    eprint: z.string().optional(),
    archiveprefix: z.string().optional(),
    primaryclass: z.string().optional(),
    institution: z.string().optional(),
    shorttitle: z.string().optional(),
    note: z.string().optional(),
    urldate: z.union([z.string(), z.date()]).optional(),
    language: z.string().optional(),
    copyright: z.string().optional(),
    howpublished: z.string().optional(),
    // Note: Verification fields removed for now - see scripts/VERIFICATION-NOTES.md
  }).passthrough(), // Allow additional unknown fields
});

export const collections = {
  'shared-references': sharedReferences,
};
