import { loadInitiatives } from '../../lib/content-loader';

export async function GET() {
  const items = (await loadInitiatives()).sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  return new Response(JSON.stringify({ count: items.length, items }, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
