---
type: doc
title: Glossary
visibility: public
order: 15
---
# Glossary

Quick reference for extenote terminology.

## Core Concepts

**Object**
: A single markdown file with YAML frontmatter. The atomic unit of content in extenote. Each object has a `type` field that determines its schema.
: Example: `shared-references/bibtex-entries/Smith2024.md`

**Vault**
: A directory containing objects. Vaults are the physical storage for content.
: Example: `extenote-pub/content/shared-references/`

**Project**
: A YAML configuration file that defines sources (which vaults to read), schemas (validation rules), build settings, and deployment targets. Projects tie content to outputs.
: Example: `extenote/projects/shared-references.yaml`

**Schema**
: A YAML file defining the valid fields and types for objects of a given `type`. Schemas enable validation and typed content.
: Example: `extenote/schemas/bibtex_entry.yaml`

## Content Terms

**Frontmatter**
: The YAML block at the top of a markdown file (between `---` markers). Contains metadata like `title`, `type`, `visibility`, `tags`, etc.

**Type**
: The `type` field in frontmatter determines which schema validates the object. Common types: `doc`, `bibtex_entry`, `blog_post`, `memo`.

**Visibility**
: Controls whether content is public or private. Set via `visibility: public` or `visibility: private` in frontmatter. Projects define `defaultVisibility`.

**Tags**
: Hierarchical labels for organizing content. Can be simple (`ml-methods`) or namespaced (`collection:data-leverage`). Defined in frontmatter as a list.

**Citation Key**
: A unique identifier for bibliographic entries (bibtex_entry type). Usually `AuthorYear` format. Used for cross-references.

## Project Configuration

**Sources**
: The `sources` block in a project config defines where to load content from. Each source has an `id`, `type` (usually `local`), `root` path, and `include` patterns.

**Includes**
: Projects can include other projects via the `includes` block. This pulls in content from other vaults (e.g., `shared-references` for citations).

**Build**
: The `build` block defines how to generate a website from content. Specifies `websiteDir`, `type` (astro/quarto), and `preRender` steps.

**Deploy**
: The `deploy` block specifies where to publish the built site. Supports `cloudflare-pages`, `github-pages`, `ftp`, etc.

## Operations

**Lint**
: Validate content against schemas and project rules. Run with `bun run cli -- lint <project>`.

**Refcheck**
: Verify bibliographic entries against external sources (DBLP, OpenAlex, Semantic Scholar). Run with `bun run cli -- refcheck <project>`.

**Export**
: Output content in different formats (JSON, BibTeX). Run with `bun run cli -- export <project>`.

**Sync**
: Push content to external platforms like Semble (ATProto). Configured via `semble` block in project config.

## Interfaces

**CLI**
: Command-line interface for all extenote operations. Lives in `packages/cli/`.

**Web UI**
: Browser-based interface for browsing and editing content. Lives in `packages/web/`.

**TUI**
: Terminal user interface (text-based UI in the terminal). Lives in `packages/tui/`.

## File Locations

| What | Where |
|------|-------|
| Project configs | `extenote/projects/*.yaml` |
| Schemas | `extenote/schemas/*.yaml` |
| CLI code | `extenote/packages/cli/src/` |
| Core library | `extenote/packages/core/src/` |
| Public content | `extenote-pub/content/` |
| Private content | `extenote-priv/` |
| Website code | `extenote-pub/websites/` |
