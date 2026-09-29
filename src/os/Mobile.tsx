import React, { useEffect, useRef, useState } from 'react';
import { AppIcon, Icon, KaliDragonIcon, BespokePentestIcon, BespokeSocIcon, BespokeResearchIcon, BespokeCertSigIcon } from './Icon';
import { apps, appNames, Mode, modeNames, useSystemContext, AppId } from './state';
import { Application, ControlCenter, Dock } from './Shell';
import { RecruiterFastPassCard } from './NetHunterApps';

function NetHunterHome() {
  const s = useSystemContext();

  const tacticalTools: { id: AppId; name: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'incident-replay', name: 'Incident Replay', desc: 'Red vs. Blue campaign', icon: <Icon name="shield" size={24} /> },
    {
      id: 'duckhunter',
      name: 'DuckHunter',
      desc: 'BadUSB & DuckyScript',
      icon: <Icon name="bolt" size={24} />
    },
    {
      id: 'subnet-radar',
      name: 'Subnet Radar',
      desc: 'ARP & Port Scanner',
      icon: <Icon name="wifi" size={24} />
    },
    {
      id: 'pentest-reports',
      name: 'Pentest Audits',
      desc: 'eJPT CVE Reports',
      icon: <BespokePentestIcon size={24} />
    },
    {
      id: 'soc-hunting',
      name: 'SOC Hunting',
      desc: 'BTL1 Sigma Rules',
      icon: <BespokeSocIcon size={24} />
    },
    {
      id: 'masters-research',
      name: "Master's Thesis",
      desc: 'eBPF & Adversarial ML',
      icon: <BespokeResearchIcon size={24} />
    },
    {
      id: 'terminal',
      name: 'Kali Zsh Shell',
      desc: 'Chroot Terminal',
      icon: <Icon name="terminal" size={24} />
    },
    {
      id: 'projects',
      name: 'Tooling Arsenal',
      desc: '16+ Security Repos',
      icon: <Icon name="projects" size={24} />
    },
    {
      id: 'credentials-sig',
      name: 'Credentials.sig',
      desc: 'GPG Verified Manifest',
      icon: <BespokeCertSigIcon size={24} />
    },
    {
      id: 'mail',
      name: 'Transmission',
      desc: 'Encrypted Contact',
      icon: <Icon name="mail" size={24} />
    },
    {
      id: 'settings',
      name: 'NetHunter CFG',
      desc: 'Kernel & Theme',
      icon: <Icon name="settings" size={24} />
    }
  ];

  return (
    <div className={`phone-home nethunter-home ${s.active ? 'home-hidden' : ''}`} aria-hidden={!!s.active}>
      {/* Tactical Status Greeting */}
      <div className="nethunter-greeting-banner">
        <div className="nethunter-banner-brand">
          <KaliDragonIcon size={22} color="#38bdf8" />
          <span>KALI NETHUNTER <small>ROLLING</small></span>
        </div>
        <div className="nethunter-clock-row">
          <h1>{s.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</h1>
          <div className="nethunter-telemetry-pill">
            <span>tun0: 10.10.14.22</span>
            <span>USB: ARSENAL</span>
          </div>
        </div>
      </div>

      {/* Recruiter 60-Second Fast-Pass Card (Pinned directly on mobile homescreen) */}
      <RecruiterFastPassCard />
      <button className="recruiter-pill mobile-fastpass" onClick={() => s.setFastPassOpen(true)}>⚡ Recruiter Fast-Pass</button>

      {/* Tactical NetHunter Tools Grid */}
      <div className="nethunter-grid-header">
        <span>NETHUNTER TACTICAL SUITE</span>
        <small>{tacticalTools.length} MODULES READY</small>
      </div>

      <div className="nethunter-app-grid">
        {tacticalTools.map(t => (
          <button key={t.id} className="nethunter-tool-card" onClick={() => s.open(t.id)}>
            <div className="nethunter-card-icon">{t.icon}</div>
            <div className="nethunter-card-meta">
              <strong>{t.name}</strong>
              <small>{t.desc}</small>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Mini Dock */}
      <Dock mobile />
    </div>
  );
}

export function Phone() {
  const s = useSystemContext();
  const down = useRef({ x: 0, y: 0 });
  const [homeProgress, setHomeProgress] = useState(0);

  return (
    <div className="phone-stage nethunter-stage">
      {/* Intro Sidebar (Visible on Desktop viewports) */}
      <aside className="device-intro nethunter-intro">
        <div className="nethunter-intro-badge">
          <KaliDragonIcon size={20} color="#38bdf8" />
          <span>TACTICAL CYBER RIG</span>
        </div>
        <h1 className="editorial-hero-title">
          <span className="title-lead">Kali Linux</span>
          <span className="title-cursive">NetHunter.</span>
        </h1>
        <p>
          Tactical mobile penetration testing and incident response rig.<br />
          Explore offensive BadUSB tools, live packet streams, and verified credentials.
        </p>

        <div className="device-choice">
          <button
            className={s.mode === 'macos' || s.mode === 'desktop' ? 'selected' : ''}
            onClick={() => s.setMode('macos')}
          >
            <Icon name="monitor" size={16} />
            <span>Kali Workstation</span>
          </button>
          <button
            className={s.mode === 'nethunter' || s.mode === 'ios' || s.mode === 'android' ? 'selected' : ''}
            onClick={() => s.setMode('nethunter')}
          >
            <Icon name="phone" size={16} />
            <span>Kali NetHunter</span>
          </button>
        </div>

        <button className="recruiter-pill" onClick={s.startBrief}>
          ⚡ Recruiter Brief (60s)
        </button>
        <small>Touch, tap, and run simulated tactical tools.</small>
      </aside>

      {/* Tactical Ruggedized Mobile Chassis */}
      <div className="phone-frame nethunter-frame">
        <span className="phone-hardware-button one" title="Power / Lock" />
        <span className="phone-hardware-button two" title="Volume Up" />
        <span className="phone-hardware-button three" title="Volume Down" />

        <div className={`phone-screen nethunter-screen wallpaper-${s.wallpaper}`}>
          {/* Tactical Status Header */}
          <div
            className="phone-status nethunter-status-bar"
            onPointerDown={e => {
              down.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={e => {
              if (e.clientY - down.current.y > 30) s.setShade(true);
            }}
          >
            <div className="status-left">
              <time>{s.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</time>
              <span className="tactical-status-tag">wlan0mon</span>
            </div>

            <div className="status-center">
              <span className="nethunter-dragon-status">
                <KaliDragonIcon size={14} color="#38bdf8" />
              </span>
            </div>

            <div className="status-right">
              <button aria-label="Open NetHunter Controls" onClick={() => s.setShade(!s.shade)}>
                <Icon name="wifi" size={15} />
                <Icon name={s.battery?.charging ? 'bolt' : 'battery'} size={18} />
              </button>
            </div>
          </div>

          {/* Content Stage */}
          <div className="phone-content nethunter-content">
            <NetHunterHome />

            {/* Opened Mobile Windows */}
            {s.windows.map(w => (
              <div
                key={w.id}
                className={`phone-application nethunter-application ${s.active === w.id ? 'visible' : ''}`}
                style={{
                  transform: s.active === w.id ? `translateY(${-homeProgress * 0.2}px) scale(${1 - homeProgress / 800})` : undefined,
                  opacity: s.active === w.id ? 1 - homeProgress / 250 : undefined
                }}
              >
                <div className="phone-app-header nethunter-app-header">
                  <button aria-label="Go back" className="nethunter-back-btn" onClick={s.back}>
                    ‹ BACK
                  </button>
                  <strong className="nethunter-app-title">{appNames[w.id]}</strong>
                  <button aria-label="Go home" className="nethunter-home-btn" onClick={s.home}>
                    <KaliDragonIcon size={16} color="#38bdf8" />
                  </button>
                </div>
                <Application id={w.id} />
              </div>
            ))}
          </div>

          {/* Recents Drawer */}
          {s.recents && (
            <div className="recents nethunter-recents">
              <header>
                <h2>NetHunter Active Chroot Tasks</h2>
                <button aria-label="Close recents" onClick={() => s.setRecents(false)}>
                  <Icon name="close" />
                </button>
              </header>
              <div className="recents-cards">
                {s.windows.map(w => (
                  <div key={w.id} className="recents-card-item">
                    <button onClick={() => s.open(w.id)}>
                      <AppIcon id={w.id} />
                      <h3>{appNames[w.id]}</h3>
                      <p>Running in Kali Chroot</p>
                    </button>
                    <button className="recent-close" onClick={() => s.close(w.id)} aria-label={`Close ${appNames[w.id]}`}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {!s.windows.length && <p>No active background chroot tasks.</p>}
              <button
                className="secondary-button"
                onClick={() => {
                  s.windows.forEach(w => s.close(w.id));
                  s.home();
                }}
              >
                Terminate All Chroot Tasks
              </button>
            </div>
          )}

          {/* Control Center */}
          {s.shade && <ControlCenter />}

          {/* NetHunter Tactical Cyber Navigation Bar */}
          <nav className="nethunter-navigation-bar" aria-label="NetHunter Navigation">
            <button aria-label="Back" onClick={s.back} className="nav-btn">
              ◀ BACK
            </button>
            <button aria-label="Kali NetHunter Home" onClick={s.home} className="nav-btn center">
              <KaliDragonIcon size={18} color="#38bdf8" />
            </button>
            <button aria-label="Chroot Recents" onClick={() => s.setRecents(!s.recents)} className="nav-btn">
              ■ CHROOT
            </button>
          </nav>
        </div>
      </div>

      <span className="device-caption">
        Kali NetHunter 2024.3 <span>·</span> Interactive Mobile Cyber Rig
      </span>
    </div>
  );
}
