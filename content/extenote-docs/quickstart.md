---
type: doc
title: Quick Start
visibility: public
order: 1
---
# Quick Start

## Setup

```bash
# Clone and install
git clone git@github.com:you/extenote.git
git clone git@github.com:you/extenote-pub.git
cd extenote
bun install && bun run build

# Configure environment
cat > .env << EOF
EXTENOTE_CONTENT_ROOT=../extenote-pub/content
EOF
```

## Basic Workflow

> **Note:** Commands use `bun run cli -- <command>` when running from source. The [CLI Reference](/extenote/docs/cli) uses `extenote <command>` for brevity—these are equivalent. You can create a shell alias: `alias extenote="bun run cli --"`

```bash
# 1. Check vault status
bun run cli -- status
bun run cli -- issues

# 2. Create content
bun run cli -- create blog_post my-post --title "My Post" --visibility public
# Or interactive: bun run cli -- creator

# 3. Export (optional, standalone)
bun run cli -- export-project personal-website --format json

# 4. Build & deploy website
bun run cli -- build personal-website
bun run cli -- deploy personal-website
```

**Export → Build → Deploy**: Export generates data files, Build compiles websites, Deploy publishes them. See [CONFIGURATION.md](/extenote/docs/configuration#export-configuration) for details.

## Three Interfaces

```bash
bun run cli -- status    # CLI
bun run tui              # Terminal UI (vim-style keys)
bun run web              # Web UI at localhost:3000
```

## Clipper + Refcheck (Optional)

The browser clipper extension is the fastest way to capture references from the web. Clip a paper, save it as a `bibtex_entry`, then run refcheck to validate and fill gaps.

See `extensions/clipper/README.md` for installation and usage.

## Command Reference

### Status & Issues
```bash
bun run cli -- status                    # Vault summary
bun run cli -- issues --limit 20         # Validation issues
bun run cli -- guide --project <name>    # Available schemas & commands
```

### Content Creation
```bash
bun run cli -- create <schema> <slug> --title "..." --visibility public
bun run cli -- creator                   # Interactive wizard
```

### Export
```bash
bun run cli -- export-project <project> --format json
bun run cli -- export-project <project> --format bibtex --detect-citations
```

Formats: `json`, `markdown`, `html`, `atproto`, `bibtex`

### Build & Deploy
```bash
bun run cli -- build --list              # List buildable projects
bun run cli -- build <project>           # Build single project
bun run cli -- build all --dry-run       # Preview steps
bun run cli -- deploy <project>          # Deploy to configured platform
```

### Discussions
```bash
bun run cli -- discussions validate         # Check provider config
bun run cli -- discussions create <project> # Create discussion threads
bun run cli -- discussions list             # List existing links
```

### Refcheck
```bash
bun run cli -- refcheck shared-references --dry-run
```

## TUI Keybindings

| Key | Action |
|-----|--------|
| `d` | Dashboard |
| `i` | Issues |
| `c` | Create |
| `e` | Export |
| `r` | Reload |
| `q` | Quit |

Issues page: `1-4` filter by severity, `n/p` paginate

## More Documentation

- [CONFIGURATION.md](/extenote/docs/configuration) - Project and schema configuration
- [ARCHITECTURE.md](/extenote/docs/architecture) - System architecture, key concepts
- [FAQ.md](/extenote/docs/faq) - Frequently asked questions
- [KNOWN_ISSUES.md](/extenote/docs/known-issues) - Limitations and workarounds
