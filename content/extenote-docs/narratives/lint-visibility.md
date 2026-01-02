---
type: doc
title: "Content Linting"
visibility: public
order: 25
generated: true
sourceTests:
  - packages/core/tests/lint.test.ts
---

# Content Linting

Extenote validates your content against configurable rules. The linter checks for issues like missing required fields and reports them with configurable severity.

## Step 1: reports missing visibility when rule enabled

The "required-visibility" rule ensures all content has a visibility field (public, private, or unlisted). Missing visibility is reported as an issue.

**Test:** `reports missing visibility when rule enabled`
**File:** `packages/core/tests/lint.test.ts:47`

```typescript
it("reports missing visibility when rule enabled", async () => {
    const objects = [buildObject({
      frontmatter: { type: "note" } // no visibility
    })];

    const result = await lintObjects(objects, baseConfig, { fix: false });
    expect(result.issues.length).toBe(1);
    expect(result.issues[0].message).toContain("Missing visibility");
    expect(result.issues[0].rule).toBe("required-visibility");
  });
```

## Step 2: respects rule set to off

Rules can be set to "off", "warn", or "error". Setting a rule to "off" disables it entirely - no issues will be reported even if content violates the rule.

**Test:** `respects rule set to off`
**File:** `packages/core/tests/lint.test.ts:72`

```typescript
it("respects rule set to off", async () => {
    const config: ExtenoteConfig = {
      ...baseConfig,
      lint: { rules: { "required-visibility": "off" } }
    };
    const objects = [buildObject({
      frontmatter: { type: "note" } // no visibility
    })];

    const result = await lintObjects(objects, config, { fix: false });
    expect(result.issues.length).toBe(0);
  });
```

## Step 3: sets severity based on rule level

The rule level determines severity. "warn" produces warnings (informational), while "error" produces errors (should be fixed before publishing).

**Test:** `sets severity based on rule level`
**File:** `packages/core/tests/lint.test.ts:90`

```typescript
it("sets severity based on rule level", async () => {
    const errorConfig: ExtenoteConfig = {
      ...baseConfig,
      lint: { rules: { "required-visibility": "error" } }
    };
    const objects = [buildObject({
      frontmatter: { type: "note" }
    })];

    const result = await lintObjects(objects, errorConfig, { fix: false });
    expect(result.issues[0].severity).toBe("error");
  });
```

## Step 4: uses project profile lint rules when available

Project profiles can override global lint rules. This allows different projects to have different requirements - a blog might require visibility while personal notes might not.

**Test:** `uses project profile lint rules when available`
**File:** `packages/core/tests/lint.test.ts:109`

```typescript
it("uses project profile lint rules when available", async () => {
    const config: ExtenoteConfig = {
      ...baseConfig,
      lint: { rules: { "required-visibility": "warn" } },
      projectProfiles: [
        {
          name: "my-project",
          lint: { rules: { "required-visibility": "off" } }
        }
      ]
    };
    const objects = [buildObject({
      relativePath: "my-project/note.md",
      frontmatter: { type: "note" }
    })];

    const result = await lintObjects(objects, config, { fix: false });
    expect(result.issues.length).toBe(0); // profile overrides to off
  });
```

## Step 5: checks compatibility required fields

Compatibility rules check that content meets requirements for target platforms like Astro or Quarto. Required fields for each platform are validated.

**Test:** `checks compatibility required fields`
**File:** `packages/core/tests/lint.test.ts:156`

```typescript
it("checks compatibility required fields", async () => {
    const config: ExtenoteConfig = {
      ...baseConfig,
      projectProfiles: [
        {
          name: "website",
          lint: { rules: { "compatibility:astro": "warn" } },
          compatibility: {
            astro: {
              requiredFields: ["slug", "description"]
            }
          }
        }
      ]
    };
    const objects = [buildObject({
      relativePath: "website/article.md",
      frontmatter: { type: "note", visibility: "public", slug: "my-article" } // missing description
    })];

    const result = await lintObjects(objects, config, { fix: false });
    expect(result.issues.some(i => i.message.includes("description is required for astro"))).toBe(true);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
