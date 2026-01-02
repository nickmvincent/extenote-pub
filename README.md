---
type: readme
---
# extenote-pub

This repository is organized to keep public content and the web shells that render it side-by-side:

- `content/` – the canonical source for public Markdown vaults, demos, and assets (e.g., `data-licenses`, `data-napkin-math`, `personal-website` seed content).
- `websites/` – Astro (or other) front-ends such as `personal-website-astro` that read from `content/`.

### Wiring content into apps

- Each site defaults to loading from `../../content/<name>`, but you can override via env vars (e.g., `PERSONAL_CONTENT_PATH`) when developing elsewhere.
- When adding a new site, create the corresponding vault under `content/` so code and artifacts live in a single repo.
- Verified 2025-12-28: all Astro sites load content directly from `../../content` (no symlinks required).

### Usage notes

- Edit Markdown/demos inside `content/` and keep framework-specific code in `websites/`.
- Point other tools at this repo with something like `process.env.EXTENOTE_CONTENT_ROOT ?? "../extenote-pub"` if they live in sibling workspaces.
- This repo’s commit history stays focused on public-facing material while remaining decoupled from private tooling.
- Website builds are managed via the extenote CLI (see `bun run cli -- build` in the extenote repo).
