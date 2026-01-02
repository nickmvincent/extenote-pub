---
type: doc
title: Interface Comparison
visibility: public
order: 5
---
# Interface Comparison

Extenote provides three interfaces with overlapping but not identical capabilities.

## Feature Matrix

| Feature | CLI | TUI | Web |
|---------|-----|-----|-----|
| View stats | `status` | `d` Dashboard | Dashboard |
| View issues | `issues` | `i` Issues page | Issues page |
| Filter issues | `--limit` | `1/2/3/4` keys | Tabs |
| View object | `view <path>` | Enter key | Object page |
| List objects | `list <project>` | `o` Objects page | Project page |
| Search objects | `search <query>` | `/` key in Objects | Search bar |
| Open in editor | `edit <path>` | Enter → detail menu | - |
| Create object | `create` (supports project/dir) | `c` wizard | Form with validation |
| Interactive create | `creator` | Built-in | Built-in |
| Export | `export-project` (5 formats + filters) | `e` wizard (4 formats) | Form (4 formats) |
| Lint/fix | `lint --fix` | `l` Lint page | - |
| Command guide | `guide` | `g` Guide page | - |
| Build website | `build` | - | - |
| Deploy website | `deploy` | - | - |
| Discussions | `discussions create/list/validate` | `x` view only | - |
| Semble sync | `sync` | - | - |
| Refcheck | `refcheck` | - | Refcheck page |
| List websites | `websites` | - | Websites page |
| Browse objects | `list` | Objects page | Project/Object pages |
| Markdown preview | - | - | Preview/Source toggle |
| Cross-references | - | - | Object detail page |
| Backlinks | - | - | Object detail page |
| Graph view | - | - | Graph page |
| Dark mode | - | - | Toggle button |
| Reload | Re-run | `r` key | Button |
| Watch mode | - | `w` key | - |
| Project filter | `--project` | `f` key | Dropdown |
| Works over SSH | Yes | Yes | No |
| Scriptable | Yes | No | No |

The browser clipper extension is a separate tool for capturing references from the web and validating existing entries. See [CLIPPER.md](/extenote/docs/clipper) for full documentation.

## When to Use Each

| Use Case | Best Interface |
|----------|----------------|
| Scripting/automation | CLI |
| Quick checks | CLI (`status`, `issues`) |
| Building/deploying websites | CLI (`build`, `deploy`) |
| Syncing with Semble/ATProto | CLI (`sync`) |
| Verifying references | CLI (`refcheck`) |
| Managing discussions | CLI (`discussions`) |
| Viewing object details | CLI (`view`) or Web |
| Searching objects | CLI (`search`) or Web |
| Interactive browsing | TUI or Web |
| Deep diving into objects | Web |
| Exploring object relationships | Web (Graph view) |
| SSH/remote access | CLI or TUI |
| Creating objects | CLI (`creator`), TUI, or Web |
| Markdown preview | Web |

## Details

Each interface has its own package with a README:
- **CLI**: `packages/cli/` - Commander-based, fully scriptable
- **TUI**: `packages/tui/` - Ink/React terminal UI with vim-style keys
- **Web**: `packages/web/` - React + Vite + Tailwind

All three use `@extenote/core` for consistent behavior.
