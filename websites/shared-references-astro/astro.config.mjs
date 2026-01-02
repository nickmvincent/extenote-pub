// @ts-check
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
});
