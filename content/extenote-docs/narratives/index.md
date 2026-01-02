---
type: doc
title: "Narrative Tests"
visibility: public
order: 20
---

# Narrative Tests

Learn how Extenote works by walking through annotated test cases. Each narrative explains a feature through the tests that validate it.

## Coverage

**54** of **617** tests (9%) are documented in narratives across **13** topics.

Narratives are organized by feature area, starting with foundational concepts (validation, string matching) and building toward higher-level features (cross-references, exports).

## Check

*Reference verification and metadata matching*

- [String Normalization for Matching](/extenote/docs/narratives/check-string-normalization) (3 steps) - When comparing academic metadata (titles, authors, venues), Extenote normalizes strings to handle variations in formatting, diacritics, and whitespace.
- [Author Name Parsing](/extenote/docs/narratives/check-author-parsing) (3 steps) - Academic papers use different author name formats: "Smith, John" (BibTeX style) vs "John Smith" (natural style).

## Validation

*Schema and field validation*

- [Schema Validation Basics](/extenote/docs/narratives/validation-schema-basics) (11 steps) - Learn how Extenote validates objects against their schemas.

## Crossref

*Links, citations, and backlinks*

- [Wiki Link Parsing](/extenote/docs/narratives/crossref-wiki-links) (4 steps) - Wiki links connect your notes together using [[double-bracket]] syntax.
- [Citation Parsing](/extenote/docs/narratives/crossref-citations) (3 steps) - Extenote supports academic citation syntax similar to Pandoc and Quarto.
- [Backlinks and Cross-References](/extenote/docs/narratives/crossref-backlinks) (3 steps) - Extenote automatically computes bidirectional links between your content.

## Tags

*Hierarchical tag management*

- [Building the Tag Tree](/extenote/docs/narratives/tags-tree-structure) (3 steps) - Extenote organizes tags into a hierarchical tree.

## Lint

*Content linting rules*

- [Content Linting](/extenote/docs/narratives/lint-visibility) (5 steps) - Extenote validates your content against configurable rules.

## Export

*Exporting to external formats*

- [BibTeX Export](/extenote/docs/narratives/export-bibtex) (4 steps) - Export your bibliography entries to standard BibTeX format for use with LaTeX, citation managers, and other academic tools.

## Refcheck

*Verifying references against DBLP and OpenAlex*

- [Reference Field Comparison](/extenote/docs/narratives/refcheck-field-comparison) (4 steps) - When verifying your bibliography against DBLP or OpenAlex, Extenote compares each field (title, authors, year, venue) individually.
- [Author List Comparison](/extenote/docs/narratives/refcheck-author-comparison) (4 steps) - Comparing author lists is tricky because names appear in different formats: "John Smith", "Smith, John", "J.
- [Page-to-Bibliography Matching](/extenote/docs/narratives/refcheck-page-matching) (4 steps) - When you visit an academic paper online, Extenote checks if it's already in your bibliography.

## Backup

*Undo and backup system*

- [Backup and Undo System](/extenote/docs/narratives/backup-undo-system) (3 steps) - Every destructive operation in Extenote (tag renames, deletes, merges) creates a backup first.

---

*These documents are generated from test annotations. Run `bun run generate:narratives` to regenerate.*
