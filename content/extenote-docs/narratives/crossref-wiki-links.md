---
type: doc
title: "Wiki Link Parsing"
visibility: public
order: 26
generated: true
sourceTests:
  - packages/core/tests/crossref.test.ts
---

# Wiki Link Parsing

Wiki links connect your notes together using [[double-bracket]] syntax. Extenote parses these links to build a graph of relationships between your content.

## Step 1: returns empty array for text with no links

Wiki links use [[double-bracket]] syntax. The text inside the brackets becomes the target ID. Text without brackets has no links.

**Test:** `returns empty array for text with no links`
**File:** `packages/core/tests/crossref.test.ts:48`

```typescript
it("returns empty array for text with no links", () => {
    const links = parseWikiLinks("This is plain text without any links.");
    expect(links).toEqual([]);
  });
```

## Step 2: parses single wiki link

A single wiki link extracts the target ID from between the brackets.

**Test:** `parses single wiki link`
**File:** `packages/core/tests/crossref.test.ts:58`

```typescript
it("parses single wiki link", () => {
    const links = parseWikiLinks("See [[my-note]] for more.");
    expect(links.length).toBe(1);
    expect(links[0].targetId).toBe("my-note");
    expect(links[0].displayText).toBeUndefined();
  });
```

## Step 3: parses multiple wiki links

You can have multiple wiki links in the same text. Each one is parsed independently and returned in order.

**Test:** `parses multiple wiki links`
**File:** `packages/core/tests/crossref.test.ts:70`

```typescript
it("parses multiple wiki links", () => {
    const links = parseWikiLinks("Links to [[note-a]] and [[note-b]] and [[note-c]].");
    expect(links.length).toBe(3);
    expect(links.map(l => l.targetId)).toEqual(["note-a", "note-b", "note-c"]);
  });
```

## Step 4: parses wiki link with display text

Wiki links can include display text after a pipe character. The syntax [[id|Display Text]] links to "id" but shows "Display Text" to readers.

**Test:** `parses wiki link with display text`
**File:** `packages/core/tests/crossref.test.ts:81`

```typescript
it("parses wiki link with display text", () => {
    const links = parseWikiLinks("See [[my-note|My Custom Title]] here.");
    expect(links.length).toBe(1);
    expect(links[0].targetId).toBe("my-note");
    expect(links[0].displayText).toBe("My Custom Title");
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
