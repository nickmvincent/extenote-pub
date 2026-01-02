---
type: doc
title: Cross-Project Linking
visibility: public
order: 10
---
# Cross-Project Linking

Extenote supports linking content across projects using reference keys. This enables a "single source of truth" pattern where canonical data lives in one location and other projects reference it.

## Key Concepts

### Reference Keys

Reference keys are frontmatter fields that point to content in another project:

| Key | Points To | Use Case |
|-----|-----------|----------|
| `citation_key` | Bibtex entry in shared-references | Papers linking to bibliographic metadata |
| `archive_ref` | Blog post in data-leverage-blogs | Editorial stubs linking to full content |

### Single Source of Truth

Instead of duplicating data:

```
# Bad: Duplicate data that can get out of sync
scholarly-publication/paper.md:
  title: "My Paper Title"
  authors: ["Alice", "Bob"]
  venue: "Conference 2025"

shared-references/bibtex-entries/mypaper2025.md:
  title: "My Paper Title"  # duplicated!
  authors: ["Alice", "Bob"]  # duplicated!
  venue: "Conference 2025"  # duplicated!
```

Use reference keys:

```
# Good: Single source of truth
scholarly-publication/paper.md:
  citation_key: mypaper2025
  url: https://mysite.com/paper  # local override

shared-references/bibtex-entries/mypaper2025.md:
  title: "My Paper Title"  # canonical
  authors: ["Alice", "Bob"]  # canonical
  venue: "Conference 2025"  # canonical
```

## citation_key: Linking Papers to Bibtex Entries

The `citation_key` field links a scholarly publication to its canonical bibliographic entry.

### Setup

1. Create a bibtex entry in `shared-references/bibtex-entries/`:

```yaml
# shared-references/bibtex-entries/vincent2025bargaining.md
---
title: "Collective Bargaining in the Information Economy"
authors:
  - Nicholas Vincent
  - Matthew Prewitt
  - Hanlin Li
year: 2025
venue: NeurIPS Position Papers
doi: "10.xxxx/xxxxx"
url: "https://arxiv.org/abs/2506.10272"
abstract: "We argue that..."
---
```

2. Reference it from your publication:

```yaml
# personal-website/scholarly-publication/2025-12-06_cbi.md
---
citation_key: vincent2025bargaining
publication_type: Publication
visibility: public
---
```

### How It Works

When building the personal website, `contentLoader.ts`:
1. Detects `citation_key` in scholarly publication frontmatter
2. Loads the corresponding bibtex entry from `shared-references/bibtex-entries/{citation_key}.md`
3. Merges metadata (bibtex is source of truth for title, authors, year, venue, doi, abstract)
4. Local fields like `url` take precedence if specified

### Fields Merged from Bibtex

| Field | Priority |
|-------|----------|
| `title` | Bibtex wins |
| `authors` | Bibtex wins |
| `year` | Bibtex wins |
| `venue` | Bibtex wins |
| `doi` | Bibtex wins |
| `abstract` | Bibtex wins |
| `url` | Local wins (allows custom links) |

## archive_ref: Linking Blogs to Archives

The `archive_ref` field links a blog stub to the full post content in an archive.

### Setup

1. Ensure full blog post exists in `data-leverage-blogs/`:

```yaml
# data-leverage-blogs/2023-03-02-measuring-relative-ai-alignment.md
---
title: Measuring Relative AI Alignment
subtitle: In Terms of Data Pipelines
date: 2023-03-02
---

Full blog post content here...

This is the canonical version of the post with all the details.
```

2. Create a stub in your editorial collection:

```yaml
# personal-website/editorial-blog/2023-03-01_plural-ai-data-alignment.md
---
title: Plural AI Data Alignment
type: blog_post
date: '2023-03-01'
venue: Data Leverage Newsletter
url: https://dataleverage.substack.com/p/measuring-relative-ai-alignment
archive_ref: 2023-03-02-measuring-relative-ai-alignment
visibility: public
---
```

### How It Works

When building the personal website, `contentLoader.ts`:
1. Detects `archive_ref` in editorial blog frontmatter
2. Loads the full content from `data-leverage-blogs/{archive_ref}.md`
3. Uses the archive body as the entry body
4. Merges select metadata (like `subtitle`)

## Environment Variables

Path resolution uses environment variables with sensible defaults:

```bash
# Bibtex entries location
SHARED_REFS_PATH=../../content/shared-references/bibtex-entries

# Blog archive location
DATA_LEVERAGE_BLOGS_PATH=../../content/data-leverage-blogs
```

## Benefits

1. **No stale data**: Update the source, all references get the update
2. **Cleaner stubs**: Publication files just need the key, not all metadata
3. **Flexible overrides**: Local values can override when needed
4. **Cross-project reuse**: Same bibtex entry powers multiple sites

## Creating New Links

### For a new publication:

```bash
# 1. Import or create bibtex entry
bun run cli -- import-bib path/to/paper.bib

# 2. Add citation_key to publication
# Edit: personal-website/scholarly-publication/my-paper.md
# Add: citation_key: authorYYYYkeyword
```

### For a new blog:

```bash
# 1. Ensure blog exists in data-leverage-blogs/
# 2. Add archive_ref to editorial stub
# Edit: personal-website/editorial-blog/my-post.md
# Add: archive_ref: YYYY-MM-DD-slug-name
```

## Troubleshooting

### "Bibtex entry not found for citation_key: X"

The referenced bibtex entry doesn't exist. Check:
- File exists at `shared-references/bibtex-entries/{citation_key}.md`
- Citation key matches exactly (case-sensitive)

### "Data leverage blog not found for archive_ref: X"

The referenced blog post doesn't exist. Check:
- File exists at `data-leverage-blogs/{archive_ref}.md`
- Slug matches exactly (case-sensitive)

### Data not updating

The personal website caches data in production. Force rebuild:

```bash
cd websites/personal-website-astro
bun run build
```
