Static site wrapper for the paidf mini-book content in `../../content/paidf-mini-book`.

## Build

Prereq: Quarto installed (https://quarto.org/docs/get-started/).

From the extenote repo:

```
./scripts/websites/paidf-mini-book-quarto.sh ../extenote-content-public/websites/paidf-mini-book-quarto
```

What it does:
- Rsyncs just the needed sources (`*.qmd`, `*.md`) from `../../content/paidf-mini-book/` into `src/` (ignored in git).
- Generates `references.bib` from shared references via the extenote CLI.
- Copies the synced `src/index.qmd` to the project root (Quarto expects a top-level index).
- Renders the book from the copied content into `docs/` (publishable, e.g., GitHub Pages).

Edit the markdown in `../../content/paidf-mini-book`, rerun the script, and the updates flow into `docs/`. If you add other asset types (images, etc.), update the includes in the extenote render script to pull them over.
