---
type: doc
title: Web UI Gallery
visibility: public
order: 6
---
# Web UI Gallery

The Extenote web interface provides a visual way to browse, search, and manage your content. Start the web server with:

```bash
extenote web
```

Then open `http://localhost:3000` in your browser.

## Dashboard

The dashboard shows an overview of your vault: total objects, types, tags, and any issues that need attention.

![Dashboard](/screenshots/01-dashboard.png)

## Search

Full-text search across all your content. Results update as you type.

![Search](/screenshots/03-search-empty.png)

![Search with results](/screenshots/04-search-with-query.png)

## Graph View

Visualize connections between objects through citations, wiki links, and backlinks.

![Graph visualization](/screenshots/05-graph-default.png)

## Tags

Browse your tag hierarchy. Tags with `:` separators create nested structures (e.g., `topic:ai` appears under `topic`).

![Tags browser](/screenshots/07-tags.png)

![Tag tree structure](/screenshots/08-tags-tree.png)

## Issues

View validation issues, missing references, and other problems. Filter by severity level.

![Issues list](/screenshots/09-issues.png)

## Export

Export your content to various formats: JSON, Markdown, BibTeX, or plain text. Filter by project, type, or tags.

![Export options](/screenshots/11-export.png)

## Create Form

Create new objects with schema-validated forms. The form fields adapt based on the selected type.

![Create form](/screenshots/13-create-form.png)

## Schema Reference

Browse your project's schemas to understand available types and their fields.

![Schema reference](/screenshots/15-schemas.png)

## Refcheck

Verify bibliographic references against external databases like DBLP and OpenAlex.

![Refcheck](/screenshots/16-refcheck.png)

## Review Queue

Review and approve content before publishing.

![Review page](/screenshots/18-review.png)

## Websites

View configured websites and their deployment status.

![Websites list](/screenshots/19-websites.png)

## Dark Mode

Toggle between light and dark themes using the button in the header.

![Light theme](/screenshots/20-theme-initial.png)

![Dark theme](/screenshots/21-theme-toggled.png)

## Responsive Design

The interface adapts to different screen sizes.

**Tablet view:**
![Tablet viewport](/screenshots/23-responsive-tablet.png)

**Mobile view:**
![Mobile viewport](/screenshots/24-responsive-mobile.png)
