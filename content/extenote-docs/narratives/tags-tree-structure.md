---
type: doc
title: "Building the Tag Tree"
visibility: public
order: 24
generated: true
sourceTests:
  - packages/core/tests/tags.test.ts
---

# Building the Tag Tree

Extenote organizes tags into a hierarchical tree. Simple tags like "research" become root nodes. Hierarchical tags like "collection:papers" create nested structures where "collection" is the parent and "papers" is a child node.

## Step 1: returns empty tree for vault with no tagged objects

When no objects have tags, the tree is empty with zero counts.

**Test:** `returns empty tree for vault with no tagged objects`
**File:** `packages/core/tests/tags.test.ts:95`

```typescript
it("returns empty tree for vault with no tagged objects", () => {
    const vault = buildVault([
      buildObject({ frontmatter: {} }),
      buildObject({ id: "obj2", frontmatter: { title: "No tags" } }),
    ]);

    const tree = buildTagTree(vault);

    expect(tree.roots).toEqual([]);
    expect(tree.totalTags).toBe(0);
    expect(tree.totalTaggedObjects).toBe(0);
  });
```

## Step 2: builds flat tree for simple tags

Simple tags without colons become root-level nodes. Each node tracks how many objects use that tag. Here, "research" appears in 2 objects, "ml" in 1.

**Test:** `builds flat tree for simple tags`
**File:** `packages/core/tests/tags.test.ts:113`

```typescript
it("builds flat tree for simple tags", () => {
    const vault = buildVault([
      buildObject({
        id: "obj1",
        relativePath: "obj1.md",
        frontmatter: { tags: ["research"] },
      }),
      buildObject({
        id: "obj2",
        relativePath: "obj2.md",
        frontmatter: { tags: ["research", "ml"] },
      }),
    ]);

    const tree = buildTagTree(vault);

    expect(tree.totalTags).toBe(2);
    expect(tree.totalTaggedObjects).toBe(2);
    expect(tree.roots.length).toBe(2);

    const mlRoot = tree.roots.find((r) => r.name === "ml");
    expect(mlRoot).toBeDefined();
    expect(mlRoot!.count).toBe(1);
    expect(mlRoot!.children).toEqual([]);

    const researchRoot = tree.roots.find((r) => r.name === "research");
    expect(researchRoot).toBeDefined();
    expect(researchRoot!.count).toBe(2);
  });
```

## Step 3: builds hierarchical tree for colon-separated tags

Colon-separated tags like "collection:papers" create hierarchy. "collection" becomes a parent with "papers" and "data-leverage" as children. Parent counts are the sum of all children.

**Test:** `builds hierarchical tree for colon-separated tags`
**File:** `packages/core/tests/tags.test.ts:150`

```typescript
it("builds hierarchical tree for colon-separated tags", () => {
    const vault = buildVault([
      buildObject({
        id: "obj1",
        relativePath: "obj1.md",
        frontmatter: { tags: ["collection:data-leverage"] },
      }),
      buildObject({
        id: "obj2",
        relativePath: "obj2.md",
        frontmatter: { tags: ["collection:papers", "collection:data-leverage"] },
      }),
    ]);

    const tree = buildTagTree(vault);

    expect(tree.totalTags).toBe(2);
    expect(tree.roots.length).toBe(1);

    const collectionRoot = tree.roots[0];
    expect(collectionRoot.name).toBe("collection");
    expect(collectionRoot.children.length).toBe(2);
    expect(collectionRoot.count).toBe(3); // Sum of children counts

    const dataLeverageChild = collectionRoot.children.find((c) => c.name === "data-leverage");
    expect(dataLeverageChild).toBeDefined();
    expect(dataLeverageChild!.fullPath).toBe("collection:data-leverage");
    expect(dataLeverageChild!.count).toBe(2);
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
