import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '*.md', base: '../../content/courses' }),
  schema: z.object({
    type: z.string(),
    title: z.string().optional(),
    course_number: z.string().optional(),
    course_title: z.string().optional(),
    slug: z.string(),
    term: z.string().optional(),
    year: z.string().optional(),
    institution: z.string().optional(),
    department: z.string().optional(),
    description: z.string().optional(),
    level: z.string().optional(),
    credits: z.number().optional(),
    topics: z.array(z.string()).optional(),
    learning_objectives: z.array(z.string()).optional(),
    grading: z.record(z.number()).optional(),
    website_url: z.string().optional(),
    repo_url: z.string().optional(),
    tags: z.array(z.string()).optional(),
    visibility: z.string().optional(),
  }),
});

const syllabi = defineCollection({
  loader: glob({ pattern: 'syllabi/*.md', base: '../../content/courses' }),
  schema: z.object({
    type: z.string(),
    title: z.string(),
    slug: z.string(),
    course_slug: z.string(),
    term: z.string().optional(),
    year: z.string().optional(),
    visibility: z.string().optional(),
  }),
});

const assignments = defineCollection({
  loader: glob({ pattern: 'assignments/*.md', base: '../../content/courses' }),
  schema: z.object({
    type: z.string(),
    title: z.string(),
    slug: z.string(),
    course_slug: z.string(),
    assignment_number: z.number().optional(),
    assignment_type: z.string().optional(),
    due_date: z.coerce.date().optional(),
    points_possible: z.number().optional(),
    visibility: z.string().optional(),
  }),
});

const readingLists = defineCollection({
  loader: glob({ pattern: 'reading_lists/*.md', base: '../../content/courses' }),
  schema: z.object({
    type: z.string(),
    title: z.string(),
    slug: z.string(),
    course_slug: z.string().optional(),
    visibility: z.string().optional(),
  }),
});

export const collections = { courses, syllabi, assignments, readingLists };
