---
type: doc
title: Discussion Plugin System
visibility: public
order: 12
---
# Discussion Plugin System

A modular plugin system for creating discussion threads across multiple platforms for extenote content objects. Supports both project-level discussions (one per project) and per-object discussions.

> **Status:** GitHub Discussions and WhiteWind are fully supported. Leaflet and Google Docs are on the roadmap but not yet implemented.

## Discussion vs Network: Key Distinction

Extenote separates **discussion management** from **network visibility** into two distinct but complementary systems:

### Discussion System (Creating External Discussions)

The **Discussion** system creates and manages discussion threads on external platforms:

- **What it does**: Creates discussions on GitHub, Leaflet, WhiteWind, Google Docs, etc.
- **When to use**: Run `extenote discussions create <project>` to create discussion threads
- **Output**: Writes `project_discussion` objects (markdown files) with links to all created discussions
- **Configuration**: The `discussion:` block in your project YAML

```yaml
# Example: Create discussions on GitHub and WhiteWind
discussion:
  createObjects: true
  outputDir: ${EXTENOTE_CONTENT_ROOT}/discussions
  providers:
    github:
      enabled: true
      repo: user/repo
      category: General
    whitewind:
      enabled: true
      identifier: user.bsky.social
```

### Network System (Making Discussions Visible)

The **Network** system makes your discussions discoverable on your static site:

- **What it does**: Generates a `/discussions` page with links to external discussions and related projects
- **When to use**: Add a `network` preRender step to your build config
- **Output**:
  - **Quarto**: Generates `discussions.qmd` and updates `_quarto.yml` navbar
  - **Astro**: Generates `src/data/network.json` for your components to consume
- **Configuration**: The `network` step in your `build.preRender` array

```yaml
# Example: Generate a discussions page for your Astro site
includes:
  - discussions  # Include the discussions project to access discussion objects

build:
  type: astro
  preRender:
    - type: network
      outputFormat: astro
```

### Complete Workflow

```
1. Configure discussion providers in project YAML
                    ↓
2. Run: extenote discussions create my-project
   → Creates discussions on GitHub, ATProto, etc.
   → Writes discussion objects to content/discussions/
                    ↓
3. Add network step to build config
                    ↓
4. Run: extenote build my-project
   → Network step reads discussion objects
   → Generates discussions page for your SSG
                    ↓
5. Add nav link to your site's layout pointing to /discussions
   → Users can now find and join your discussions
```

## Providers

### GitHub Discussions (Supported)

```yaml
github:
  enabled: true
  repo: owner/repo
  category: General
  token: $GITHUB_TOKEN  # or env var
```

### WhiteWind (Supported)

Creates markdown blog entries on ATProto using the `com.whtwnd.blog.entry` lexicon.

```yaml
whitewind:
  enabled: true
  identifier: user.bsky.social
  password: $ATPROTO_APP_PASSWORD
```

### Leaflet (Roadmap)

> Not yet implemented. Planned support for creating rich documents on ATProto using the `pub.leaflet.document` lexicon.

### Google Docs (Roadmap)

> Not yet implemented. Planned support for creating Google Docs with configurable sharing permissions.

## CLI Commands

```bash
# Create project-level discussion
bun run cli discussions create <project>

# Dry run - show what would be created
bun run cli discussions create <project> --dry-run

# Only use specific provider
bun run cli discussions create <project> --provider leaflet

# List existing discussion links
bun run cli discussions list

# Validate provider configurations
bun run cli discussions validate
```

## Discussion Objects

When `createObjects: true`, running `discussions create` generates markdown files:

```markdown
---
type: project_discussion
project: my-project
title: "my-project Discussions"
github_url: "https://github.com/user/repo/discussions/42"
leaflet_url: "https://mysite.leaflet.pub/3abc..."
created_at: 2024-01-15
---

# my-project Discussions

Welcome! This is the central discussion space for the **my-project** project.

## Discussion Links

- [Discuss on GitHub](https://github.com/user/repo/discussions/42)
- [Discuss on Leaflet](https://mysite.leaflet.pub/3abc...)
```

## Network Step

The `network` preRender step generates a discussions page for your static site:

```yaml
build:
  websiteDir: my-site-quarto
  type: quarto
  preRender:
    - type: network
      outputFormat: quarto
      addToNavbar: true
      relatedProjects: [other-project]
```

| Option | Default | Description |
|--------|---------|-------------|
| `outputFormat` | `quarto` | `quarto`, `astro`, or `both` |
| `addToNavbar` | `true` | Update `_quarto.yml` navbar |
| `relatedProjects` | `[]` | Additional projects to link |
| `excludeProjects` | `[]` | Projects to exclude |
