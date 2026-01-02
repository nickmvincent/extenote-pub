#!/usr/bin/env bun
/**
 * Reference Verification Script v2
 *
 * Uses multiple APIs to verify reference metadata:
 * - DBLP (primary for CS papers)
 * - OpenAlex (primary, tracks preprint-to-published relationships)
 * - Semantic Scholar (backup)
 *
 * Records detailed verification logs including all API calls and responses.
 *
 * Usage:
 *   bun run scripts/verify-references.ts [options]
 *
 * Options:
 *   --all          Verify all references (default: only unverified)
 *   --file <path>  Verify a specific file
 *   --dry-run      Show what would be updated without making changes
 *   --force        Re-verify even if already verified
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path'
import matter from 'gray-matter';

const REFERENCES_DIR = join(import.meta.dir, '../../../content/shared-references');
const RATE_LIMIT_DELAY = 500; // ms between requests

// API endpoints
const DBLP_API = 'https://dblp.org/search/publ/api';
const OPENALEX_API = 'https://api.openalex.org/works';
const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1/paper';

// Types
interface ApiCall {
  source: 'dblp' | 'openalex' | 'semantic_scholar';
  endpoint: string;
  timestamp: string;
  status: 'success' | 'not_found' | 'error' | 'rate_limited';
  response_time_ms: number;
  paper_found: boolean;
  error_message?: string;
}

interface SourceMatch {
  source: 'dblp' | 'openalex' | 'semantic_scholar';
  paper_id?: string;
  title?: string;
  authors?: string[];
  year?: number;
  venue?: string;
  doi?: string;
  arxiv_id?: string;
  url?: string;
  // OpenAlex specific - tracks published versions
  published_version?: {
    venue: string;
    year: number;
    doi?: string;
  };
}

interface Mismatch {
  field: string;
  local_value: string;
  sources: { source: string; value: string }[];
}

interface VerificationLog {
  verified_at: string;
  api_calls: ApiCall[];
  matches: SourceMatch[];
  mismatches: Mismatch[];
  consensus?: {
    title?: string;
    authors?: string[];
    year?: number;
    venue?: string;
    doi?: string;
  };
  has_published_version: boolean;
  published_venue?: string;
  published_year?: number;
  status: 'valid' | 'mismatch' | 'not_found' | 'unverifiable' | 'outdated';
}

interface ReferenceData {
  title: string;
  authors?: string[];
  author?: string;
  year?: string;
  doi?: string;
  eprint?: string;
  url?: string;
  venue?: string;
  journal?: string;
  verification_log?: VerificationLog;
  [key: string]: unknown;
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  all: args.includes('--all'),
  dryRun: args.includes('--dry-run'),
  force: args.includes('--force'),
  file: args.includes('--file') ? args[args.indexOf('--file') + 1] : null,
};

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAuthorName(name: string): string {
  // Handle "Last, First" format
  const parts = name.split(',').map(p => p.trim());
  if (parts.length === 2) {
    return normalizeString(`${parts[1]} ${parts[0]}`);
  }
  return normalizeString(name);
}

function extractLastName(name: string): string {
  const normalized = normalizeAuthorName(name);
  return normalized.split(' ').pop() || '';
}

// ============ DBLP API ============

interface DblpHit {
  info: {
    title: string;
    authors?: { author: { text: string }[] | { text: string } };
    year?: string;
    venue?: string;
    doi?: string;
    ee?: string;
    url?: string;
  };
}

async function fetchFromDblp(query: string, isDoi: boolean = false): Promise<{ call: ApiCall; match: SourceMatch | null }> {
  const startTime = Date.now();
  const searchQuery = isDoi ? query : encodeURIComponent(query);
  const endpoint = `${DBLP_API}?q=${searchQuery}&format=json&h=5`;

  const call: ApiCall = {
    source: 'dblp',
    endpoint,
    timestamp: new Date().toISOString(),
    status: 'success',
    response_time_ms: 0,
    paper_found: false,
  };

  try {
    const response = await fetch(endpoint);
    call.response_time_ms = Date.now() - startTime;

    if (response.status === 429) {
      call.status = 'rate_limited';
      call.error_message = 'Rate limited';
      return { call, match: null };
    }

    if (!response.ok) {
      call.status = 'error';
      call.error_message = `HTTP ${response.status}`;
      return { call, match: null };
    }

    const data = await response.json();
    const hits: DblpHit[] = data.result?.hits?.hit || [];

    if (hits.length === 0) {
      call.status = 'not_found';
      return { call, match: null };
    }

    // Take first hit
    const hit = hits[0].info;
    call.paper_found = true;

    // Parse authors
    let authors: string[] = [];
    if (hit.authors?.author) {
      const authorData = hit.authors.author;
      if (Array.isArray(authorData)) {
        authors = authorData.map(a => a.text);
      } else {
        authors = [authorData.text];
      }
    }

    const match: SourceMatch = {
      source: 'dblp',
      title: hit.title,
      authors,
      year: hit.year ? parseInt(hit.year, 10) : undefined,
      venue: hit.venue,
      doi: hit.doi,
      url: hit.ee || hit.url,
    };

    return { call, match };
  } catch (error) {
    call.response_time_ms = Date.now() - startTime;
    call.status = 'error';
    call.error_message = String(error);
    return { call, match: null };
  }
}

// ============ OpenAlex API ============

interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  authorships: { author: { display_name: string } }[];
  primary_location?: {
    source?: { display_name: string };
  };
  locations?: {
    source?: { display_name: string; type: string };
    is_published: boolean;
    landing_page_url?: string;
  }[];
  doi?: string;
  ids?: {
    openalex: string;
    doi?: string;
    pmid?: string;
  };
  best_oa_location?: {
    source?: { display_name: string };
    landing_page_url?: string;
  };
}

async function fetchFromOpenAlex(identifier: string, type: 'doi' | 'title' | 'arxiv'): Promise<{ call: ApiCall; match: SourceMatch | null }> {
  const startTime = Date.now();
  let endpoint: string;

  if (type === 'doi') {
    endpoint = `${OPENALEX_API}/doi:${identifier}`;
  } else if (type === 'arxiv') {
    // OpenAlex indexes arXiv papers with their arXiv URL
    endpoint = `${OPENALEX_API}?filter=ids.openalex:https://arxiv.org/abs/${identifier}`;
  } else {
    endpoint = `${OPENALEX_API}?search=${encodeURIComponent(identifier)}&per_page=1`;
  }

  // Add polite pool email for better rate limits
  endpoint += endpoint.includes('?') ? '&' : '?';
  endpoint += 'mailto=verification@example.com';

  const call: ApiCall = {
    source: 'openalex',
    endpoint,
    timestamp: new Date().toISOString(),
    status: 'success',
    response_time_ms: 0,
    paper_found: false,
  };

  try {
    const response = await fetch(endpoint);
    call.response_time_ms = Date.now() - startTime;

    if (response.status === 404) {
      call.status = 'not_found';
      return { call, match: null };
    }

    if (response.status === 429) {
      call.status = 'rate_limited';
      call.error_message = 'Rate limited';
      return { call, match: null };
    }

    if (!response.ok) {
      call.status = 'error';
      call.error_message = `HTTP ${response.status}`;
      return { call, match: null };
    }

    const data = await response.json();

    // Handle search results vs direct lookup
    let work: OpenAlexWork | null = null;
    if (data.results) {
      work = data.results[0] || null;
    } else if (data.id) {
      work = data;
    }

    if (!work) {
      call.status = 'not_found';
      return { call, match: null };
    }

    call.paper_found = true;

    // Extract authors
    const authors = work.authorships?.map(a => a.author.display_name) || [];

    // Check for published version (vs preprint)
    let publishedVersion: SourceMatch['published_version'] | undefined;
    if (work.locations) {
      const publishedLoc = work.locations.find(
        loc => loc.is_published && loc.source?.type === 'journal' || loc.source?.type === 'conference'
      );
      if (publishedLoc?.source) {
        publishedVersion = {
          venue: publishedLoc.source.display_name,
          year: work.publication_year,
        };
      }
    }

    const match: SourceMatch = {
      source: 'openalex',
      paper_id: work.id,
      title: work.title,
      authors,
      year: work.publication_year,
      venue: work.primary_location?.source?.display_name,
      doi: work.doi?.replace('https://doi.org/', ''),
      published_version: publishedVersion,
    };

    return { call, match };
  } catch (error) {
    call.response_time_ms = Date.now() - startTime;
    call.status = 'error';
    call.error_message = String(error);
    return { call, match: null };
  }
}

// ============ Semantic Scholar API ============

interface SemanticScholarPaper {
  paperId: string;
  title: string;
  year?: number;
  authors?: { name: string }[];
  venue?: string;
  publicationVenue?: { name: string; type?: string };
  externalIds?: {
    DOI?: string;
    ArXiv?: string;
  };
}

async function fetchFromSemanticScholar(identifier: string, type: 'doi' | 'arxiv' | 'search'): Promise<{ call: ApiCall; match: SourceMatch | null }> {
  const startTime = Date.now();
  const fields = 'paperId,title,year,authors,venue,publicationVenue,externalIds';

  let endpoint: string;
  if (type === 'doi') {
    endpoint = `${SEMANTIC_SCHOLAR_API}/DOI:${encodeURIComponent(identifier)}?fields=${fields}`;
  } else if (type === 'arxiv') {
    endpoint = `${SEMANTIC_SCHOLAR_API}/arXiv:${encodeURIComponent(identifier)}?fields=${fields}`;
  } else {
    endpoint = `${SEMANTIC_SCHOLAR_API}/search?query=${encodeURIComponent(identifier)}&fields=${fields}&limit=1`;
  }

  const call: ApiCall = {
    source: 'semantic_scholar',
    endpoint,
    timestamp: new Date().toISOString(),
    status: 'success',
    response_time_ms: 0,
    paper_found: false,
  };

  try {
    const response = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
    });
    call.response_time_ms = Date.now() - startTime;

    if (response.status === 404) {
      call.status = 'not_found';
      return { call, match: null };
    }

    if (response.status === 429) {
      call.status = 'rate_limited';
      call.error_message = 'Rate limited';
      return { call, match: null };
    }

    if (!response.ok) {
      call.status = 'error';
      call.error_message = `HTTP ${response.status}`;
      return { call, match: null };
    }

    const data = await response.json();

    // Handle search results
    let paper: SemanticScholarPaper | null = null;
    if (type === 'search') {
      paper = data.data?.[0] || null;
    } else {
      paper = data;
    }

    if (!paper || !paper.paperId) {
      call.status = 'not_found';
      return { call, match: null };
    }

    call.paper_found = true;

    const authors = paper.authors?.map(a => a.name) || [];
    const venue = paper.publicationVenue?.name || paper.venue;

    // Check if this is a published version (has venue that's not arXiv)
    let publishedVersion: SourceMatch['published_version'] | undefined;
    if (venue && !venue.toLowerCase().includes('arxiv')) {
      publishedVersion = {
        venue,
        year: paper.year || 0,
        doi: paper.externalIds?.DOI,
      };
    }

    const match: SourceMatch = {
      source: 'semantic_scholar',
      paper_id: paper.paperId,
      title: paper.title,
      authors,
      year: paper.year,
      venue,
      doi: paper.externalIds?.DOI,
      arxiv_id: paper.externalIds?.ArXiv,
      published_version: publishedVersion,
    };

    return { call, match };
  } catch (error) {
    call.response_time_ms = Date.now() - startTime;
    call.status = 'error';
    call.error_message = String(error);
    return { call, match: null };
  }
}

// ============ Verification Logic ============

function compareTitles(local: string, remote: string): boolean {
  const localNorm = normalizeString(local);
  const remoteNorm = normalizeString(remote);

  if (localNorm === remoteNorm) return true;
  if (localNorm.includes(remoteNorm) || remoteNorm.includes(localNorm)) return true;

  // Word overlap check
  const localWords = new Set(localNorm.split(' ').filter(w => w.length > 2));
  const remoteWords = new Set(remoteNorm.split(' ').filter(w => w.length > 2));
  const intersection = [...localWords].filter(w => remoteWords.has(w));
  const similarity = intersection.length / Math.max(localWords.size, remoteWords.size);

  return similarity > 0.7;
}

function compareAuthors(local: string[], remote: string[]): boolean {
  if (remote.length === 0) return true;
  if (local.length === 0) return true;

  // Compare first author last names
  const localFirst = extractLastName(local[0]);
  const remoteFirst = extractLastName(remote[0]);

  return localFirst === remoteFirst;
}

// Helper to check if a match is actually for the same paper (title must be similar)
function isValidMatch(localTitle: string, match: SourceMatch): boolean {
  if (!match.title) return false;
  return compareTitles(localTitle, match.title);
}

async function verifyReference(data: ReferenceData): Promise<VerificationLog> {
  const apiCalls: ApiCall[] = [];
  const matches: SourceMatch[] = [];
  const mismatches: Mismatch[] = [];

  const localAuthors = data.authors || (data.author ? [data.author] : []);
  const localYear = data.year ? parseInt(data.year, 10) : undefined;
  const localVenue = data.venue || data.journal;

  // Helper to add match only if it's valid (title matches)
  const addIfValid = (match: SourceMatch | null) => {
    if (match && isValidMatch(data.title, match)) {
      matches.push(match);
    }
  };

  // ---- Try DBLP first (best for CS conference papers) ----
  if (data.doi) {
    const { call, match } = await fetchFromDblp(data.doi, true);
    apiCalls.push(call);
    addIfValid(match);
    await sleep(RATE_LIMIT_DELAY);
  }

  if (matches.length === 0 && data.title) {
    const { call, match } = await fetchFromDblp(data.title);
    apiCalls.push(call);
    addIfValid(match);
    await sleep(RATE_LIMIT_DELAY);
  }

  // ---- Try OpenAlex ----
  if (data.doi) {
    const { call, match } = await fetchFromOpenAlex(data.doi, 'doi');
    apiCalls.push(call);
    addIfValid(match);
    await sleep(RATE_LIMIT_DELAY);
  }

  if (data.title) {
    const { call, match } = await fetchFromOpenAlex(data.title, 'title');
    apiCalls.push(call);
    addIfValid(match);
    await sleep(RATE_LIMIT_DELAY);
  }

  // ---- Try Semantic Scholar (backup) ----
  if (data.doi) {
    const { call, match } = await fetchFromSemanticScholar(data.doi, 'doi');
    apiCalls.push(call);
    addIfValid(match);
    await sleep(RATE_LIMIT_DELAY);
  }

  if (data.eprint) {
    const { call, match } = await fetchFromSemanticScholar(data.eprint, 'arxiv');
    apiCalls.push(call);
    addIfValid(match);
    await sleep(RATE_LIMIT_DELAY);
  }

  // Try extracting arXiv ID from URL
  if (!data.eprint && data.url) {
    const arxivMatch = data.url.match(/arxiv\.org\/abs\/(\d+\.\d+)/);
    if (arxivMatch) {
      const { call, match } = await fetchFromSemanticScholar(arxivMatch[1], 'arxiv');
      apiCalls.push(call);
      addIfValid(match);
      await sleep(RATE_LIMIT_DELAY);
    }
  }

  if (matches.length === 0 && data.title) {
    const { call, match } = await fetchFromSemanticScholar(data.title, 'search');
    apiCalls.push(call);
    addIfValid(match);
  }

  // ---- Analyze results ----
  if (matches.length === 0) {
    return {
      verified_at: new Date().toISOString(),
      api_calls: apiCalls,
      matches: [],
      mismatches: [],
      has_published_version: false,
      status: 'not_found',
    };
  }

  // Check for mismatches across sources
  // Note: We skip title mismatch check since we pre-validate that matches are for the same paper

  // Authors
  const authorMismatches: { source: string; value: string }[] = [];
  for (const match of matches) {
    if (match.authors && match.authors.length > 0 && !compareAuthors(localAuthors, match.authors)) {
      authorMismatches.push({ source: match.source, value: match.authors.join(', ') });
    }
  }
  if (authorMismatches.length > 0) {
    mismatches.push({
      field: 'authors',
      local_value: localAuthors.join(', '),
      sources: authorMismatches,
    });
  }

  // Year
  const yearMismatches: { source: string; value: string }[] = [];
  for (const match of matches) {
    if (match.year && localYear && match.year !== localYear) {
      yearMismatches.push({ source: match.source, value: String(match.year) });
    }
  }
  if (yearMismatches.length > 0) {
    mismatches.push({
      field: 'year',
      local_value: String(localYear),
      sources: yearMismatches,
    });
  }

  // Check for published versions
  let hasPublishedVersion = false;
  let publishedVenue: string | undefined;
  let publishedYear: number | undefined;

  for (const match of matches) {
    if (match.published_version) {
      hasPublishedVersion = true;
      publishedVenue = match.published_version.venue;
      publishedYear = match.published_version.year;
      break;
    }
    // Also check if venue exists and local doesn't have one
    if (match.venue && !localVenue && !match.venue.toLowerCase().includes('arxiv')) {
      hasPublishedVersion = true;
      publishedVenue = match.venue;
      publishedYear = match.year;
    }
  }

  // Build consensus from sources
  const consensus: VerificationLog['consensus'] = {};

  // Use most common values or first available
  const titles = matches.map(m => m.title).filter(Boolean);
  if (titles.length > 0) consensus.title = titles[0];

  const allAuthors = matches.map(m => m.authors).filter(a => a && a.length > 0);
  if (allAuthors.length > 0) consensus.authors = allAuthors[0];

  const years = matches.map(m => m.year).filter(Boolean) as number[];
  if (years.length > 0) consensus.year = years[0];

  const venues = matches.map(m => m.venue).filter(v => v && !v.toLowerCase().includes('arxiv'));
  if (venues.length > 0) consensus.venue = venues[0];

  const dois = matches.map(m => m.doi).filter(Boolean);
  if (dois.length > 0) consensus.doi = dois[0];

  // Determine status
  let status: VerificationLog['status'];
  if (mismatches.length > 0) {
    status = 'mismatch';
  } else if (hasPublishedVersion && !localVenue) {
    status = 'outdated'; // Has arxiv but there's a published version
  } else {
    status = 'valid';
  }

  return {
    verified_at: new Date().toISOString(),
    api_calls: apiCalls,
    matches,
    mismatches,
    consensus,
    has_published_version: hasPublishedVersion,
    published_venue: publishedVenue,
    published_year: publishedYear,
    status,
  };
}

async function processFile(filePath: string): Promise<{ updated: boolean; log: VerificationLog | null }> {
  const content = await readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  const refData = data as ReferenceData;

  // Skip if already verified and not forcing
  if (refData.verification_log?.verified_at && !options.force) {
    return { updated: false, log: null };
  }

  // Skip non-academic references
  const entryType = (data.entry_type || data.type || '').toLowerCase();
  if (['misc', 'online', 'software'].includes(entryType) && !refData.doi && !refData.eprint) {
    if (refData.url && !refData.url.includes('arxiv.org') && !refData.url.includes('doi.org')) {
      return {
        updated: false,
        log: {
          verified_at: new Date().toISOString(),
          api_calls: [],
          matches: [],
          mismatches: [],
          has_published_version: false,
          status: 'unverifiable',
        }
      };
    }
  }

  console.log(`Verifying: ${refData.title?.substring(0, 60)}...`);

  const log = await verifyReference(refData);

  // Print summary
  console.log(`  Status: ${log.status}`);
  console.log(`  API calls: ${log.api_calls.length} (${log.api_calls.filter(c => c.paper_found).length} found papers)`);

  if (log.has_published_version) {
    console.log(`  Published version: ${log.published_venue} (${log.published_year})`);
  }

  if (log.mismatches.length > 0) {
    console.log(`  Mismatches:`);
    for (const m of log.mismatches) {
      console.log(`    ${m.field}: local="${m.local_value}"`);
      for (const s of m.sources) {
        console.log(`      ${s.source}: "${s.value}"`);
      }
    }
  }

  if (options.dryRun) {
    return { updated: false, log };
  }

  // Clean undefined values from the log before saving
  const cleanLog = JSON.parse(JSON.stringify(log, (_, v) => v === undefined ? null : v));

  // Update the frontmatter with verification log
  const updatedData = {
    ...data,
    verification_log: cleanLog,
  };

  const updatedContent = matter.stringify(body, updatedData);
  await writeFile(filePath, updatedContent);

  console.log(`  (updated)`);

  return { updated: true, log };
}

async function main() {
  console.log('Reference Verification Script v2');
  console.log('Sources: DBLP, OpenAlex, Semantic Scholar\n');

  if (options.dryRun) {
    console.log('DRY RUN MODE - No files will be modified\n');
  }

  let files: string[];

  if (options.file) {
    files = [options.file];
  } else {
    const allFiles = await readdir(REFERENCES_DIR);
    files = allFiles
      .filter(f => f.endsWith('.md'))
      .map(f => join(REFERENCES_DIR, f));
  }

  const stats = {
    total: files.length,
    verified: 0,
    valid: 0,
    mismatch: 0,
    outdated: 0,
    notFound: 0,
    unverifiable: 0,
    skipped: 0,
  };

  for (const file of files) {
    try {
      const { updated, log } = await processFile(file);

      if (!log) {
        stats.skipped++;
        continue;
      }

      stats.verified++;
      switch (log.status) {
        case 'valid': stats.valid++; break;
        case 'mismatch': stats.mismatch++; break;
        case 'outdated': stats.outdated++; break;
        case 'not_found': stats.notFound++; break;
        case 'unverifiable': stats.unverifiable++; break;
      }

    } catch (error) {
      console.error(`Error processing ${file}: ${error}`);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total files: ${stats.total}`);
  console.log(`Verified: ${stats.verified}`);
  console.log(`  Valid: ${stats.valid}`);
  console.log(`  Mismatch: ${stats.mismatch}`);
  console.log(`  Outdated (has published version): ${stats.outdated}`);
  console.log(`  Not found: ${stats.notFound}`);
  console.log(`  Unverifiable: ${stats.unverifiable}`);
  console.log(`Skipped: ${stats.skipped}`);
}

main().catch(console.error);
