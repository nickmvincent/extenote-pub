---
type: doc
title: Tags
visibility: public
order: 7
---
# Tags

Tags provide a flexible way to organize and categorize objects across your vault. Extenote supports both simple tags and hierarchical tags with a colon separator.

## Tag Format

Tags are defined in the frontmatter `tags` field:

```yaml
---
title: My Research Paper
tags:
  - research
  - ml
  - collection:data-leverage
---
```

### Simple Tags

Simple tags are single labels like `research`, `important`, or `draft`.

### Hierarchical Tags

Hierarchical tags use a colon separator to create parent-child relationships:

- `collection:data-leverage` - belongs to the "data-leverage" subcollection
- `status:draft` - has "draft" status
- `topic:ml:transformers` - deeply nested topic

Hierarchical tags are displayed as a tree structure in the web UI, with the prefix as the parent node.

## Web UI Tag Management

The web app provides a full-featured tag management interface at the **Tags** page.

### Features

1. **Tag Tree View**
   - Hierarchical display with expand/collapse
   - Object counts for each tag
   - Search/filter to find specific tags

2. **Tag Operations**
   - **Rename**: Change a tag name across all objects
   - **Merge**: Combine one tag into another
   - **Delete**: Remove a tag from all objects

3. **Preview Before Apply**
   - See exactly which files will be modified
   - Review current vs new tags for each file
   - Cancel if the changes aren't what you expected

## CLI Tag Management

Tag operations are also available via the CLI:

```bash
# List all tags with counts
bun run cli -- tags list

# List tags in a specific project
bun run cli -- tags list shared-references

# List as JSON
bun run cli -- tags list --json

# Rename a tag
bun run cli -- tags rename old-tag new-tag

# Preview rename without applying
bun run cli -- tags rename old-tag new-tag --dry-run

# Merge source tag into target
bun run cli -- tags merge source-tag target-tag

# Delete a tag from all objects
bun run cli -- tags delete unwanted-tag

# Delete with confirmation prompt skipped
bun run cli -- tags delete unwanted-tag --yes
```

## Collection Tags

Tags prefixed with `collection:` define which paper collections an object belongs to:

```yaml
tags:
  - collection:data-leverage
  - collection:data-valuation
```

A paper can belong to multiple collections by having multiple `collection:*` tags.

### Priority in Collections

To manually control the order of papers in collections, add a `priority:<number>` tag:

```yaml
tags:
  - collection:data-valuation
  - priority:1  # Appears first in all collections this paper belongs to
```

**Sort order:** Papers with `priority:N` tags are sorted by N (ascending), then unprioritized papers are sorted by year (most recent first).

## Semble Collection Integration

Tags prefixed with `collection:` have special meaning for [Semble sync](/extenote/docs/configuration#semble-sync-configuration). When syncing objects to Semble:

1. The project name becomes a Semble collection
2. Each `collection:*` tag creates an additional collection membership

For example, an object with:
```yaml
tags:
  - collection:data-leverage
  - collection:papers
```

In project `shared-references` will be synced to three Semble collections:
- `shared-references` (project collection)
- `shared-references:data-leverage` (tag collection)
- `shared-references:papers` (tag collection)

## Best Practices

1. **Use consistent naming conventions**
   - Lowercase with hyphens: `machine-learning`, `data-leverage`
   - Avoid spaces or special characters

2. **Use hierarchical tags for categories**
   - `status:draft`, `status:published`, `status:archived`
   - `topic:ml`, `topic:nlp`, `topic:vision`

3. **Preview before applying**
   - Always use `--dry-run` in CLI or Preview in web UI
   - Verify the affected files are what you expect

4. **Merge rather than delete**
   - When consolidating tags, merge into the canonical name
   - This preserves the tagging rather than losing it

5. **Use collection: prefix for Semble**
   - Objects with `collection:*` tags get multi-collection membership
   - Plan your collection structure before syncing
