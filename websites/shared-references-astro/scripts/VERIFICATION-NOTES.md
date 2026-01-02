# Reference Verification: Notes and Learnings

## What We Tried

### v1: Semantic Scholar Only
Simple script that:
- Looked up papers by DOI, arXiv ID, or title search
- Compared title, authors, year against local metadata
- Wrote flat fields: `verified_auto`, `verified_status`, `verified_source`, `verified_paper_id`

**Issues encountered:**
- Semantic Scholar rate limits aggressively (1 req/sec, 429s after ~10-20 requests)
- Title search often returns wrong papers
- Year mismatches common (arXiv year vs conference year)

### v2: Multi-Source (DBLP, OpenAlex, Semantic Scholar)
More comprehensive script that:
- Hit DBLP first (best for CS conference papers)
- Then OpenAlex (tracks preprint-to-published relationships)
- Semantic Scholar as backup
- Recorded detailed logs: timestamps, API calls, response times, all matches
- Attempted to detect "outdated" refs (arXiv paper that's now published at a conference)

**Issues encountered:**
- DBLP title search returns wrong papers (keyword matching, not exact)
- Need to pre-validate that a "match" is actually the same paper before trusting its metadata
- Different sources disagree on years (arXiv upload year vs conference year vs publication year)
- Author name normalization is hard (diacritics, "Last, First" vs "First Last", etc.)

## Why This Problem Is Hard

### 1. No Canonical Identifiers
- Not all papers have DOIs
- arXiv IDs don't always link to published versions
- Same paper can have different identifiers across sources

### 2. Metadata Disagreement Across Sources
- Year: Is it the arXiv upload date? Conference date? Journal publication date?
- Authors: Different name formats, diacritics handled differently, author order sometimes differs
- Title: Subtitles included/excluded, punctuation differences, version differences

### 3. Preprint vs Published Version
- A paper on arXiv from 2023 might be published at NeurIPS 2024
- Which citation is "correct"? Depends on context
- Hard to automatically decide if a ref should be "upgraded" to conference version

### 4. API Limitations
- Rate limits make batch verification slow
- Search APIs return "similar" papers, not exact matches
- Need human judgment to verify a match is correct

### 5. Edge Cases
- Books (not in academic databases)
- Technical reports
- Blog posts, websites
- Standards documents (ISO, NISO, etc.)
- Papers with institutional authors ("{DeepSeek AI}")

## Ideas for Future

### Manual-First Approach
- Focus on `verified_manual` field for human verification
- Script could generate a "review queue" of unverified refs
- Human confirms each one, script just assists with lookups

### Confidence Scores
- Instead of binary valid/mismatch, compute a confidence score
- High confidence (DOI match, all metadata agrees) = auto-verify
- Low confidence = add to review queue

### Separate "Upgrade" Detection
- Don't mix "is this ref correct?" with "is there a newer published version?"
- Two separate workflows:
  1. Verify existing metadata is accurate
  2. Optionally upgrade arXiv refs to conference versions

### Better Title Matching
- Use fuzzy matching with a high threshold
- Normalize more aggressively (remove subtitles, punctuation, etc.)
- Require 2+ sources to agree before trusting

### Incremental Verification
- Verify refs as they're added, not in bulk
- Could hook into the content creation workflow

### Source Priority
- For papers with DOIs: trust DOI lookup (Crossref/OpenAlex)
- For arXiv papers: trust arXiv API + Semantic Scholar for conference detection
- For CS papers: DBLP is authoritative for venue/year
- Don't try to reconcile disagreements, just pick the most authoritative source

## Files

- `verify-references.ts` - Current v2 implementation (multi-source, detailed logging)
- This file - Notes on the problem

## Schema Fields (Currently Removed)

We had planned these fields but removed them pending better solution:

```typescript
// Simple fields (v1)
verified_manual: z.string().optional(),
verified_auto: z.string().optional(),
verified_source: z.enum(['semantic_scholar', 'openalex', 'crossref', 'arxiv', 'doi', 'dblp']).optional(),
verified_status: z.enum(['valid', 'mismatch', 'not_found', 'unverifiable', 'outdated']).optional(),
verified_paper_id: z.string().optional(),

// Detailed log (v2)
verification_log: z.object({
  verified_at: z.string(),
  api_calls: z.array(...),
  matches: z.array(...),
  mismatches: z.array(...),
  consensus: z.object(...),
  has_published_version: z.boolean(),
  published_venue: z.string().optional(),
  status: z.enum([...]),
}).optional()
```
