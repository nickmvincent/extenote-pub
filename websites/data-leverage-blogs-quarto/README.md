# data-leverage-blogs-quarto

Quarto website for the Data Leverage blog. Source pages live in `index.qmd`,
`archive.qmd`, and `discussions.qmd`. Canonical blog content lives in
`../../content/data-leverage-blogs`, and `posts` should be a symlink to that
directory. Output goes to `docs/`.

## Development

```bash
./scripts/ensure-posts-link.sh
quarto preview
```

## Build

```bash
./scripts/ensure-posts-link.sh
quarto render
```

If you already have a local `posts/` directory, run:

```bash
./scripts/ensure-posts-link.sh --migrate
```
