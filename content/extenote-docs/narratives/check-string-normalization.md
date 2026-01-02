---
type: doc
title: "String Normalization for Matching"
visibility: public
order: 21
generated: true
sourceTests:
  - packages/core/tests/check.test.ts
---

# String Normalization for Matching

When comparing academic metadata (titles, authors, venues), Extenote normalizes strings to handle variations in formatting, diacritics, and whitespace. This allows matching "Müller" with "Muller" and "HELLO World" with "hello world".

## Step 1: converts to lowercase

All comparisons are case-insensitive. "HELLO" matches "hello".

**Test:** `converts to lowercase`
**File:** `packages/core/tests/check.test.ts:34`

```typescript
it("converts to lowercase", () => {
    expect(normalizeString("HELLO World")).toBe("hello world");
  });
```

## Step 2: removes diacritics

Diacritics (accents) are removed: "Müller" becomes "muller", "café" becomes "cafe". This handles international author names and venue names correctly.

**Test:** `removes diacritics`
**File:** `packages/core/tests/check.test.ts:44`

```typescript
it("removes diacritics", () => {
    expect(normalizeString("Müller")).toBe("muller");
    expect(normalizeString("café")).toBe("cafe");
    expect(normalizeString("Dudík")).toBe("dudik");
    expect(normalizeString("naïve")).toBe("naive");
  });
```

## Step 3: collapses whitespace

Extra whitespace, tabs, and newlines are collapsed to single spaces.

**Test:** `collapses whitespace`
**File:** `packages/core/tests/check.test.ts:55`

```typescript
it("collapses whitespace", () => {
    expect(normalizeString("hello   world")).toBe("hello world");
    expect(normalizeString("  hello  world  ")).toBe("hello world");
    expect(normalizeString("hello\t\nworld")).toBe("hello world");
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
