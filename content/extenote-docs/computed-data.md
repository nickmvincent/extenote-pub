---
type: doc
title: Computed Data
visibility: public
order: 11
---
# Computed Data

Extenote derives certain data dynamically from your vault content. This page explains what gets computed, when it's computed, and how to choose between dynamic computation and persisted values.

## Computed vs Persisted

Some data can be either:
- **Computed on-demand**: Calculated fresh each time it's needed
- **Persisted**: Saved to frontmatter via CLI commands, then read back

| Data Type | Computed | Persisted | Notes |
|-----------|----------|-----------|-------|
| cited_in | `computeCitedIn()` | `sync-citations` | Which projects cite each bibtex entry |
| cross-refs | `computeAllCrossRefs()` | - | Wikilinks and backlinks |
| tag index | `buildTagTree()` | - | All tags and their objects |
| project membership | `objectBelongsToProject()` | - | Which objects belong to each project |
| vault summary | `summarizeVault()` | - | Object counts, issues, etc. |

## When to Use Each Approach

### Dynamic Computation
- **Small vaults**: Computation is fast enough
- **Always fresh**: No risk of stale data
- **Read-only use**: Viewing, searching, querying

### Persisted Values
- **Large vaults**: Avoid re-computing on every load
- **Static builds**: Generate data once, use in builds
- **Audit trails**: Track what was computed and when

## Computation Details

### cited_in (Citation Tracking)

Scans all projects that include `shared-references` for Pandoc/Quarto citations (`[@key]`) and builds a reverse index.

**Dynamic**: `computeCitedIn(objects, config)` returns `CitedInMap` with:
- `citedIn: Map<string, string[]>` - citation_key → [project1, project2, ...]
- `totalCitations: number`
- `scannedProjects: string[]`

**Persist**: `extenote sync-citations` writes `cited_in` field to each bibtex entry.

### Cross-References (Wikilinks)

Parses `[[wikilinks]]` in document bodies and builds forward/backward reference maps.

**Dynamic only**: `computeAllCrossRefs(objects)` returns refs per object.

Uses `parseWikiLinks()` to extract links, `buildObjectIndex()` for ID lookups.

### Tag Index

Builds a tree structure of all tags with their objects.

**Dynamic only**:
- `getAllTags(objects)` - flat list of all tags
- `buildTagTree(objects)` - hierarchical tree with counts

Tags support namespaces via `:` (e.g., `collection:data-leverage`).

### Project Membership

Determines which objects belong to each project based on source configuration and includes.

**Dynamic only**: `objectBelongsToProject(obj, projectName, config)` checks:
1. Object's `sourceId` matches project sources
2. Object type matches project includes

### Vault Summary

Aggregates statistics about the vault.

**Dynamic only**: `summarizeVault(vault)` returns:
- Total object count by type
- Public/private/unlisted counts
- Issue counts by severity
- Project breakdowns

## Web UI: Computed Data View

The web app's status page shows:
- Last vault load time
- Computation times for each derived data type
- Memory usage
- Option to recompute specific data

Access via the "System" or "Status" menu item.

## Performance Considerations

| Operation | Typical Time | Notes |
|-----------|--------------|-------|
| Load vault (500 objects) | ~200ms | File I/O + parsing |
| computeCitedIn | ~50ms | Regex scanning |
| computeAllCrossRefs | ~100ms | Link parsing + indexing |
| buildTagTree | ~20ms | String processing |

For vaults with 1000+ objects, consider persisting frequently-accessed computed data.

## CLI Commands

```bash
# Persist cited_in to bibtex entries
extenote sync-citations

# Preview what would be updated
extenote sync-citations --dry-run

# View vault summary (computed)
extenote summary
```

## API Reference

```typescript
import {
  computeCitedIn,
  getCitedIn,
  computeAllCrossRefs,
  buildTagTree,
  summarizeVault
} from "@extenote/core";

// Compute cited_in dynamically
const citedInMap = computeCitedIn(vault.objects, vault.config);

// Get cited_in for specific entry (checks persisted first, falls back to computed)
const projects = getCitedIn(entry, citedInMap);

// Build full cross-reference graph
const crossRefs = computeAllCrossRefs(vault.objects);

// Build tag tree
const tagTree = buildTagTree(vault.objects);

// Get vault summary
const summary = summarizeVault(vault);
```
