import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { readSaved, useSaved, useSystemContext } from './state';

export function DraggableWidget({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0, px: 0, py: 0, dragging: false });
  return <section className={`widget ${className}`} style={{ transform: `translate(${position.x}px, ${position.y}px)` }}><div className="widget-grip" aria-label="Drag widget" title="Drag widget" onPointerDown={e => { start.current = { x: e.clientX, y: e.clientY, px: position.x, py: position.y, dragging: true }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (!start.current.dragging) return; const rect = e.currentTarget.parentElement!.getBoundingClientRect(); const dx = Math.min(window.innerWidth - rect.right, Math.max(-rect.left, e.clientX - start.current.x)); const dy = Math.min(window.innerHeight - 95 - rect.bottom, Math.max(40 - rect.top, e.clientY - start.current.y)); setPosition({ x: position.x + dx, y: position.y + dy }); start.current.x = e.clientX; start.current.y = e.clientY; }} onPointerUp={() => { start.current.dragging = false; }} onPointerCancel={() => { start.current.dragging = false; }}><span/></div>{children}</section>;
}
export function ClockWidget() {
  const { time } = useSystemContext();
  const clockAnchor = useRef(time);
  const secondAngle = clockAnchor.current.getSeconds() * 6 + (time.getTime() - clockAnchor.current.getTime()) / 1000 * 6;
  const second = time.getSeconds(), minute = time.getMinutes(), hour = time.getHours();
  return <DraggableWidget className="clock-widget"><div className="clock-left"><span className="widget-overline">{time.toLocaleDateString('en-US', { weekday: 'long' })}</span><strong>{time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</strong><span>{time.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span><small>{Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').at(-1)?.replace('_', ' ')}</small></div><div className="analog-clock">{Array.from({ length: 12 }, (_, i) => <i className="clock-tick" key={i} style={{ transform: `rotate(${i * 30}deg)` }}/ >)}<i className="clock-hand hour" style={{ transform: `rotate(${hour * 30 + minute / 2}deg)` }}/><i className="clock-hand minute" style={{ transform: `rotate(${minute * 6 + second / 10}deg)` }}/><i className="clock-hand second" style={{ transform: `rotate(${secondAngle}deg)` }}/><b/></div></DraggableWidget>;
}
export function TelemetryWidget() {
  const [sample, setSample] = useState(0);
  useEffect(() => { const id = setInterval(() => setSample(n => n + 1), 2200); return () => clearInterval(id); }, []);
  const heap = (performance as any).memory?.usedJSHeapSize;
  return <DraggableWidget className="telemetry-widget"><div className="widget-title"><Icon name="chip" size={14}/><span>System monitor</span><i className="status-dot"/></div><div className="telemetry-stats"><div><small>CPU · DEMO</small><strong>{12 + Math.round(Math.sin(sample) * 5)}<em>%</em></strong></div><div><small>JS MEMORY</small><strong>{heap ? Math.round(heap / 1048576) : '—'}<em>{heap ? 'MB' : ''}</em></strong></div><div><small>NET · DEMO</small><strong>{(1.2 + Math.sin(sample) * .4).toFixed(1)}<em>MB/s</em></strong></div></div><div className="telemetry-chart">{Array.from({ length: 38 }, (_, i) => <i key={i} style={{ height: `${15 + Math.abs(Math.sin(i * 1.7 + sample / 3)) * 70}%`, opacity: .3 + i / 60 }}/>)}</div><div className="widget-footnote">Browser memory · CPU & network simulated</div></DraggableWidget>;
}
export function GithubWidget() {
  const s = useSystemContext();
  const defaultUser = s.config?.githubUsername || 'Zakarya-Oukil';
  const [username, setUsername] = useState(() => readSaved('zak.github', '') || defaultUser);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [status, setStatus] = useState('Loading GitHub telemetry…');

  useEffect(() => {
    if (s.config?.githubUsername && !readSaved('zak.github', '')) {
      setUsername(s.config.githubUsername);
    }
  }, [s.config?.githubUsername]);

  useEffect(() => {
    const sync = (e: Event) => setUsername((e as CustomEvent).detail || defaultUser);
    window.addEventListener('zak:github', sync);
    return () => window.removeEventListener('zak:github', sync);
  }, [defaultUser]);
  useEffect(() => {
    if (!username) { setStatus('Demo · connect in Settings'); setCounts({}); return; }
    const controller = new AbortController();
    const refresh = async () => { setStatus('Refreshing public activity…'); try { const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`, { signal: controller.signal }); if (!response.ok) throw new Error(response.status === 404 ? 'User not found' : 'Activity unavailable'); const events = await response.json(); const next: Record<string, number> = {}; for (const event of events) { const day = event.created_at.slice(0, 10); next[day] = (next[day] || 0) + 1; } setCounts(next); setStatus(`${events.length} recent public events · @${username}`); } catch (e) { if (!controller.signal.aborted) setStatus(e instanceof Error ? e.message : 'Activity unavailable'); } };
    refresh(); const timer = setInterval(refresh, 300000); return () => { controller.abort(); clearInterval(timer); };
  }, [username]);
  return <DraggableWidget className="github-widget"><div className="widget-title"><Icon name="github" size={16}/><span>Showing up, every day.</span></div><div className="heatmap">{Array.from({ length: 105 }, (_, i) => { const day = new Date(); day.setDate(day.getDate() - 104 + i); const key = day.toISOString().slice(0, 10); const level = username ? Math.min(counts[key] || 0, 4) : (i * 13 + Math.floor(i / 5)) % 5; return <i key={key} data-level={level} title={`${key}: ${username ? counts[key] || 0 : 'Demo'} public events`}/>; })}</div><div className="heatmap-caption"><span>{status}</span><button aria-label="Configure GitHub activity" onClick={() => s.open('settings')}><Icon name="arrow" size={14}/></button></div></DraggableWidget>;
}
export function NotesWidget() {
  const s = useSystemContext();
  const [note, setNote] = useSaved('zak.note', 'Build with intention.\nStay curious.\nLeave things a little better.');
  return <DraggableWidget className="notes-widget"><div className="widget-title"><span className="note-dot"/>A note to self <span>↗</span></div><textarea aria-label="Quick note" value={note} onChange={e => setNote(e.target.value)}/><div className="note-footer"><span>Edits saved locally</span><button onClick={() => s.open('mail')}>Say hello <Icon name="arrow" size={13}/></button></div></DraggableWidget>;
}
