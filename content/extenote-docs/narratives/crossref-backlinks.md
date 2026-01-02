---
type: doc
title: "Backlinks and Cross-References"
visibility: public
order: 28
generated: true
sourceTests:
  - packages/core/tests/crossref.test.ts
---

# Backlinks and Cross-References

Extenote automatically computes bidirectional links between your content. When note A links to note B, note B gets a "backlink" to note A.

## Step 1: returns empty map for empty array

Cross-references are computed for all objects at once. Each object gets a list of outgoing links (what it references) and backlinks (what references it).

**Test:** `returns empty map for empty array`
**File:** `packages/core/tests/crossref.test.ts:412`

```typescript
it("returns empty map for empty array", () => {
    const refs = computeAllCrossRefs([]);
    expect(refs.size).toBe(0);
  });
```

## Step 2: computes refs for all objects

When two notes link to each other, both get backlinks. Here A links to B and B links to A, so both have one outgoing link and one backlink.

**Test:** `computes refs for all objects`
**File:** `packages/core/tests/crossref.test.ts:423`

```typescript
it("computes refs for all objects", () => {
    const objA = buildObject({ id: "a", body: "Links to [[b]]." });
    const objB = buildObject({ id: "b", body: "Links to [[a]]." });
    const refs = computeAllCrossRefs([objA, objB]);

    expect(refs.size).toBe(2);

    const refsA = refs.get("a")!;
    expect(refsA.outgoingLinks.length).toBe(1);
    expect(refsA.outgoingLinks[0].targetId).toBe("b");
    expect(refsA.backlinks.length).toBe(1);
    expect(refsA.backlinks[0].sourceId).toBe("b");

    const refsB = refs.get("b")!;
    expect(refsB.outgoingLinks.length).toBe(1);
    expect(refsB.backlinks.length).toBe(1);
  });
```

## Step 3: finds citation backlinks to bibtex_entry objects

Citations create backlinks too. When a note cites a paper, the corresponding bibtex_entry (matched by citation_key) gets a backlink from that note.

**Test:** `finds citation backlinks to bibtex_entry objects`
**File:** `packages/core/tests/crossref.test.ts:467`

```typescript
it("finds citation backlinks to bibtex_entry objects", () => {
    const paper = buildObject({
      id: "paper-id",
      type: "bibtex_entry",
      frontmatter: { citation_key: "smith2024" },
      body: "",
    });
    const note = buildObject({
      id: "note-id",
      type: "note",
      body: "See [@smith2024] for details.",
    });

    const refs = computeAllCrossRefs([paper, note]);
    const paperRefs = refs.get("paper-id")!;

    expect(paperRefs.backlinks.length).toBe(1);
    expect(paperRefs.backlinks[0].sourceId).toBe("note-id");
    expect(paperRefs.backlinks[0].linkType).toBe("citation");
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
