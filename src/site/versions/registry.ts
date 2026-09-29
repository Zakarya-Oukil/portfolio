import { useEffect, useState } from 'react';

/**
 * Design versions under review. The switcher is a review tool: to ship one version, delete the others and
 * the VersionSwitcher, and return that version from getVersion().
 */
export type VersionId = 'casefile' | 'editorial' | 'swiss' | 'blueprint' | 'cinematic';

export const VERSIONS: { id: VersionId; name: string; note: string }[] = [
  { id: 'casefile', name: 'Case file', note: 'Dark dossier, printed portrait, redaction bars' },
  { id: 'editorial', name: 'Editorial', note: 'Light magazine profile, serif headlines, colour photography' },
  { id: 'swiss', name: 'Swiss poster', note: 'Black, white and one red, rigid grid, enormous type' },
  { id: 'blueprint', name: 'Blueprint', note: 'Engineering drawing sheet with annotated portrait' },
  { id: 'cinematic', name: 'Cinematic', note: 'Full-bleed photography and a pinned horizontal reel' }
];

const KEY = 'zak.version';
const EVENT = 'zak:version';
const ids = VERSIONS.map(v => v.id);

const fromParam = (): VersionId | null => {
  const raw = new URLSearchParams(window.location.search).get('v');
  if (!raw) return null;
  const byNumber = VERSIONS[Number(raw) - 1]?.id;
  return byNumber || (ids.includes(raw as VersionId) ? (raw as VersionId) : null);
};

export function getVersion(): VersionId {
  const fromUrl = fromParam();
  if (fromUrl) return fromUrl;
  try { const stored = window.localStorage.getItem(KEY); if (stored && ids.includes(stored as VersionId)) return stored as VersionId; } catch { /* storage is optional */ }
  return 'casefile';
}

export function setVersion(id: VersionId) {
  try { window.localStorage.setItem(KEY, id); } catch { /* storage is optional */ }
  const url = new URL(window.location.href);
  url.searchParams.set('v', String(ids.indexOf(id) + 1));
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event(EVENT));
}

export function useVersion(): VersionId {
  const [version, setLocal] = useState<VersionId>(() => getVersion());
  useEffect(() => {
    const sync = () => setLocal(getVersion());
    window.addEventListener(EVENT, sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('popstate', sync); };
  }, []);
  return version;
}
