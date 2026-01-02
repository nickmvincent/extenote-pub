---
type: doc
title: "Backup and Undo System"
visibility: public
order: 33
generated: true
sourceTests:
  - packages/cli/tests/backup.test.ts
---

# Backup and Undo System

Every destructive operation in Extenote (tag renames, deletes, merges) creates a backup first. You can undo any operation with a single command, restoring your files to their previous state.

**Note:** Backup/undo is still lightly tested. Keep version control and verify restores before relying on it.

## Step 1: creates a backup of specified files

Before modifying files, Extenote saves their current contents. The backup includes metadata about what operation was performed.

**Test:** `creates a backup of specified files`
**File:** `packages/cli/tests/backup.test.ts:36`

```typescript
it("creates a backup of specified files", async () => {
      // Create test files
      const file1 = path.join(tempDir, "file1.md");
      const file2 = path.join(tempDir, "file2.md");
      await fs.writeFile(file1, "content 1");
      await fs.writeFile(file2, "content 2");

      const backupId = await createBackup(tempDir, "test operation", [
        file1,
        file2,
      ]);

      expect(backupId).toBeDefined();
      expect(typeof backupId).toBe("string");

      const backups = await listBackups(tempDir);
      expect(backups.length).toBe(1);
      expect(backups[0].operation).toBe("test operation");
      expect(backups[0].files.length).toBe(2);
    });
```

## Step 2: restores files from the last backup

Running "extenote undo" restores files from the most recent backup. The original content is written back, and the backup is consumed (removed).

**Test:** `restores files from the last backup`
**File:** `packages/cli/tests/backup.test.ts:94`

```typescript
it("restores files from the last backup", async () => {
      const file = path.join(tempDir, "test.md");
      await fs.writeFile(file, "original content");

      await createBackup(tempDir, "test", [file]);

      // Modify the file
      await fs.writeFile(file, "modified content");

      const result = await undoLastOperation(tempDir);

      expect(result.success).toBe(true);
      expect(result.filesRestored).toBe(1);

      const restored = await fs.readFile(file, "utf8");
      expect(restored).toBe("original content");
    });
```

## Step 3: handles multiple backups correctly (LIFO order)

Multiple operations create stacked backups. Undo works in LIFO (last-in-first-out) order: each undo reverts one operation, and you can keep undoing to go further back.

**Test:** `handles multiple backups correctly (LIFO order)`
**File:** `packages/cli/tests/backup.test.ts:140`

```typescript
it("handles multiple backups correctly (LIFO order)", async () => {
      const file = path.join(tempDir, "test.md");

      // First backup
      await fs.writeFile(file, "version 1");
      await createBackup(tempDir, "first", [file]);

      // Second backup
      await fs.writeFile(file, "version 2");
      await createBackup(tempDir, "second", [file]);

      // Current state
      await fs.writeFile(file, "version 3");

      // Undo last (second) backup
      await undoLastOperation(tempDir);
      expect(await fs.readFile(file, "utf8")).toBe("version 2");

      // Undo first backup
      await undoLastOperation(tempDir);
      expect(await fs.readFile(file, "utf8")).toBe("version 1");
    });
```

---

*This documentation is generated from test annotations. Edit the source test file to update.*
