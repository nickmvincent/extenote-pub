---
type: readme
visibility: public
---
# personal-website-astro

Astro front-end for the personal website content. Reads Markdown from `../../content/personal-website/`.

## Development

```bash
# From the extenote repo:
bun run cli -- build personal-website --dev

# Or directly:
cd websites/personal-website-astro
npm install
npm run dev
```

## Structure

- `src/pages/` - Astro page routes
- `src/layouts/` - Page layouts
- `src/components/` - Reusable components
- `src/content/` - Content collections config (loads from `../../content/personal-website/`)

## Building

Managed via extenote CLI:

```bash
bun run cli -- build personal-website
bun run cli -- deploy personal-website
```

See the [extenote documentation](https://github.com/nickmvincent/extenote) for full details.
