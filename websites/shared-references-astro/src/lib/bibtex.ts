/**
 * BibTeX generation utilities for reference pages
 */

export interface ReferenceData {
  citation_key?: string;
  citekey?: string;
  entry_type?: string;
  type?: string;
  title?: string;
  authors?: string[];
  author?: string;
  year?: string;
  venue?: string;
  journal?: string;
  booktitle?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  eprint?: string;
  pages?: string;
  volume?: string;
  number?: string;
  publisher?: string;
  institution?: string;
  [key: string]: unknown;
}

export interface CheckLog {
  checked_at?: string;
  checked_with?: string;
  status?: 'confirmed' | 'not_found' | 'unverifiable' | 'mismatch' | 'valid' | string;
  paper_id?: string;
  remote?: {
    title?: string;
    authors?: string[];
    year?: number | string;
    doi?: string;
    venue?: string;
    journal?: string;
    booktitle?: string;
    url?: string;
    [key: string]: unknown;
  };
  fields?: {
    [fieldName: string]: {
      local?: string | number | null;
      remote?: string | number | null;
      match?: boolean;
      [key: string]: unknown;
    };
  };
  external_bibtex?: {
    source: string;
    bibtex: string;
    fetched_at: string;
  };
  [key: string]: unknown;
}

/**
 * Manual verification by a human reviewer
 */
export interface ManualVerification {
  verified_at: string;        // ISO timestamp
  verified_by: string;        // 'human', 'agent', or reviewer identifier
  notes?: string;             // Explanation of verification
  source_url?: string;        // URL used for verification
}

/**
 * Canonical/authoritative source reference
 */
export interface CanonicalSource {
  url: string;                // URL to authoritative source
  title?: string;             // Page/document title
  accessed_at: string;        // Date accessed (YYYY-MM-DD)
  match_confidence?: number;  // 0-1 confidence score
  source_type?: 'publisher' | 'doi' | 'arxiv' | 'institutional' | 'author' | 'other';
}

/**
 * Combined confirmation structure for a reference
 * Supports multiple confirmation sources
 */
export interface ConfirmationRecord {
  // Automated check log (from OpenAlex, Semantic Scholar, etc.)
  check_log?: CheckLog;

  // Manual human/agent verification
  manually_verified?: ManualVerification;

  // Link to authoritative source
  canonical_source?: CanonicalSource;

  // Array of all confirmations for aggregation
  confirmations?: Array<{
    type: 'auto' | 'manual' | 'canonical';
    source: string;
    timestamp: string;
    confidence?: number;
    details?: Record<string, unknown>;
  }>;
}

/**
 * Fields that should not be included in BibTeX output
 */
const EXCLUDED_FIELDS = new Set([
  'type',
  'visibility',
  'slug',
  'tags',
  'manual_check',
  'check_log',
  'verification_log',
  'verified_manual',
  'verified_auto',
  'verified_status',
]);

/**
 * Format an array of authors into BibTeX format (joined with " and ")
 */
function formatAuthors(authors: string[] | string | undefined): string {
  if (!authors) return '';
  if (typeof authors === 'string') return authors;
  return authors.join(' and ');
}

/**
 * Generate a BibTeX entry string from reference data
 */
export function generateBibTeX(data: ReferenceData, id?: string): string {
  const entryType = data.entry_type || data.type || 'misc';
  const citationKey = data.citation_key || data.citekey || id || 'unknown';

  const fields: Array<[string, string]> = [];

  // Title
  if (data.title) {
    fields.push(['title', data.title]);
  }

  // Authors
  const authors = data.authors || (data.author ? [data.author] : []);
  if (authors.length > 0) {
    fields.push(['author', formatAuthors(authors)]);
  }

  // Year
  if (data.year) {
    fields.push(['year', String(data.year)]);
  }

  // Venue - use appropriate field based on entry type
  if (entryType === 'article') {
    if (data.journal || data.venue) {
      fields.push(['journal', data.journal || data.venue || '']);
    }
  } else if (entryType === 'inproceedings' || entryType === 'incollection') {
    if (data.booktitle || data.venue) {
      fields.push(['booktitle', data.booktitle || data.venue || '']);
    }
  } else if (data.venue) {
    // For misc, techreport, etc., use howpublished or note
    fields.push(['howpublished', data.venue]);
  }

  // DOI
  if (data.doi) {
    fields.push(['doi', data.doi]);
  }

  // URL
  if (data.url) {
    fields.push(['url', data.url]);
  }

  // arXiv
  if (data.eprint) {
    fields.push(['eprint', data.eprint]);
    fields.push(['archiveprefix', 'arXiv']);
  }

  // Abstract
  if (data.abstract) {
    fields.push(['abstract', data.abstract]);
  }

  // Additional standard fields
  if (data.pages) fields.push(['pages', data.pages]);
  if (data.volume) fields.push(['volume', String(data.volume)]);
  if (data.number) fields.push(['number', String(data.number)]);
  if (data.publisher) fields.push(['publisher', data.publisher]);
  if (data.institution) fields.push(['institution', data.institution]);

  // Build the BibTeX entry
  const fieldLines = fields
    .map(([key, value]) => `  ${key} = {${value}}`)
    .join(',\n');

  return `@${entryType}{${citationKey},\n${fieldLines}\n}`;
}

/**
 * Generate BibTeX from check_log.remote data (external source)
 */
export function generateBibTeXFromRemote(
  checkLog: CheckLog | undefined,
  citationKey: string,
  entryType: string = 'misc'
): string | null {
  // If we have a pre-fetched external BibTeX, return that
  if (checkLog?.external_bibtex?.bibtex) {
    return checkLog.external_bibtex.bibtex;
  }

  // Otherwise, construct from remote data
  const remote = checkLog?.remote;
  if (!remote) {
    return null;
  }

  const fields: Array<[string, string]> = [];

  if (remote.title) {
    fields.push(['title', remote.title]);
  }

  if (remote.authors && remote.authors.length > 0) {
    fields.push(['author', formatAuthors(remote.authors)]);
  }

  if (remote.year) {
    fields.push(['year', String(remote.year)]);
  }

  // Venue
  if (entryType === 'article' && (remote.journal || remote.venue)) {
    fields.push(['journal', remote.journal || remote.venue || '']);
  } else if ((entryType === 'inproceedings' || entryType === 'incollection') && (remote.booktitle || remote.venue)) {
    fields.push(['booktitle', remote.booktitle || remote.venue || '']);
  }

  if (remote.doi) {
    fields.push(['doi', remote.doi]);
  }

  if (remote.url) {
    fields.push(['url', remote.url]);
  }

  if (fields.length === 0) {
    return null;
  }

  const fieldLines = fields
    .map(([key, value]) => `  ${key} = {${value}}`)
    .join(',\n');

  return `@${entryType}{${citationKey},\n${fieldLines}\n}`;
}

/**
 * Get the source label for external BibTeX
 */
export function getExternalSourceLabel(checkLog: CheckLog | undefined): string {
  if (checkLog?.external_bibtex?.source) {
    return checkLog.external_bibtex.source.toUpperCase();
  }
  if (checkLog?.checked_with) {
    return checkLog.checked_with.toUpperCase();
  }
  return 'External Source';
}

/**
 * Get verification status info for display
 */
export function getVerificationStatus(checkLog: CheckLog | undefined): {
  status: 'verified' | 'mismatch' | 'not_found' | 'pending' | 'unverifiable';
  message: string;
} {
  if (!checkLog) {
    return { status: 'pending', message: 'Verification pending' };
  }

  switch (checkLog.status) {
    case 'confirmed':
    case 'valid':
      return { status: 'verified', message: `Verified via ${checkLog.checked_with || 'external source'}` };
    case 'mismatch':
      return { status: 'mismatch', message: 'Data differs from external source' };
    case 'not_found':
      return { status: 'not_found', message: 'Not found in external databases' };
    case 'unverifiable':
      return { status: 'unverifiable', message: 'Not verifiable (non-academic entry)' };
    default:
      return { status: 'pending', message: 'Verification pending' };
  }
}
