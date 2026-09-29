import React, { useEffect, useRef, useState } from 'react';
import { About, Mail, Settings, Terminal } from './Apps';
import { Projects } from './Projects';
import { AppIcon, Icon } from './Icon';
import { AppId, appNames, apps, RecruiterRoleId, useSystemContext } from './state';
import { PROJECTS } from './projects-data';
import { Desktop } from './Desktop';
import { Phone } from './Mobile';
import { BootAnimation } from './BootAnimation';
import { BriefNavigation, Credentials, DefenseLab, Dossier, Flagships, Quickstart } from './Recruiter';
import { HardwareTransition } from './Transition';
import { PentestReportsApp } from './PentestReportsApp';
import { SocCommandApp } from './SocCommandApp';
import { MastersResearchApp } from './MastersResearchApp';
import { CredentialSigModal } from './CredentialSigModal';
import { LiveSocScriptModal } from './LiveSocScriptModal';
import { DuckHunterBadUsbApp, SubnetRadarApp } from './NetHunterApps';
import { RecruiterFastPassDrawer } from './RecruiterFastPassDrawer';
import { RecruiterEntry } from './RecruiterEntry';
import { IncidentReplayApp } from './IncidentReplayApp';

export function Application({ id }: { id: AppId }) {
  switch (id) {
    case 'incident-replay': return <IncidentReplayApp />;
    case 'dossier': return <Dossier />;
    case 'flagships': return <Flagships />;
    case 'quickstart': return <Quickstart />;
    case 'defense': return <DefenseLab />;
    case 'projects': return <Projects />;
    case 'terminal': return <Terminal />;
    case 'settings': return <Settings />;
    case 'mail': return <Mail />;
    case 'pentest-reports': return <PentestReportsApp />;
    case 'soc-hunting': return <SocCommandApp />;
    case 'masters-research': return <MastersResearchApp />;
    case 'credentials-sig': return <CredentialSigModal />;
    case 'live-soc-script': return <LiveSocScriptModal />;
    case 'duckhunter': return <DuckHunterBadUsbApp />;
    case 'subnet-radar': return <SubnetRadarApp />;
    case 'about':
    default: return <About />;
  }
}
export function Dock({ mobile = false }: { mobile?: boolean }) {
  const s = useSystemContext(); const [pointer, setPointer] = useState<number | null>(null); const [bounce, setBounce] = useState(''); const dock = useRef<HTMLDivElement>(null);
  const items: AppId[] = mobile ? ['projects', 'terminal', 'settings', 'mail'] : ['projects', 'terminal', 'mail', 'about', 'settings'];
  return <div className={`dock ${mobile ? 'mobile-dock' : ''}`} ref={dock} onPointerMove={e => { if (!mobile && e.pointerType === 'mouse') setPointer(e.clientX); }} onPointerLeave={() => setPointer(null)}>{items.map((id, i) => { const element = dock.current?.children[i] as HTMLElement; const rect = element?.getBoundingClientRect(); const distance = pointer === null || !rect ? 200 : Math.abs(pointer - (rect.left + rect.width / 2)); const scale = 1 + Math.max(0, 1 - distance / 125) * .35; return <button key={id} className={`dock-item ${bounce === id ? 'bouncing' : ''}`} style={{ '--dock-scale': scale } as React.CSSProperties} aria-label={`Open ${appNames[id]}`} onClick={() => { s.open(id); setBounce(id); }} onAnimationEnd={() => setBounce('')}><span className="dock-tooltip">{appNames[id]}</span><AppIcon id={id}/>{!mobile && <i className={s.windows.some(w => w.id === id) ? 'running' : ''}/>}</button>; })}{!mobile && <><button className="recruiter-pill dock-brief" onClick={() => s.setFastPassOpen(true)} aria-label="Recruiter Fast-Pass"><span>⚡</span><span>Recruiter Fast-Pass<small>Role fit · CV · Technical screen</small></span></button><span className="dock-divider"/><button className="dock-item device-dock" aria-label="Switch device" onClick={() => s.open('settings')}><span className="dock-tooltip">Switch experience</span><span className="app-icon icon-device"><Icon name="monitor" size={28}/></span></button></>}</div>;
}
export function ControlCenter() {
  const s = useSystemContext(); const start = useRef(0);
  const labels = s.mode === 'android' ? ['Wi-Fi', 'Bluetooth', 'Do Not Disturb', 'Flashlight', 'Auto-Rotate', 'Low Power'] : ['Cellular', 'Wi-Fi', 'Bluetooth', 'AirDrop', 'Do Not Disturb', 'Flashlight', 'Low Power'];
  return <><button className="panel-backdrop" aria-label="Close Control Center" onClick={() => s.setShade(false)}/><section className={`control-center ${s.mode === 'android' ? 'material-panel' : ''}`} aria-label="Control Center"><header><h2>{s.mode === 'android' ? 'Quick settings' : 'Control Center'}</h2><button aria-label="Close controls" onClick={() => s.setShade(false)}><Icon name="close"/></button></header><p className="muted">{s.time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p><div className="control-toggles">{labels.map(label => <button key={label} className={s.toggles[label] ? 'on' : ''} aria-pressed={s.toggles[label]} onClick={() => s.setToggles(t => ({ ...t, [label]: !t[label] }))}><Icon name={label === 'Wi-Fi' ? 'wifi' : label === 'Bluetooth' ? 'bluetooth' : label === 'Do Not Disturb' ? 'moon' : label === 'Flashlight' ? 'sun' : label === 'Low Power' ? 'battery' : 'bolt'}/><span>{label}<small>{s.toggles[label] ? 'On' : 'Off'}</small></span></button>)}<button className={s.theme !== 'light' ? 'on' : ''} aria-pressed={s.theme !== 'light'} onClick={() => s.setTheme(s.theme === 'light' ? 'dark' : 'light')}><Icon name="moon"/><span>Dark Mode<small>{s.theme !== 'light' ? 'On' : 'Off'}</small></span></button></div><div className="control-sliders"><label><Icon name="sun"/><span>Brightness</span><input aria-label="Brightness" type="range" min="25" max="100" value={s.brightness} onChange={e => s.setBrightness(+e.target.value)}/><small>{s.brightness}%</small></label><label><Icon name="volume"/><span>Volume</span><input aria-label="Volume" type="range" min="0" max="100" value={s.volume} onChange={e => s.setVolume(+e.target.value)}/><small>{s.volume}%</small></label></div><div className="control-notice">Controls simulate this portfolio's device. Hardware settings stay with your browser.</div><button className="shade-handle" aria-label="Dismiss notification shade" onPointerDown={e => { start.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={e => { if (e.clientY - start.current < -35) s.setShade(false); }} onClick={() => s.setShade(false)}><i/></button></section></>;
}
function Spotlight() {
  const s = useSystemContext(); const [query, setQuery] = useState(''); const input = useRef<HTMLInputElement>(null); const dialog = useRef<HTMLElement>(null);
  useEffect(() => { const previous = document.activeElement as HTMLElement; input.current?.focus(); return () => previous?.focus(); }, []);
  const results = apps.filter(id => appNames[id].toLowerCase().includes(query.toLowerCase()));
  const projects = query ? s.projects.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];
  return <div className="spotlight-backdrop" onClick={() => s.setSpotlight(false)}><section ref={dialog} className="spotlight" role="dialog" aria-modal="true" aria-label="Spotlight search" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key !== 'Tab') return; const elements = Array.from(dialog.current!.querySelectorAll<HTMLElement>('input,button')); if (e.shiftKey && document.activeElement === elements[0]) { e.preventDefault(); elements.at(-1)?.focus(); } else if (!e.shiftKey && document.activeElement === elements.at(-1)) { e.preventDefault(); elements[0]?.focus(); } }}><div className="spotlight-input"><Icon name="search" size={25}/><input ref={input} placeholder="Search apps and projects…" aria-label="Spotlight query" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && results[0]) s.open(results[0]); }}/><button aria-label="Close search" onClick={() => s.setSpotlight(false)}><kbd>esc</kbd></button></div><div className="spotlight-results">{results.map(id => <button key={id} onClick={() => s.open(id)}><AppIcon id={id} small/><span>{appNames[id]}<small>Application</small></span><Icon name="arrow" size={16}/></button>)}{projects.map(p => <button key={p.id} onClick={() => { s.open('projects'); setTimeout(() => window.dispatchEvent(new CustomEvent('zak:project', { detail: p.id })), 80); }}><Icon name="code"/><span>{p.title}<small>{p.country}</small></span><Icon name="arrow" size={16}/></button>)}{!results.length && !projects.length && <p className="empty-state">No matches. Try “Terminal” or “Kernel”.</p>}</div></section></div>;
}
export function Shell() {
  const s = useSystemContext();
  const [entryOpen, setEntryOpen] = useState(() => {
    try { return sessionStorage.getItem('zak.explored') !== '1'; } catch { return true; }
  });
  const [fastPassRole, setFastPassRole] = useState<RecruiterRoleId>('pentest');
  const enterOS = () => {
    setEntryOpen(false);
    s.setBooting(null);
    try { sessionStorage.setItem('zak.explored', '1'); } catch { /* Browser storage is optional. */ }
  };
  useEffect(() => { const key = (e: KeyboardEvent) => { if (s.fastPassOpen) return; if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (e.shiftKey && !entryOpen) s.setSpotlight(!s.spotlight); else s.setFastPassOpen(true); } if ((e.metaKey || e.ctrlKey) && e.key === ',' && !entryOpen) { e.preventDefault(); s.open('settings'); } if (e.key === 'Escape' && !entryOpen) { if (s.transition) s.setTransition(null); else if (s.spotlight) s.setSpotlight(false); else if (s.brief) s.endBrief(); else s.back(); } }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, [s, entryOpen]);
  if (entryOpen) return <><RecruiterEntry onExplore={enterOS} onEvidence={id => { enterOS(); s.open(id); }} onContact={role => { setFastPassRole(role); s.setFastPassOpen(true); }}/>{s.fastPassOpen && <RecruiterFastPassDrawer initialRole={fastPassRole} onEvidenceOpen={enterOS}/>}</>;
  return <div className={`os-shell theme-${s.theme} mode-${s.mode} wallpaper-${s.wallpaper} stance-${s.operatorStance} ${s.brief ? 'brief-open' : ''}`}>
    {(s.mode === 'macos' || s.mode === 'desktop') ? <><Desktop/>{s.shade && <ControlCenter/>}</> : <Phone/>}
    {s.brief && <BriefNavigation/>}
    {s.fastPassOpen && <RecruiterFastPassDrawer/>}
    {s.spotlight && <Spotlight/>}
    {s.toast && <div className="toast" role="status"><Icon name="check" size={17}/>{s.toast}</div>}
    {s.sleeping && <button className="sleep-screen" onClick={() => s.setSleeping(false)}><span>{s.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span><small>Click anywhere to wake</small></button>}
    <div className="brightness-overlay" style={{ opacity: 1 - s.brightness / 100 }}/>
    {s.booting && <BootAnimation mode={s.booting} onComplete={() => s.setBooting(null)} />}
    {s.transition && <HardwareTransition/>}
  </div>;
}
