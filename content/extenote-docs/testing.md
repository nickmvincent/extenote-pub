---
type: doc
title: Manual Testing Guide
visibility: public
order: 9
---
# Manual Testing Guide

Test all three interfaces (CLI, TUI, Web).

**Prerequisites:** Run `bun install && bun run build` and configure `.env` per the Quick Start guide.

## Automated Tests

Run from the `extenote/` repo root:

```bash
bun run --cwd packages/core test
bun run --cwd packages/cli test
bun run --cwd packages/refcheck test
bun run --cwd packages/tui test
bun run --cwd extensions/clipper test
```

Web UI integration tests (starts servers and captures screenshots):

```bash
bun run --cwd packages/web test:run
```

## Testing Workflow

### 1. CLI Testing

```bash
# View vault status
bun run cli -- status

# Check for issues
bun run cli -- issues

# Create a BibTeX entry (non-interactive)
bun run cli -- create bibtex_entry smith2024 \
  --title "Machine Learning in Practice" \
  --visibility public \
  --project personal-website

# Create a memo (interactive wizard)
bun run cli -- creator

# Export personal-website project
bun run cli -- export-project personal-website \
  --format json \
  --output dist/export/personal-website/json

# Show available commands
bun run cli -- guide --project personal-website
```

**Expected outputs:**
- `status` should show object counts, projects, issues
- `issues` lists validation errors by severity
- `create` creates `smith2024.md` in appropriate directory
- `export-project` creates JSON bundle in dist/

### 2. TUI Testing

```bash
bun run tui
```

**Test flow:**
1. **Dashboard (default)** - View stats
2. **Press `i` - Issues** - Press `1/2/3/4` to filter by severity
3. **Press `c` - Create** - Select schema, enter details
4. **Press `e` - Export** - Select project and format
5. **Navigation** - Press `h` or `ESC` to return, `q` to quit

### 3. Web Testing

```bash
bun run web
```

Opens http://localhost:3000

**Test flow:**
1. **Dashboard** - View vault stats
2. **Project Detail** - Click a project to view objects
3. **Object Detail** - View frontmatter and markdown
4. **Issues Page** - Filter by severity
5. **Create Page** - Create new objects
6. **Export Page** - Export projects

## Build & Deploy Testing

```bash
# List buildable projects
bun run cli -- build --list

# Dry-run build
bun run cli -- build data-leverage-blogs --dry-run

# Build a project
bun run cli -- build data-leverage-blogs --verbose

# Deploy
bun run cli -- deploy data-leverage-blogs
```

## Success Criteria

- All three interfaces launch without errors
- Vault data loads in <5 seconds
- Create operations produce valid markdown files
- Export generates expected output files
- Build commands execute preRender steps and build websites
- Deploy commands push to configured platforms
