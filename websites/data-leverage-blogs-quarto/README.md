# data-leverage-blogs-quarto

Quarto website for the Data Leverage blog. Source pages live in `index.qmd`,
`archive.qmd`, and `discussions.qmd`. Canonical blog content lives in
`../../content/data-leverage-blogs`, and `posts/` is a generated mirror synced
from that source before render. Output goes to `docs/`.

## Development

```bash
./scripts/sync-posts-from-content.sh --repair
quarto preview
```

## Build

```bash
./scripts/sync-posts-from-content.sh --repair
quarto render
```
