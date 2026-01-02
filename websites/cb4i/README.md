# CB4I - Collective Bargaining for Information

Astro site for the "Collective Bargaining in the Information Economy" NeurIPS 2025 position paper.

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
npm run cf:deploy
```

Or manually:
```bash
npx wrangler pages deploy dist --project-name cb4i
```
