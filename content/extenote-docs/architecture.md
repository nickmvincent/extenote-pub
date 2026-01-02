---
type: doc
title: Architecture Overview
visibility: public
order: 4
---
# Architecture Overview

Extenote is a content management system for structured Markdown documents with YAML frontmatter. The name comes from **Exte**rnalized **Note**s — content that lives outside any particular institution, laptop, or software.

## Key Concepts

Understanding these three terms will help you navigate Extenote:

| Term | What it is | Example |
|------|------------|---------|
| **Object** | A single markdown file with YAML frontmatter | `shared-references/smith2024.md` |
| **Vault** | A directory containing objects | `extenote-pub/content/shared-references/` |
| **Project** | A configuration defining sources, schemas, and outputs | `projects/shared-references.yaml` |

**How they relate:**
- A **project** reads from one or more **vaults** (via `sources` config)
- Each **vault** contains **objects** (markdown files)
- Multiple **projects** can share the same **vault** (e.g., several blogs include `shared-references`)
- Each **object** belongs to exactly one **project** (determined by which project's source loaded it)

```
projects/my-blog.yaml          # Project config
  └── sources:
        └── content/my-blog/   # Vault (directory)
              ├── post1.md     # Object
              ├── post2.md     # Object
              └── ...
  └── includes: [shared-references]  # Include another project's objects
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interfaces                          │
├─────────────────┬─────────────────────┬─────────────────────────┤
│      CLI        │        TUI          │          Web            │
│   (Commander)   │    (Ink/React)      │   (React + Bun API)     │
└────────┬────────┴──────────┬──────────┴────────────┬────────────┘
         │                   │                       │
         └───────────────────┼───────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  @extenote/core │
                    │                 │
                    │  - Config       │
                    │  - Schemas      │
                    │  - Validation   │
                    │  - Lint         │
                    │  - Export       │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
        │ projects/ │  │  Content  │  │   dist/   │
        │ schemas/  │  │   Vaults  │  │  export   │
        │  (YAML)   │  │    (MD)   │  │  (output) │
        └───────────┘  └───────────┘  └───────────┘
```

## Data Model

### VaultObject

A vault object is a Markdown file with YAML frontmatter. See `packages/core/src/types.ts` for the full interface.

Key fields:
- `id` - Identity field value or filename
- `type` - Schema name (from frontmatter.type)
- `title` - Display title
- `sourceId` - Source configuration ID
- `project` - Owning project name
- `filePath` - Absolute file path
- `relativePath` - Path relative to source root
- `frontmatter` - All YAML frontmatter fields
- `body` - Markdown content after frontmatter
- `mtime` - File modification timestamp (ms)
- `schema` - Resolved schema definition
- `visibility` - `public` | `private` | `unlisted`

**File format:**
```markdown
---
type: blog_post
title: My Article
visibility: public
date: 2024-12-17
tags:
  - tech
---

# My Article

Content goes here...
```

### Schema Definition

Schemas define structure and validation rules. See `packages/core/src/types.ts` for the full interfaces (`SchemaDefinition`, `SchemaFieldDefinition`).

Key fields:
- `name` - Unique identifier
- `description` - Human-readable description
- `subdirectory` - Default subdirectory for new objects
- `identityField` - Field used as ID (default: "slug")
- `required` - Required frontmatter fields
- `fields` - Field definitions with types (`string`, `number`, `date`, `array`, `boolean`)

### Visibility

Objects have three visibility levels:

| Level | Description |
|-------|-------------|
| `public` | Visible to all, included in public exports |
| `private` | Hidden from public exports |
| `unlisted` | Not listed but accessible if URL known |

### Issues

Validation and lint issues. See `VaultIssue` in `packages/core/src/types.ts`.

Key fields: `sourceId`, `filePath`, `field`, `message`, `severity` (`error` | `warn` | `info`), `rule`.

## Directory Structure

```
extenote/
├── packages/
│   ├── core/                   # Business logic
│   │   └── src/
│   │       ├── index.ts        # Public API
│   │       ├── types.ts        # Type definitions
│   │       ├── constants.ts    # Shared configuration defaults
│   │       ├── config.ts       # Config loading
│   │       ├── schemas.ts      # Schema loading
│   │       ├── validation.ts   # Object validation
│   │       ├── lint.ts         # Lint rules
│   │       ├── exporters/      # Export formats
│   │       └── plugins/        # Discussion, network, semble plugins
│   │
│   ├── cli/                    # Command-line interface
│   │   └── src/
│   │       ├── index.ts        # Entry point (registers commands)
│   │       └── commands/       # One file per command
│   │           ├── utils.ts    # Shared CLI utilities
│   │           ├── build.ts
│   │           ├── deploy.ts
│   │           ├── validate.ts
│   │           └── ...
│   │
│   ├── web/                    # Web interface (React + Bun)
│   │   └── src/
│   │       ├── server.ts       # API server entry point
│   │       └── server/         # Server modules
│   │           ├── utils.ts    # Shared utilities
│   │           ├── cache.ts    # Vault caching logic
│   │           └── handlers/   # API route handlers
│   │
│   ├── tui/                    # Terminal UI (Ink/React)
│   └── refcheck/               # Reference validation library
│
├── projects/                   # Project configurations
│   ├── personal-website.yaml
│   └── ...
│
└── schemas/                    # Schema definitions
    ├── common.yaml
    ├── personal-website.yaml
    └── ...
```

## Core API

Key functions exported from `@extenote/core` (see `packages/core/src/index.ts`):

- `loadConfig()` - Load configuration from `projects/` directory
- `loadSchemas()` - Load schema definitions from `schemas/` directory
- `loadVault()` - Load complete vault state (objects + issues)
- `exportContent()` - Export content to various formats
- `lintObjects()` - Lint objects against rules

## Export Formats

| Format | Output | Description |
|--------|--------|-------------|
| `json` | `objects.json` | All objects as JSON array |
| `markdown` | Mirror of source | Reconstructed markdown files |
| `html` | `index.html` | Single-page HTML summary |
| `atproto` | `records.json` | ATProto-compatible records |
| `bibtex` | `references.bib` | BibTeX bibliography |

## Build & Deploy

Projects can define build and deploy configuration in their YAML files:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Content       │      │    Website      │      │    Hosting      │
│   Vaults        │─────▶│    Build        │─────▶│    Platform     │
│   (Markdown)    │      │    (Astro/      │      │  (Cloudflare/   │
│                 │      │     Quarto)     │      │   GitHub Pages) │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
   PreRender Steps:         Build Types:
   - rsync content          - astro (npm run build)
   - export bibtex          - quarto (quarto render)
   - copy files             - custom (preRender only)
   - shell commands
```

### Build Types

| Type | Command | Use Case |
|------|---------|----------|
| `astro` | `npm install && npm run build` | Astro static sites |
| `quarto` | `quarto render` | Quarto documents/books |
| `custom` | (none) | Only preRender steps |

### Deploy Platforms

| Platform | Tool | Config File |
|----------|------|-------------|
| `cloudflare-pages` | wrangler | `wrangler.toml` |
| `github-pages` | gh-pages | (package.json) |
| `ftp` | lftp | (inline config) |
| `vercel` | vercel cli | `vercel.json` |
| `netlify` | netlify cli | `netlify.toml` |

**Note:** Vercel and Netlify deployment require their respective CLI tools to be installed and authenticated. These platforms are implemented but less tested than Cloudflare Pages and GitHub Pages.
