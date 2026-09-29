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
  dragon: <path d="M12.778 5.943s-1.97-.13-5.327.92c-3.42 1.07-5.36 2.587-5.36 2.587s5.098-2.847 10.852-3.008zm7.351 3.095l.257-.017s-1.468-1.78-4.278-2.648c1.58.642 2.954 1.493 4.021 2.665zm.42.74c.039-.068.166.217.263.337.004.024.01.039-.045.027-.005-.025-.013-.032-.013-.032s-.135-.08-.177-.137c-.041-.057-.049-.157-.028-.195zm3.448 8.479s.312-3.578-5.31-4.403a18.277 18.277 0 0 0-2.524-.187c-4.506.06-4.67-5.197-1.275-5.462 1.407-.116 3.087.643 4.73 1.408-.007.204.002.385.136.552.134.168.648.35.813.445.164.094.691.43 1.014.85.07-.131.654-.512.654-.512s-.14.003-.465-.119c-.326-.122-.713-.49-.722-.511-.01-.022-.015-.055.06-.07.059-.049-.072-.207-.13-.265-.058-.058-.445-.716-.454-.73-.009-.016-.012-.031-.04-.05-.085-.027-.46.04-.46.04s-.575-.283-.774-.893c.003.107-.099.224 0 .469-.3-.127-.558-.344-.762-.88-.12.305 0 .499 0 .499s-.707-.198-.82-.85c-.124.293 0 .469 0 .469s-1.153-.602-3.069-.61c-1.283-.118-1.55-2.374-1.43-2.754 0 0-1.85-.975-5.493-1.406-3.642-.43-6.628-.065-6.628-.065s6.45-.31 11.617 1.783c.176.785.704 2.094.989 2.723-.815.563-1.733 1.092-1.876 2.97-.143 1.878 1.472 3.53 3.474 3.58 1.9.102 3.214.116 4.806.942 1.52.84 2.766 3.4 2.89 5.703.132-1.709-.509-5.383-3.5-6.498 4.181.732 4.549 3.832 4.549 3.832zM12.68 5.663l-.15-.485s-2.484-.441-5.822-.204C3.37 5.211 0 6.38 0 6.38s6.896-1.735 12.68-.717Z" fill="currentColor"/>,
  folder: <path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>,
  cert: <><circle cx="12" cy="8" r="6"/><path d="M15.48 13.9 17 22l-5-3-5 3 1.52-8.1"/></>,
  script: <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>,
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

export function KaliDragonIcon({ size = 20, className = '', color = 'currentColor', ...rest }: { size?: number; className?: string; color?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Kali Linux" {...rest}>
      <path d="M12.778 5.943s-1.97-.13-5.327.92c-3.42 1.07-5.36 2.587-5.36 2.587s5.098-2.847 10.852-3.008zm7.351 3.095l.257-.017s-1.468-1.78-4.278-2.648c1.58.642 2.954 1.493 4.021 2.665zm.42.74c.039-.068.166.217.263.337.004.024.01.039-.045.027-.005-.025-.013-.032-.013-.032s-.135-.08-.177-.137c-.041-.057-.049-.157-.028-.195zm3.448 8.479s.312-3.578-5.31-4.403a18.277 18.277 0 0 0-2.524-.187c-4.506.06-4.67-5.197-1.275-5.462 1.407-.116 3.087.643 4.73 1.408-.007.204.002.385.136.552.134.168.648.35.813.445.164.094.691.43 1.014.85.07-.131.654-.512.654-.512s-.14.003-.465-.119c-.326-.122-.713-.49-.722-.511-.01-.022-.015-.055.06-.07.059-.049-.072-.207-.13-.265-.058-.058-.445-.716-.454-.73-.009-.016-.012-.031-.04-.05-.085-.027-.46.04-.46.04s-.575-.283-.774-.893c.003.107-.099.224 0 .469-.3-.127-.558-.344-.762-.88-.12.305 0 .499 0 .499s-.707-.198-.82-.85c-.124.293 0 .469 0 .469s-1.153-.602-3.069-.61c-1.283-.118-1.55-2.374-1.43-2.754 0 0-1.85-.975-5.493-1.406-3.642-.43-6.628-.065-6.628-.065s6.45-.31 11.617 1.783c.176.785.704 2.094.989 2.723-.815.563-1.733 1.092-1.876 2.97-.143 1.878 1.472 3.53 3.474 3.58 1.9.102 3.214.116 4.806.942 1.52.84 2.766 3.4 2.89 5.703.132-1.709-.509-5.383-3.5-6.498 4.181.732 4.549 3.832 4.549 3.832zM12.68 5.663l-.15-.485s-2.484-.441-5.822-.204C3.37 5.211 0 6.38 0 6.38s6.896-1.735 12.68-.717Z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*             HIGHEST QUALITY BESPOKE CYBERSECURITY OS ICONS                 */
/* -------------------------------------------------------------------------- */

/**
 * Tactical Arsenal Crate - Flagship Security Projects
 * Titanium beveled chassis, holographic cyan targeting reticle, energy cores
 */
export function BespokeArsenalIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="Flagship Arsenal">
      <defs>
        <linearGradient id="ars-plate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="ars-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="ars-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="ars-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.65" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Outer Tactical Frame */}
      <g filter="url(#ars-shadow)">
        <rect x="8" y="10" width="64" height="60" rx="14" fill="url(#ars-plate)" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
        <rect x="10" y="12" width="60" height="56" rx="12" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* Reinforced Corner Brackets */}
        <path d="M12 24V14H22M68 24V14H58M12 56V66H22M68 56V66H58" stroke="url(#ars-glow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Carbon Mesh Grill */}
        <line x1="20" y1="28" x2="60" y2="28" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="20" y1="52" x2="60" y2="52" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
        {/* Holographic Aim Reticle */}
        <circle cx="40" cy="40" r="16" stroke="url(#ars-accent)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
        <circle cx="40" cy="40" r="7" fill="url(#ars-glow)" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1.8" />
        {/* Crosshair Spikes */}
        <line x1="40" y1="20" x2="40" y2="29" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="51" x2="40" y2="60" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="40" x2="29" y2="40" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
        <line x1="51" y1="40" x2="60" y2="40" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
        {/* Central Quantum Core */}
        <circle cx="40" cy="40" r="3.2" fill="#ffffff" />
        {/* Tactical Stencil Badge */}
        <rect x="27" y="16" width="26" height="6" rx="2" fill="#0369a1" fillOpacity="0.4" stroke="rgba(56,189,248,0.5)" strokeWidth="0.8" />
        <text x="40" y="21" fill="#7dd3fc" fontSize="5" fontWeight="800" textAnchor="middle" fontFamily="monospace" letterSpacing="0.8">ARSENAL</text>
      </g>
    </svg>
  );
}

/**
 * Offensive Pentest Dossier - eJPT Audits & Exploits
 * Obsidian clipboard, crimson exploit shield, cracked biometric lock
 */
export function BespokePentestIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="Pentest Reports">
      <defs>
        <linearGradient id="pen-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a080c" />
          <stop offset="60%" stopColor="#150508" />
          <stop offset="100%" stopColor="#0a0204" />
        </linearGradient>
        <linearGradient id="pen-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d6d" />
          <stop offset="100%" stopColor="#c9184a" />
        </linearGradient>
        <linearGradient id="pen-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff758f" />
          <stop offset="100%" stopColor="#800f2f" />
        </linearGradient>
        <filter id="pen-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff4d6d" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#pen-shadow)">
        {/* Clipboard Backing */}
        <rect x="12" y="10" width="56" height="62" rx="12" fill="url(#pen-base)" stroke="rgba(255,77,109,0.4)" strokeWidth="1.5" />
        <rect x="14" y="12" width="52" height="58" rx="10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Top Metallic Clip */}
        <path d="M28 8C28 6.89543 28.8954 6 30 6H50C51.1046 6 52 6.89543 52 8V14H28V8Z" fill="#3f1418" stroke="#ff4d6d" strokeWidth="1.2" />
        <circle cx="40" cy="10" r="2" fill="#ff758f" />
        {/* Exploit Target Shield */}
        <path d="M40 24L56 30V44C56 53 49 61 40 64C31 61 24 53 24 44V30L40 24Z" fill="#1c070a" stroke="url(#pen-red)" strokeWidth="1.8" />
        {/* Binary / Circuit Trace within Shield */}
        <path d="M32 38H48M34 44H46M37 50H43" stroke="rgba(255,117,143,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        {/* Cracked Lock Core Emblem */}
        <path d="M35 38V34C35 31.2386 37.2386 29 40 29C42.7614 29 45 31.2386 45 34V38" stroke="#ff758f" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="33" y="38" width="14" height="11" rx="2.5" fill="url(#pen-red)" />
        {/* Keyhole Exploit Vector */}
        <circle cx="40" cy="42.5" r="1.6" fill="#ffffff" />
        <path d="M39.3 43.5L38.8 46.5H41.2L40.7 43.5" fill="#ffffff" />
        {/* Laser crack across lock */}
        <path d="M31 36L49 46" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  );
}

/**
 * Defensive SOC Operations - BTL1 Incident Logs & SIEM
 * Cobalt Aegis shield, rotating radar sweep, live packet rings, sentinel node
 */
export function BespokeSocIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="SOC Blue Team">
      <defs>
        <linearGradient id="soc-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1931" />
          <stop offset="50%" stopColor="#030b1e" />
          <stop offset="100%" stopColor="#01040d" />
        </linearGradient>
        <linearGradient id="soc-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="soc-radar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="soc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#soc-shadow)">
        {/* Layered Hexagonal Base */}
        <path d="M40 8L68 22V58L40 72L12 58V22L40 8Z" fill="url(#soc-base)" stroke="url(#soc-blue)" strokeWidth="1.8" />
        <path d="M40 13L63 25V55L40 67L17 55V25L40 13Z" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* Radar Concentric Rings */}
        <circle cx="40" cy="40" r="20" stroke="#1e3a8a" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="40" cy="40" r="12" stroke="#2563eb" strokeWidth="1" opacity="0.6" />
        <circle cx="40" cy="40" r="5" stroke="#38bdf8" strokeWidth="1.2" />
        {/* Radar Sweep Arc */}
        <path d="M40 40L55 26A20 20 0 0 1 60 40Z" fill="url(#soc-radar)" fillOpacity="0.3" />
        <line x1="40" y1="40" x2="55" y2="26" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
        {/* Central Sentinel Core */}
        <circle cx="40" cy="40" r="2.5" fill="#10b981" />
        {/* Intercepted Threat Points */}
        <circle cx="48" cy="31" r="2" fill="#ef4444" />
        <circle cx="31" cy="47" r="1.5" fill="#38bdf8" />
        {/* Top Status Pill */}
        <rect x="29" y="16" width="22" height="5" rx="2" fill="#1e3a8a" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="0.8" />
        <text x="40" y="20.2" fill="#93c5fd" fontSize="4.5" fontWeight="800" textAnchor="middle" fontFamily="monospace">BTL1-SOC</text>
      </g>
    </svg>
  );
}

/**
 * Cybersecurity Master's Research - Academic & Cryptographic Folio
 * Quantum encryption prism, holographic neural circuits, gold/cyan data streams
 */
export function BespokeResearchIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="Master's Research">
      <defs>
        <linearGradient id="res-base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#0f0e26" />
          <stop offset="100%" stopColor="#050512" />
        </linearGradient>
        <linearGradient id="res-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="res-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="res-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#res-shadow)">
        {/* Research Folio Base */}
        <rect x="12" y="10" width="56" height="62" rx="12" fill="url(#res-base)" stroke="url(#res-violet)" strokeWidth="1.5" />
        <rect x="15" y="13" width="50" height="56" rx="9" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Book Spine Bevel */}
        <rect x="12" y="10" width="7" height="62" rx="3" fill="#312e81" fillOpacity="0.6" />
        {/* Quantum Isometric Prism */}
        <path d="M40 22L56 31V50L40 59L24 50V31L40 22Z" fill="#1e1b4b" stroke="url(#res-violet)" strokeWidth="1.6" />
        <path d="M40 22V40M40 40L56 31M40 40L24 31M40 40V59M40 40L56 50M40 40L24 50" stroke="rgba(168,85,247,0.4)" strokeWidth="1.2" />
        {/* Central Cryptographic Key Glyphs */}
        <circle cx="40" cy="40" r="5" fill="url(#res-gold)" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="2" fill="#ffffff" />
        {/* Academic Degree Laurel Base */}
        <path d="M28 58C32 62 48 62 52 58" stroke="url(#res-gold)" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="33" y="16" width="14" height="4.5" rx="1.5" fill="#4338ca" stroke="#818cf8" strokeWidth="0.8" />
        <text x="40" y="19.5" fill="#e0e7ff" fontSize="3.5" fontWeight="800" textAnchor="middle" fontFamily="monospace">MSc·SEC</text>
      </g>
    </svg>
  );
}

/**
 * Executive Curriculum Vitae - Holographic Red PDF
 * Dark glass parchment, ruby PDF badge, holographic wax seal, microcircuits
 */
export function BespokePdfIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="Curriculum Vitae">
      <defs>
        <linearGradient id="pdf-paper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="pdf-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="pdf-fold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <filter id="pdf-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#pdf-shadow)">
        {/* Folded Document Base */}
        <path d="M16 10C16 7.79086 17.7909 6 20 6H48L64 22V66C64 68.2091 62.2091 70 60 70H20C17.7909 70 16 68.2091 16 66V10Z" fill="url(#pdf-paper)" stroke="rgba(239,68,68,0.45)" strokeWidth="1.5" />
        {/* Fold Corner */}
        <path d="M48 6V20C48 21.1046 48.8954 22 50 22H64" fill="url(#pdf-fold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* Text Guidelines */}
        <line x1="24" y1="24" x2="42" y2="24" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="24" y1="30" x2="40" y2="30" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="24" y1="36" x2="44" y2="36" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
        {/* Prominent Ruby PDF Badge Plate */}
        <rect x="20" y="44" width="40" height="18" rx="4.5" fill="url(#pdf-ruby)" />
        <rect x="21" y="45" width="38" height="16" rx="3.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="40" y="57" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="1">PDF</text>
        {/* Verified Holographic Security Seal */}
        <circle cx="53" cy="31" r="5" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.2" />
        <path d="M51 31L52.5 32.5L55 29.5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/**
 * Verified Cryptographic Signature - eJPT & BTL1 Credentials
 * Multi-ring cryptographic medal, dual verification ribbon, SHA-256 seal
 */
export function BespokeCertSigIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="Verified Credentials">
      <defs>
        <linearGradient id="sig-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="sig-core" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <filter id="sig-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter="url(#sig-shadow)">
        {/* Ceremonial Ribbon Hangings */}
        <path d="M30 46L22 68L34 62L40 68L36 46" fill="#047857" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <path d="M50 46L58 68L46 62L40 68L44 46" fill="#065f46" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Outer Radiant Cog/Ring */}
        <circle cx="40" cy="34" r="24" fill="#064e3b" stroke="url(#sig-gold)" strokeWidth="2.2" />
        <circle cx="40" cy="34" r="20" fill="url(#sig-core)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="40" cy="34" r="16" stroke="#34d399" strokeWidth="1" opacity="0.6" />
        {/* Heavy Verification Checkmark */}
        <path d="M28 34L36 42L52 24" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 34L36 42L52 24" stroke="#a7f3d0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Stamped Keyhole Node */}
        <circle cx="40" cy="18" r="1.5" fill="#facc15" />
      </g>
    </svg>
  );
}

/**
 * Cyber Incident Script - live_soc_alert.sh
 * Carbon fiber cartridge, hazard warning chevron, neon terminal prompt, sparks
 */
export function BespokeScriptIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="bespoke-svg-icon" aria-label="Interactive SOC Alert">
      <defs>
        <linearGradient id="sh-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#030712" />
        </linearGradient>
        <linearGradient id="sh-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="sh-hazard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="sh-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#sh-shadow)">
        {/* Terminal Cartridge Shell */}
        <rect x="12" y="10" width="56" height="62" rx="12" fill="url(#sh-body)" stroke="url(#sh-cyan)" strokeWidth="1.6" />
        <rect x="14" y="12" width="52" height="58" rx="10" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {/* Hazard Top Warning Strip */}
        <path d="M14 20H66" stroke="url(#sh-hazard)" strokeWidth="3" strokeDasharray="6 4" />
        {/* Shebang #! Indicator */}
        <text x="22" y="38" fill="#38bdf8" fontSize="16" fontWeight="900" fontFamily="monospace">#!</text>
        {/* Command Line Prompt Glyph */}
        <path d="M22 47L30 53L22 59M34 59H48" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Glowing Cursor Pulse */}
        <rect x="52" y="52" width="5" height="8" rx="1" fill="#34d399" />
        {/* Lightning Spark */}
        <path d="M56 26L50 35H55L49 44L61 33H56L59 26H56Z" fill="url(#sh-hazard)" />
      </g>
    </svg>
  );
}

/**
 * Bespoke HUD Action Icon: 60-Second Recruiter Brief
 * Holographic cyan targeting reticle with emerald plasma lightning crest
 */
export function BespokeQuickstartActionIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hud-action-svg" aria-hidden="true">
      <defs>
        <linearGradient id="q-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="7" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
      <path d="M13 2.5L6.5 12.5H12L10.5 21.5L18 10.5H12.5L13 2.5Z" fill="url(#q-grad)" stroke="#ffffff" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Bespoke HUD Action Icon: SOC Incident Simulator
 * Cobalt Aegis shield with rotating radar sweep and alert node
 */
export function BespokeDefenseActionIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hud-action-svg" aria-hidden="true">
      <defs>
        <linearGradient id="d-shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <path d="M12 2.5L20 5.5V12.5C20 17.5 16.5 20.8 12 22C7.5 20.8 4 17.5 4 12.5V5.5L12 2.5Z" fill="url(#d-shield)" stroke="#38bdf8" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="5" stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M12 12L16 8.5A5 5 0 0 1 17 12Z" fill="#10b981" fillOpacity="0.45" />
      <circle cx="12" cy="12" r="1.5" fill="#38bdf8" />
      <circle cx="14.5" cy="9.5" r="1" fill="#ef4444" />
    </svg>
  );
}

/**
 * Bespoke HUD Action Icon: Kali Zsh Shell
 * Terminal console frame with prompt glyph and phosphor cursor
 */
export function BespokeTerminalActionIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hud-action-svg" aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.5" fill="#090d16" stroke="#38bdf8" strokeWidth="1.3" />
      <line x1="2.5" y1="7.5" x2="21.5" y2="7.5" stroke="rgba(56,189,248,0.3)" strokeWidth="0.8" />
      <circle cx="5" cy="5.5" r="0.8" fill="#ef4444" />
      <circle cx="7.5" cy="5.5" r="0.8" fill="#f59e0b" />
      <circle cx="10" cy="5.5" r="0.8" fill="#10b981" />
      <path d="M6 11L9.5 13.5L6 16" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="11.5" y="15" width="4.5" height="2" rx="0.5" fill="#38bdf8" />
    </svg>
  );
}

/**
 * Bespoke HUD Action Icon: Official Resume & Dossier
 * Folded cryptographic document with ruby PDF badge plate
 */
export function BespokeResumeActionIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hud-action-svg" aria-hidden="true">
      <defs>
        <linearGradient id="r-doc" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <path d="M5 3.5C5 2.67157 5.67157 2 6.5 2H14.5L19 6.5V20.5C19 21.3284 18.3284 22 17.5 22H6.5C5.67157 22 5 21.3284 5 20.5V3.5Z" fill="url(#r-doc)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
      <path d="M14.5 2V6.5H19" fill="#334155" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      <rect x="7" y="13" width="10" height="5.5" rx="1.5" fill="#ef4444" />
      <text x="12" y="17" fill="#ffffff" fontSize="3.6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">PDF</text>
      <circle cx="15.5" cy="9.5" r="1.5" fill="#38bdf8" />
    </svg>
  );
}

// Backward-compatibility aliases
export const AuthenticCyberFolder = BespokeArsenalIcon;
export const AuthenticPdfFile = BespokePdfIcon;
export const AuthenticCertBadge = BespokeCertSigIcon;
export const AuthenticScriptFile = BespokeScriptIcon;
