---
type: doc
title: "Citation Parsing"
visibility: public
order: 27
generated: true
sourceTests:
  - packages/core/tests/crossref.test.ts
---

# Citation Parsing

Extenote supports academic citation syntax similar to Pandoc and Quarto. Citations link your notes to bibliography entries (bibtex_entry objects).

## Step 1: returns empty array for text with no citations

Citations use the at-bracket syntax (like Pandoc/Quarto). The key inside references a bibtex_entry's citation_key field.

**Test:** `returns empty array for text with no citations`
**File:** `packages/core/tests/crossref.test.ts:127`

```typescript
it("returns empty array for text with no citations", () => {
    const citations = parseCitations("This is plain text without any citations.");
    expect(citations).toEqual([]);
  });
```

## Step 2: parses single citation

A single citation is parsed and tagged as a "citation" link type, distinguishing it from wiki links.

**Test:** `parses single citation`
**File:** `packages/core/tests/crossref.test.ts:138`

```typescript
it("parses single citation", () => {
    const citations = parseCitations("See [@smith2024] for more.");
    expect(citations.length).toBe(1);
    expect(citations[0].targetId).toBe("smith2024");
    expect(citations[0].linkType).toBe("citation");
  });
```

## Step 3: parses multiple citations in one bracket

Multiple citations can be combined in one bracket, separated by semicolons. This is the standard academic style for citing multiple sources.

**Test:** `parses multiple citations in one bracket`
**File:** `packages/core/tests/crossref.test.ts:150`

```typescript
it("parses multiple citations in one bracket", () => {
    const citations = parseCitations("Multiple sources [@smith2024; @jones2023; @lee2022].");
    expect(citations.length).toBe(3);
    expect(citations.map(c => c.targetId)).toEqual(["smith2024", "jones2023", "lee2022"]);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
