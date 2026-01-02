---
type: doc
title: "Schema Validation Basics"
visibility: public
order: 29
generated: true
sourceTests:
  - packages/core/tests/validation.test.ts
---

# Schema Validation Basics

Learn how Extenote validates objects against their schemas. Every markdown file must declare a type that matches a defined schema, and required fields must be present.

Validation failures are recorded as issues and appear in the CLI `extenote issues` output and the Web UI Issues view.

## Step 1: flags missing required fields

Schemas can mark fields as required. If a required field is missing from the frontmatter, validation fails with an error. In this example, the schema requires a "title" field.

**Test:** `flags missing required fields`
**File:** `packages/core/tests/validation.test.ts:65`

```typescript
it("flags missing required fields", () => {
    const object = buildObject({
      frontmatter: { type: "demo_note", tags: [1] }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.length).toBeGreaterThan(0);
    expect(results[0].issues.some(i => i.message.includes("Missing required field"))).toBe(true);
  });
```

## Step 2: flags unknown schema

Each object must have a type that matches a known schema. If the type in frontmatter doesn't match any schema definition, validation fails with an error.

**Test:** `flags unknown schema`
**File:** `packages/core/tests/validation.test.ts:97`

```typescript
it("flags unknown schema", () => {
    const object = buildObject({
      type: "unknown_type",
      frontmatter: { type: "unknown_type" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.message.includes("Unknown schema"))).toBe(true);
    expect(results[0].issues[0].severity).toBe("error");
  });
```

## Step 3: validates string type

String fields must contain text values. Numbers, booleans, or other types in a string field will be rejected.

**Test:** `validates string type`
**File:** `packages/core/tests/validation.test.ts:113`

```typescript
it("validates string type", () => {
    const object = buildObject({
      frontmatter: { title: 123, visibility: "private" } // title should be string
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "title" && i.message.includes("should be string"))).toBe(true);
  });
```

## Step 4: validates number type

Number fields require numeric values. Strings containing digits (like "42") are not automatically converted - they must be actual numbers.

**Test:** `validates number type`
**File:** `packages/core/tests/validation.test.ts:127`

```typescript
it("validates number type", () => {
    const object = buildObject({
      frontmatter: { title: "Test", count: "not a number", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "count" && i.message.includes("should be number"))).toBe(true);
  });
```

## Step 5: validates boolean type

Boolean fields must be true or false. Strings like "yes", "no", or "true" are not accepted - YAML will parse unquoted true/false as booleans.

**Test:** `validates boolean type`
**File:** `packages/core/tests/validation.test.ts:141`

```typescript
it("validates boolean type", () => {
    const object = buildObject({
      frontmatter: { title: "Test", published: "yes", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "published" && i.message.includes("should be boolean"))).toBe(true);
  });
```

## Step 6: validates date type with valid ISO string

Date fields accept ISO 8601 format strings (like "2024-01-15") and Date objects parsed from YAML. The date must include at least a 4-digit year.

**Test:** `validates date type with valid ISO string`
**File:** `packages/core/tests/validation.test.ts:155`

```typescript
it("validates date type with valid ISO string", () => {
    const object = buildObject({
      frontmatter: { title: "Test", createdAt: "2024-01-15T10:30:00Z", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "createdAt")).toBe(false);
  });
```

## Step 7: validates date type rejects invalid date string

Random strings that don't look like dates are rejected.

**Test:** `validates date type rejects invalid date string`
**File:** `packages/core/tests/validation.test.ts:169`

```typescript
it("validates date type rejects invalid date string", () => {
    const object = buildObject({
      frontmatter: { title: "Test", createdAt: "not-a-date", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "createdAt" && i.message.includes("should be date"))).toBe(true);
  });
```

## Step 8: validates date type rejects month name without year

Month names alone (like "March") are rejected because they lack a year. This prevents JavaScript's Date.parse() from accepting ambiguous formats.

**Test:** `validates date type rejects month name without year`
**File:** `packages/core/tests/validation.test.ts:183`

```typescript
it("validates date type rejects month name without year", () => {
    const object = buildObject({
      frontmatter: { title: "Test", createdAt: "March", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "createdAt" && i.message.includes("should be date"))).toBe(true);
  });
```

## Step 9: validates date type accepts year-only string

Year-only strings like "2024" are valid - common for academic citations where only the publication year is known.

**Test:** `validates date type accepts year-only string`
**File:** `packages/core/tests/validation.test.ts:197`

```typescript
it("validates date type accepts year-only string", () => {
    const object = buildObject({
      frontmatter: { title: "Test", createdAt: "2024", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "createdAt")).toBe(false);
  });
```

## Step 10: validates array type

Array fields must be actual arrays (using YAML list syntax). A single string value won't be automatically wrapped in an array.

**Test:** `validates array type`
**File:** `packages/core/tests/validation.test.ts:229`

```typescript
it("validates array type", () => {
    const object = buildObject({
      frontmatter: { title: "Test", tags: "not-an-array", visibility: "private" }
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "tags" && i.message.includes("should be array"))).toBe(true);
  });
```

## Step 11: validates array item types

Arrays can have typed items. If the schema specifies items: string, each element must be a string. An array of numbers in a string array field fails.

**Test:** `validates array item types`
**File:** `packages/core/tests/validation.test.ts:243`

```typescript
it("validates array item types", () => {
    const object = buildObject({
      frontmatter: { title: "Test", tags: [1, 2, 3], visibility: "private" } // items should be strings
    });

    const results = validateObjects([object], config, [schema]);
    expect(results[0].issues.some(i => i.field === "tags" && i.message.includes("should be array"))).toBe(true);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
