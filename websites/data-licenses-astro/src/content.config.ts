import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const initiatives = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../../content/data-licenses/initiatives' }),
  schema: z.object({
    title: z.string().describe('Display name of the initiative'),
    summary: z.string().describe('Short description for cards'),

    // Actions this project supports (tag-like)
    actionsSupported: z
      .array(
        z.enum([
          'attach-preference-signal',
          'attach-formal-license',
          'join-licensing-collective',
          'add-tollgate',
          'technical-blocking',
          'new-infrastructures',
          'certification',
        ])
      )
      .default([])
      .optional(),

    // Single status field using simplified scale
    status: z
      .enum(['WIP', 'usable-but-new', 'usable-with-some-evidence', 'usable-with-strong-evidence'])
      .describe('Project status'),
    website: z.string().url().optional(),
    spec: z.string().url().optional(),
    sourceRepo: z.string().url().optional(),
    pressPage: z.string().url().optional().describe('Press page for the project'),
    linkWithEvidenceOfUse: z.string().url().optional().describe('Evidence of use'),
    jurisdictions: z.array(z.string()).default([]).optional(),
    signals: z.array(z.string()).default([]).optional(),
    pipelineStages: z
      .array(z.enum(['collect', 'train', 'fine-tune', 'retrieve', 'generate']))
      .default([])
      .optional(),
    considerations: z.string().optional().describe('Risks, tradeoffs, or caveats'),
    tags: z.array(z.string()).default([]).optional(),
    // Dependencies/relationships
    dependsOn: z
      .array(z.string())
      .default([])
      .optional()
      .describe('Slugs/ids of initiatives this depends on'),
    lastUpdated: z.coerce.date().optional(),

    // Activity metadata
    recentActivity: z.coerce.date().optional().describe('Most recent public activity date'),
    recentActivityNote: z.string().optional().describe('Short note/context for recent activity'),

    // Adoption and impact
    usersCount: z.string().optional().describe('Approximate number of users/adopters'),
    dataVolume: z.string().optional().describe('Amount of data flowing (e.g., pages/day, tokens, GB)'),
    moneyVolume: z.string().optional().describe('Payments/revenue flowing (e.g., $/month, $ total)'),

    // Implementation snippets
    implementationSnippets: z
      .array(
        z.object({
          title: z.string().describe('Short label for the snippet'),
          language: z.string().default('text').optional(),
          code: z.string().describe('Copy-pasteable code/config snippet'),
          sourceUrl: z.string().url().describe('Source link for the snippet'),
        })
      )
      .optional(),

    // References to academic papers (citation keys from shared-references)
    references: z
      .array(z.string())
      .default([])
      .optional()
      .describe('Citation keys from shared-references for related papers'),
  }),
});

export const collections = { initiatives };
