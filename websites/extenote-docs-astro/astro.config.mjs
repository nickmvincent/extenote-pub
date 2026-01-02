import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const BASE_PATH = '/extenote';

// Rehype plugin to prepend base path to image src attributes
function rehypeBaseImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src;
        // Only transform absolute paths that don't already have the base
        if (src.startsWith('/') && !src.startsWith(BASE_PATH)) {
          node.properties.src = BASE_PATH + src;
        }
      }
    });
  };
}

export default defineConfig({
  site: 'https://nickmvincent.github.io',
  base: BASE_PATH,
  srcDir: 'src',
  experimental: {
    contentLayer: true,
  },
  markdown: {
    rehypePlugins: [rehypeBaseImages],
  },
  vite: {
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
});
