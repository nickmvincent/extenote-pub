import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';

import { sortByDateDescending } from './formatters';
import type { CvData, MarkdownEntry, PersonalInfo, SiteData } from './types';

const CONTENT_ROOT = path.resolve(
	process.cwd(),
	process.env.PERSONAL_CONTENT_PATH ?? path.join('..', '..', 'content', 'personal-website')
);

// Cross-project content roots for single source of truth
const SHARED_REFS_ROOT = path.resolve(
	process.cwd(),
	process.env.SHARED_REFS_PATH ?? path.join('..', '..', 'content', 'shared-references', 'bibtex-entries')
);

const DATA_LEVERAGE_BLOGS_ROOT = path.resolve(
	process.cwd(),
	process.env.DATA_LEVERAGE_BLOGS_PATH ?? path.join('..', '..', 'content', 'data-leverage-blogs')
);

const DATE_FIELDS = ['date', 'start_date', 'end_date'];

const shouldCacheResults = process.env.NODE_ENV === 'production';
let cachedData: SiteData | null = null;

export async function getSiteData(options: { force?: boolean } = {}): Promise<SiteData> {
	if (shouldCacheResults && cachedData && !options.force) {
		return cachedData;
	}

	const [
		personalInfoEntry,
		scholarlyPublication,
		scholarlyWorkshops,
		scholarlyOther,
		blogPosts,
		editorialOpeds,
		talkEvents,
		talkPodcasts,
		newsCoverage,
		appointments,
		education,
		grants,
		awards,
		teaching,
		industry,
		mentees,
		service,
		reviews
	] = await Promise.all([
		loadMarkdownFile('personal/personal_info.md'),
		loadCollection('scholarly-publication'),
		loadCollection('scholarly-workshop_paper'),
		loadCollection('scholarly-other_paper'),
		loadBlogPosts(),
		loadCollection('editorial-opeds'),
		loadCollection('talks-events'),
		loadCollection('talks-podcast'),
		loadCollection('news_coverage'),
		loadCollection('cv-appointments'),
		loadCollection('education'),
		loadCollection('cv-grants'),
		loadCollection('cv-awards'),
		loadCollection('cv-teaching'),
		loadCollection('cv-industry'),
		loadCollection('cv-mentoring'),
		loadCollection('cv-service'),
		loadCollection('cv-reviews')
	]);

	const personalInfo = (personalInfoEntry?.metadata ?? {}) as PersonalInfo;

	const scholarly = buildScholarlyList({
		publications: scholarlyPublication,
		workshops: scholarlyWorkshops,
		other: scholarlyOther
	});

	const editorial = sortByDateDescending([...editorialOpeds], 'date');
	const blogs = sortByDateDescending([...blogPosts], 'date');
	const talks = sortByDateDescending([...talkEvents, ...talkPodcasts], 'date');
	const sortedNewsCoverage = sortByDateDescending(newsCoverage, 'date');

	const cvData = buildCvData(
		{
			appointments,
			education,
			grants,
			awards,
			teaching,
			industry,
			mentees,
			service,
			reviews
		},
		{
			scholarly,
			talks,
			newsCoverage: sortedNewsCoverage,
			editorial
		}
	);

	const siteData: SiteData = {
		personalInfo,
		scholarly,
		editorial,
		blogs,
		talks,
		newsCoverage: sortedNewsCoverage,
		cv: cvData
	};

	if (shouldCacheResults) {
		cachedData = siteData;
	}

	return siteData;
}

async function loadCollection(collectionName: string): Promise<MarkdownEntry[]> {
	const targetDir = path.resolve(CONTENT_ROOT, collectionName);
	let entries: string[] = [];

	try {
		entries = await readdir(targetDir);
	} catch (error) {
		const err = error as NodeJS.ErrnoException;
		if (err.code === 'ENOENT') {
			return [];
		}
		throw error;
	}

	const results: MarkdownEntry[] = [];
	for (const file of entries) {
		if (!file.endsWith('.md')) continue;
		const fullPath = path.join(targetDir, file);
		const parsed = await parseMarkdown(fullPath);

		let metadata = parsed.metadata;
		let body = parsed.content;

		// For scholarly publications: merge metadata from bibtex entry if citation_key exists
		if (collectionName.startsWith('scholarly-') && metadata.citation_key) {
			const bibtexData = await loadBibtexEntry(metadata.citation_key as string);
			if (bibtexData) {
				// Bibtex entry is source of truth for these fields
				metadata = {
					...metadata,
					// Override with bibtex data (but keep local overrides if they exist)
					title: bibtexData.metadata.title ?? metadata.title,
					authors: bibtexData.metadata.authors ?? metadata.authors,
					year: bibtexData.metadata.year ?? metadata.year,
					venue: bibtexData.metadata.venue ?? metadata.venue,
					doi: bibtexData.metadata.doi ?? metadata.doi,
					url: metadata.url ?? bibtexData.metadata.url, // Local URL takes precedence
					abstract: bibtexData.metadata.abstract ?? metadata.abstract,
					// Keep bibtex source reference
					_bibtex_source: metadata.citation_key
				};
			}
		}

		results.push({
			slug: file.replace(/\.md$/, ''),
			collection: collectionName,
			metadata,
			body
		});
	}

	return results;
}

/**
 * Load a bibtex entry by citation_key from shared-references
 */
async function loadBibtexEntry(citationKey: string): Promise<{ metadata: Record<string, any>; body: string } | null> {
	const fullPath = path.join(SHARED_REFS_ROOT, `${citationKey}.md`);
	try {
		return await parseMarkdown(fullPath);
	} catch (error) {
		const err = error as NodeJS.ErrnoException;
		if (err.code === 'ENOENT') {
			console.warn(`Bibtex entry not found for citation_key: ${citationKey}`);
			return null;
		}
		throw error;
	}
}

/**
 * Load all blog posts directly from data-leverage-blogs
 * Maps metadata for personal website display
 */
async function loadBlogPosts(): Promise<MarkdownEntry[]> {
	let entries: string[] = [];

	try {
		entries = await readdir(DATA_LEVERAGE_BLOGS_ROOT);
	} catch (error) {
		const err = error as NodeJS.ErrnoException;
		if (err.code === 'ENOENT') {
			return [];
		}
		throw error;
	}

	const results: MarkdownEntry[] = [];
	for (const file of entries) {
		if (!file.endsWith('.md')) continue;
		const fullPath = path.join(DATA_LEVERAGE_BLOGS_ROOT, file);
		const parsed = await parseMarkdown(fullPath);

		// Skip drafts or non-public posts
		if (parsed.metadata.visibility && parsed.metadata.visibility !== 'public') {
			continue;
		}

		// Map data-leverage-blogs metadata to personal website format
		const metadata = {
			...parsed.metadata,
			type: 'blog_post',
			venue: 'Data Leverage Newsletter',
			url: parsed.metadata.original_url || parsed.metadata.url
		};

		results.push({
			slug: file.replace(/\.md$/, ''),
			collection: 'blogs',
			metadata: normalizeMetadata(metadata),
			body: parsed.content
		});
	}

	return results;
}

async function loadMarkdownFile(relativePath: string): Promise<MarkdownEntry | null> {
	const fullPath = path.resolve(CONTENT_ROOT, relativePath);
	try {
		const parsed = await parseMarkdown(fullPath);
		return {
			slug: path.basename(relativePath, '.md'),
			collection: path.dirname(relativePath),
			metadata: parsed.metadata,
			body: parsed.content
		};
	} catch (error) {
		const err = error as NodeJS.ErrnoException;
		if (err.code === 'ENOENT') {
			return null;
		}
		throw error;
	}
}

async function parseMarkdown(fullPath: string): Promise<{ metadata: Record<string, any>; content: string }> {
	const raw = await readFile(fullPath, 'utf-8');
	const parsed = matter(raw);
	return {
		metadata: normalizeMetadata(parsed.data ?? {}),
		content: parsed.content.trim()
	};
}

function normalizeMetadata(data: Record<string, any>): Record<string, any> {
	const metadata: Record<string, any> = Array.isArray(data) ? { ...data } : { ...data };
	for (const field of DATE_FIELDS) {
		if (metadata[field]) {
			metadata[field] = normalizeDate(metadata[field]);
		}
	}
	return metadata;
}

function normalizeDate(value: unknown): unknown {
	if (!value) return value;
	if (value instanceof Date) {
		return value.toISOString();
	}
	if (typeof value === 'string' || typeof value === 'number') {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) {
			return parsed.toISOString();
		}
	}
	return value;
}

function buildScholarlyList(groups: {
	publications: MarkdownEntry[];
	workshops: MarkdownEntry[];
	other: MarkdownEntry[];
}): MarkdownEntry[] {
	const decorate = (items: MarkdownEntry[], label: string) =>
		items.map((item) => ({
			...item,
			metadata: {
				...item.metadata,
				publication_type: item.metadata.publication_type ?? label
			}
		}));

	const combined = [
		...decorate(groups.publications, 'Publication'),
		...decorate(groups.workshops, 'Workshop Paper'),
		...decorate(groups.other, 'Other Paper')
	];

	return sortByDateDescending(combined, 'date');
}

function buildCvData(
	raw: {
		appointments: MarkdownEntry[];
		education: MarkdownEntry[];
		grants: MarkdownEntry[];
		awards: MarkdownEntry[];
		teaching: MarkdownEntry[];
		industry: MarkdownEntry[];
		mentees: MarkdownEntry[];
		service: MarkdownEntry[];
		reviews: MarkdownEntry[];
	},
	supplemental: {
		scholarly: MarkdownEntry[];
		talks: MarkdownEntry[];
		newsCoverage: MarkdownEntry[];
		editorial: MarkdownEntry[];
	}
): CvData {
	const reviewingSummary = raw.reviews.length ? raw.reviews[0].metadata : null;

	const appointments = sortByDateDescending(
		raw.appointments.map((entry) => ({
			...entry,
			metadata: { ...entry.metadata, start_date: entry.metadata.start_date ?? entry.metadata.date }
		})),
		['start_date', 'date']
	);

	const education = sortByDateDescending(raw.education, ['end_date', 'date']);
	const grants = sortByDateDescending(raw.grants, ['start_date', 'date']);
	const awards = sortByDateDescending(raw.awards, 'date');
	const teaching = sortByDateDescending(raw.teaching, 'date');
	const industry = sortByDateDescending(raw.industry, ['start_date', 'date']);
	const service = sortByDateDescending(raw.service, ['date']);

	const menteeOrder: Record<string, number> = {
		'PhD (advisor)': 0,
		'MSc (advisor)': 1,
		'PhD (committee)': 2,
		'MSc (committee)': 3,
		Undergrad: 4
	};

	const mentees = [...raw.mentees].sort((a, b) => {
		const levelA = menteeOrder[String(a.metadata.level ?? '')] ?? 99;
		const levelB = menteeOrder[String(b.metadata.level ?? '')] ?? 99;
		if (levelA !== levelB) return levelA - levelB;
		const nameA = String(a.metadata.name ?? '');
		const nameB = String(b.metadata.name ?? '');
		return nameA.localeCompare(nameB);
	});

	return {
		appointments,
		education,
		peerReviewedPubs: supplemental.scholarly.filter(
			(item) => String(item.metadata.publication_type).toLowerCase() === 'publication'
		),
		workshopPubs: supplemental.scholarly.filter(
			(item) => String(item.metadata.publication_type).toLowerCase() === 'workshop paper'
		),
		otherPubs: supplemental.scholarly.filter(
			(item) => String(item.metadata.publication_type).toLowerCase() === 'other paper'
		),
		grants,
		awards,
		teaching,
		industryExperience: industry,
		mentees,
		reviewingSummary,
		serviceItems: service,
		talks: supplemental.talks,
		newsCoverage: supplemental.newsCoverage,
		editorial: supplemental.editorial
	};
}
