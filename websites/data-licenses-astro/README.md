# datalicenses.org

A community‑curated index of initiatives related to AI data flow, focused on:
- Preference signals
- Licenses/collectives
- Technical enforcement and certification

This README documents the schema, filters/sorting, endpoints, and local development.

## Project Structure

Key paths:
- `src/content.config.ts` — Content collections and schema
- `content/data-licenses/initiatives/*.md` — Main dataset (frontmatter + optional body)
- `src/pages/index.astro` — UI (filters, cards, primer, etc.)
- `src/pages/memo.astro` and `content/data-licenses/memos/memo.md` — Longer memo
- `src/pages/contributing.astro` — Contributing guide
- `src/pages/data/initiatives.json.ts` — JSON endpoint
- `scripts/lint-content.mjs` — Content linter

## Schema: collections

The site uses an Astro Content Collection (`astro:content`): `initiatives`.

### initiatives frontmatter

Required
- `title`: string — Display name
- `summary`: string — Short description for cards

Recommended/optional
- `actionsSupported`: string[] — One or more of:
  - `attach-preference-signal`
  - `attach-formal-license`
  - `join-licensing-collective`
  - `add-tollgate`
  - `technical-blocking`
  - `new-infrastructures`
  - `certification`
- `status`: enum — Project status (simplified scale):
  - `WIP` — Work in progress
  - `usable-but-new` — Usable, limited or no third‑party evidence
  - `usable-with-some-evidence` — Usable with some independent adoption
  - `usable-with-strong-evidence` — Usable with strong, broad evidence
- `website`: url
- `spec`: url
- `sourceRepo`: url
- `pressPage`: url
- `linkWithEvidenceOfUse`: url — Evidence of adoption/use
- `jurisdictions`: string[]
- `signals`: string[]
- `pipelineStages`: enum[] — Any of `collect`, `train`, `fine-tune`, `retrieve`, `generate`
- `considerations`: string — Risks, tradeoffs, caveats
- `tags`: string[]
- `lastUpdated`: date
- Activity metadata:
  - `recentActivity`: date — Most recent public activity
  - `recentActivityNote`: string — Short note/context
- Adoption/impact (displayed as chips):
  - `usersCount`: string — e.g., `10+ orgs`, `1k+ users`
  - `dataVolume`: string — e.g., `>10M pages/day`, `TB/mo`
  - `moneyVolume`: string — e.g., `$100k+/mo`, `$2M total`
- Implementation snippets (rendered in a collapsible section):
  - `implementationSnippets`: Array<{ `title`: string; `language`?: string; `code`: string; `sourceUrl`: url }>

Example
```md
---
title: Really Simple Licensing (RSL)
summary: Machine‑readable licensing schema to signal reuse permissions.
actionsSupported: ["attach-formal-license"]
status: usable-with-some-evidence
website: https://rslstandard.org/
spec: https://rslstandard.org/spec
pressPage: https://rslstandard.org/press
pipelineStages: ["collect", "train", "retrieve"]
usersCount: "10+ orgs"
linkWithEvidenceOfUse: https://rslstandard.org/press
recentActivity: 2025-09-14
recentActivityNote: See press page
implementationSnippets:
  - title: Add X‑Robots‑Tag
    language: http
    code: |
      X-Robots-Tag: noai, notrain
    sourceUrl: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Robots-Tag
---

Optional long body text…
```

## Filters, sorting, and URL params

UI behavior (implemented in `src/pages/index.astro`):
- Search: free text over `title`, `summary`, and `tags`.
- Actions: multi‑select (pill toggles) from `actionsSupported`.
- Status: filter using the simplified scale (WIP → Strong evidence).
- Show what I can use today: toggle shows items with non‑WIP status.
- Sort: `recent` (default), `alpha`, `usable`.

Deep‑linking via URL parameters:
- `q`: string — search query
- `status`: string — status value (e.g., `usable-with-some-evidence`)
- `actions`: repeated — one or more action values
- `usable`: `true` — toggle on
- `sort`: `recent` | `alpha` | `usable`

“Copy link to this view” updates and copies the current filter URL.

## JSON endpoint

`/data/initiatives.json` (defined in `src/pages/data/initiatives.json.ts`)
- Response: `{ count: number, items: Initiative[] }`
- Items include all frontmatter fields plus `id` and `slug`.
- Ordered alphabetically by `title`.

## Linting content

Run: `npm run lint:content`
- Checks required fields (`title`, `summary`, `status`).
- Light URL shape checks on common link fields.
- Notes presence of `implementationSnippets` (no deep validation).

## Contributing

- See `src/pages/contributing.astro` for scope and how to add entries.
- Quick path: add a new Markdown file under `content/data-licenses/initiatives/` with the frontmatter above and open a PR.
- Or ping @nickmvincent

## Development

Commands:
- `npm install` — install deps
- `npm run dev` — dev server at `localhost:4321`
- `npm run build` — build to `./dist/`
- `npm run preview` — preview the build locally

## Deploying to Cloudflare Pages

This repo includes a `wrangler.toml` configured for Pages.

1. Authenticate once: `npx wrangler login`
2. Build the static assets: `npm run build`
3. Deploy to your Pages project: `npm run cf:deploy` (defaults to project name `datalicenses-org`; override with `--project-name <your-project>` if needed)
4. Optional: test locally with `npx wrangler pages dev dist`

The Pages output directory is `dist`; adjust `wrangler.toml` if you change the build path.

## UI notes

- Primer cards explain “Preference signals”, “Licenses and collectives”, and “Technical controls”, mapping to all action tags.
- Card badges show status; a “usable today” chip appears for non‑WIP items.
- Implementation snippets section supports copy‑to‑clipboard and links to sources.
- “You may also like” provides related resources.
