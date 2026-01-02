# Data Counterfactuals – Astro app

This folder now uses Astro + Preact. The “memo” content lives in `content/data-counterfactuals/memos/data-counterfactuals.md`, and the interactive explorer lives in `src/components/Explorer.jsx`.

## Prerequisites
- Install dependencies: `npm install`
- (optional) Install Wrangler globally for Cloudflare Pages: `npm install -g wrangler`
- Authenticate once for Pages: `wrangler login`

## Local dev
- Run the site: `npm run dev`
- Open the app at the URL printed by Astro (defaults to http://localhost:4321).

## Build & preview
- Production build: `npm run build` (outputs to `dist/`)
- Preview the built site locally: `npm run preview`
- Cloudflare Pages preview against the built output: `wrangler pages dev dist`

## Deploy to Pages
- Deploy the built site (uses `wrangler.toml`): `wrangler pages deploy dist --project-name data-counterfactuals`
  - If the project does not exist yet, create it first: `wrangler pages project create data-counterfactuals`
