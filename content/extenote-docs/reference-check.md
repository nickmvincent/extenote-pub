---
type: doc
title: Refcheck
visibility: public
order: 8
---
# Refcheck

Refcheck verifies your bibliographic references against external academic databases to catch errors, find missing metadata, and ensure citation accuracy.

## Overview

The `refcheck` command looks up your bibtex entries in external APIs and compares the metadata. For each entry, it:

1. Searches the provider's API using DOI or title
2. Compares local metadata against the remote source
3. Reports matches and mismatches at the field level
4. Stores detailed results in the `check_log` frontmatter field

## Refcheck Workflow (CLI + Clipper)

Refcheck runs in two places: the CLI and the browser clipper extension. A typical flow is:

1. **Clip a paper** with the browser extension to create a `bibtex_entry`
2. **Pick the best source** in the clipper (DBLP/Semantic Scholar by default; OpenAlex and Crossref optional)
3. **Validate** with `refcheck` in the CLI or use the clipper's validation mode
4. **Fix mismatches** using values stored in `check_log`

If you're using the clipper in download mode, move the saved markdown file into your vault before running `refcheck`. See `extensions/clipper/README.md` for installation and API mode setup.

## Usage

```bash
# Check all bibtex entries (uses 'auto' provider by default)
bun run cli -- refcheck

# Check entries in a specific project
bun run cli -- refcheck shared-references

# Check a single file
bun run cli -- refcheck --file references/smith-2024.md

# Preview without updating files
bun run cli -- refcheck --dry-run

# Re-check entries that were already checked
bun run cli -- refcheck --force

# Use a specific provider
bun run cli -- refcheck --provider dblp
bun run cli -- refcheck --provider openalex

# Check only entries matching a path pattern
bun run cli -- refcheck --filter "references/2024/*"

# Limit the number of entries to check
bun run cli -- refcheck --limit 10

# Resume from a specific entry (if interrupted)
bun run cli -- refcheck --start-from smith2024

# Skip first N entries (alternative resume method)
bun run cli -- refcheck --skip 50

# List available providers
bun run cli -- refcheck --list-providers
```

## Providers

### CLI providers

The CLI `refcheck` command supports:
- `auto` (default): DBLP → Crossref → Semantic Scholar → OpenAlex
- `dblp`
- `crossref`
- `s2` (Semantic Scholar)
- `openalex`

### Clipper extension sources

The browser clipper searches DBLP and Semantic Scholar by default, with optional OpenAlex and Crossref toggles. When multiple sources return results, the clipper auto-selects the best match based on completeness rather than a fixed order.

### dblp (CLI + clipper)

[DBLP](https://dblp.org) is the computer science bibliography database. Best for:
- Computer science conference papers
- CS journal articles
- Papers with accurate BibTeX entries

DBLP provides high-quality BibTeX that can be used to correct your entries.

### s2 (Semantic Scholar, CLI + clipper)

[Semantic Scholar](https://www.semanticscholar.org) provides broad academic coverage with good abstracts. Best for:
- Papers across all academic fields
- Works with arXiv IDs or DOIs
- Access to citation data and abstracts

### openalex (CLI + clipper)

[OpenAlex](https://openalex.org) is an open catalog of 200M+ scholarly works. Best for:
- Papers across all academic disciplines
- Works with DOIs
- Comprehensive coverage with links to other databases

### crossref (CLI + clipper)

[Crossref](https://www.crossref.org) is the official DOI metadata registry. Best for:
- Any DOI-registered work
- Authoritative DOI metadata
- Fallback when other providers don't have the paper

## Refcheck Status

Each checked entry receives one of these statuses:

| Status | Meaning |
|--------|---------|
| `confirmed` | All checked fields match the remote source |
| `mismatch` | One or more fields differ from the remote source |
| `not_found` | Paper was not found in the provider's database |
| `error` | API error or processing error occurred |
| `stale` | Refcheck is older than 30 days (re-validate for freshness) |
| `unchecked` | Entry has never been validated |

## Mismatch Severity

When a mismatch is detected, refcheck also classifies its **severity** to help you prioritize review:

| Severity | Meaning | Examples |
|----------|---------|----------|
| `minor` | Likely a false positive, probably OK | Venue: "NeurIPS 2023" vs "arXiv"; Author initials differ; Year off by 1 |
| `major` | Needs human review | Wrong authors (book review matched); DOI mismatch; Title differs |

### Minor Mismatches (Likely OK)

These patterns are common and usually don't indicate real errors:

- **Venue variations**: Conference name vs arXiv preprint (e.g., "ICML 2023" vs "arXiv (Cornell University)")
- **Author initials**: "John Smith" vs "J. Smith" or "John D. Smith"
- **Year ±1**: Preprint date vs publication date

### Major Mismatches (Need Review)

These patterns often indicate real issues:

- **Wrong authors**: Last names don't match (may have matched a book review instead of the book)
- **DOI mismatch**: Different DOIs mean different papers
- **Title mismatch**: Likely matched the wrong paper entirely
- **Book → journal**: Publisher venue matched to a journal (book review problem)

The CLI shows severity in its output:
```
⚠ [mismatch:minor] smith2023   # Yellow - probably OK
⚠ [mismatch:major] zuboff2019  # Red - needs review
```

The web app Review page has filters for "Mismatches (major)" and "Mismatches (minor)" to help you focus on entries that need attention.

## Field Comparison

Refcheck compares these fields when available in both local and remote:

| Field | Comparison Method |
|-------|-------------------|
| `title` | Normalized string match (ignores case, punctuation, diacritics) |
| `authors` | Count match + first/last name comparison for each author |
| `year` | Exact numeric match |
| `venue` | Normalized string match (journal/booktitle/conference) |
| `doi` | Normalized DOI match (strips `https://doi.org/` prefix) |

### Normalization

String comparisons use normalization to handle minor differences:
- Case insensitive (`Deep Learning` = `deep learning`)
- Ignores diacritics (`Müller` = `Muller`)
- Ignores punctuation (`What's Next?` = `Whats Next`)
- Collapses whitespace

When strings don't match, refcheck reports the **edit distance** (Levenshtein distance) so you can gauge how different they are.

## The check_log Field

After refcheck runs, the entry's frontmatter is updated with a `check_log` field containing:

```yaml
check_log:
  checked_at: "2024-01-15T10:30:00.000Z"
  checked_with: dblp
  status: mismatch
  paper_id: conf/neurips/SmithJ23

  fields:
    title:
      local: "Deep Learing for NLP"
      remote: "Deep Learning for NLP"
      match: false
      edit_distance: 2

    authors:
      local_count: 2
      remote_count: 2
      count_match: true

    year:
      local: "2023"
      remote: "2024"
      match: false
      year_diff: 1

  remote:
    title: "Deep Learning for NLP"
    authors:
      - "John Smith"
      - "Jane A. Doe"
    year: 2024
    venue: "Advances in Neural Information Processing Systems"
    doi: "10.1234/example"

  external_bibtex:
    source: dblp
    bibtex: |
      @inproceedings{DBLP:conf/neurips/SmithJ23,
        author    = {John Smith and Jane A. Doe},
        title     = {Deep Learning for NLP},
        booktitle = {NeurIPS},
        year      = {2024}
      }
    fetched_at: "2024-01-15T10:30:00.000Z"
```

### Using check_log to Fix Entries

The `remote` section contains the provider's values, making it easy to copy the correct data:

```yaml
# Before (with typo)
title: "Deep Learing for NLP"

# After (corrected from check_log.remote.title)
title: "Deep Learning for NLP"
```

The `external_bibtex` section (when available from DBLP) provides a complete BibTeX entry you can use as a reference.

## Best Practices

1. **Run with `--dry-run` first** to see what would be changed without modifying files

2. **Refcheck by project** to focus on specific reference sets:
   ```bash
   bun run cli -- refcheck shared-references --dry-run
   ```

3. **Use `--force` sparingly** - only re-check when you've made corrections or want fresh data

4. **Review mismatches carefully** - not all differences are errors:
   - Venue names vary (abbreviations vs full names)
   - Author middle names may differ
   - Year might be publication vs online date

5. **Trust but verify** - external APIs aren't perfect:
   - DBLP focuses on CS, may not have other disciplines
   - OpenAlex has broader coverage but may have less accurate metadata

## Troubleshooting

### `No bibtex entries found to refcheck`

Entries must have `type: bibtex_entry` in their frontmatter to be checked.

### "Paper not found"

Refcheck uses DOI (if available) or title to search. If neither produces a match:
- Verify the DOI is correct
- Try a different provider
- The paper may not be in the database

### Rate Limiting

Refcheck includes automatic rate limiting (250ms between API calls) to avoid overloading providers. For large batches, use `--limit` to refcheck in smaller groups, or use `--skip`/`--start-from` to resume interrupted runs.

## Re-checking and Staleness

### How Re-checking Works

By default, the refcheck command **skips entries that already have a `check_log`**. This prevents unnecessary API calls and preserves your verification history.

To re-check entries:

```bash
# Re-check all entries, overwriting existing check_log
bun run cli -- refcheck --force

# Re-check a specific file
bun run cli -- refcheck --file references/smith-2024.md --force
```

### When to Re-check

Re-check entries when:
- You've corrected metadata (fixed a typo, added DOI)
- The original refcheck failed (`error` status)
- The refcheck is stale (older than 30 days)
- You want to try a different provider

### Stale Checks

Checks older than 30 days are marked as `stale`. This doesn't mean they're wrong - external databases rarely change existing records. Staleness is a soft reminder that you might want fresh data.

```yaml
# Example stale check_log
check_log:
  checked_at: "2024-10-15T10:30:00.000Z"  # More than 30 days ago
  status: stale  # Automatically computed, not stored
```

## Auto Mode Provider Selection

The CLI `auto` provider (default) tries providers in order until one succeeds:

1. **DBLP** - Tried first, best for computer science
2. **Crossref** - DOI-based lookup, good for published works
3. **Semantic Scholar** - Broad academic coverage
4. **OpenAlex** - Broader coverage across fields

The clipper evaluates DBLP and Semantic Scholar (plus optional OpenAlex/Crossref) and picks the most complete result rather than following a fixed order.

"Succeeds" means the provider found a matching paper - even if fields mismatch. The CLI stops at the first provider that returns a result, so:

- A CS paper will typically be checked against DBLP
- A paper with a DOI might match in Crossref
- Other papers might fall through to Semantic Scholar or OpenAlex

The `checked_with` field records which provider was used:

```yaml
check_log:
  checked_with: "auto:dblp"      # Auto mode, matched in DBLP
  checked_with: "auto:crossref"  # Auto mode, matched in Crossref
  checked_with: "auto:s2"        # Auto mode, matched in Semantic Scholar
  checked_with: "auto:openalex"  # Auto mode, matched in OpenAlex
  checked_with: "dblp"           # Explicit provider selection
```

## Viewing Refcheck Status

### In the Web App

On each reference's detail page, you'll see a verification badge showing:

| Badge | Meaning |
|-------|---------|
| ✓ Confirmed | All checked fields match the external database |
| ⚠ Needs review - N fields differ | Some fields differ (see list below) |
| ? Not found | Paper wasn't in the database |
| ✗ Refcheck failed | API error occurred |
| ↻ Stale | Refcheck is older than 30 days |
| ○ Not yet checked | Entry hasn't been verified |

For mismatches, the badge shows which fields differ (title, authors, year, venue, doi). Scroll down to compare the "Local Entry" and "From [source]" BibTeX side-by-side.

### In the Markdown Files

The full details are stored in the `check_log` frontmatter field:

```yaml
check_log:
  checked_at: "2024-01-15T10:30:00.000Z"
  checked_with: "auto:dblp"
  status: mismatch
  paper_id: conf/neurips/SmithJ23
  fields:
    title:
      local: "Deep Learing for NLP"
      remote: "Deep Learning for NLP"
      match: false
      edit_distance: 2
    year:
      local: "2023"
      remote: "2024"
      match: false
  remote:
    title: "Deep Learning for NLP"
    authors: ["John Smith", "Jane Doe"]
    year: 2024
```

### Interpreting Mismatches

Not all mismatches are errors. Common benign differences:

| Field | Common Reason |
|-------|---------------|
| `venue` | Abbreviation vs full name ("NeurIPS" vs "Advances in Neural Information Processing Systems") |
| `authors` | Middle initials, name order, diacritics ("François" vs "Francois") |
| `year` | Online publication date vs print date |
| `title` | Trailing period in database ("Title." vs "Title") |

The `edit_distance` helps gauge severity - distance of 1-2 usually indicates minor formatting differences.

## Manual Verification

For entries that can't be automatically verified (books, technical reports, websites), add a `manually_verified` field:

```yaml
manually_verified:
  verified_at: "2024-12-28T00:00:00.000Z"
  verified_by: human
  notes: "Verified against publisher website"
canonical_source:
  url: "https://example.com/book"
  title: "The Book Title"
  accessed_at: "2024-12-28"
```

This will display a "Manually verified" badge in the web app.
