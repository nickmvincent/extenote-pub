---
type: doc
title: Extenote Documentation
visibility: public
order: 0
---
# Extenote

**Extenote** = **Exte**rnalized **Note**s — notes that live outside any particular institution, laptop, or software.

## Why Externalized Notes?

Your content should outlive your current job, your current laptop, and your current software. Academics often find themselves going to their own personal website to find their papers — proof that externalized content is more durable than anything locked in institutional systems.

Notion workspaces disappear when you leave a company. Local files get lost in laptop transitions. Extenote gives you a structured, schema-validated vault of markdown files that you control, with multiple sync targets (git repos, static sites, ATProto) so your knowledge persists.

## What Extenote Does

**One vault, many outputs.** Write structured markdown once, publish everywhere:
- Personal websites (Astro, Quarto, or any SSG)
- Blogs and mini-books
- Annotated bibliographies with verified references
- Federated platforms (ATProto/Semble)

**Schema validation without lock-in.** Your content stays in plain markdown with YAML frontmatter — readable by any tool, easy to work with programmatically, perfect for AI-assisted workflows. Extenote validates against schemas, catches errors, and exports to multiple formats.

**SSG scaffolding, not another SSG.** Instead of building bespoke static site generators, Extenote wraps established tools (Astro, Quarto) with a consistent build/deploy workflow. When the next great SSG arrives, add it as a build target — your content stays the same.

**Verified bibliographies.** The refcheck system validates citations against DBLP, Semantic Scholar, OpenAlex, and Crossref. Catch hallucinated metadata, fix preprint-vs-published mismatches, and show verification status publicly.

## Who It's For

- **Academics** managing research bibliographies, CVs, and publications across institutions
- **Technical bloggers** who want structured content without bespoke tooling
- **Knowledge workers** who like Obsidian-style vaults but want more structure and portability
- **Anyone** who wants their notes to outlive their current setup

## Getting Started
- [QUICKSTART.md](/extenote/docs/quickstart) - Setup, workflow, and command reference
- [CLI.md](/extenote/docs/cli) - Complete CLI reference
  - `extenote init` - Project setup wizard
  - `extenote doctor` - Diagnose configuration issues
  - `extenote undo` - Undo destructive operations
  - Tag management, refcheck, export commands

## Reference
- [CONFIGURATION.md](/extenote/docs/configuration) - Project and schema configuration
- [ARCHITECTURE.md](/extenote/docs/architecture) - System architecture, key concepts (vault vs project vs object)
- [INTERFACES.md](/extenote/docs/interfaces) - CLI vs TUI vs Web comparison
- [WEB-UI.md](/extenote/docs/web-ui) - Web interface screenshots and guide
- [FAQ.md](/extenote/docs/faq) - Frequently asked questions
- [KNOWN_ISSUES.md](/extenote/docs/known-issues) - Limitations and workarounds

## Testing
- [TESTING.md](/extenote/docs/testing) - Manual testing guide

## Features
- [CROSS-PROJECT-LINKING.md](/extenote/docs/cross-project-linking) - Link content across projects
  - `citation_key` - Link papers to bibtex entries in shared-references
  - `archive_ref` - Link blog stubs to full content in archives
  - Single source of truth pattern
- [COMPUTED-DATA.md](/extenote/docs/computed-data) - Dynamically derived data
  - `cited_in` - Which projects cite each reference
  - Cross-references, tag index, vault summary
  - Computed vs persisted tradeoffs
- [DISCUSSIONS.md](/extenote/docs/discussions) - Discussion & Network systems
  - **Discussion**: Create discussion threads on GitHub and WhiteWind (ATProto)
  - **Network**: Generate visible discussions pages for Quarto and Astro static sites
  - *Roadmap: Leaflet, Google Docs*
- [TAGS.md](/extenote/docs/tags) - Tag management and organization
  - Simple and hierarchical tags
  - Web UI for rename, merge, delete operations
  - CLI tag commands
  - Semble collection integration
- [REFERENCE-CHECK.md](/extenote/docs/reference-check) - Refcheck (bibliographic reference verification)
  - Refcheck references against DBLP, Crossref, Semantic Scholar, and OpenAlex
  - Field-by-field comparison with edit distance
  - Detailed check_log in frontmatter
- [CLIPPER.md](/extenote/docs/clipper) - Browser clipper extension
  - Capture references from any website
  - Validate existing vault entries against live API data
  - Multi-source search with auto-selection
- **Semble Sync** (see [CONFIGURATION.md#semble-sync-configuration](/extenote/docs/configuration#semble-sync-configuration))
  - Bidirectional sync with [Semble](https://semble.app) (ATProto-based research network, very WIP)
  - Push local references as URL/NOTE cards, pull cards as markdown objects
  - Change detection, conflict resolution, collection management
