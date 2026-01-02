import { promises as fs } from 'node:fs';
import { join, resolve } from 'node:path';

import { parseFrontmatter, slugFromFilename } from '../../../../helpers/markdown';
import { loadReferences } from '../../../../helpers/shared-references';

const DEFAULT_CONTENT_DIR =
  process.env.DATA_LICENSES_CONTENT_DIR ||
  // Default to monorepo layout: websites/data-licenses -> ../../content/data-licenses
  resolve(process.cwd(), '../../content/data-licenses');

function coerceDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? undefined : d;
}

async function ensureContentRoot(): Promise<string> {
  const target = resolve(DEFAULT_CONTENT_DIR);
  try {
    await fs.access(target);
    return target;
  } catch (err) {
    const msg = [
      'Could not find external content directory.',
      `Expected at: ${target}`,
      'Set DATA_LICENSES_CONTENT_DIR to override this path.',
    ].join(' ');
    throw new Error(msg);
  }
}

export async function loadInitiatives() {
  const root = await ensureContentRoot();
  const dir = join(root, 'initiatives');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.md'));
  const allReferences = await loadReferences();

  const items = [];
  for (const file of files) {
    const raw = await fs.readFile(join(dir, file), 'utf8');
    const { data } = parseFrontmatter(raw);

    if (data?.visibility && data.visibility !== 'public') continue;
    if (data?.type && data.type !== 'data_license_initiative') continue;

    const referenceKeys = Array.isArray(data?.references)
      ? data.references.filter((k) => typeof k === 'string')
      : [];
    const resolvedReferences = referenceKeys
      .map((key) => allReferences.get(key))
      .filter(Boolean);

    const slug = slugFromFilename(file);
    items.push({
      id: data.id || slug,
      slug,
      ...data,
      references: referenceKeys,
      referencesResolved: resolvedReferences,
      recentActivity: coerceDate(data?.recentActivity),
      lastUpdated: coerceDate(data?.lastUpdated),
    });
  }

  return items;
}

export async function loadMemo(slug = 'memo') {
  const root = await ensureContentRoot();
  const filePath = join(root, 'memos', `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, body } = parseFrontmatter(raw);

  if (data?.visibility && data.visibility !== 'public') {
    throw new Error(`Memo ${slug} is not marked public (visibility: ${data.visibility})`);
  }
  if (data?.type && data.type !== 'data_license_memo') {
    throw new Error(`Memo ${slug} has unexpected type: ${data.type}`);
  }

  return { slug, frontmatter: data, body };
}

export async function loadContentMeta() {
  const root = await ensureContentRoot();
  return { root };
}

export { loadReferences, loadReferencesByKeys, formatCitation } from '../../../../helpers/shared-references';
