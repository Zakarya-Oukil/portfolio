import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { detectInitialOS } from '../utils/deviceDetection';
import { PROJECTS, CATEGORIES } from './projects-data';
import { cachedPortfolio, cachePortfolio, fetchPortfolio, PORTFOLIO_KEY, validPortfolio } from './portfolio-store';
import { configureAudio, playSound } from './audio';

export type Mode = 'macos' | 'ios' | 'android';
export type Theme = 'dark' | 'light' | 'oled';
export type AppId = 'projects' | 'terminal' | 'settings' | 'mail' | 'about' | 'dossier' | 'flagships' | 'quickstart' | 'defense';
export type Wallpaper = 'sonoma' | 'sequoia' | 'neon' | 'oled';

export interface PortfolioTab {
  id: string;
  name: string;
  slogan: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface PortfolioProject {
  featured?: boolean;
  codeUrl?: string;
  demoUrl?: string;
  metrics?: { label: string; value: string; source: string; url?: string }[];
  architecture?: { id: string; label: string; detail: string }[];
  id: string;
  country: string;
  title: string;
  subtitle: string;
  location: string;
  tags?: string[];
  image: string;
  imageAlt?: string;
  duration: string;
  distance: string;
  likes?: number;
  saves?: number;
  views?: number;
  description: string;
}

export interface WidgetVisibility {
  about: boolean;
  certs: boolean;
  github: boolean;
  neofetch: boolean;
  telemetry: boolean;
  clock: boolean;
  notes: boolean;
}

export interface AboutWidgetData {
  avatar?: string;
  name: string;
  role: string;
  statusText: string;
  statusType: 'available' | 'busy' | 'open';
  location: string;
  specialties: string[];
  bio: string;
  resumeUrl?: string;
}

export interface CertItem {
  id: string;
  title: string;
  badge: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
  accent?: string;
}

export interface NeofetchData {
  os: string;
  host: string;
  kernel: string;
  shell: string;
  uptime: string;
  cipher: string;
  memory: string;
}

export interface WidgetsConfig {
  visibility: WidgetVisibility;
  about: AboutWidgetData;
  certs: CertItem[];
  neofetch: NeofetchData;
}

export const appNames: Record<AppId, string> = { projects: 'Projects', terminal: 'Terminal', settings: 'Settings', mail: 'Mail', about: 'About me', dossier: 'Executive Dossier', flagships: 'Flagship Projects', quickstart: 'Executive Terminal', defense: 'Cyber Defense Lab' };
export const apps: AppId[] = ['projects', 'terminal', 'settings', 'mail', 'about'];
export const modeNames: Record<Mode, string> = { macos: 'macOS 27', ios: 'iPhone 16 Pro Max', android: 'Android 15' };

export function readSaved<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
export function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled in private browsing. */ }
}
export function useSaved<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readSaved(key, initial));
  useEffect(() => save(key, value), [key, value]);
  return [value, setValue] as const;
}

export type WindowState = { id: AppId; minimized: boolean; maximized: boolean; x: number; y: number; z: number };

function useSystem() {
  const initialMode = (() => {
    const detected = detectInitialOS();
    return detected === 'desktop' ? 'macos' : detected;
  })();

  const [mode, setModeState] = useSaved<Mode>('zak.mode', initialMode);
  const [theme, setTheme] = useSaved<Theme>('zak.theme', cachedPortfolio().config.defaultTheme as Theme);
  const [wallpaper, setWallpaper] = useSaved<Wallpaper>('zak.wallpaper', cachedPortfolio().config.defaultWallpaper as Wallpaper);
  const [windows, setWindows] = useState<WindowState[]>([{ id: 'projects', minimized: false, maximized: false, x: 0, y: 0, z: 1 }]);
  const [active, setActive] = useState<AppId | null>(mode === 'macos' ? 'projects' : null);
  const [history, setHistory] = useState<AppId[]>([]);
  const [shade, setShade] = useState(false);
  const [recents, setRecents] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [toast, setToast] = useState('');
  const [time, setTime] = useState(new Date());
  const [brightness, setBrightness] = useSaved('zak.brightness', 100);
  const [volume, setVolume] = useSaved('zak.volume', 65);
  const [soundOn, setSoundOn] = useSaved('zak.sound', false);
  const [brief, setBrief] = useState(false);
  const [transition, setTransition] = useState<{ from: Mode; to: Mode } | null>(null);
  const previousWindows = useRef<WindowState[]>([]);
  const previousActive = useRef<AppId | null>(null);
  useEffect(() => configureAudio(soundOn, volume), [soundOn, volume]);
  const toggleSound = () => { configureAudio(!soundOn, volume); setSoundOn(!soundOn); if (!soundOn) playSound('startup'); };
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Wi-Fi': true, Bluetooth: true, Cellular: true, AirDrop: false, 'Do Not Disturb': false, Flashlight: false, 'Auto-Rotate': true, 'Low Power': false
  });
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  
  // OS Welcome / Boot sequence state
  const [booting, setBooting] = useState<Mode | null>(() => {
    try {
      if (!sessionStorage.getItem('zak.booted')) {
        sessionStorage.setItem('zak.booted', '1');
        return initialMode;
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Dynamic CMS data with immediate fallback
  const [tabs, setTabs] = useState<PortfolioTab[]>(() => {
    const defaultSlogans = [
      'ZERO-TRUST & REVERSE ENGINEERING',
      'HIGH-CONCURRENCY & AGENTIC INTERFACES',
      'LOW-LEVEL KERNEL & HARDWARE INTERACTION',
      'ADVERSARIAL ML & RESILIENT ORCHESTRATION'
    ];
    return CATEGORIES.map((c, i) => ({
      id: c,
      name: c,
      slogan: defaultSlogans[i] || 'SYSTEMS ARCHITECTURE & SECURITY',
      title: c,
      subtitle: '',
      icon: ['shield', 'code', 'chip', 'cloud'][i] || 'code'
    }));
  });

  const [projects, setProjects] = useState<PortfolioProject[]>(() => cachedPortfolio().projects);
  const [config, setConfig] = useState<any>(() => cachedPortfolio().config);

  const z = useRef(2);

  // Sync with /api/portfolio-data
  useEffect(() => {
    const apply = (data: any) => { if (validPortfolio(data)) { setTabs(data.tabs); setProjects(data.projects); setConfig(data.config); } };
    apply(cachedPortfolio());
    const controller = new AbortController();
    let revision = 0;
    const refresh = async () => { const started = revision; if (cachedPortfolio()._localOnly) return; try { const data = await fetchPortfolio(controller.signal); if (started === revision && !controller.signal.aborted) cachePortfolio(data); } catch { /* Cached public content remains available offline. */ } };
    const local = (event: Event) => { revision++; apply((event as CustomEvent).detail); };
    const storage = (event: StorageEvent) => { if (event.key === PORTFOLIO_KEY) { revision++; apply(cachedPortfolio()); } };
    window.addEventListener('zak:portfolio', local); window.addEventListener('storage', storage); window.addEventListener('focus', refresh);
    void refresh(); const timer = setInterval(refresh, 60000);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('zak:portfolio', local); window.removeEventListener('storage', storage); window.removeEventListener('focus', refresh); };
  }, []);

  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 3500); return () => clearTimeout(id); }, [toast]);

  useEffect(() => {
    let cleanup = () => {}; let disposed = false;
    (navigator as any).getBattery?.().then((b: any) => {
      if (disposed) return;
      const sync = () => setBattery({ level: Math.round(b.level * 100), charging: b.charging });
      sync();
      b.addEventListener('levelchange', sync);
      b.addEventListener('chargingchange', sync);
      cleanup = () => {
        b.removeEventListener('levelchange', sync);
        b.removeEventListener('chargingchange', sync);
      };
    }).catch(() => {});
    return () => { disposed = true; cleanup(); };
  }, []);

  const open = (id: AppId) => {
    playSound(id === 'defense' ? 'alert' : 'tap');
    if (active && active !== id) setHistory(h => [...h, active]);
    setActive(id);
    setRecents(false);
    setShade(false);
    setSpotlight(false);
    const nextZ = ++z.current;
    setWindows(ws => ws.some(w => w.id === id)
      ? ws.map(w => w.id === id ? { ...w, minimized: false, z: nextZ } : w)
      : [...ws, { id, minimized: false, maximized: false, x: id === 'defense' ? 0 : Math.min(ws.length * 28, 100), y: id === 'defense' ? 0 : Math.min(ws.length * 24, 80), z: nextZ }]
    );
  };

  const home = () => {
    setActive(null);
    setHistory([]);
    setShade(false);
    setRecents(false);
    window.dispatchEvent(new Event('zak:home'));
  };

  const close = (id: AppId) => {
    setWindows(ws => ws.filter(w => w.id !== id));
    if (active === id) {
      setActive(mode === 'macos' ? windows.filter(w => w.id !== id && !w.minimized).sort((a, b) => b.z - a.z)[0]?.id || null : null);
    }
  };

  const minimize = (id: AppId) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true } : w));
    if (active === id) {
      setActive(windows.filter(w => w.id !== id && !w.minimized).sort((a, b) => b.z - a.z)[0]?.id || null);
    }
  };

  const updateWindow = (id: AppId, update: Partial<WindowState>) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, ...update } : w));
  };

  const focus = (id: AppId) => {
    setActive(id);
    updateWindow(id, { z: ++z.current });
  };

  const back = () => {
    if (shade) { setShade(false); return; }
    if (recents) { setRecents(false); return; }
    const event = new CustomEvent('zak:back', { cancelable: true });
    if (!window.dispatchEvent(event)) return;
    setActive(history.at(-1) || null);
    setHistory(h => h.slice(0, -1));
  };

  const setMode = (next: Mode) => {
    if (next === mode) return;
    if (brief) endBrief();
    playSound('hardware');
    setTransition({ from: mode, to: next });
    setModeState(next);
    home();
    setBooting(null);
    if (next === 'macos') {
      setActive(windows.filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id || null);
    }
  };

  const startBrief = () => {
    setBooting(null); setSpotlight(false); setShade(false); setSleeping(false);
    if (!brief) { previousWindows.current = windows; previousActive.current = active; }
    setBrief(true); playSound('tap');
    const ids: AppId[] = ['dossier', 'flagships', 'quickstart'];
    setWindows(ws => [...ws.filter(w => !ids.includes(w.id)).map(w => ({ ...w, minimized: true })), ...ids.map(id => ({ id, minimized: false, maximized: false, x: 0, y: 0, z: ++z.current }))]);
    setActive('dossier');
  };
  const endBrief = () => { setBrief(false); setWindows(previousWindows.current); setActive(previousActive.current); };

  return {
    mode,
    setMode,
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    windows,
    active,
    open,
    close,
    minimize,
    home,
    back,
    focus,
    updateWindow,
    shade,
    setShade,
    recents,
    setRecents,
    spotlight,
    setSpotlight,
    sleeping,
    setSleeping,
    toast,
    notify: setToast,
    time,
    brightness,
    setBrightness,
    volume,
    setVolume,
    soundOn, toggleSound, brief, startBrief, endBrief, transition, setTransition,
    toggles,
    setToggles,
    battery,
    booting,
    setBooting,
    tabs,
    projects,
    config
  };
}

const SystemContext = createContext<ReturnType<typeof useSystem>>(null!);
export function SystemProvider({ children }: { children: React.ReactNode }) {
  const system = useSystem();
  return <SystemContext.Provider value={system}>{children}</SystemContext.Provider>;
}
export function useSystemContext() {
  return useContext(SystemContext);
}
