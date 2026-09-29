import React, { useEffect, useRef, useState } from 'react';
import {
  AppIcon,
  Icon,
  KaliDragonIcon,
  BespokeArsenalIcon,
  BespokePentestIcon,
  BespokeSocIcon,
  BespokeResearchIcon,
  BespokePdfIcon,
  BespokeCertSigIcon,
  BespokeScriptIcon,
  BespokeQuickstartActionIcon,
  BespokeDefenseActionIcon,
  BespokeTerminalActionIcon,
  BespokeResumeActionIcon
} from './Icon';
import { AppId, appNames, apps, Mode, useSaved, useSystemContext, WindowState, MissionHudConfig } from './state';
import { Application, Dock } from './Shell';
import { AboutMeWidget, CertificationsWidget, ClockWidget, GithubWidget, NeofetchWidget, NotesWidget, TelemetryWidget } from './Widgets';

function KaliTopPanel() {
  const s = useSystemContext();
  const [menu, setMenu] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const dismiss = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false);
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [menu]);

  const kaliCategories = [
    { num: '00', name: 'Red vs. Blue Incident Replay', desc: 'Interactive attack, detection and kernel containment campaign', action: () => s.open('incident-replay') },
    { num: '01', name: 'Offensive Pentest Audits & CVEs', desc: 'eJPT methodology, exploit chains, CVSS v3.1 calculator', action: () => s.open('pentest-reports') },
    { num: '02', name: 'SOC Threat Hunting Center', desc: 'BTL1 SOC operations, Sigma/Suricata rules, SIEM telemetry', action: () => s.open('soc-hunting') },
    { num: '03', name: 'Master’s Thesis & Kernel Research', desc: 'Adversarial ML, eBPF LSM sandboxing, benchmarks', action: () => s.open('masters-research') },
    { num: '04', name: 'Flagship Security Projects Arsenal', desc: 'Top developed tools, zero-trust runtimes, reverse engineering', action: () => s.open('projects') },
    { num: '05', name: 'Interactive Terminal (Zsh Shell)', desc: 'Kali Zsh environment with security utilities', action: () => s.open('terminal') },
    { num: '06', name: 'Cryptographic Credentials & Attestation', desc: 'eJPT, BTL1, CompTIA Security+, GPG key verification', action: () => s.open('credentials-sig') },
    { num: '07', name: 'Tactical Script Automation', desc: 'Run live_soc_alert.sh interactive incident runner', action: () => s.open('live-soc-script') },
    { num: '08', name: 'Systems & Hardware Config', desc: 'Kernel settings, appearance, widgets, audio', action: () => s.open('settings') }
  ];

  return (
    <div className="menu-bar kali-panel" ref={menuRef}>
      <div className="menu-left">
        <button
          className={`kali-menu-btn ${menu ? 'active' : ''}`}
          aria-label="Kali Linux Applications Menu"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <KaliDragonIcon size={18} color="#38bdf8" />
          <span>Applications</span>
        </button>

        {/* Kali Workspace Switchers */}
        <div className="kali-workspaces" aria-label="Virtual Desktops">
          {[1, 2, 3, 4].map(ws => (
            <button
              key={ws}
              className={`kali-ws-btn ${activeWorkspace === ws ? 'active' : ''}`}
              onClick={() => {
                setActiveWorkspace(ws);
                s.notify(`Switched to Virtual Workspace [${ws}]`);
              }}
              title={`Virtual Workspace ${ws}`}
            >
              {ws}
            </button>
          ))}
        </div>

        {/* Active Application / Window Title */}
        <div className="kali-active-title">
          <span className="kali-prompt-glyph">┌─</span>
          <strong>{s.active ? appNames[s.active] : 'kali-workstation'}</strong>
        </div>
      </div>

      {/* Center: Dual-Plex Operator Stance & Recruiter Brief */}
      <div className="menu-center-cluster">
        <div className="operator-stance-selector" title="Dual-Plex Stance: Red Team (Offense) vs Blue Team (Defense)">
          <button
            className={`stance-btn red ${s.operatorStance === 'red' ? 'active' : ''}`}
            onClick={() => {
              s.setOperatorStance('red');
              s.notify('Operator Stance: [RED TEAM ⚔️] Exploits, eJPT & Attack Chains');
            }}
          >
            ⚔️ RED
          </button>
          <button
            className={`stance-btn blue ${s.operatorStance === 'blue' ? 'active' : ''}`}
            onClick={() => {
              s.setOperatorStance('blue');
              s.notify('Operator Stance: [BLUE TEAM 🛡️] SOC, BTL1 & Threat Hunting');
            }}
          >
            🛡️ BLUE
          </button>
        </div>

        {/* Recruiter Fast-Pass Pill */}
        <button className="recruiter-pill menu-brief" onClick={() => s.setFastPassOpen(true)}>
          ⚡ Recruiter Fast-Pass
        </button>

        {/* Quick Center HUD rescue button */}
        <button
          className="recruiter-pill menu-center-hud"
          title="Instantly re-center the Mission HUD to default location"
          onClick={() => {
            try { localStorage.removeItem('zak.hud.pos'); } catch {}
            window.dispatchEvent(new CustomEvent('zak:center-hud'));
          }}
        >
          🎯 Center HUD
        </button>
      </div>

      {/* System Tray Controls */}
      <div className="menu-right">
        {/* VPN / Network Interface Indicator */}
        <div className="kali-vpn-status" title="Tun0 Secure VPN: 10.10.14.22 connected">
          <span className="vpn-dot" />
          <code>tun0: 10.10.14.22</code>
        </div>

        <button className="soc-menu-alert" title="Simulated SOC alert: Suspicious beaconing from 192.168.1.105" onClick={() => s.open('defense')}>
          <i /> SOC Alert <span>· 192.168.1.105</span>
        </button>

        <button className="sound-toggle" aria-pressed={s.soundOn} onClick={s.toggleSound}>
          {s.soundOn ? 'Sound On' : 'Mute'}
        </button>

        <span className="battery-status" title={s.battery ? 'Device battery' : 'Battery information unavailable'}>
          {s.battery ? `${s.battery.level}%` : '—'}
          <Icon name={s.battery?.charging ? 'bolt' : 'battery'} size={20} />
        </span>

        <button aria-label="Network controls" onClick={() => s.setShade(!s.shade)}>
          <Icon name="wifi" size={17} />
        </button>
        <button aria-label="Spotlight search" onClick={() => s.setSpotlight(!s.spotlight)}>
          <Icon name="search" size={16} />
        </button>
        <button aria-label="Control Center" onClick={() => s.setShade(!s.shade)}>
          <Icon name="control" size={17} />
        </button>

        <span className="menu-date">{s.time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <time>{s.time.toLocaleTimeString('en-GB')}</time>
      </div>

      {/* Authentic Kali Dropdown Menu */}
      {menu && (
        <div className="kali-dropdown-menu" role="menu">
          <div className="kali-menu-header">
            <KaliDragonIcon size={24} color="#38bdf8" />
            <div>
              <strong>KALI LINUX ROLLING 2024</strong>
              <small>Cybersecurity Lab &amp; Systems Architecture</small>
            </div>
          </div>
          <div className="kali-menu-items">
            {kaliCategories.map(cat => (
              <button
                key={cat.num}
                className="kali-cat-item"
                role="menuitem"
                onClick={() => {
                  cat.action();
                  setMenu(false);
                }}
              >
                <span className="kali-cat-num">{cat.num}</span>
                <div className="kali-cat-text">
                  <strong>{cat.name}</strong>
                  <small>{cat.desc}</small>
                </div>
                <Icon name="arrow" size={14} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Window({ state }: { state: WindowState }) {
  const s = useSystemContext();
  const node = useRef<HTMLElement>(null);
  const drag = useRef({ x: 0, y: 0, wx: 0, wy: 0, down: false });

  useEffect(() => {
    const resize = () => {
      const el = node.current;
      if (!el || state.maximized) return;
      const r = el.getBoundingClientRect();
      const dx = Math.min(0, window.innerWidth - 80 - r.left);
      const dy = Math.min(0, window.innerHeight - 125 - r.top);
      if (dx || dy) s.updateWindow(state.id, { x: Math.max(-20, state.x + dx), y: Math.max(-25, state.y + dy) });
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [state]);

  return (
    <section
      ref={node}
      aria-label={`${appNames[state.id]} window`}
      className={`app-window kali-window ${s.brief && ['dossier', 'flagships', 'quickstart'].includes(state.id) ? 'brief-tile' : ''} window-${state.id} ${state.maximized ? 'maximized' : ''} ${state.minimized ? 'minimized' : ''} ${s.active === state.id ? 'focused' : ''}`}
      style={{ '--window-x': `${state.x}px`, '--window-y': `${state.y}px`, zIndex: 100 + state.z } as React.CSSProperties}
      onPointerDownCapture={() => {
        if (s.active !== state.id) s.focus(state.id);
      }}
    >
      <header
        className="window-titlebar kali-titlebar"
        onDoubleClick={e => {
          if (!(e.target as HTMLElement).closest('button')) s.updateWindow(state.id, { maximized: !state.maximized });
        }}
        onPointerDown={e => {
          if ((e.target as HTMLElement).closest('button') || state.maximized || (s.brief && ['dossier', 'flagships', 'quickstart'].includes(state.id))) return;
          drag.current = { x: e.clientX, y: e.clientY, wx: state.x, wy: state.y, down: true };
          e.currentTarget.setPointerCapture(e.pointerId);
          s.focus(state.id);
        }}
        onPointerMove={e => {
          if (!drag.current.down || !node.current) return;
          const r = node.current.getBoundingClientRect();
          const baseX = r.left - state.x, baseY = r.top - state.y;
          s.updateWindow(state.id, {
            x: Math.max(8 - baseX, Math.min(window.innerWidth - 80 - baseX, drag.current.wx + e.clientX - drag.current.x)),
            y: Math.max(35 - baseY, Math.min(window.innerHeight - 130 - baseY, drag.current.wy + e.clientY - drag.current.y))
          });
        }}
        onPointerUp={() => { drag.current.down = false; }}
        onPointerCancel={() => { drag.current.down = false; }}
      >
        <div className="traffic-lights kali-controls">
          <button aria-label={`Close ${appNames[state.id]} window`} className="traffic-close kali-btn-close" onClick={() => s.close(state.id)}>×</button>
          <button aria-label={`Minimize ${appNames[state.id]} window`} className="traffic-minimize kali-btn-min" onClick={() => s.minimize(state.id)}>−</button>
          <button aria-label={`Maximize ${appNames[state.id]} window`} className="traffic-maximize kali-btn-max" onClick={() => s.updateWindow(state.id, { maximized: !state.maximized })}>+</button>
        </div>
        <span className="kali-window-label">
          <Icon name={state.id} size={13} />
          {appNames[state.id]}
          <span className="title-divider">::</span>
          zakarya@kali
        </span>
        <button className="window-more" aria-label="Search apps" onClick={() => s.setSpotlight(true)}>
          <Icon name="search" size={15} />
        </button>
      </header>
      <div className="window-content"><Application id={state.id} /></div>
    </section>
  );
}

/**
 * Center Mission Command HUD (Idea C)
 * High-performance tactical operator HUD with smooth dragging,
 * authentic Zsh terminal output, telemetry strip, security stack, and bespoke action icons.
 */
function DesktopMissionHUD() {
  const s = useSystemContext();
  const [hudPos, setHudPosState] = useState<{ x: number; y: number }>(() => {
    try {
      const raw = localStorage.getItem('zak.hud.pos');
      if (raw) {
        const p = JSON.parse(raw);
        if (Number.isFinite(p?.x) && Number.isFinite(p?.y)) {
          if (Math.abs(p.x) < 700 && Math.abs(p.y) < 500) {
            return { x: Math.round(p.x), y: Math.round(p.y) };
          }
        }
      }
    } catch {}
    return { x: 0, y: 0 };
  });

  const [activeTab, setActiveTab] = useState<'whoami' | 'stack' | 'labs'>('whoami');
  const [dragging, setDragging] = useState(false);
  const hudNodeRef = useRef<HTMLDivElement>(null);
  const hudPosRef = useRef(hudPos);

  const resetHudPos = () => {
    try { localStorage.removeItem('zak.hud.pos'); } catch {}
    const zeroPos = { x: 0, y: 0 };
    hudPosRef.current = zeroPos;
    setHudPosState(zeroPos);
    if (hudNodeRef.current) {
      hudNodeRef.current.style.transform = 'translate3d(0px, 0px, 0px)';
    }
    s.notify('Mission Command HUD centered');
  };

  useEffect(() => {
    // If stored position was corrupt or out of bounds, reset immediately
    try {
      const raw = localStorage.getItem('zak.hud.pos');
      if (raw) {
        const p = JSON.parse(raw);
        if (!Number.isFinite(p?.x) || !Number.isFinite(p?.y) || Math.abs(p.x) > 700 || Math.abs(p.y) > 500) {
          localStorage.removeItem('zak.hud.pos');
          resetHudPos();
        }
      }
    } catch {
      try { localStorage.removeItem('zak.hud.pos'); } catch {}
    }
  }, []);

  useEffect(() => {
    const handleCenter = () => resetHudPos();
    window.addEventListener('zak:center-hud', handleCenter);
    return () => window.removeEventListener('zak:center-hud', handleCenter);
  }, []);

  const handleDragStart = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Don't drag if clicking buttons, tabs, interactive elements, or text inputs
    if (target.closest('button, input, textarea, a, .hud-tabs-segmented, .hud-action-btn, .hud-badge, .hud-terminal-output-lines')) {
      return;
    }
    if (e.button !== 0) return; // Only left mouse button or touch

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initX = Number.isFinite(hudPosRef.current.x) ? hudPosRef.current.x : 0;
    const initY = Number.isFinite(hudPosRef.current.y) ? hudPosRef.current.y : 0;
    let currX = initX;
    let currY = initY;

    setDragging(true);

    const onPointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const dx = moveEvt.clientX - startX;
      const dy = moveEvt.clientY - startY;

      // Safe screen boundaries: HUD can NEVER be dragged off-screen
      const maxDeltaX = Math.max(120, Math.round(window.innerWidth / 2 - 180));
      const maxDeltaY = Math.max(120, Math.round(window.innerHeight - 250));

      currX = Math.max(-maxDeltaX, Math.min(maxDeltaX, initX + dx));
      currY = Math.max(-60, Math.min(maxDeltaY, initY + dy));
      hudPosRef.current = { x: currX, y: currY };

      if (hudNodeRef.current) {
        hudNodeRef.current.style.transform = `translate3d(${currX}px, ${currY}px, 0px)`;
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setDragging(false);

      // Snap to 16px magnetic grid
      const snappedX = Math.round(currX / 16) * 16;
      const snappedY = Math.round(currY / 16) * 16;
      const finalPos = { x: snappedX, y: snappedY };
      hudPosRef.current = finalPos;
      setHudPosState(finalPos);

      if (hudNodeRef.current) {
        hudNodeRef.current.style.transform = `translate3d(${snappedX}px, ${snappedY}px, 0px)`;
      }

      try {
        localStorage.setItem('zak.hud.pos', JSON.stringify(finalPos));
      } catch {}
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const hudConfig: MissionHudConfig = s.config?.missionHud || {
    title: 'ZAKARYA OUKIL',
    tagline: 'Master’s Degree Candidate in Cybersecurity · eJPT Certified · BTL1 SOC Analyst',
    promptLead: '┌──(zakarya㉿kali)-[~/portfolio]',
    promptCmd: '└─$ whoami --verbose',
    showDragon: true,
    telemetry: {
      status: 'OPERATIONAL 🟢',
      clearance: 'L3 SECOPS',
      tun0: '10.10.14.22',
      certs: 'eJPT · BTL1 · Security+'
    },
    terminalOutput: [
      'uid=1000(zakarya) gid=1000(kali) groups=1000(kali),27(sudo),1337(redteam,blueteam)',
      '[+] OPERATOR    : Zakarya Oukil (Security Researcher & Systems Architect)',
      '[+] ACADEMIC    : Master’s Degree Candidate in Cybersecurity (Zero-Trust Specialization)',
      '[+] CREDENTIALS : eJPT Verified · BTL1 SOC Analyst · CompTIA Security+',
      '[+] CAPABILITIES: Adversarial ML · Threat Hunting · Kernel Sandboxing · Exploit Chaining',
      '[+] AVAILABILITY: Open to Red Team, Blue Team, & Systems Engineering Roles'
    ],
    stackGroups: [
      {
        domain: 'Offensive & Red Team (eJPT)',
        tools: ['Ghidra', 'Burp Suite Pro', 'Metasploit', 'Nmap', 'BloodHound', 'Impacket', 'SQLmap', 'Hashcat']
      },
      {
        domain: 'Defensive & Blue Team (BTL1)',
        tools: ['Wireshark', 'Suricata / Snort', 'Splunk SIEM', 'Elastic Security', 'Volatility 3', 'Autopsy', 'Zeek']
      },
      {
        domain: 'Systems & Engineering',
        tools: ['Python (Scapy, AsyncIO)', 'C / C++', 'Linux Kernel 6.x', 'Docker Container Enclaves', 'Kubernetes', 'Git']
      }
    ],
    research: {
      title: 'Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes',
      subtitle: 'Master’s Degree Research Project & Thesis',
      abstract: 'Investigating adversarial evasion against neural intrusion detection systems and developing hardware-isolated eBPF runtime sandboxing to prevent post-exploitation privilege escalation in Linux production environments.',
      metrics: [
        { label: 'Security Repositories', value: '16+' },
        { label: 'Audited Pentest Engagements', value: '2' },
        { label: 'Hands-on Lab Scenarios', value: '100%' },
        { label: 'Uptime / Stability', value: '99.98%' }
      ]
    },
    badges: [
      { id: 'b1', label: 'eJPT Certified', type: 'certified' },
      { id: 'b2', label: 'BTL1 SOC Analyst', type: 'in-progress' },
      { id: 'b3', label: 'CompTIA Security+', type: 'in-progress' },
      { id: 'b4', label: 'MSc Cybersecurity', type: 'degree' }
    ],
    actions: [
      { id: 'a1', label: '60-Second Recruiter Brief', icon: 'quickstart', appId: 'quickstart' },
      { id: 'a2', label: 'SOC Incident Simulator', icon: 'defense', appId: 'defense' },
      { id: 'a3', label: 'Kali Zsh Shell', icon: 'terminal', appId: 'terminal' },
      { id: 'a4', label: 'Resume / CV', icon: 'about', appId: 'about' }
    ]
  };

  const executeAction = (action: any) => {
    if (action.appId === 'quickstart') s.startBrief();
    else if (action.appId === 'about' && action.label.toLowerCase().includes('resume')) {
      if (s.config?.recruiter?.resumeUrl) {
        window.open(s.config.recruiter.resumeUrl, '_blank');
      } else {
        s.notify('CV Download · Full credentials available in Dossier');
        s.open('about');
      }
    } else {
      s.open(action.appId);
    }
  };

  const renderActionIcon = (appId: string, iconFallback: string) => {
    if (appId === 'quickstart') return <BespokeQuickstartActionIcon size={20} />;
    if (appId === 'defense') return <BespokeDefenseActionIcon size={20} />;
    if (appId === 'terminal') return <BespokeTerminalActionIcon size={20} />;
    if (appId === 'about') return <BespokeResumeActionIcon size={20} />;
    return <span className="hud-fallback-icon">{iconFallback || '⚡'}</span>;
  };

  const telemetry = hudConfig.telemetry || {
    status: 'OPERATIONAL 🟢',
    clearance: 'L3 SECOPS',
    tun0: '10.10.14.22',
    certs: 'eJPT · BTL1 · Security+'
  };

  return (
    <div
      ref={hudNodeRef}
      className={`desktop-mission-hud ${dragging ? 'hud-dragging' : ''}`}
      style={{
        transform: `translate3d(${Number.isFinite(hudPos?.x) ? hudPos.x : 0}px, ${Number.isFinite(hudPos?.y) ? hudPos.y : 0}px, 0px)`,
        transition: dragging ? 'none' : 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onPointerDown={handleDragStart}
    >
      {/* Corner Cyber Reticles */}
      <span className="hud-reticle hud-reticle-tl" />
      <span className="hud-reticle hud-reticle-tr" />
      <span className="hud-reticle hud-reticle-bl" />
      <span className="hud-reticle hud-reticle-br" />

      {/* Titanium Drag Handle & Tab Bar */}
      <div
        className="hud-titlebar-bar hud-drag-handle"
        title="Click and drag anywhere to reposition Mission Command HUD (Double-click to center)"
        onDoubleClick={e => {
          if (!(e.target as HTMLElement).closest('button, .hud-tabs-segmented')) {
            resetHudPos();
          }
        }}
      >
        <div className="hud-handle-grip">
          <span className="hud-drag-dots">⠿</span>
          <span className="hud-titlebar-tag">KALI MISSION HUD</span>
          <span className="hud-drag-hint">DRAG TO MOVE</span>
          <button
            type="button"
            className="hud-reset-pos-btn"
            title="Reset HUD to center position"
            onClick={e => {
              e.stopPropagation();
              resetHudPos();
            }}
          >
            ⟲ Center
          </button>
        </div>

        <div className="hud-tabs-segmented" onPointerDown={e => e.stopPropagation()}>
          <button
            className={`hud-tab-btn ${activeTab === 'whoami' ? 'active' : ''}`}
            onClick={() => setActiveTab('whoami')}
          >
            <span>01</span> WHOAMI
          </button>
          <button
            className={`hud-tab-btn ${activeTab === 'stack' ? 'active' : ''}`}
            onClick={() => setActiveTab('stack')}
          >
            <span>02</span> STACK
          </button>
          <button
            className={`hud-tab-btn ${activeTab === 'labs' ? 'active' : ''}`}
            onClick={() => setActiveTab('labs')}
          >
            <span>03</span> LABS
          </button>
        </div>
      </div>

      {/* High-Tech Telemetry Ribbon */}
      <div className="hud-telemetry-strip">
        <div className="hud-tele-item">
          <span className="tele-dot pulse-emerald" />
          <span className="tele-label">STATUS:</span>
          <strong className="tele-val emerald">{telemetry.status}</strong>
        </div>
        <div className="hud-tele-sep">/</div>
        <div className="hud-tele-item">
          <span className="tele-label">CLEARANCE:</span>
          <strong className="tele-val cyan">{telemetry.clearance}</strong>
        </div>
        <div className="hud-tele-sep">/</div>
        <div className="hud-tele-item">
          <span className="tele-label">TUN0:</span>
          <strong className="tele-val code">{telemetry.tun0}</strong>
        </div>
        <div className="hud-tele-sep">/</div>
        <div className="hud-tele-item">
          <span className="tele-label">CERTS:</span>
          <strong className="tele-val amber">{telemetry.certs}</strong>
        </div>
      </div>

      {/* TAB 1: WHOAMI (Terminal & Identity) */}
      {activeTab === 'whoami' && (
        <>
          <div className="mission-hud-terminal">
            <div className="hud-prompt-row">
              <span className="hud-prompt-lead">{hudConfig.promptLead || '┌──(zakarya㉿kali)-[~/portfolio]'}</span>
            </div>
            <div className="hud-prompt-row">
              <span className="hud-prompt-sub">{hudConfig.promptCmd || '└─$ whoami --verbose'}</span>
            </div>
            <div className="hud-terminal-output-lines">
              {(hudConfig.terminalOutput || [
                'uid=1000(zakarya) gid=1000(kali) groups=1000(kali),27(sudo),1337(redteam,blueteam)',
                '[+] OPERATOR    : Zakarya Oukil (Security Researcher & Systems Architect)',
                '[+] ACADEMIC    : Master’s Degree Candidate in Cybersecurity (Zero-Trust Specialization)',
                '[+] CREDENTIALS : eJPT Verified · BTL1 SOC Analyst · CompTIA Security+',
                '[+] CAPABILITIES: Adversarial ML · Threat Hunting · Kernel Sandboxing · Exploit Chaining',
                '[+] AVAILABILITY: Open to Red Team, Blue Team, & Systems Engineering Roles'
              ]).map((line, i) => (
                <div key={i} className="hud-term-line">
                  {line.startsWith('[+]') ? (
                    <>
                      <span className="term-plus">[+]</span>{' '}
                      <span className="term-key">{line.slice(4, line.indexOf(':') + 1)}</span>
                      <span className="term-val">{line.slice(line.indexOf(':') + 1)}</span>
                    </>
                  ) : (
                    <span className="term-raw">{line}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mission-hud-body">
            <div className="hud-title-row">
              {hudConfig.showDragon !== false && (
                <div className="hud-dragon-badge">
                  <KaliDragonIcon size={34} color="#38bdf8" />
                </div>
              )}
              <div className="hud-identity">
                <h1>{hudConfig.title || 'ZAKARYA OUKIL'}</h1>
                <p className="hud-tagline">
                  {hudConfig.tagline || 'Master’s Degree Candidate in Cybersecurity · eJPT Certified · BTL1 SOC Analyst'}
                </p>
              </div>
            </div>

            <div className="hud-badges">
              {(hudConfig.badges || []).map(b => (
                <span key={b.id || b.label} className={`hud-badge ${b.type || 'certified'}`}>
                  <span className="badge-dot" /> {b.label}
                </span>
              ))}
            </div>

            <div className="hud-actions">
              {(hudConfig.actions || []).map(a => (
                <button
                  key={a.id || a.label}
                  className={`hud-btn ${a.appId === 'quickstart' ? 'primary' : a.appId === 'defense' ? 'defense' : a.appId === 'terminal' ? 'terminal' : 'resume'}`}
                  onClick={() => executeAction(a)}
                >
                  <span className="hud-btn-icon-wrap">{renderActionIcon(a.appId, a.icon)}</span>
                  <span className="hud-btn-text">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: SECURITY STACK & TOOLCHAIN */}
      {activeTab === 'stack' && (
        <div className="hud-stack-tab-content">
          <div className="hud-tab-header-blurb">
            <strong>OFFENSIVE &amp; DEFENSIVE TOOLCHAIN</strong>
            <p>Battle-tested in lab environments, CTF challenges, and live SOC alert pipelines.</p>
          </div>
          <div className="hud-stack-groups">
            {(hudConfig.stackGroups || [
              {
                domain: 'Offensive & Red Team (eJPT)',
                tools: ['Ghidra', 'Burp Suite Pro', 'Metasploit', 'Nmap', 'BloodHound', 'Impacket', 'SQLmap', 'Hashcat']
              },
              {
                domain: 'Defensive & Blue Team (BTL1)',
                tools: ['Wireshark', 'Suricata / Snort', 'Splunk SIEM', 'Elastic Security', 'Volatility 3', 'Autopsy', 'Zeek']
              },
              {
                domain: 'Systems & Engineering',
                tools: ['Python (Scapy, AsyncIO)', 'C / C++', 'Linux Kernel 6.x', 'Docker Container Enclaves', 'Kubernetes', 'Git']
              }
            ]).map((grp, i) => (
              <div key={i} className="hud-stack-group-card">
                <div className="stack-group-title">
                  <span className="stack-group-indicator">::</span>
                  {grp.domain}
                </div>
                <div className="stack-tools-pills">
                  {grp.tools.map((t, j) => (
                    <span key={j} className="stack-tool-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESEARCH & LAB TELEMETRY */}
      {activeTab === 'labs' && (
        <div className="hud-research-tab-content">
          <div className="hud-thesis-card">
            <div className="thesis-badge-row">
              <span className="thesis-tag">MASTER'S DEGREE THESIS</span>
              <span className="thesis-status">IN PROGRESS · 2024-2025</span>
            </div>
            <h3>{hudConfig.research?.title || 'Adversarial ML & Kernel Sandboxing in Zero-Trust Runtimes'}</h3>
            <p className="thesis-abstract">
              {hudConfig.research?.abstract ||
                'Investigating adversarial evasion against neural intrusion detection systems and developing hardware-isolated eBPF runtime sandboxing to prevent post-exploitation privilege escalation in Linux production environments.'}
            </p>
          </div>

          <div className="hud-metrics-grid">
            {(hudConfig.research?.metrics || [
              { label: 'Security Repositories', value: '16+' },
              { label: 'Audited Pentest Engagements', value: '2' },
              { label: 'Hands-on Lab Scenarios', value: '100%' },
              { label: 'Uptime / Stability', value: '99.98%' }
            ]).map((m, i) => (
              <div key={i} className="hud-metric-box">
                <strong>{m.value}</strong>
                <small>{m.label}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Desktop Lab Filesystem (Idea B)
 * Multi-column auto-flowing grid with snappy sticky drag-and-drop & bespoke SVGs
 */
function DesktopFileSystem() {
  const s = useSystemContext();

  const handleResume = () => {
    if (s.config?.recruiter?.resumeUrl) {
      window.open(s.config.recruiter.resumeUrl, '_blank');
    } else {
      s.notify('CV Download: Full credentials available in Dossier');
      s.open('about');
    }
  };

  const defaultPositions: Record<string, { col: number; row: number }> = {
    flagships: { col: 0, row: 0 },
    pentests: { col: 0, row: 1 },
    soc: { col: 0, row: 2 },
    research: { col: 0, row: 3 },
    resume: { col: 1, row: 0 },
    certs: { col: 1, row: 1 },
    incident: { col: 1, row: 2 }
  };

  const [positions, setPositions] = useSaved<Record<string, { col: number; row: number }>>(
    'zak.desktop.icon_positions',
    defaultPositions
  );

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ id: '', startX: 0, startY: 0, isDown: false, hasMoved: false });

  const files = [
    {
      id: 'flagships',
      label: '/flagship-arsenal',
      sub: 'Top Security Projects',
      icon: <BespokeArsenalIcon size={46} />,
      action: () => s.open('projects')
    },
    {
      id: 'pentests',
      label: '/pentest-reports',
      sub: 'eJPT Audits & Exploits',
      icon: <BespokePentestIcon size={46} />,
      action: () => s.open('pentest-reports')
    },
    {
      id: 'soc',
      label: '/soc-blue-team',
      sub: 'BTL1 Incident Logs',
      icon: <BespokeSocIcon size={46} />,
      action: () => s.open('soc-hunting')
    },
    {
      id: 'research',
      label: '/masters-research',
      sub: 'Cybersecurity Thesis',
      icon: <BespokeResearchIcon size={46} />,
      action: () => s.open('masters-research')
    },
    {
      id: 'resume',
      label: 'resume_zakarya.pdf',
      sub: 'Curriculum Vitae',
      icon: <BespokePdfIcon size={46} />,
      action: handleResume
    },
    {
      id: 'certs',
      label: 'credentials.sig',
      sub: 'eJPT & BTL1 Verified',
      icon: <BespokeCertSigIcon size={46} />,
      action: () => s.open('credentials-sig')
    },
    {
      id: 'incident',
      label: 'live_soc_alert.sh',
      sub: 'Interactive Defense',
      icon: <BespokeScriptIcon size={46} />,
      action: () => s.open('live-soc-script')
    }
  ];

  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      isDown: true,
      hasMoved: false
    };
    setDraggingId(id);
    setDragOffset({ x: 0, y: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (id: string, e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.isDown || dragRef.current.id !== id) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.hypot(dx, dy) > 5) {
      dragRef.current.hasMoved = true;
    }
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (file: typeof files[0], e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.isDown || dragRef.current.id !== file.id) return;
    dragRef.current.isDown = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}

    const hasMoved = dragRef.current.hasMoved;
    setDraggingId(null);

    if (hasMoved) {
      // Snap to discrete grid slots (Column step ~114px, Row step ~104px)
      const currentPos = positions[file.id] || defaultPositions[file.id] || { col: 0, row: 0 };
      const deltaCols = Math.round(dragOffset.x / 114);
      const deltaRows = Math.round(dragOffset.y / 104);
      const targetCol = Math.max(0, Math.min(5, currentPos.col + deltaCols));
      const targetRow = Math.max(0, Math.min(3, currentPos.row + deltaRows));

      setPositions(prev => ({
        ...prev,
        [file.id]: { col: targetCol, row: targetRow }
      }));
    } else {
      // Just a click without dragging -> execute action
      file.action();
    }
  };

  return (
    <div className="desktop-filesystem" aria-label="Desktop Filesystem">
      <div className="filesystem-header">
        <span className="fs-path">~/lab-workspace</span>
      </div>
      <div className="filesystem-grid snappy-desktop-grid">
        {files.map(f => {
          const pos = positions[f.id] || defaultPositions[f.id] || { col: 0, row: 0 };
          const isDragging = draggingId === f.id;
          return (
            <button
              key={f.id}
              className={`desktop-file-item ${isDragging ? 'icon-dragging' : ''}`}
              style={{
                gridColumn: pos.col + 1,
                gridRow: pos.row + 1,
                transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
                zIndex: isDragging ? 50 : 2
              }}
              onPointerDown={e => handlePointerDown(f.id, e)}
              onPointerMove={e => handlePointerMove(f.id, e)}
              onPointerUp={e => handlePointerUp(f, e)}
              onPointerCancel={e => handlePointerUp(f, e)}
              title={`${f.label} — ${f.sub}`}
            >
              <div className="file-icon-wrap">{f.icon}</div>
              <span className="file-name">{f.label}</span>
              <small className="file-sub">{f.sub}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Desktop() {
  const s = useSystemContext();
  const visibility = s.config?.widgets?.visibility || {
    about: true,
    certs: true,
    github: true,
    neofetch: true,
    telemetry: false,
    clock: false,
    notes: false
  };

  const widgets: Record<string, React.ReactNode> = {
    about: <AboutMeWidget />,
    certs: <CertificationsWidget />,
    github: <GithubWidget />,
    neofetch: <NeofetchWidget />,
    clock: <ClockWidget />,
    telemetry: <TelemetryWidget />,
    notes: <NotesWidget />
  };

  const order: string[] = s.config?.widgets?.order || Object.keys(widgets);

  // Check if any active window is open to adjust background HUD opacity
  const hasOpenWindows = s.windows.some(w => !w.minimized);

  return (
    <>
      <KaliTopPanel />

      <div className="desktop-label kali-brand-label">
        <span className="desktop-brand">
          <KaliDragonIcon size={22} color="#38bdf8" />
          <span>KALI<small>.SEC</small></span>
        </span>
        <span>CYBERSECURITY OPERATOR WORKSTATION <i /> eJPT · BTL1</span>
      </div>

      {/* Device Switcher (Kali Workstation vs Kali NetHunter) */}
      <div className="desktop-mode-switch">
        <button
          className={s.mode === 'macos' || s.mode === 'desktop' ? 'selected' : ''}
          onClick={() => s.setMode('macos')}
        >
          <Icon name="monitor" size={14} />
          <span>Kali Workstation</span>
        </button>
        <button
          className={s.mode === 'nethunter' || s.mode === 'ios' || s.mode === 'android' ? 'selected' : ''}
          onClick={() => s.setMode('nethunter')}
        >
          <Icon name="phone" size={14} />
          <span>Kali NetHunter (Tactical Mobile)</span>
        </button>
      </div>

      {/* Left Column: Interactive Lab Filesystem (Idea B) */}
      <DesktopFileSystem />

      {/* Center Stage: Mission Command HUD (Idea C) */}
      <div className={`desktop-center-stage ${hasOpenWindows ? 'stage-dimmed' : ''}`}>
        <DesktopMissionHUD />
      </div>

      {/* Right Column: Your Beloved Widgets (Preserved & Polished) */}
      <div className="desktop-widgets">
        {[...new Set([...order, ...Object.keys(widgets)])]
          .filter(id => visibility[id])
          .map(id => (
            <React.Fragment key={id}>{widgets[id]}</React.Fragment>
          ))}
      </div>

      {/* Open Floating Windows */}
      {s.windows.map(w => (
        <Window key={w.id} state={w} />
      ))}

      <div className="desktop-signature">
        <i className="status-dot" /> Available for Offensive &amp; Defensive Cybersecurity Roles
        <span>eJPT Certified · BTL1 Analyst</span>
        <button
          type="button"
          style={{
            background: 'transparent',
            border: 0,
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '9px',
            marginLeft: '8px',
            textDecoration: 'underline'
          }}
          onClick={() => {
            try { localStorage.removeItem('zak.hud.pos'); } catch {}
            window.dispatchEvent(new CustomEvent('zak:center-hud'));
          }}
        >
          [Center HUD]
        </button>
      </div>

      <Dock />
    </>
  );
}
