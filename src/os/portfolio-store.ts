import seed from '../data/seed.json';

export const PORTFOLIO_KEY = 'zak.portfolio.v2';
export const DRAFT_KEY = 'zak.portfolio.draft.v2';
export const defaultPortfolio = seed;
export function safeLink(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  if (/^\/(?!\/)/.test(value)) return value;
  try { const url = new URL(value); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? value : undefined; } catch { return undefined; }
}
export function validPortfolio(data: any): boolean {
  return !!data && Array.isArray(data.tabs) && Array.isArray(data.projects) && !!data.config?.bio &&
    data.tabs.every((t: any) => t && typeof t.id === 'string' && typeof t.name === 'string') &&
    data.projects.every((p: any) => p && ['id', 'title', 'country', 'description', 'image'].every(k => typeof p[k] === 'string'));
}
export function cachedPortfolio() {
  try { const data = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || 'null'); if (validPortfolio(data)) return data; } catch { /* Use seeded content when storage is unavailable. */ }
  return defaultPortfolio;
}
export function cachePortfolio(data: unknown) {
  let stored = true;
  try { localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(data)); } catch { stored = false; }
  window.dispatchEvent(new CustomEvent('zak:portfolio', { detail: data }));
  return stored;
}
export async function fetchPortfolio(signal?: AbortSignal) {
  const response = await fetch('/api/portfolio-data', { signal, cache: 'no-store' });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Publishing service unavailable');
  const data = await response.json();
  if (!validPortfolio(data)) throw new Error('Invalid portfolio response');
  return data;
}
