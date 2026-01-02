---
type: doc
title: "Page-to-Bibliography Matching"
visibility: public
order: 32
generated: true
sourceTests:
  - packages/refcheck/tests/matcher.test.ts
---

# Page-to-Bibliography Matching

When you visit an academic paper online, Extenote checks if it's already in your bibliography. It tries multiple matching strategies: exact URL, DOI, arXiv ID, and finally title similarity. Each match type has a confidence score.

## Step 1: matches exact URL

The fastest match is by exact URL. If the page URL matches an entry's url field, that's a perfect match with 100% confidence.

**Test:** `matches exact URL`
**File:** `packages/refcheck/tests/matcher.test.ts:74`

```typescript
it("matches exact URL", () => {
    const result = matchPageToVault(
      "https://arxiv.org/abs/1706.03762",
      "Some Page Title",
      testEntries
    );

    expect(result).not.toBeNull();
    expect(result!.entry.id).toBe("attention2017");
    expect(result!.matchType).toBe("url");
    expect(result!.confidence).toBe(1.0);
  });
```

## Step 2: matches DOI in URL

DOIs are extracted from URLs like doi.org/10.xxxx or embedded in publisher URLs. DOI matches have 95% confidence since they're unique identifiers.

**Test:** `matches DOI in URL`
**File:** `packages/refcheck/tests/matcher.test.ts:131`

```typescript
it("matches DOI in URL", () => {
    const result = matchPageToVault(
      "https://doi.org/10.18653/v1/N19-1423",
      "Some Title",
      testEntries
    );

    expect(result).not.toBeNull();
    expect(result!.entry.id).toBe("bert2019");
    expect(result!.matchType).toBe("doi");
    expect(result!.confidence).toBe(0.95);
  });
```

## Step 3: matches arXiv abs URL

arXiv IDs are extracted from various URL formats: /abs/xxxx, /pdf/xxxx.pdf, and versioned URLs like /abs/xxxx.v3. All resolve to the same paper.

**Test:** `matches arXiv abs URL`
**File:** `packages/refcheck/tests/matcher.test.ts:188`

```typescript
it("matches arXiv abs URL", () => {
    const result = matchPageToVault(
      "https://arxiv.org/abs/2005.14165",
      "Some Title",
      testEntries
    );

    expect(result).not.toBeNull();
    expect(result!.entry.id).toBe("gpt3-2020");
    // URL match takes precedence over arXiv match since the entry has exact URL
    expect(result!.matchType).toBe("url");
    expect(result!.confidence).toBe(1.0);
  });
```

## Step 4: matches by title when URL doesn't match

When URL-based matching fails, Extenote falls back to title similarity. The page title is compared against all entry titles using fuzzy matching. Confidence depends on how closely the titles match.

**Test:** `matches by title when URL doesn't match`
**File:** `packages/refcheck/tests/matcher.test.ts:248`

```typescript
it("matches by title when URL doesn't match", () => {
    const result = matchPageToVault(
      "https://example.com/unknown",
      "Attention Is All You Need",
      testEntries
    );

    expect(result).not.toBeNull();
    expect(result!.entry.id).toBe("attention2017");
    expect(result!.matchType).toBe("title");
    expect(result!.confidence).toBeGreaterThan(0.85);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
