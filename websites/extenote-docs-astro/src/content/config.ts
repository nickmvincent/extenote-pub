import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../../content/extenote-docs' }),
  schema: z.object({
    title: z.string(),
    type: z.string().optional(),
    visibility: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { docs };
