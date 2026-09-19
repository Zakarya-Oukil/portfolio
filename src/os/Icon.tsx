import React from 'react';
import { Mode, useSystemContext } from './state';

const paths: Record<string, React.ReactNode> = {
  projects: <><path d="M3 7h7l2 2h9v11H3z"/><path d="M3 7V4h7l2 3h8v2"/></>,
  terminal: <><path d="m5 7 5 5-5 5M13 17h6"/></>,
  settings: <><path d="m10 3-1 3-3 1-3 3 2 3-1 3 3 3 3-1 3 2 3-3 1-3 3-1-1-4-3-1-1-3z"/><circle cx="12" cy="12" r="3"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 7 9-7"/></>,
  about: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  wifi: <><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r=".7"/></>,
  battery: <><rect x="2" y="7" width="18" height="10" rx="3"/><path d="M23 10v4M5 10h12v4H5z"/></>,
  control: <><path d="M3 6h18M3 18h18"/><circle cx="8" cy="6" r="3" fill="currentColor"/><circle cx="16" cy="18" r="3" fill="currentColor"/></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  code: <><path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18"/></>,
  shield: <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z"/><path d="m8 12 3 3 5-6"/></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5m6-5v5M9 18v5m6-5v5M1 9h5m-5 6h5m12-6h5m-5 6h5M9 9h6v6H9z"/></>,
  cloud: <path d="M6 19a5 5 0 1 1 0-10 7 7 0 0 1 13-2 6 6 0 0 1-1 12z"/>,
  github: <><path d="M9 20c-5 2-5-3-7-3m15 6v-4c0-1-1-2-1-2 5-1 6-4 6-7 0-2-1-3-2-4 0-1 0-3-1-4-3 0-4 2-4 2-2-1-4-1-6 0 0 0-2-2-4-2-1 1-1 3-1 4-1 1-2 2-2 4 0 3 1 6 6 7 0 0-1 1-1 2v4"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></>,
  moon: <path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12z"/>,
  volume: <><path d="M3 9h4l5-4v14l-5-4H3zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
  bluetooth: <path d="m6 6 12 12-6 4V2l6 4L6 18"/>,
  bolt: <path d="m14 2-10 12h7l-1 8 10-12h-7z"/>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  bookmark: <path d="M6 3h12v19l-6-4-6 4z"/>,
  music: <><path d="M9 18V5l11-3v14M9 9l11-3"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></>,
  plus: <path d="M12 5v14m-7-7h14"/>,
  trash: <><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>,
  edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-8.5-8.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 9.5-9.5z"/>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
  refresh: <><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
  sparkles: <path d="m12 3 1.9 4.8L18.7 9l-4.8 1.9L12 15.7l-1.9-4.8L5.3 9l4.8-1.9L12 3zm6 13 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z"/>,
  palette: <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.8-.4-1.2 0-.9.8-1.7 1.7-1.7H17c2.8 0 5-2.2 5-5 0-5.5-4.5-9.3-10-9.3z"/></>,
};

export function Icon({ name, size = 20, ...rest }: { name: string; size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {paths[name] || paths.grid}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                        AUTHENTIC BESPOKE APP ICONS                         */
/* -------------------------------------------------------------------------- */

export function AuthenticProjectsIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="authentic-svg-icon">
      <defs>
        <linearGradient id="prj-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B4B88" />
          <stop offset="50%" stopColor="#082A52" />
          <stop offset="100%" stopColor="#04142B" />
        </linearGradient>
        <linearGradient id="prj-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0077FE" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="prj-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="prj-bracket" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
        <filter id="prj-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Base App Plate */}
      <rect width="100" height="100" rx="22.5" fill="url(#prj-bg)" />
      {/* Specular Edge Highlight */}
      <rect x="1" y="1" width="98" height="98" rx="21.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none" />
      {/* Blueprint Grid Lines */}
      <path d="M20 0v100M40 0v100M60 0v100M80 0v100M0 20h100M0 40h100M0 60h100M0 80h100" stroke="#0284C7" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="2 3" />
      {/* Golden Ratio Circular Guides */}
      <circle cx="50" cy="50" r="34" stroke="url(#prj-ring)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
      <circle cx="50" cy="50" r="22" stroke="url(#prj-ring)" strokeWidth="1.2" opacity="0.4" />
      <line x1="16" y1="84" x2="84" y2="16" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="0.8" />
      {/* Central 3D Blueprint Folder / Architecture Emblem */}
      <g filter="url(#prj-shadow)">
        <path d="M26 36C26 32.6863 28.6863 30 32 30H44L49 35H68C71.3137 35 74 37.6863 74 41V64C74 67.3137 71.3137 70 68 70H32C28.6863 70 26 67.3137 26 64V36Z" fill="url(#prj-glow)" />
        <path d="M26 40C26 36.6863 28.6863 34 32 34H68C71.3137 34 74 36.6863 74 40V64C74 67.3137 71.3137 70 68 70H32C28.6863 70 26 67.3137 26 64V40Z" fill="#0369A1" fillOpacity="0.6" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* Code Brackets on Folder Face */}
        <path d="M44 46L38 52L44 58" stroke="url(#prj-bracket)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M56 46L62 52L56 58" stroke="url(#prj-bracket)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="52" y1="45" x2="48" y2="59" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      {/* Top Gloss */}
      <path d="M0 22.5C0 10.0736 10.0736 0 22.5 0H77.5C89.9264 0 100 10.0736 100 22.5V36C65 42 35 30 0 46V22.5Z" fill="white" fillOpacity="0.08" />
    </svg>
  );
}

export function AuthenticTerminalIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="authentic-svg-icon">
      <defs>
        <linearGradient id="term-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E232A" />
          <stop offset="50%" stopColor="#12161C" />
          <stop offset="100%" stopColor="#0B0D11" />
        </linearGradient>
        <linearGradient id="term-header" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#323842" />
          <stop offset="100%" stopColor="#1E232B" />
        </linearGradient>
        <linearGradient id="term-prompt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="term-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.6" />
        </filter>
      </defs>
      {/* Body plate */}
      <rect width="100" height="100" rx="22.5" fill="url(#term-bg)" />
      <rect x="1" y="1" width="98" height="98" rx="21.5" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
      {/* Inner Terminal Window */}
      <rect x="10" y="12" width="80" height="76" rx="14" fill="#07090C" stroke="#262D37" strokeWidth="1" />
      {/* Window Header */}
      <path d="M10 26C10 19.3726 15.3726 14 22 14H78C84.6274 14 90 19.3726 90 26V30H10V26Z" fill="url(#term-header)" />
      {/* Traffic light dots */}
      <circle cx="21" cy="22" r="3" fill="#EF4444" />
      <circle cx="29" cy="22" r="3" fill="#F59E0B" />
      <circle cx="37" cy="22" r="3" fill="#10B981" />
      <rect x="52" y="20.5" width="28" height="3" rx="1.5" fill="#4B5563" opacity="0.5" />
      {/* Code / Command Prompt */}
      <g filter="url(#term-glow)">
        <path d="M23 44L34 52L23 60" stroke="url(#term-prompt)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Blinking Cursor Bar */}
        <rect x="40" y="58" width="13" height="3" rx="1.5" fill="#34D399" />
      </g>
      {/* Secondary command line hint */}
      <rect x="23" y="69" width="32" height="2" rx="1" fill="#10B981" opacity="0.3" />
      <rect x="59" y="69" width="15" height="2" rx="1" fill="#38BDF8" opacity="0.3" />
      {/* Top Gloss */}
      <path d="M0 22.5C0 10.0736 10.0736 0 22.5 0H77.5C89.9264 0 100 10.0736 100 22.5V36C65 42 35 30 0 46V22.5Z" fill="white" fillOpacity="0.08" />
    </svg>
  );
}

export function AuthenticSettingsIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="authentic-svg-icon">
      <defs>
        <linearGradient id="set-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A5568" />
          <stop offset="50%" stopColor="#2D3748" />
          <stop offset="100%" stopColor="#1A202C" />
        </linearGradient>
        <radialGradient id="set-gear-metal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="45%" stopColor="#CBD5E1" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </radialGradient>
        <radialGradient id="set-core-shade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="75%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <filter id="set-depth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Base Plate */}
      <rect width="100" height="100" rx="22.5" fill="url(#set-bg)" />
      <rect x="1" y="1" width="98" height="98" rx="21.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none" />
      {/* Precision Circular Grooves */}
      <circle cx="50" cy="50" r="41" stroke="#94A3B8" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="50" cy="50" r="36" stroke="#94A3B8" strokeOpacity="0.15" strokeWidth="0.8" />
      {/* Precision Metallic Gear */}
      <g filter="url(#set-depth)">
        <path
          d="M50 20C51.5 20 52.8 21.2 53 22.7L53.7 27.2C55.2 27.8 56.6 28.6 57.9 29.5L62.1 27.8C63.5 27.2 65.2 27.7 66 29L70 36C70.8 37.3 70.6 39 69.4 40.1L66.1 43.1C66.4 44.6 66.5 46.1 66.5 47.6C66.5 48.4 66.4 49.2 66.2 50L69.6 52.9C70.8 54 71 55.7 70.2 57L66.2 64C65.4 65.3 63.7 65.8 62.3 65.2L58.1 63.5C56.8 64.4 55.4 65.2 53.9 65.8L53.2 70.3C53 71.8 51.7 73 50.2 73H42.2C40.7 73 39.4 71.8 39.2 70.3L38.5 65.8C37 65.2 35.6 64.4 34.3 63.5L30.1 65.2C28.7 65.8 27 65.3 26.2 64L22.2 57C21.4 55.7 21.6 54 22.8 52.9L26.1 49.9C25.8 48.4 25.7 46.9 25.7 45.4C25.7 44.6 25.8 43.8 26 43L22.6 40.1C21.4 39 21.2 37.3 22 36L26 29C26.8 27.7 28.5 27.2 29.9 27.8L34.1 29.5C35.4 28.6 36.8 27.8 38.3 27.2L39 22.7C39.2 21.2 40.5 20 42 20H50Z"
          fill="url(#set-gear-metal)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.8"
        />
        {/* Core Center Ring */}
        <circle cx="46" cy="46.5" r="14" fill="url(#set-core-shade)" stroke="#64748B" strokeWidth="1.5" />
        <circle cx="46" cy="46.5" r="7" fill="#0F172A" />
        <circle cx="46" cy="46.5" r="3" fill="#38BDF8" opacity="0.8" />
      </g>
      {/* Top Gloss */}
      <path d="M0 22.5C0 10.0736 10.0736 0 22.5 0H77.5C89.9264 0 100 10.0736 100 22.5V36C65 42 35 30 0 46V22.5Z" fill="white" fillOpacity="0.08" />
    </svg>
  );
}

export function AuthenticMailIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="authentic-svg-icon">
      <defs>
        <linearGradient id="mail-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
        <linearGradient id="mail-letter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <linearGradient id="mail-pocket" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <filter id="mail-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#024C78" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Base Plate */}
      <rect width="100" height="100" rx="22.5" fill="url(#mail-bg)" />
      <rect x="1" y="1" width="98" height="98" rx="21.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      {/* Envelope & Emerging Letter */}
      <g filter="url(#mail-shadow)">
        {/* Back of Envelope */}
        <rect x="16" y="32" width="68" height="46" rx="9" fill="#0C4A6E" />
        {/* Emerging crisp letter sheet */}
        <rect x="22" y="21" width="56" height="42" rx="6" fill="url(#mail-letter)" stroke="#E2E8F0" strokeWidth="0.8" />
        {/* Letter Text Lines */}
        <line x1="28" y1="28" x2="48" y2="28" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="28" y1="34" x2="68" y2="34" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="28" y1="39" x2="62" y2="39" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" />
        {/* Postage Stamp */}
        <rect x="62" y="24" width="10" height="12" rx="2" fill="#38BDF8" fillOpacity="0.4" stroke="#0284C7" strokeWidth="0.8" />
        {/* Front Envelope Body */}
        <path d="M16 42C16 38.6863 18.6863 36 22 36H78C81.3137 36 84 38.6863 84 42V71C84 74.3137 81.3137 77 78 77H22C18.6863 77 16 74.3137 16 71V42Z" fill="url(#mail-pocket)" />
        {/* Folded Flap Lines */}
        <path d="M16 40L50 62L84 40" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 75L42 54" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M84 75L58 54" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
        {/* Red / Gold Circular Seal */}
        <circle cx="50" cy="62" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
      </g>
      {/* Top Gloss */}
      <path d="M0 22.5C0 10.0736 10.0736 0 22.5 0H77.5C89.9264 0 100 10.0736 100 22.5V36C65 42 35 30 0 46V22.5Z" fill="white" fillOpacity="0.12" />
    </svg>
  );
}

export function AuthenticAboutIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="authentic-svg-icon">
      <defs>
        <linearGradient id="abt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        <radialGradient id="abt-halo" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="abt-badge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
        <filter id="abt-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#312E81" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Base Plate */}
      <rect width="100" height="100" rx="22.5" fill="url(#abt-bg)" />
      <rect x="1" y="1" width="98" height="98" rx="21.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />
      {/* Security Halo / Developer Aperture */}
      <circle cx="50" cy="50" r="35" fill="url(#abt-halo)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 4" />
      {/* Central Monogram Crest */}
      <g filter="url(#abt-shadow)">
        <path d="M50 18L74 27V48C74 64 50 78 50 78C50 78 26 64 26 48V27L50 18Z" fill="url(#abt-badge)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
        <path d="M50 22L70 29.5V47C70 60 50 72 50 72C50 72 30 60 30 47V29.5L50 22Z" fill="#312E81" fillOpacity="0.15" />
        {/* Monogram "z." */}
        <text x="47" y="56" fill="#3730A3" fontSize="28" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle">
          z<tspan fill="#6366F1">.</tspan>
        </text>
      </g>
      {/* Top Gloss */}
      <path d="M0 22.5C0 10.0736 10.0736 0 22.5 0H77.5C89.9264 0 100 10.0736 100 22.5V36C65 42 35 30 0 46V22.5Z" fill="white" fillOpacity="0.1" />
    </svg>
  );
}

export function AppIcon({
  id,
  small = false,
  modeOverride,
  customUrl
}: {
  id: string;
  small?: boolean;
  modeOverride?: Mode;
  customUrl?: string;
}) {
  let activeCustomUrl = customUrl;
  if (activeCustomUrl === undefined) {
    try {
      const s = useSystemContext();
      const effectiveMode = modeOverride || s?.mode || 'macos';
      activeCustomUrl = s?.config?.appIcons?.[effectiveMode]?.[id];
    } catch {
      // Outside of context provider
    }
  }

  const size = small ? 32 : 56;

  if (activeCustomUrl && activeCustomUrl.trim().length > 0) {
    return (
      <span className={`authentic-svg-icon custom-app-icon ${small ? 'small' : ''}`}>
        <img
          src={activeCustomUrl}
          alt={id}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </span>
    );
  }

  if (id === 'projects') return <AuthenticProjectsIcon size={size} />;
  if (id === 'terminal') return <AuthenticTerminalIcon size={size} />;
  if (id === 'settings') return <AuthenticSettingsIcon size={size} />;
  if (id === 'mail') return <AuthenticMailIcon size={size} />;
  if (id === 'about') return <AuthenticAboutIcon size={size} />;
  return (
    <span className={`app-icon icon-${id} ${small ? 'small' : ''}`}>
      <Icon name={id} size={small ? 23 : 30} />
    </span>
  );
}
