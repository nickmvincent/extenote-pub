---
type: doc
title: "Author Name Parsing"
visibility: public
order: 22
generated: true
sourceTests:
  - packages/core/tests/check.test.ts
---

# Author Name Parsing

Academic papers use different author name formats: "Smith, John" (BibTeX style) vs "John Smith" (natural style). Extenote parses both formats to enable reliable matching.

## Step 1: parses 'Last, First' format

BibTeX typically uses "Last, First" format. The parser splits on the comma.

**Test:** `parses 'Last, First' format`
**File:** `packages/core/tests/check.test.ts:106`

```typescript
it("parses 'Last, First' format", () => {
    const result = parseAuthorName("Smith, John");
    expect(result.last).toBe("smith");
    expect(result.first).toBe("john");
  });
```

## Step 2: parses 'First Last' format

Natural format "First Last" is also supported. The last word is the surname.

**Test:** `parses 'First Last' format`
**File:** `packages/core/tests/check.test.ts:122`

```typescript
it("parses 'First Last' format", () => {
    const result = parseAuthorName("John Smith");
    expect(result.first).toBe("john");
    expect(result.last).toBe("smith");
  });
```

## Step 3: parses 'First Middle Last' format

Middle names are included with the first name. "John David Smith" parses as first="john david", last="smith".

**Test:** `parses 'First Middle Last' format`
**File:** `packages/core/tests/check.test.ts:133`

```typescript
it("parses 'First Middle Last' format", () => {
    const result = parseAuthorName("John David Smith");
    expect(result.first).toBe("john david");
    expect(result.last).toBe("smith");
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
