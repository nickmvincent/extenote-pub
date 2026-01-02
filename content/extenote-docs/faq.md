---
type: doc
title: FAQ
visibility: public
order: 11
---
# Frequently Asked Questions

## General

### What does "Extenote" mean?

**Exte**rnalized **Note**s — notes that live outside any particular institution, laptop, or software. The core idea is that your content should be more durable than your current job, device, or tooling.

### Who is Extenote for?

Extenote is designed for people who:
- Want structured, schema-validated content without vendor lock-in
- Publish to multiple outputs (personal site, blog, bibliography, federated platforms)
- Value plain markdown files over proprietary formats
- Like working with AI/LLMs and want content that's easy to process programmatically

Common users include academics, technical bloggers, and knowledge workers who want more structure than a folder of markdown files but less lock-in than Notion or Roam.

### Is Extenote a note-taking app?

No. Extenote is a **content management layer** — it validates, organizes, and exports your markdown files. You write and edit markdown in whatever editor you prefer (VS Code, Obsidian, vim, etc.). Extenote provides the structure, validation, and publishing pipeline.

---

## Comparison with Other Tools

### How does Extenote relate to Obsidian?

They're complementary. Obsidian is an excellent markdown editor with a plugin ecosystem. Extenote is a validation and publishing layer. You can:
- Edit your vault in Obsidian
- Use Extenote to validate schemas, check references, and build/deploy websites

Extenote doesn't replace Obsidian's editing experience — it adds structure and export capabilities on top of any markdown vault.

### How does Extenote relate to Zotero?

Extenote's bibliography features (refcheck, clipper, bibtex export) overlap with reference managers like Zotero. The key differences:
- Extenote stores references as markdown files you control (not a database)
- Refcheck verifies metadata against multiple sources (DBLP, OpenAlex, Crossref, Semantic Scholar)
- References integrate with the rest of your content vault

You could use both: Zotero for PDF management and quick capture, Extenote for the canonical bibliography that powers your websites.

### Why not just use Astro/Quarto directly?

You can! Extenote doesn't replace static site generators — it **wraps** them. The value is:
- **Consistent workflow**: Same `build` and `deploy` commands across all your sites
- **Shared content**: Multiple sites can include the same `shared-references` vault
- **Future-proofing**: When a new SSG gets popular, add it as a build target without restructuring your content
- **Validation**: Catch schema errors before they break builds

If you have one simple blog, plain Astro might be easier. If you have multiple sites sharing content, Extenote provides the orchestration layer.

### How is this different from a headless CMS?

Headless CMSs (Contentful, Sanity, Strapi) store content in databases and expose APIs. Extenote keeps everything in markdown files on your filesystem. This means:
- No hosting costs or API limits
- Full git history for all content
- Works offline
- No vendor dependency

The tradeoff is you need to be comfortable with files and command-line tools.

---

## Concepts

### What's the difference between a "vault" and a "project"?

A **vault** is a directory of markdown files — the actual content.

A **project** is a configuration (YAML file) that defines:
- Which vaults/directories to read from (`sources`)
- What schemas apply to the content
- Where to publish (build/deploy settings)
- Other projects to include (e.g., `shared-references`)

Multiple projects can share the same vault. For example, several blog projects might all include `shared-references` for citations.

### Why are markdown files called "objects"?

Because they can be anything — blog posts, bibliography entries, CV items, todo tasks, book chapters. "Objects" is intentionally generic. If you prefer to think of them as "notes" or "entries," that's fine too.

### What's a schema?

A schema defines the structure of an object type. For example, a `blog_post` schema might require:
- `title` (string)
- `date` (date)
- `visibility` (public/private/unlisted)
- `tags` (array of strings)

Schemas live in `schemas/*.yaml`. When you create or edit content, Extenote validates frontmatter against the schema and reports issues.

---

## Features

### What is refcheck?

Refcheck verifies your bibliographic entries against external databases (DBLP, Semantic Scholar, OpenAlex, Crossref). It:
- Searches for your paper by DOI or title
- Compares local metadata against the remote source
- Reports mismatches (wrong year, misspelled author, etc.)
- Stores results in `check_log` frontmatter for transparency

This catches errors like hallucinated citations, outdated preprint metadata, and typos.

### What's the browser clipper?

A browser extension that captures references from any webpage. When you're reading a paper, click the clipper to:
- Search DBLP/Semantic Scholar for the paper
- Preview and edit the metadata
- Save directly to your vault as a `bibtex_entry`

It's the fastest way to build a bibliography while browsing.

### What is Semble/ATProto sync?

[Semble](https://semble.app) is an ATProto-based research network. Extenote can sync your references bidirectionally with Semble, making your bibliography visible on the federated social web.

ATProto (the protocol behind Bluesky) is one of several sync targets — alongside git repos and static sites. The goal is to have your content exist in multiple places, not locked to any single platform.

---

## Technical

### Why Bun instead of Node?

Performance and developer experience. Bun is faster for the TypeScript toolchain and has built-in test runner and bundler. The codebase uses standard Node APIs, so porting to Node would be straightforward if needed.

### Can I use Extenote with an existing markdown vault?

Yes. Point `EXTENOTE_CONTENT_ROOT` at your content directory. You'll need to:
1. Add frontmatter with `type` fields to your markdown files
2. Create schemas that match your content structure
3. Create a project config

Start with `bun run cli -- status` to see what Extenote finds.

### How do I add a new static site generator?

Add a new `build.type` in your project config. Currently supported:
- `astro` — runs `npm install && npm run build`
- `quarto` — runs `quarto render`
- `custom` — only runs preRender steps (you handle the build)

For a new SSG, you'd add a case to the build logic in `packages/core/src/build.ts`.

---

## Roadmap

### Will there be an Obsidian plugin?

Maybe. It's on the roadmap but not a high priority. The current workflow (edit in any editor, run CLI for validation/build) works well.

### Will there be a VS Code extension?

Same answer — possible but not prioritized. Schema autocomplete and real-time validation would be nice, but the CLI catches most issues.

### Is the TUI going to be feature-complete?

The TUI is for people who like terminal interfaces. It will stay useful but probably won't have 100% feature parity with the Web UI. The CLI is the most complete interface.
