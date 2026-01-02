import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

export default defineConfig({
  site: 'https://nickmvincent.github.io',
  base: '/courses',
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
