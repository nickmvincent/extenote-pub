---
type: readme
visibility: public
---
# extenote-docs-astro

Documentation site for Extenote. Reads docs from `../../content/extenote-docs/`.

## Development

```bash
# From the extenote repo:
bun run cli -- build extenote-docs --dev

# Or directly:
cd websites/extenote-docs-astro
npm install
npm run dev
```

## Structure

- `src/pages/index.astro` - Landing page with features overview
- `src/pages/docs/index.astro` - Docs listing page
- `src/pages/docs/[...slug].astro` - Individual doc pages with sidebar
- `src/content/` - Content collections config (loads from `../../content/extenote-docs/`)

## Building

```bash
npm run build
```

Output goes to `dist/`.
