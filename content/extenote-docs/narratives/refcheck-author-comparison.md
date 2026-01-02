---
type: doc
title: "Author List Comparison"
visibility: public
order: 31
generated: true
sourceTests:
  - packages/refcheck/tests/compare.test.ts
---

# Author List Comparison

Comparing author lists is tricky because names appear in different formats: "John Smith", "Smith, John", "J. Smith", "Smith, J.". Extenote compares authors by matching last names and provides detailed per-author match results.

## Step 1: matches identical author lists

Author lists are compared position-by-position. Each author gets a detailed match result showing whether the last name matched.

**Test:** `matches identical author lists`
**File:** `packages/refcheck/tests/compare.test.ts:145`

```typescript
it("matches identical author lists", () => {
    const result = compareAuthors(
      ["John Smith", "Jane Doe"],
      ["John Smith", "Jane Doe"]
    );
    expect(result.count_match).toBe(true);
    expect(result.details).toHaveLength(2);
    expect(result.details![0].last_match).toBe(true);
    expect(result.details![1].last_match).toBe(true);
  });
```

## Step 2: matches authors with different name formats

"Smith, John" and "John Smith" both match because the comparison extracts and compares last names regardless of format.

**Test:** `matches authors with different name formats`
**File:** `packages/refcheck/tests/compare.test.ts:161`

```typescript
it("matches authors with different name formats", () => {
    const result = compareAuthors(
      ["Smith, John", "Doe, Jane"],
      ["John Smith", "Jane Doe"]
    );
    expect(result.count_match).toBe(true);
    expect(result.details![0].last_match).toBe(true);
    expect(result.details![1].last_match).toBe(true);
  });
```

## Step 3: detects author count mismatch

If your entry has 2 authors but the database has 1, that's flagged as a count mismatch. This helps catch incomplete author lists.

**Test:** `detects author count mismatch`
**File:** `packages/refcheck/tests/compare.test.ts:176`

```typescript
it("detects author count mismatch", () => {
    const result = compareAuthors(
      ["John Smith", "Jane Doe"],
      ["John Smith"]
    );
    expect(result.count_match).toBe(false);
    expect(result.local_count).toBe(2);
    expect(result.remote_count).toBe(1);
  });
```

## Step 4: handles diacritics in author names

International names with diacritics are normalized: "François Müller" matches "Francois Muller". This prevents false mismatches for non-ASCII characters.

**Test:** `handles diacritics in author names`
**File:** `packages/refcheck/tests/compare.test.ts:201`

```typescript
it("handles diacritics in author names", () => {
    const result = compareAuthors(
      ["François Müller"],
      ["Francois Muller"]
    );
    expect(result.details![0].last_match).toBe(true);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
