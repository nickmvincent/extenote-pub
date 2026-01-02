# Shared References Browser

An Astro-powered static site for browsing and searching a collection of bibliographic references.

## Features

- **Search**: Filter references by title or author
- **Filtering**: Filter by tag, year, or entry type
- **Sorting**: Sort by year (newest/oldest) or title (A-Z/Z-A)
- **Random**: View a random selection of 10 references
- **Individual pages**: Each reference has its own page at `/reference/[id]`
- **Tag pages**: Browse references by tag at `/tags/[tag]`

## Project Structure

```
/
├── src/
│   ├── components/
│   │   └── ReferenceCard.astro    # Card component for each reference
│   ├── layouts/
│   │   └── Layout.astro           # Base page layout
│   ├── pages/
│   │   ├── index.astro            # Main browsing page with filters
│   │   ├── reference/[...slug].astro  # Individual reference pages
│   │   └── tags/[tag].astro       # Tag listing pages
│   ├── styles/
│   │   └── global.css             # Global styles
│   └── content.config.ts          # Content collection schema
├── public/                        # Static assets
└── ../../content/shared-references/  # Markdown reference files (external)
```

## Content

References are loaded from markdown files in `../../content/shared-references/`. Each file should have frontmatter with:

- `title` (required)
- `authors` or `author`
- `year`
- `citation_key` or `citekey`
- `entry_type` or `type`
- `venue` or `journal`
- `url`
- `abstract`
- `tags`
- `doi`, `keywords`, etc.

## Commands

| Command       | Action                                      |
| :------------ | :------------------------------------------ |
| `bun install` | Install dependencies                        |
| `bun dev`     | Start local dev server at `localhost:4321`  |
| `bun build`   | Build production site to `./dist/`          |
| `bun preview` | Preview build locally before deploying      |
