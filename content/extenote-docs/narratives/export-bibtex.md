---
type: doc
title: "BibTeX Export"
visibility: public
order: 23
generated: true
sourceTests:
  - packages/core/tests/bibtex.test.ts
---

# BibTeX Export

Export your bibliography entries to standard BibTeX format for use with LaTeX, citation managers, and other academic tools. Extenote converts your markdown frontmatter into properly formatted .bib entries.

## Step 1: creates references.bib file

The exporter creates a references.bib file containing all your bibtex_entry objects. Each entry includes standard BibTeX fields like title, author, and year.

**Test:** `creates references.bib file`
**File:** `packages/core/tests/bibtex.test.ts:70`

```typescript
it("creates references.bib file", async () => {
    const outputDir = path.join(tmpDir, "basic-output");
    const object = buildBibtexObject({
      id: "smith2024",
      frontmatter: {
        entry_type: "article",
        citation_key: "smith2024",
        title: "A Test Article",
        authors: ["John Smith"],
        year: 2024,
      },
    });

    const options: ExportOptions = {
      format: "bibtex",
      outputDir,
      objects: [object],
      config: baseConfig,
      schemas: [baseSchema],
    };

    const result = await exportBibtex(options);

    expect(result.format).toBe("bibtex");
    expect(result.files.length).toBe(1);
    expect(result.files[0]).toContain("references.bib");

    const content = await fs.readFile(result.files[0], "utf8");
    expect(content).toContain("@article{smith2024");
    expect(content).toContain("title = {A Test Article}");
    expect(content).toContain("author = {John Smith}");
    expect(content).toContain("year = {2024}");
  });

  /**
   * @narrative-step 2
   * @explanation Only objects with type "bibtex_entry" are exported. Other content
   * types like notes or blog posts are automatically filtered out.
   */
  it("filters to only bibtex_entry type objects", async () => {
    const outputDir = path.join(tmpDir, "filter-output");
    const bibObject = buildBibtexObject({
      id: "bib-entry",
      frontmatter: { title: "BibTeX Entry" },
    });
    const noteObject: VaultObject = {
      id: "note-entry",
      type: "note",
      sourceId: "local",
      project: "default",
```

## Step 2: filters to only bibtex_entry type objects

Only objects with type "bibtex_entry" are exported. Other content types like notes or blog posts are automatically filtered out.

**Test:** `filters to only bibtex_entry type objects`
**File:** `packages/core/tests/bibtex.test.ts:109`

```typescript
it("filters to only bibtex_entry type objects", async () => {
    const outputDir = path.join(tmpDir, "filter-output");
    const bibObject = buildBibtexObject({
      id: "bib-entry",
      frontmatter: { title: "BibTeX Entry" },
    });
    const noteObject: VaultObject = {
      id: "note-entry",
      type: "note",
      sourceId: "local",
      project: "default",
      filePath: "/tmp/note.md",
      relativePath: "note.md",
      frontmatter: { type: "note", title: "A Note" },
      body: "",
      mtime: Date.now(),
      visibility: "public",
    };

    const options: ExportOptions = {
      format: "bibtex",
      outputDir,
      objects: [bibObject, noteObject],
      config: baseConfig,
      schemas: [baseSchema],
    };

    const result = await exportBibtex(options);
    const content = await fs.readFile(result.files[0], "utf8");

    expect(content).toContain("bib-entry");
    expect(content).not.toContain("note-entry");
    expect(content).not.toContain("A Note");
  });
```

## Step 3: exports article with journal field

The "venue" field in your frontmatter is mapped to the appropriate BibTeX field: "journal" for articles, "booktitle" for conference papers.

**Test:** `exports article with journal field`
**File:** `packages/core/tests/bibtex.test.ts:149`

```typescript
it("exports article with journal field", async () => {
    const outputDir = path.join(tmpDir, "article-journal");
    const object = buildBibtexObject({
      id: "article1",
      frontmatter: {
        entry_type: "article",
        title: "Journal Article",
        venue: "Nature",
        year: 2023,
      },
    });

    const result = await exportBibtex({
      format: "bibtex",
      outputDir,
      objects: [object],
      config: baseConfig,
      schemas: [baseSchema],
    });

    const content = await fs.readFile(result.files[0], "utf8");
    expect(content).toContain("@article{");
    expect(content).toContain("journal = {Nature}");
  });

  it("exports inproceedings with booktitle field", async () => {
    const outputDir = path.join(tmpDir, "inproceedings");
    const object = buildBibtexObject({
      id: "conf1",
      frontmatter: {
        entry_type: "inproceedings",
        title: "Conference Paper",
        venue: "ICML 2024",
        year: 2024,
      },
    });

    const result = await exportBibtex({
      format: "bibtex",
      outputDir,
      objects: [object],
      config: baseConfig,
      schemas: [baseSchema],
    });

    const content = await fs.readFile(result.files[0], "utf8");
    expect(content).toContain("@inproceedings{");
    expect(content).toContain("booktitle = {ICML 2024}");
  });
```

## Step 4: formats multiple authors with 'and' separator

Author lists are automatically formatted with "and" separators as required by BibTeX. You can list authors as an array in your frontmatter.

**Test:** `formats multiple authors with 'and' separator`
**File:** `packages/core/tests/bibtex.test.ts:204`

```typescript
it("formats multiple authors with 'and' separator", async () => {
    const outputDir = path.join(tmpDir, "multi-author");
    const object = buildBibtexObject({
      id: "multi",
      frontmatter: {
        entry_type: "article",
        title: "Collaborative Work",
        authors: ["Alice Smith", "Bob Jones", "Carol White"],
      },
    });

    const result = await exportBibtex({
      format: "bibtex",
      outputDir,
      objects: [object],
      config: baseConfig,
      schemas: [baseSchema],
    });

    const content = await fs.readFile(result.files[0], "utf8");
    expect(content).toContain("author = {Alice Smith and Bob Jones and Carol White}");
  });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
