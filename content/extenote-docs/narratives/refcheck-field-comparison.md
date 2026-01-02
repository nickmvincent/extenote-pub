---
type: doc
title: "Reference Field Comparison"
visibility: public
order: 30
generated: true
sourceTests:
  - packages/refcheck/tests/compare.test.ts
---

# Reference Field Comparison

When verifying your bibliography against DBLP or OpenAlex, Extenote compares each field (title, authors, year, venue) individually. The comparison is fuzzy - it handles differences in case, punctuation, diacritics, and name formats.

## Step 1: matches identical titles

Titles are compared after normalizing case and whitespace. Identical titles match perfectly with no edit distance reported.

**Test:** `matches identical titles`
**File:** `packages/refcheck/tests/compare.test.ts:37`

```typescript
it("matches identical titles", () => {
    const result = compareTitle("Attention Is All You Need", "Attention Is All You Need");
    expect(result.match).toBe(true);
    expect(result.edit_distance).toBeUndefined();
  });
```

## Step 2: matches titles ignoring punctuation

Punctuation like colons and hyphens is ignored during comparison. This handles variations in how titles are formatted across different databases.

**Test:** `matches titles ignoring punctuation`
**File:** `packages/refcheck/tests/compare.test.ts:53`

```typescript
it("matches titles ignoring punctuation", () => {
    const result = compareTitle(
      "BERT: Pre-training of Deep Bidirectional Transformers",
      "BERT Pre-training of Deep Bidirectional Transformers"
    );
    expect(result.match).toBe(true);
  });
```

## Step 3: reports mismatch with edit distance for different titles

When titles don't match, the edit distance (Levenshtein) is reported so you can see how different they are. Small differences might indicate typos.

**Test:** `reports mismatch with edit distance for different titles`
**File:** `packages/refcheck/tests/compare.test.ts:66`

```typescript
it("reports mismatch with edit distance for different titles", () => {
    const result = compareTitle("Paper About Cats", "Paper About Dogs");
    expect(result.match).toBe(false);
    expect(result.edit_distance).toBeGreaterThan(0);
  });
```

## Step 4: matches titles with diacritics

Diacritics (accents) are normalized so "Café" matches "Cafe". This is essential for international author names and venues.

**Test:** `matches titles with diacritics`
**File:** `packages/refcheck/tests/compare.test.ts:104`

```typescript
it("matches titles with diacritics", () => {
    const result = compareTitle("Café-Résumé Analysis", "Cafe-Resume Analysis");
    expect(result.match).toBe(true);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
