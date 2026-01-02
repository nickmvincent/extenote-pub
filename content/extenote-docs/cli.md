---
type: doc
title: CLI Reference
visibility: public
order: 3
---
# CLI Reference

Complete reference for the extenote command-line interface.

## Running Commands

When running from the cloned repository (development mode), use:

```bash
bun run cli -- <command>
```

The examples in this reference use `extenote <command>` for brevity. Translate as follows:

| Documentation | Development Mode |
|---------------|------------------|
| `extenote status` | `bun run cli -- status` |
| `extenote build my-site` | `bun run cli -- build my-site` |

**Tip:** You can create a shell alias for convenience:
```bash
alias extenote="bun run cli --"
```

## Quick Start Commands

### Initialize a New Project

```bash
# Interactive wizard (recommended for first-time setup)
extenote init

# Quick setup with defaults
extenote init my-project --quick

# Specify schema type
extenote init my-refs --type references --quick
```

Schema types:
- `notes` - Simple notes and documents (default)
- `references` - BibTeX-style citations
- `blog` - Blog posts with dates and slugs
- `custom` - Basic document structure

### Diagnose Issues

```bash
# Run diagnostic checks
extenote doctor

# Show detailed output
extenote doctor --verbose
```

The doctor command checks:
- **Structure**: projects/ and schemas/ directories exist
- **Config**: YAML files are valid and have required fields
- **Environment**: Optional environment variables (SEMBLE_APP_PASSWORD, GITHUB_TOKEN)
- **Content**: Source directories exist and contain markdown files
- **Dependencies**: package.json exists

Exit code is 1 if any checks fail.

## Vault Operations

### Status

```bash
# Show vault summary
extenote status
```

### View Object

```bash
# View object details
extenote view path/to/file.md

# Output as JSON
extenote view path/to/file.md --json
```

### List Objects

```bash
# List objects in a project
extenote list personal-website

# Filter by type or visibility
extenote list personal-website --type blog_post --visibility public

# Output as JSON
extenote list personal-website --json
```

### Search

```bash
# Search by title/body/path
extenote search "data leverage"

# Filter results
extenote search "arxiv" --project shared-references --type bibtex_entry
```

### Edit

```bash
# Open an object in $EDITOR
extenote edit path/to/file.md

# Wait for the editor to close before returning
extenote edit path/to/file.md --wait
```

### Lint

```bash
# Check for issues
extenote lint

# Auto-fix issues (creates backup first)
extenote lint --fix
```

## Tag Management

```bash
extenote tags list              # List all tags with counts
extenote tags list --tree       # Show hierarchical tree
extenote tags rename old new    # Rename a tag (creates backup)
extenote tags merge src target  # Merge tags (creates backup)
extenote tags delete tag --yes  # Delete a tag (creates backup)
```

All tag mutations support `--dry-run` for preview. See [TAGS.md](/extenote/docs/tags) for full documentation.

## Undo Operations

Destructive operations (tag mutations, lint --fix) automatically create backups.

```bash
# Undo the last operation
extenote undo

# List available backups
extenote undo list
```

Backups are stored in `.extenote-backup/` and the last 10 are kept.
Backup/undo is still lightly tested, so keep version control and verify restores before relying on it.

## Refcheck

```bash
# Refcheck references against DBLP/OpenAlex
extenote refcheck

# Limit to specific project
extenote refcheck shared-references

# Use specific provider
extenote refcheck --provider dblp
extenote refcheck --provider openalex

# Preview without modifying files
extenote refcheck --dry-run

# Re-check already checked entries
extenote refcheck --force

# Limit number of entries
extenote refcheck --limit 10

# Resume from a specific entry (if interrupted)
extenote refcheck --start-from smith2024

# Skip first N entries (alternative resume)
extenote refcheck --skip 50
```

Mismatches are classified by severity:
- `mismatch:minor` - Likely false positive (venue abbreviations, author initials)
- `mismatch:major` - Needs review (wrong authors, DOI mismatch)

## Discussion Management

Manage discussion threads for your content (e.g., on ATProto or other configured providers).

```bash
# Create project-level discussion (default)
extenote discussions create my-project

# Create per-object discussions
extenote discussions create --per-object "posts/*.md"

# List existing discussion links
extenote discussions list

# Validate provider configuration
extenote discussions validate
```

### Create Options

```bash
# Dry run to preview changes
extenote discussions create --dry-run

# Limit to specific provider
extenote discussions create --provider atproto

# Update frontmatter with links (per-object only)
extenote discussions create --per-object --update-frontmatter
```

## Export

```bash
# Export to JSON
extenote export-project my-project --format json

# Export to BibTeX
extenote export-project shared-references --format bibtex

# Export to HTML
extenote export-project my-project --format html

# Specify output directory
extenote export-project my-project --format json --output ./dist
```

Formats: `json`, `markdown`, `html`, `bibtex`, `atproto`

## Create Objects

```bash
# Create from schema (interactive wizard)
extenote creator

# Create directly
extenote create note my-note --title "My Note"
extenote create bibtex_entry smith2024 --title "Example Paper"

# Specify visibility
extenote create note private-note --visibility private
```

## Guide

```bash
# Suggested create/export commands by project
extenote guide

# Only show one project
extenote guide --project personal-website
```

## Semble Sync

Sync bibliography entries with [Semble](https://semble.app) (ATProto-based research network). **ATProto sync is still very WIP** and may change.

```bash
# List projects with Semble config
extenote sync --list

# Preview what would sync (no changes)
extenote sync my-project --dry-run

# Sync bidirectionally
extenote sync my-project

# Push local changes only
extenote sync my-project --push-only

# Pull remote changes only
extenote sync my-project --pull-only

# Force re-sync all objects
extenote sync my-project --force
```

Requires `SEMBLE_APP_PASSWORD` environment variable. See [configuration](/extenote/docs/configuration#semble-sync-configuration) for setup.

## Build & Deploy

```bash
# Build a project website
extenote build my-website

# Deploy to configured target
extenote deploy my-website
```

## Websites

```bash
# List deployed websites
extenote websites

# Output only URLs
extenote websites --urls-only

# Output as JSON
extenote websites --json
```

## Error Messages

The CLI provides helpful suggestions when errors occur:

```
Error: Could not find config at /path/to/projects

Try this:
  Run 'extenote init' to create a new project, or ensure you're in the correct directory.
```

Common suggestions include:
- Config not found → Run `extenote init`
- Object not found → Use `extenote status` to list objects
- Schema not found → Check schemas/*.yaml files
- YAML errors → Check indentation and syntax
- Auth errors → Set environment variables

## Common Workflows

**Quick status check:**
```bash
extenote status && extenote lint
```

**Create and validate a new reference:**
```bash
extenote create bibtex_entry smith2024 --title "Paper Title"
extenote refcheck --limit 1
```

**Build and deploy a website:**
```bash
extenote build my-site && extenote deploy my-site
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXTENOTE_CONTENT_ROOT` | Root directory for content | `../extenote-pub/content` |
| `SEMBLE_APP_PASSWORD` | ATProto app password for Semble sync | - |
| `GITHUB_TOKEN` | GitHub personal access token | - |
| `DEBUG` | Show stack traces on errors | - |

## Global Options

```bash
# Specify working directory
extenote --cwd /path/to/project status

# Get help
extenote --help
extenote <command> --help
```

## Debugging

If commands fail unexpectedly:

```bash
# Show full stack traces
DEBUG=1 extenote <command>

# Run diagnostic checks
extenote doctor --verbose
```
