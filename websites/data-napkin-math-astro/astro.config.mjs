// @ts-check
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

// https://astro.build/config
export default defineConfig({
  // Custom domain - served from root
  site: 'https://exploringai.org',
  integrations: [vue()],
  vite: {
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
});
