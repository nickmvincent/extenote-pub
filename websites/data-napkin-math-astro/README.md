# Data Napkin Math - Astro Site

An Astro + Vue site for interactive "napkin math" calculations about training data value.

## Content Source

This site loads content directly from:
```
../../content/data-napkin-math/
├── inputs/      # Input variable definitions (26 files)
└── scenarios/   # Calculation scenarios (4 files)
```

## Project Structure

```
├── src/
│   ├── components/
│   │   └── NapkinApp.vue      # Main interactive Vue component
│   ├── layouts/
│   │   └── Layout.astro       # Base HTML layout
│   ├── lib/
│   │   └── calculations.ts    # Calculation logic & formatters
│   ├── pages/
│   │   └── index.astro        # Main page (loads content collections)
│   ├── styles/
│   │   └── global.css         # All styles
│   └── content.config.ts      # Astro content collection schemas
├── astro.config.mjs
└── package.json
```

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview production build locally            |

## How It Works

1. **Astro Content Collections** read the markdown files at build time
2. **Frontmatter** in each markdown file defines the data (values, units, formulas)
3. **Vue component** (`NapkinApp.vue`) handles all client-side interactivity
4. The page is statically generated but hydrates Vue for interactive calculations

## Editing Content

To add/edit inputs or scenarios, modify the markdown files in:
```
../../content/data-napkin-math/inputs/
../../content/data-napkin-math/scenarios/
```

See existing files for the expected frontmatter format.
