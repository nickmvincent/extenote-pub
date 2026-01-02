---
type: doc
title: Browser Clipper Extension
description: Capture and validate bibliographic references from the web
order: 15
visibility: public
---

# Browser Clipper Extension

The Extenote Web Clipper is a browser extension that lets you save web pages as markdown objects and validate existing references against live metadata APIs.

## Features

### Capture Mode
- **API-First Search**: Queries DBLP and Semantic Scholar by default; OpenAlex and Crossref available as optional secondary sources
- **Smart Detection**: Automatically extracts DOIs and arXiv IDs from URLs
- **Auto-Select**: Automatically chooses the best result based on completeness
- **Lookup Trail**: Shows which sources were tried and what was found
- **Editable Metadata**: Review and edit all fields before saving
- **Tag Suggestions**: AI-powered tag suggestions based on content

### Validation Mode
When you visit a page that's already in your vault:
- **Validate Existing Entries**: Compare vault entries with fresh API data
- **Field Comparison**: Side-by-side view of vault vs API values
- **Update check_log**: Persist validation results to track entry quality
- **Fix Mismatches**: One-click update of mismatched fields
- **Status Badge**: Color-coded icon shows validation status:
  - Green check: Confirmed
  - Yellow warning: Mismatch detected
  - Gray question: Unchecked or stale (>30 days)
  - Red X: Not found or error

### Validation Queue
Browse and process entries that need validation without leaving your browser.

## Installation

### Firefox (Temporary Add-on)

1. Build the extension:
   ```bash
   cd extenote/extensions/clipper
   bun install
   bun run build
   ```

2. Load in Firefox:
   - Open `about:debugging` in Firefox
   - Click "This Firefox" in the sidebar
   - Click "Load Temporary Add-on..."
   - Navigate to `extenote/extensions/clipper/dist/` and select `manifest.json`

### Chrome (Developer Mode)

1. Build the extension (same as above)
2. Open `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist/` folder

## Modes

### Download Mode (Default)
- Saves markdown files directly to your browser's download folder
- Files go to `shared-references/` subdirectory by default
- No API connection required
- Good for getting started quickly

### API Mode
- Connect to a running Extenote web server
- Saves directly to your vault
- Enables validation features
- Shows live vault matching

To enable API mode:
1. Start the Extenote web server: `bun run web:server`
2. Click the extension icon, then the gear icon for options
3. Switch to "API mode"
4. Enter API URL (default: `http://localhost:3001`)

## Usage

### Clipping a New Reference

1. Navigate to a paper on any website (arXiv, ACM DL, Google Scholar, etc.)
2. Click the Extenote Clipper icon (or press `Alt+Shift+C`)
3. The popup shows a pre-filled search query (DOI, arXiv ID, or title)
4. The "Lookup trail" shows which sources were searched:
   - **Page**: Direct extraction from page metadata
   - **DBLP**: Computer science bibliography
   - **Semantic Scholar**: Broad academic coverage
   - **OpenAlex** (optional): Additional coverage
   - **Crossref** (optional): DOI verification
5. Review the auto-selected best result (or select a different source)
6. Edit fields if needed
7. Click "Save to Vault" (API mode) or "Download" (download mode)

### Validating Existing Entries

When you visit a page that's already in your vault:

1. The popup automatically shows validation mode
2. Fresh API data is fetched and compared to vault
3. Field-by-field comparison shows matches and mismatches
4. Options:
   - **Update check_log**: Save validation status without changing fields
   - **Fix Mismatches**: Update vault with API values
   - **Clip as New**: Create a separate entry

### Using the Validation Queue

1. Click "Queue" in the popup footer
2. Browse entries that haven't been validated
3. Click an entry to open its URL
4. Validate using the normal validation flow
5. Click "Refresh" to update the queue

## Search Sources

The clipper evaluates multiple sources and picks the most complete result:

| Source | Default | Best For |
|--------|---------|----------|
| **DBLP** | Yes | Computer science papers |
| **Semantic Scholar** | Yes | Broad coverage, abstracts |
| **OpenAlex** | Optional | Wide academic coverage |
| **Crossref** | Optional | DOI verification |

Unlike the CLI which stops at the first match, the clipper evaluates all enabled sources and auto-selects based on completeness (number of populated fields).

## Configuration

Open extension options (click gear icon) to configure:

| Setting | Description | Default |
|---------|-------------|---------|
| Mode | Download or API | Download |
| API URL | Server URL for API mode | `http://localhost:3001` |
| Default Project | Project for new entries | - |
| Default Schema | Schema type for clipped pages | `bibtex_entry` |
| Default Tags | Tags to add to all clipped pages | `clipped` |
| Download Subdirectory | Subdirectory for downloads | `shared-references/` |

## Keyboard Shortcuts

- `Alt+Shift+C`: Open clipper popup

## Workflow Integration

The clipper integrates with the broader Extenote workflow:

1. **Capture**: Use the clipper to save references while browsing
2. **Review**: Use the web UI's Review page to check for mismatches
3. **Refcheck**: Use the CLI to batch-validate references
4. **Fix**: Use either the clipper or CLI to update mismatched fields

See [Reference Check](./reference-check.md) for the full refcheck documentation.

## Caching

The extension caches responses from external APIs (DBLP, Semantic Scholar, OpenAlex, Crossref) to improve performance:

- **TTL**: 10 minutes - academic metadata rarely changes
- **Storage**: Two-tier caching with in-memory Map (fast) and IndexedDB (persistent)
- **Automatic**: No configuration needed; caching is transparent

This means:
- Repeated searches for the same paper are instant
- Recently searched papers work offline
- External APIs see reduced load

The cache expires automatically. Restarting the browser clears the memory layer but IndexedDB persists until the TTL expires.

## Troubleshooting

### "Failed to save" error
- Check that the API server is running (`bun run web:server`)
- Verify the API URL in extension options
- Check browser console for detailed error messages

### No results found
- Try checking the optional sources (OpenAlex, Crossref)
- Verify the DOI or arXiv ID is correct
- Some preprints may not be indexed yet

### Extension not updating vault
- Make sure you're in API mode, not download mode
- Check that the file path is correct
- Try refreshing the vault in the web UI

## Development

```bash
cd extenote/extensions/clipper

# Install dependencies
bun install

# Build once
bun run build

# Watch for changes during development
bun run watch

# Run tests
bun test
```
