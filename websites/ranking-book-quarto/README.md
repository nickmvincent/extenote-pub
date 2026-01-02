# ranking-book-quarto

Static site wrapper for the ranking-book content in `../../content/ranking-book`.

## Build

Prereq: Quarto installed (https://quarto.org/docs/get-started/).

From the extenote repo:

```bash
bun run cli -- build ranking-book
```

What it does:
- Rsyncs Quarto sources from `../../content/ranking-book/` into `src/`.
- Generates `src/references.bib` from shared references.
- Generates `discussions.qmd` and injects it into `_quarto.yml`.
- Renders the book to `_book/`.

Edit the markdown in `../../content/ranking-book`, rerun the build, and the updates flow into `_book/`.
