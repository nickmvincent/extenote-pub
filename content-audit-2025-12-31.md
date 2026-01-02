# Content Audit Report

**Date:** 2025-12-31
**Repository:** extenote-pub
**Auditor:** Claude Code (Opus 4.5)

---

## Executive Summary

This comprehensive audit reviewed all content in the `extenote-pub` repository, covering 600+ files across 15 content directories. The audit identified issues in the following categories:

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Missing/Incomplete Content | 4 | 12 | 8 | 6 |
| Placeholder/TODO Items | 2 | 15 | 10 | - |
| Hallucinated/Fake URLs | - | 4 | - | - |
| Writing Quality Issues | 3 | 4 | 8 | 12 |
| Schema/Formatting Issues | 3 | 10 | 15 | 20 |
| Cross-Reference Problems | - | 3 | 5 | - |

**Overall Content Health:** Moderate - Most content is high quality, but several sections have significant gaps requiring attention.

---

## Table of Contents

1. [Critical Issues (Immediate Action Required)](#1-critical-issues)
2. [Shared References Audit](#2-shared-references)
3. [Blog Posts Audit](#3-blog-posts)
4. [Extenote Documentation Audit](#4-extenote-docs)
5. [Personal Website Audit](#5-personal-website)
6. [PAIDF Mini-Book Audit](#6-paidf-mini-book)
7. [Other Content Directories](#7-other-content)
8. [Cross-Reference Issues](#8-cross-references)
9. [Recommendations](#9-recommendations)

---

## 1. Critical Issues

### Hallucinated/Placeholder URLs (HIGH PRIORITY)

The following files contain `example.com` placeholder URLs that appear to be fabricated:

| File | Fake URL | Required Action |
|------|----------|-----------------|
| `data-napkin-math/inputs/conversion_rate__stackipedia__contributions_per_document.md` | `https://example.com/stackipedia-content-aggregation` | Replace with real source or remove |
| `data-napkin-math/inputs/target_metric__stackipedia__tokens.md` | `https://example.com/stackipedia-target-tokens` | Replace with real source or remove |
| `data-napkin-math/inputs/dataset_attribute__stackipedia__tokens_per_document.md` | `https://example.com/stackipedia-document-length` | Replace with real source or remove |
| `data-napkin-math/inputs/conversion_rate__stackipedia__visitors_per_contribution.md` | `https://example.com/stackipedia-engagement` | Replace with real source or remove |

### Incomplete Course Content (HIGH PRIORITY)

| File | Issue |
|------|-------|
| `courses/technical-writing.md` | Resources and Assignments sections marked "To be added" |
| `courses/syllabi/technical-writing-syllabus.md` | Assessment "To be determined", Resources "To be added" |
| `courses/reading_lists/technical-writing-readings.md` | Entire file is placeholder content |
| `courses/reading_lists/random-stuff-readings.md` | All sections empty ("To be added") |

### Data Quality Issues in Shared References

| File | Issue | Fix |
|------|-------|-----|
| `shared-references/bibtex-entries/longpre2024consent.md` | Duplicate `author:` and `authors:` fields | Remove `author:` field |
| `shared-references/bibtex-entries/dpo_paper.md` | Wrong year: 2024, should be 2023 | Update year |
| `shared-references/bibtex-entries/delriochanona2024stackoverflow.md` | Wrong year: 2024, should be 2023 | Update year |

### Typos in Published Content

| File | Line | Error | Correction |
|------|------|-------|------------|
| `personal-website/cv-appointments/2023_sfu_appointment.md` | 7 | "Digitial" | "Digital" |
| `personal-website/talks-events/2025-03_ai_day_of_learning.md` | 20 | "better understanding" | "better understand" |
| `data-licenses/readme.md` | 8 | "concenpts" | "concepts" |
| `data-napkin-math/inputs/dataset_size__hle__questions.md` | 26 | "examn" | "exam" |

---

## 2. Shared References

**Total Files:** 427 bibtex entries + 14 paper collections
**Quality Score:** 85/100

### Issues Found

#### Missing/Incorrect Author Field Format (8 files)

These files use `author:` (string) instead of `authors:` (array):

1. `deepseek2025r1.md`
2. `hecht2017google.md`
3. `kwon2021betashapley.md`
4. `vincent2023datalabor.md`
5. `vincent2024attentional.md`
6. `delriochanona2024stackoverflow.md`
7. `na2024modulartraining.md`
8. `longpre2024consent.md` (has both - duplicate)

#### Missing Year Field (35 files)

Mostly specification/API entries (acceptable):
- `alpaca_clean.md`, `arxiv_api.md`, `c4_github.md`, `jsonlines.md`, `parquet.md`, etc.

#### Missing Venue Field (77 files)

Mix of papers and non-academic sources. Notable papers missing venues:
- `acemoglu2018ai.md` - NBER Working Paper
- `carlini2024poisoningwebscaletrainingdatasets.md`
- `benaich2023.md`

#### Verification Status

| Status | Count | Notes |
|--------|-------|-------|
| confirmed | 96 | Successfully verified against external sources |
| mismatch | 200 | Minor field differences (usually venue naming) |
| not_found | 130 | Often older books, government docs (acceptable) |

---

## 3. Blog Posts

**Total Files:** 28 posts
**Quality Score:** 95/100

### Status: EXCELLENT

All blog posts pass frontmatter validation with complete required fields. Writing quality is professional.

### Minor Issues

| File | Issue |
|------|-------|
| `apoc.md` | Missing optional `subtitle` field (inconsistent with other posts) |

### Notes

- Several posts explicitly marked as "early drafts" in content (not frontmatter) - this is intentional
- All external links appear valid
- Citation format consistent throughout

---

## 4. Extenote Documentation

**Total Files:** 29 markdown files
**Quality Score:** 70/100

### Critical Issues

#### Missing Screenshots

**File:** `web-ui.md`

Document references 17 screenshots that don't exist:
- `/extenote/screenshots/01-dashboard.png`
- `/extenote/screenshots/02-nav-bar.png`
- etc.

Header states: "**Screenshots pending:** The screenshot files referenced below have not been generated yet."

#### Undocumented Commands

| Command | Referenced In | Issue |
|---------|---------------|-------|
| `import-bib` | `cross-project-linking.md:177` | Not in CLI reference, may not exist |
| `sync-citations` | `computed-data.md:107-118` | Not in main CLI reference |

#### WIP Features

ATProto/Semble sync marked as "very WIP" in multiple places:
- `configuration.md:369`
- `cli.md:268`
- `index.md:84`

### Medium Issues

- Command inconsistencies: `extenote web` vs `bun run web` vs `bun run web:server`
- Duplicate `order:` values in frontmatter causing navigation issues
- No dedicated TUI documentation

---

## 5. Personal Website

**Total Files:** 171 markdown files
**Quality Score:** 88/100

### Critical Issues

| File | Issue |
|------|-------|
| `scholarly-workshop_paper/2022-cscw-tensions.md:25` | Contains only "todo" |
| `scholarly-workshop_paper/2023-cscw-licensing.md:20` | Contains only "todo" |
| `scholarly-workshop_paper/2023-cscw-epistemic.md:20` | Contains only "todo" |
| `education/northwestern.md` | Link text reads "[link]" instead of descriptive text |

### TODO Markers in Teaching Files

The following teaching entries have unresolved TODOs:
- `cv-teaching/2024-01_cmpt419.md` - "Todo: add course webpage"
- `cv-teaching/2023-09_cmpt120.md` - "Todo: add course webpage"
- `cv-teaching/2024-09_cmpt120.md` - "Todo: add course webpage"
- `cv-teaching/2025-01_cmpt419.md` - "Todo: add course webpage"
- `cv-teaching/2025-09_cmpt120.md` - "Todo: add course webpage"
- `cv-teaching/2025-09_cmpt419.md` - "Todo: add course webpage"
- `cv-appointments/2022_davis_appointment.md` - "Todo: improve schema for notes"
- `cv-appointments/2023_sfu_appointment.md` - "Todo: improve schema for affiliations"

### Missing DOIs (Future Publications)

These 2025 publications need DOIs once available:
- `scholarly-publication/2025-08_aies_hf_data.md`
- `scholarly-publication/2025-08_aies_health.md`
- `scholarly-publication/2025-06-23_facct_pushpull.md`
- `scholarly-publication/2025-06-23_facct_multiplecollectives.md`
- `scholarly-publication/2025-12-06_cbi.md`

---

## 6. PAIDF Mini-Book

**Total Files:** 28 Quarto documents
**Quality Score:** 65/100

### Critical Issues

#### Severely Incomplete Chapters

| File | Issue |
|------|-------|
| `2e_code.qmd` | Contains only placeholder text with no actual code snippets |
| `3c_future_directions.qmd` | Only 27 lines, minimal content, marked as "draft" |

#### Broken Cross-References

| File:Line | Reference | Issue |
|-----------|-----------|-------|
| `01a_intro.qmd:24` | `@a-democratic-data-pipeworks` | Target anchor doesn't exist |
| `01a_intro.qmd:38` | `@why-collect-data` | Section not properly anchored |
| `01a_intro.qmd:55` | `@ethics-and-compliance` | Heading doesn't match |

#### Truncated Content

| File | Issue |
|------|-------|
| `01c_pipeworks.qmd:49` | Sentence cut off: "enabling pluralistic governance and new not" |

### TODO File

`todos.md` contains explicit unresolved items:
- `#todo: talk about the convergence of "feedback data" in the flywheel and "content data"`
- `#todo: talk about user reputation`
- `#todo: talk about machine unlearning in EC section`

### Status Annotations Requiring Attention

Many chapters have `status:` notes indicating rewrites needed:
- `01c_pipeworks.qmd`: "needs rewrite - reads like a blog summary"
- `01e_options_for_flywheel.qmd`: "needs tightening - repetitive and list-heavy"
- `01f_ethics_compliance.qmd`: "needs rewrite - list-heavy"
- `01i_extended_model.qmd`: "needs heavy revision - overlong and reads like LLM-generated exposition"
- `appendix3_example_legalterms.qmd`: "needs contributions"
- `appendix4_diffable_terms.qmd`: "needs rewrite - placeholder date and no actual diff annotations"

---

## 7. Other Content

### Data Napkin Math

**Status:** Active development with many TODOs

| Issue Type | Details |
|------------|---------|
| Active TODO file | `TODO.md` with 80+ unchecked items |
| Missing sources | `wage_data__phd__dollars_per_question.md`, `dataset_size__hle__questions.md` have "#todo" in source fields |
| Placeholder URLs | 4 files with `example.com` URLs (see Critical Issues) |

### Data Licenses

**Status:** Multiple WIP initiatives

| File | Status |
|------|--------|
| `initiatives/ai-pref.md` | `status: WIP` |
| `initiatives/cc-signals.md` | `status: WIP` |
| `initiatives/ai-txt.md` | `status: WIP` |
| `initiatives/abc.md` | `status: WIP` |

### Courses

**Status:** Spring 2025 and Fall 2025 courses complete; Technical Writing incomplete

| Course | Status |
|--------|--------|
| `cmpt419-spring2025` | Complete |
| `cmpt419-fall2025` | Complete |
| `cmpt120` | Complete |
| `technical-writing` | INCOMPLETE - placeholder content |
| `random-stuff` | INCOMPLETE - all readings empty |

### Ranking Book

**Status:** Complete - no issues found

### Talks

**Status:** Complete - 2 events documented with proper metadata

---

## 8. Cross-References

### Global TODO/FIXME Count

Found across all content directories:
- Direct TODO markers: 45+ instances
- WIP status markers: 15+ instances
- Placeholder text ("To be added"): 20+ instances

### Taxonomy Validation

`_taxonomy.md` defines tag hierarchy. No validation errors detected in current content.

### Internal Links

No broken internal links detected (wikilinks or relative paths).

---

## 9. Recommendations

### Immediate (This Week)

1. **Fix typos in published content** (4 items listed above)
2. **Remove/replace placeholder URLs** in data-napkin-math stackipedia files
3. **Fix shared-references data issues:**
   - Remove duplicate `author:` field from `longpre2024consent.md`
   - Update years in `dpo_paper.md` and `delriochanona2024stackoverflow.md`
   - Convert `author:` to `authors:` array in 8 files

### Short-term (This Month)

4. **Generate web-ui screenshots** or remove screenshot references
5. **Document missing CLI commands** (`import-bib`, `sync-citations`)
6. **Complete PAIDF mini-book code chapter** (`2e_code.qmd`)
7. **Fix broken cross-references** in PAIDF mini-book intro
8. **Address workshop paper TODOs** (3 files with just "todo")

### Medium-term (This Quarter)

9. **Complete technical-writing course materials**
10. **Standardize WIP feature documentation** with consistent labeling
11. **Add course webpage URLs** to teaching entries
12. **Review and rewrite flagged PAIDF chapters** per their status notes
13. **Add missing sources** to data-napkin-math inputs
14. **Add DOIs** to 2025 publications as they become available

### Ongoing Maintenance

15. Establish regular content audits (quarterly recommended)
16. Run `bun run cli -- lint` before committing content changes
17. Use `bun run cli -- refcheck` to validate shared-references
18. Regenerate narrative documentation after test updates

---

## Appendix: Files Requiring Immediate Attention

### Priority 1 (Fix Today)

```
personal-website/cv-appointments/2023_sfu_appointment.md
personal-website/talks-events/2025-03_ai_day_of_learning.md
data-licenses/readme.md
data-napkin-math/inputs/dataset_size__hle__questions.md
shared-references/bibtex-entries/longpre2024consent.md
shared-references/bibtex-entries/dpo_paper.md
shared-references/bibtex-entries/delriochanona2024stackoverflow.md
```

### Priority 2 (Fix This Week)

```
data-napkin-math/inputs/conversion_rate__stackipedia__contributions_per_document.md
data-napkin-math/inputs/target_metric__stackipedia__tokens.md
data-napkin-math/inputs/dataset_attribute__stackipedia__tokens_per_document.md
data-napkin-math/inputs/conversion_rate__stackipedia__visitors_per_contribution.md
paidf-mini-book/2e_code.qmd
paidf-mini-book/01c_pipeworks.qmd
personal-website/scholarly-workshop_paper/2022-cscw-tensions.md
personal-website/scholarly-workshop_paper/2023-cscw-licensing.md
personal-website/scholarly-workshop_paper/2023-cscw-epistemic.md
```

### Priority 3 (Fix This Month)

```
extenote-docs/web-ui.md
extenote-docs/cross-project-linking.md
paidf-mini-book/01a_intro.qmd
paidf-mini-book/3c_future_directions.qmd
courses/technical-writing.md
courses/syllabi/technical-writing-syllabus.md
courses/reading_lists/technical-writing-readings.md
courses/reading_lists/random-stuff-readings.md
shared-references/bibtex-entries/deepseek2025r1.md
shared-references/bibtex-entries/hecht2017google.md
shared-references/bibtex-entries/kwon2021betashapley.md
shared-references/bibtex-entries/vincent2023datalabor.md
shared-references/bibtex-entries/vincent2024attentional.md
shared-references/bibtex-entries/na2024modulartraining.md
```

---

*Report generated by Claude Code on 2025-12-31*
