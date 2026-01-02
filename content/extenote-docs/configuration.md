---
type: doc
title: Configuration Reference
visibility: public
order: 3
---
# Configuration Reference

Extenote uses two directories for configuration:
- `projects/` - Project configuration files (one YAML per project)
- `schemas/` - Schema definition files (content type definitions)

**Quick Navigation:**
- [Project Configuration](#project-configuration) - Sources, visibility, lint settings
- [Schema Configuration](#schema-configuration) - Content type definitions
- [Export Configuration](#export-configuration) - JSON/BibTeX/Markdown export
- [Build Configuration](#build-configuration) - Astro/Quarto website builds
- [Deploy Configuration](#deploy-configuration) - Cloudflare, GitHub Pages, etc.
- [Configuration Defaults](#configuration-defaults) - Default values and fallbacks
- [Semble Sync Configuration](#semble-sync-configuration) - ATProto integration

---

## Project Configuration

Each project has a YAML file in `projects/` defining its sources, visibility rules, lint settings, build, and deploy configuration.

**Example files:**
- `projects/personal-website.yaml` - Simple project with local sources
- `projects/data-leverage-blogs.yaml` - Full example with build, deploy, includes, and discussion config

### Key Fields

| Field | Description |
|-------|-------------|
| `project` | Project identifier |
| `defaultVisibility` | Default for new content: `public` \| `private` \| `unlisted` |
| `visibilityField` | Frontmatter field name for visibility (default: `visibility`) |
| `includes` | List of other project names to include objects from |
| `sources` | Content source definitions (see below) |
| `lint` | Linting rules and autofix settings |
| `compatibility` | Platform-specific requirements (astro, quarto) |
| `build` | Website build configuration |
| `deploy` | Deployment platform configuration |
| `discussion` | Discussion plugin configuration |
| `semble` | Semble ATProto sync configuration |
| `recipes` | Named export configurations (see Export Configuration) |

### Environment Variables

Source paths support environment variable substitution with fallback syntax: `${VAR:-fallback}`

| Variable | Purpose | Default |
|----------|---------|---------|
| `EXTENOTE_CONTENT_ROOT` | Primary content vault | `../extenote-pub/content` |
| `EXTENOTE_PRIVATE_ROOT` | Private content vault | `../extenote-priv/content` |

### Source Types

Currently only `local` sources are supported. See `packages/core/src/types.ts` for the `LocalSourceConfig` interface.

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier |
| `type` | Yes | Source type (`local`) |
| `root` | Yes | Directory path (supports env vars) |
| `include` | No | Glob patterns to include (e.g., `["**/*.md"]`) |
| `exclude` | No | Glob patterns to exclude |
| `visibility` | No | Default visibility for this source |
| `disabled` | No | Skip this source if `true` |

**Path handling**: When creating new files, the CLI automatically detects if the source `root` already includes the project name (e.g., `content/shared-references`) and avoids adding a duplicate project prefix. If the schema's `subdirectory` is `.`, files go directly in the source root.

### Lint Rules

| Rule | Description | Values |
|------|-------------|--------|
| `required-visibility` | Check for visibility field | `off`, `warn`, `error` |
| `compatibility:{target}` | Check platform requirements | `off`, `warn`, `error` |

### Compatibility Targets

| Target | Description |
|--------|-------------|
| `astro` | Astro static site generator |
| `quarto` | Quarto publishing system |

## Schema Configuration

Schema files in `schemas/` define content types and their frontmatter fields.

**Example files:**
- `schemas/common.yaml` - Minimal schema (just `readme`)
- `schemas/personal-website.yaml` - Comprehensive example with many schema types
- `schemas/shared-references.yaml` - Bibliography schemas

### Schema Fields

| Field | Description |
|-------|-------------|
| `name` | Unique schema identifier |
| `description` | Human-readable description |
| `subdirectory` | Default storage subdirectory for new objects (use `.` for root) |
| `identityField` | Field used as object ID (default: `slug`) |
| `required` | List of required frontmatter fields |
| `fields` | Field definitions (see below) |

### Field Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `"Hello"` |
| `number` | Numeric value | `42` |
| `boolean` | True/false | `true` |
| `date` | ISO 8601 date | `2024-12-17` |
| `array` | List with item type | `["a", "b"]` |

For arrays, specify the item type with `items: string | number | date | boolean`.

### Schema Validation and Issue Tracking

Schema validation is performed automatically when the vault loads. Any validation issues are tracked and surfaced through:

- **Web UI**: Issues page shows all validation errors with filters by severity
- **CLI**: `extenote issues` lists all issues, with `--limit N` to show top N
- **TUI**: Press `i` to view the Issues page

Common validation issues include:
- Missing required fields (e.g., `title` on a blog_post)
- Unknown object types (no matching schema)
- Invalid field values (wrong type, malformed dates)
- Empty or whitespace-only required fields

Each issue shows the file path, field name, and specific error message. Fix issues by editing the frontmatter directly or using the web UI's object editor.

### Project Ownership and Includes

Each object belongs to exactly one project, determined by its source. Projects can include objects from other projects using the `includes` field.

**How objects get assigned to projects:**

1. Each source in a project config has an `id`
2. When vault loads, objects from that source are assigned to the project
3. The project name is inferred from the config file (e.g., `projects/my-blog.yaml` → project `my-blog`)

**Example relationship:**

```
projects/personal-website.yaml
├── sources:
│   └── id: "personal-website"         # Objects from here belong to "personal-website"
└── includes: ["shared-references"]    # Can also see objects from "shared-references"

projects/shared-references.yaml
└── sources:
    └── id: "shared-references"        # Objects from here belong to "shared-references"
```

When project A includes project B:
- Objects from B's sources still belong to project B
- They appear in project A's views alongside A's own objects
- Export/build for project A will include B's objects
- Clear ownership: each object has exactly one owning project

**Common pattern:** A "shared-references" project contains bibliography entries that multiple blog/website projects include. Each project builds with its own content plus the shared references.

See `projects/data-leverage-blogs.yaml` for a real example that includes `shared-references` and `discussions`.

## Export Configuration

Export generates static files from your vault objects. This is useful for:
- Feeding data into static site generators (Astro, Quarto)
- Creating bibliography files for citation managers
- Publishing to federated platforms (ATProto)
- Archiving content in portable formats

### Export vs Build vs Sync

These three operations serve different purposes:

| Operation | What it does | Output |
|-----------|--------------|--------|
| **Export** | Transforms vault objects into static files | `dist/export/` files (JSON, markdown, HTML, etc.) |
| **Build** | Compiles a website from source files | `dist/` website ready for hosting |
| **Sync** | Pushes/pulls objects to/from ATProto (Semble) | Remote records on ATProto PDS |

**Typical workflow:**
1. **Export** content to JSON/markdown files
2. **Build** website that consumes those exported files
3. **Deploy** the built website to hosting

Export and sync are independent—you can use either, both, or neither.

### Supported Formats

| Format | Output File | Description |
|--------|-------------|-------------|
| `json` | `objects.json` | All objects as structured JSON with frontmatter and body |
| `markdown` | Mirrored file tree | Preserves original directory structure and filenames |
| `html` | `index.html` | Single HTML page listing all objects |
| `bibtex` | `references.bib` | Bibliography file (only exports `bibtex_entry` type objects) |
| `atproto` | `records.json` | ATProto-compatible records for federation |

### CLI Usage

```bash
# Basic export
bun run cli -- export-project <project> --format <format>

# With output directory
bun run cli -- export-project <project> --format json --output dist/data

# Filter by object type
bun run cli -- export-project <project> --format json --type blog_post

# Filter by source
bun run cli -- export-project <project> --format markdown --source local-notes

# BibTeX: only export cited references
bun run cli -- export-project <project> --format bibtex --detect-citations
```

### Export Recipes (YAML)

Define named export configurations in your project file:

```yaml
recipes:
  - name: public-json
    description: JSON bundle for website consumption
    sourceIds:
      - local-notes
    steps:
      - format: json
        outputDir: dist/export/recipes/public/json

  - name: bibliography
    steps:
      - format: bibtex
        outputDir: dist/export/refs
```

| Field | Description |
|-------|-------------|
| `name` | Recipe identifier |
| `description` | Human-readable description |
| `sourceIds` | Limit to specific sources (optional) |
| `steps` | List of export steps |
| `steps[].format` | Export format |
| `steps[].outputDir` | Output directory |

### Export in Build Pipeline

Use `preRender` CLI steps to run exports before building:

```yaml
build:
  websiteDir: my-blog
  type: astro
  preRender:
    - type: cli
      command: export-project my-project --format json
      outputDir: src/data
```

This runs the export, placing `objects.json` in `src/data/` before Astro builds. Your site can then import this data.

### Default Output Directory

Without `--output`, exports go to: `dist/export/{project}/{format}/`

## Build Configuration

Each project can define how its website is built. See `packages/core/src/types.ts` for `BuildConfig` interface.

**Example:** `projects/data-leverage-blogs.yaml` shows a Quarto build with rsync and CLI preRender steps.

| Field | Description |
|-------|-------------|
| `websiteDir` | Directory in `websites/` folder |
| `type` | Build type: `astro` \| `quarto` \| `custom` |
| `preRender` | Optional steps before main build |

### Build Types

| Type | Build Command |
|------|---------------|
| `astro` | `npm install` (if needed) + `npm run build` |
| `quarto` | `quarto render` |
| `custom` | Only runs preRender steps |

### PreRender Step Types

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `rsync` | Sync files from source to destination | `src`, `dst`, `include` (optional) |
| `cli` | Run extenote CLI command | `command`, `outputDir` (optional) |
| `copy` | Copy a single file | `src`, `dst` |
| `shell` | Run arbitrary shell command | `command` |
| `network` | Generate discussions page & related projects | `outputFormat` (optional) |

### Network Step

The `network` step generates a discussions/network page for your static site, connecting it to discussions and related projects in the extenote ecosystem.

| Field | Default | Description |
|-------|---------|-------------|
| `outputFormat` | `quarto` | Output format: `quarto`, `astro`, or `both` |
| `addToNavbar` | `true` | For Quarto: add discussions page to navbar |
| `includeProjectLinks` | `true` | For Quarto: include the "Project Links" section |
| `relatedProjects` | `[]` | Additional project names to include |
| `excludeProjects` | `[]` | Projects to exclude from auto-discovery |

**Auto-discovery:** Related projects are automatically discovered from your `includes` list.

**Example:**
```yaml
build:
  websiteDir: my-blog-quarto
  type: quarto
  preRender:
    - type: rsync
      src: ${EXTENOTE_CONTENT_ROOT}/my-blog
      dst: posts
    - type: network
      outputFormat: quarto
      addToNavbar: true
      relatedProjects: [another-project]
```

**Generated output:**
- **Quarto**: Creates `discussions.qmd` with discussion links, related projects, and optional project links. Optionally updates `_quarto.yml` navbar.
- **Astro**: Creates `src/data/network.json` for consumption by footer components.

## Deploy Configuration

Each project can define how it's deployed. See `packages/core/src/types.ts` for `DeployConfig` interface.

**Example:** `projects/data-leverage-blogs.yaml` shows Cloudflare Pages deployment.

| Field | Description |
|-------|-------------|
| `platform` | Deploy platform (see table below) |
| `configFile` | Platform config file (e.g., `wrangler.toml`) |
| `outputDir` | Build output directory |
| `repo` | GitHub Pages: target repository URL |
| `branch` | GitHub Pages: target branch (default: `gh-pages`) |

### Deploy Platforms

| Platform | Config File | Notes |
|----------|-------------|-------|
| `cloudflare-pages` | `wrangler.toml` | Uses `wrangler pages deploy` |
| `github-pages` | - | Uses `gh-pages` package, requires `repo` |
| `none` | - | No deployment configured |

### GitHub Pages Configuration

For GitHub Pages, specify the target repository with `repo` and optionally `branch` (defaults to `gh-pages`).

Note: The website directory needs a `package.json` file (even a minimal one) for `gh-pages` to work.

## Configuration Defaults

| Setting | Default |
|---------|---------|
| `defaultVisibility` | `"private"` |
| `visibilityField` | `"visibility"` |
| `identityField` | `"slug"` |
| `includes` | `[]` (no included projects) |
| `lint.rules.required-visibility` | `"warn"` |
| `lint.autofix` | `false` |
| Export output | `dist/export/{project}/{format}` |
| `build.type` | (required if build configured) |
| `deploy.platform` | `"none"` |
| `deploy.branch` | `"gh-pages"` |

## Semble Sync Configuration

Sync references bidirectionally with [Semble](https://semble.app), an ATProto-based social knowledge network for researchers. Semble is built on the AT Protocol (the same protocol behind Bluesky). **ATProto sync is still very WIP** and may change.

| Field | Required | Description |
|-------|----------|-------------|
| `enabled` | Yes | Enable sync for this project |
| `identifier` | Yes | ATProto handle or DID (e.g., `user.bsky.social`) |
| `password` | No | App password (or use `SEMBLE_APP_PASSWORD` env var) |
| `pds` | No | Personal Data Server URL (default: `https://bsky.social`) |
| `collection` | No | Semble collection name (default: project name, `null` to disable) |
| `types` | No | Object types to sync (default: `["bibtex_entry"]`) |
| `publicOnly` | No | Only sync objects with `visibility: public` |

**Example:**

```yaml
semble:
  enabled: true
  identifier: yourhandle.bsky.social
  collection: my-research-refs  # or null to disable collections
  types: ["bibtex_entry", "data_license_initiative"]
  publicOnly: false
```

### Collections

By default, synced cards are added to a Semble collection named after your project. This groups your references together in the Semble UI.

- **Default behavior**: Cards are added to a collection named `<project-name>`
- **Custom collection**: Set `collection: my-custom-name`
- **Disable collections**: Set `collection: null`

Collections are created automatically if they don't exist. The collection URI is cached in `.semble-sync.json` for efficiency.

### CLI Commands

```bash
# List projects with Semble config
bun run cli -- sync --list

# List your Semble collections
bun run cli -- sync --list-collections

# Validate configuration
bun run cli -- sync --validate

# Dry run (see what would sync)
bun run cli -- sync <project> --dry-run

# Sync a project (bidirectional)
bun run cli -- sync <project>

# Push only (local → Semble)
bun run cli -- sync <project> --push-only

# Pull only (Semble → local)
bun run cli -- sync <project> --pull-only

# Force re-sync all objects
bun run cli -- sync <project> --force
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SEMBLE_APP_PASSWORD` | App password for ATProto authentication |
| `ATPROTO_APP_PASSWORD` | Alternative env var name (fallback) |
