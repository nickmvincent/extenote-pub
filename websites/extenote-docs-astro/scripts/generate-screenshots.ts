#!/usr/bin/env bun
/**
 * Generate screenshots for documentation by running integration tests.
 *
 * This script:
 * 1. Starts the extenote web server
 * 2. Runs integration tests (which capture screenshots)
 * 3. Copies screenshots to public/screenshots
 * 4. Stops the web server
 *
 * Run with: bun run scripts/generate-screenshots.ts
 */

import { spawn, type Subprocess } from "bun";
import { cp, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = join(__dirname, "..");
const EXTENOTE_ROOT = join(DOCS_ROOT, "..", "..", "..", "extenote");
const SCREENSHOTS_SRC = join(EXTENOTE_ROOT, "packages", "web", "tests", "screenshots");
const SCREENSHOTS_DEST = join(DOCS_ROOT, "public", "screenshots");

async function waitForServer(url: string, maxAttempts = 30): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(1000)
      });
      if (response.ok || response.status < 500) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.stdout.write(".");
  }
  return false;
}

async function main() {
  console.log("📸 Generating documentation screenshots...\n");

  // Check if extenote is built
  const cliPath = join(EXTENOTE_ROOT, "packages", "cli", "dist", "index.js");
  const cliExists = await Bun.file(cliPath).exists();
  if (!cliExists) {
    console.log("⚠️  Extenote not built. Run 'bun run build' in extenote/ first.");
    console.log("   Skipping screenshot generation.\n");
    return;
  }

  // Start web server
  console.log("🚀 Starting web server...");
  const serverProc = spawn({
    cmd: ["bun", "run", "web"],
    cwd: EXTENOTE_ROOT,
    stdout: "ignore",
    stderr: "ignore",
  });

  try {
    // Wait for server to be ready
    process.stdout.write("   Waiting for server");
    const serverReady = await waitForServer("http://localhost:3000");
    console.log();

    if (!serverReady) {
      console.log("❌ Server failed to start. Skipping screenshot generation.\n");
      return;
    }
    console.log("   Server ready!\n");

    // Run integration tests
    console.log("🧪 Running integration tests...");
    const testProc = spawn({
      cmd: ["bun", "test", "packages/web/tests/integration.test.ts"],
      cwd: EXTENOTE_ROOT,
      stdout: "inherit",
      stderr: "inherit",
    });

    const testExitCode = await testProc.exited;
    if (testExitCode !== 0) {
      console.log("\n⚠️  Some tests failed, but screenshots may still be usable.\n");
    } else {
      console.log("\n✅ Tests passed!\n");
    }

    // Copy screenshots
    console.log("📋 Copying screenshots to docs...");
    await mkdir(SCREENSHOTS_DEST, { recursive: true });

    const srcDir = await Bun.file(SCREENSHOTS_SRC).exists()
      ? SCREENSHOTS_SRC
      : join(EXTENOTE_ROOT, "packages", "web", "tests", "screenshots");

    // Use shell cp for simplicity
    const copyProc = spawn({
      cmd: ["cp", "-r", `${SCREENSHOTS_SRC}/.`, SCREENSHOTS_DEST],
      stdout: "inherit",
      stderr: "inherit",
    });
    await copyProc.exited;

    // Copy 16-refcheck.png to 16-check.png for docs compatibility
    const refcheckSrc = join(SCREENSHOTS_DEST, "16-refcheck.png");
    const checkDest = join(SCREENSHOTS_DEST, "16-check.png");
    if (await Bun.file(refcheckSrc).exists()) {
      await cp(refcheckSrc, checkDest);
    }

    console.log("   Screenshots copied to public/screenshots/\n");
    console.log("✅ Screenshot generation complete!\n");

  } finally {
    // Stop web server
    console.log("🛑 Stopping web server...");
    serverProc.kill();
    await serverProc.exited;
    console.log("   Done.\n");
  }
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
