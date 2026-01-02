import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

export default defineConfig({
  integrations: [preact()],
  srcDir: 'src',
  experimental: {
    contentLayer: true,
  },
  vite: {
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
});
