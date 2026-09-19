import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { readSaved, useSaved, useSystemContext } from './state';

export function DraggableWidget({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, isDown: false });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      isDown: true
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Magnetic grid snapping (16px grid increments)
    setPosition(prev => {
      const snapX = Math.round(prev.x / 16) * 16;
      const snapY = Math.round(prev.y / 16) * 16;
      return {
        x: Math.abs(snapX) < 16 ? 0 : snapX,
        y: Math.abs(snapY) < 16 ? 0 : snapY
      };
    });
  };

  return (
    <section
      className={`widget ${className} ${dragging ? 'widget-dragging' : ''}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: dragging ? 999 : undefined,
        transition: dragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        className="widget-grip"
        aria-label="Drag widget"
        title="Drag to reposition widget"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span />
      </div>
      {children}
    </section>
  );
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

export function AboutMeWidget() {
  const s = useSystemContext();
  const about = s.config?.widgets?.about || {
    name: 'Zakarya Oukil',
    role: 'Security Researcher & Systems Architect',
    statusText: 'Available for Hire',
    statusType: 'available',
    location: 'Algiers / Remote',
    specialties: ['Zero-Trust Architecture', 'Reverse Engineering', 'High-Concurrency', 'Kernel & Sandboxing'],
    bio: 'Engineering resilient systems from low-level Linux kernels to distributed cloud runtimes. Passionate about adversarial ML and offensive security.',
    avatar: '',
    resumeUrl: ''
  };

  const handleResume = () => {
    if (about.resumeUrl) {
      window.open(about.resumeUrl, '_blank');
    } else {
      s.notify('CV Download · Full credentials available in About Me');
      s.open('about');
    }
  };

  return (
    <DraggableWidget className="about-me-widget">
      <div className="about-me-header">
        <div className="about-avatar-wrap">
          {about.avatar ? (
            <img src={about.avatar} alt={about.name} className="about-avatar-img" />
          ) : (
            <div className="about-avatar-fallback">ZO</div>
          )}
          <span className={`status-beacon status-${about.statusType || 'available'}`} />
        </div>
        <div className="about-meta">
          <div className="about-status-pill">
            <i className={`pulse-dot status-${about.statusType || 'available'}`} />
            <span>{about.statusText || 'Available for Hire'}</span>
          </div>
          <strong>{about.name || 'Zakarya Oukil'}</strong>
          <span className="about-role">{about.role || 'Security Researcher & Systems Architect'}</span>
        </div>
      </div>

      <p className="about-bio">{about.bio}</p>

      {about.specialties && about.specialties.length > 0 && (
        <div className="about-chips">
          {about.specialties.slice(0, 4).map((spec: string, i: number) => (
            <span key={i} className="about-chip">{spec}</span>
          ))}
        </div>
      )}

      <div className="about-actions">
        <button className="about-btn primary" onClick={handleResume} title="Download or inspect Resume">
          <Icon name="arrow" size={12} />
          <span>Resume / CV</span>
        </button>
        <button className="about-btn secondary" onClick={() => s.open('mail')} title="Send direct inquiry">
          <Icon name="mail" size={12} />
          <span>Contact</span>
        </button>
      </div>
    </DraggableWidget>
  );
}

export function CertificationsWidget() {
  const s = useSystemContext();
  const certs: any[] = s.config?.widgets?.certs || [
    { id: 'htb', title: 'HackTheBox', badge: 'Pro Hacker', issuer: 'HackTheBox CTF', date: 'Active 2024', verifyUrl: 'https://hackthebox.com', accent: '#9fe870' },
    { id: 'thm', title: 'TryHackMe', badge: 'Top 1% Global', issuer: 'TryHackMe Labs', date: '2024', verifyUrl: 'https://tryhackme.com', accent: '#ef4444' },
    { id: 'ejpt', title: 'eJPTv2', badge: 'Certified', issuer: 'INE Security', date: '2024', verifyUrl: '', accent: '#38bdf8' },
    { id: 'cve', title: 'CVE Hall of Fame', badge: 'Researcher', issuer: 'Responsible Disclosure', date: '2023 - 2024', verifyUrl: '', accent: '#c084fc' }
  ];

  return (
    <DraggableWidget className="certs-widget">
      <div className="widget-title">
        <Icon name="shield" size={15} />
        <span>Verifiable Credentials & CTF</span>
        <span className="certs-count-badge">{certs.length}</span>
      </div>

      <div className="certs-grid">
        {certs.map(cert => (
          <div
            key={cert.id}
            className="cert-card"
            style={{ '--cert-accent': cert.accent || '#38bdf8' } as React.CSSProperties}
            onClick={() => {
              if (cert.verifyUrl) {
                window.open(cert.verifyUrl, '_blank');
              } else {
                s.notify(`${cert.title}: ${cert.badge} · Verified Credential`);
              }
            }}
            title={cert.verifyUrl ? `Verify ${cert.title} credential` : `${cert.title} - ${cert.badge}`}
          >
            <div className="cert-card-top">
              <span className="cert-pill" style={{ borderColor: cert.accent, color: cert.accent }}>
                {cert.badge}
              </span>
              <span className="cert-date">{cert.date}</span>
            </div>
            <strong className="cert-title">{cert.title}</strong>
            <div className="cert-issuer">
              <span>{cert.issuer}</span>
              {cert.verifyUrl && <span className="cert-arrow">↗</span>}
            </div>
          </div>
        ))}
      </div>
    </DraggableWidget>
  );
}

export function NeofetchWidget() {
  const s = useSystemContext();
  const specs = s.config?.widgets?.neofetch || {
    os: 'ZakOS 27 (macOS Sequoia / Hardened Linux)',
    host: 'Apple M-Series / Virtual Systems Rig',
    kernel: 'Linux 6.8.0-Hardened / POSIX',
    shell: 'zsh 5.9 (x86_64-darwin22.0)',
    uptime: '99.98% High Availability',
    cipher: 'AES-256-GCM / TLS 1.3 Active',
    memory: '16.11 GB / 32 GB (Active)'
  };

  return (
    <DraggableWidget className="neofetch-widget">
      <div className="widget-title">
        <Icon name="terminal" size={15} />
        <span>Hardware & Kernel Specs</span>
        <span className="neofetch-status-pill">POSIX KERNEL</span>
      </div>

      <div className="neofetch-stage">
        <div className="neofetch-art">
          <pre>{`    __/\__
   \\ _  _ /
   /  \\/  \\
  /  (..)  \\
  \\  /||\\  /
   \\/    \\/`}</pre>
          <span className="neofetch-badge">ZAKAR·OS</span>
        </div>

        <div className="neofetch-lines">
          <div><small>OS</small><span>{specs.os}</span></div>
          <div><small>KERNEL</small><span>{specs.kernel}</span></div>
          <div><small>HOST</small><span>{specs.host}</span></div>
          <div><small>CIPHER</small><strong style={{ color: '#10b981' }}>{specs.cipher}</strong></div>
          <div><small>MEMORY</small><span>{specs.memory || '16.11 GB / 32 GB (Active)'}</span></div>
          <div><small>UPTIME</small><span>{specs.uptime}</span></div>
        </div>
      </div>

      <div className="neofetch-swatches">
        {['#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'].map(c => (
          <i key={c} style={{ background: c }} />
        ))}
      </div>
    </DraggableWidget>
  );
}
