---
type: doc
title: Known Issues
visibility: public
order: 10
---
# Known Issues

## Current Limitations

### Content Operations
- **No editing through interfaces** - Objects can be created and viewed, but editing requires manual file changes
- **No delete/rename** - Must be done manually in filesystem
- **No live preview while editing** - Preview is view-only

### Core
- **Only `local` sources** - GitHub, ATProto, and HTTP sources not yet implemented
- **Web API caching** - The web server caches vault state for 30 seconds (configurable via `EXTENOTE_CACHE_TTL`). Use `/api/reload` to force refresh.
- **Performance** - May be slow with 1000+ objects; use more specific `include` patterns

### Web
- **Web UI gallery** - The gallery view is currently not working end-to-end

### TUI
- **Keyboard only** - No mouse support
- **No syntax highlighting** - Plain text display

## Workarounds

### Editing Objects

Until in-app editing is implemented, use the "Open in Editor" feature:
- **CLI:** `bun run cli -- edit <path>`
- **TUI:** `o` key on object detail view

Or edit files directly in your content directory.

### Remote Content

Only local sources are supported. To use remote content, fetch it manually:

```bash
# GitHub raw pull
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/you/project/main/README.md \
  > ../extenote-pub/external/github/project/README.md

# Copy from cloned repo
rsync -av /tmp/project/docs/ ../extenote-pub/external/docs/
```

Then point a local source at the result. Automate with cron/CI for scheduled pulls.

### Port Conflict (Web)

```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
bun run web
```

### Missing Dependencies

```bash
rm -rf node_modules packages/*/node_modules
bun install && bun run build
```

### Slow Performance

If the vault feels slow:
1. Reduce source scope with more specific `include` patterns
2. Split into multiple projects with targeted includes
3. Use CLI for quick operations instead of Web/TUI

## Security Pitfalls

### Screenshots Leaking Private Data

**Problem:** When you have both public and private content loaded, screenshots of the web UI will capture private data:
- Private project names visible in dashboard
- Private file paths in issues/errors
- "private" visibility counts
- Private content in search results

**Solution:** Use `EXTENOTE_PUBLIC_ONLY=true` when generating screenshots:

```bash
EXTENOTE_PUBLIC_ONLY=true bun run web
```

See [Security: Public-Only Mode](/docs/configuration#security-public-only-mode) for full details.

**If you've already leaked:** You need to wipe git history (orphan branch + force push) and wait for CDN caches to expire.
