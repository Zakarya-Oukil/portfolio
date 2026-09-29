import React, { useState } from 'react';
import { useSystemContext, SocDetectionRule } from './state';
import { BespokeSocIcon, Icon } from './Icon';
import { AudienceSwitch, ExecutiveView, TechnicalView, ReportAudience } from './ReportAudience';
import { useCyberHeader } from './useCyberHeader';

export const DEFAULT_SOC_RULES: SocDetectionRule[] = [
  {
    id: 'rule-sysmon-lsass-dump',
    title: 'Suspicious Process Memory Access to LSASS (Mimikatz / ProcDump)',
    format: 'sigma',
    severity: 'Critical',
    mitreTactic: 'Credential Access',
    mitreTechniqueId: 'T1003.001',
    description: 'Detects unauthorized process access requests with granted access mask 0x1010 or 0x1fffff to lsass.exe indicating credential harvesting.',
    ruleSyntax: `title: Suspicious LSASS Process Access
id: a74251e1-88f2-4912-bdae-2195f190e221
status: production
description: Detects memory extraction attempts targeting lsass.exe via Sysmon EventID 10
author: Zakarya Oukil (BTL1 Verified)
logsource:
  category: process_access
  product: windows
detection:
  selection:
    TargetImage|endswith: '\\lsass.exe'
    GrantedAccess|contains:
      - '0x1010'
      - '0x1fffff'
      - '0x1410'
  filter_legit:
    SourceImage|endswith:
      - '\\MsMpEng.exe'
      - '\\csrss.exe'
  condition: selection and not filter_legit
fields:
  - ComputerName
  - SourceImage
  - TargetImage
  - GrantedAccess
falsepositives:
  - Antivirus and EDR agents performing memory scanning
level: critical
tags:
  - attack.credential_access
  - attack.t1003.001`,
    logSample: `{"EventID":10,"Channel":"Microsoft-Windows-Sysmon/Operational","SourceImage":"C:\\\\Users\\\\Operator\\\\Downloads\\\\mimikatz.exe","TargetImage":"C:\\\\Windows\\\\System32\\\\lsass.exe","GrantedAccess":"0x1010","SourceProcessId":4820,"User":"CORP\\\\operator"}`
  },
  {
    id: 'rule-suricata-cobalt-c2',
    title: 'Cobalt Strike Malleable C2 Beaconing Pattern over HTTP/S',
    format: 'suricata',
    severity: 'Critical',
    mitreTactic: 'Command and Control',
    mitreTechniqueId: 'T1071.001',
    description: 'Inspects HTTP GET queries with high jitter variance matching default Cobalt Strike malleable profiles with forged Apache/IIS headers.',
    ruleSyntax: `alert http $HOME_NET any -> $EXTERNAL_NET any (
  msg:"ZAK-SEC MALWARE Cobalt Strike Malleable C2 HTTP Beacon Detected";
  flow:established,to_server;
  http.method; content:"GET";
  http.uri; pcre:"/\\/[a-zA-Z0-9_-]{4,8}\\.gif$/";
  http.header; content:"Accept: */*";
  http.header; content:"Cookie: __cfduid=";
  threshold:type both, track by_src, count 5, seconds 60;
  reference:mitre,T1071.001;
  classtype:trojan-activity;
  sid:2098412;
  rev:2;
)`,
    logSample: `09:41:25.892011 IP 192.168.1.105.49822 > 203.0.113.42.443: Flags [P.], seq 1:482, ack 1, win 502, length 481: HTTP GET /pixel.gif HTTP/1.1`
  },
  {
    id: 'rule-yara-wmiexec',
    title: 'Impacket WMIexec Script Execution and Output Redirection',
    format: 'yara',
    severity: 'High',
    mitreTactic: 'Lateral Movement',
    mitreTechniqueId: 'T1047',
    description: 'Detects command artifact strings and output file patterns typical of Impacket wmiexec and dcomexec lateral movement routines.',
    ruleSyntax: `rule APT_Impacket_WMIexec_Artifacts {
  meta:
    description = "Detects Impacket wmiexec execution patterns in memory and logs"
    author = "Zakarya Oukil (Blue Team Level 1)"
    reference = "https://github.com/fortra/impacket"
    date = "2024-09-15"
  strings:
    $cmd1 = "cmd.exe /Q /c" ascii wide nocase
    $cmd2 = "1> \\\\\\\\127.0.0.1\\\\ADMIN$\\\\" ascii wide
    $cmd3 = "2>&1" ascii wide
    $pipe = "__output" ascii wide
  condition:
    all of ($cmd*) and $pipe
}`,
    logSample: `cmd.exe /Q /c whoami 1> \\\\127.0.0.1\\ADMIN$\\__1726958402.12 2>&1`
  }
];

export function SocCommandApp() {
  const root = useCyberHeader();
  const [audience, setAudience] = useState<ReportAudience>('executive');
  const s = useSystemContext();
  const rules: SocDetectionRule[] = s.config?.socRules || DEFAULT_SOC_RULES;
  const [selectedRuleId, setSelectedRuleId] = useState(rules[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'stream' | 'mitre'>('rules');

  const currentRule = rules.find(r => r.id === selectedRuleId) || rules[0];

  const handleCopy = async () => {
    if (!currentRule) return;
    try { await navigator.clipboard.writeText(currentRule.ruleSyntax); }
    catch { s.notify('Clipboard unavailable. Select and copy the rule text below.'); return; }
    setCopied(true);
    s.notify('Detection Rule copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatedStream = [
    { time: '09:41:25', src: '192.168.1.105', dst: '203.0.113.42', event: 'Cobalt Strike C2 Beaconing (Suricata)', sev: 'Critical', mitre: 'T1071.001' },
    { time: '09:40:12', src: '10.10.10.5', dst: '10.10.10.12', event: 'LSASS Memory Injection (Sysmon 10)', sev: 'Critical', mitre: 'T1003.001' },
    { time: '09:38:50', src: '10.10.10.22', dst: '10.10.10.5', event: 'Impacket WMIexec Remote Invocation', sev: 'High', mitre: 'T1047' },
    { time: '09:35:19', src: '172.16.4.12', dst: '172.16.4.1', event: 'SSH Brute Force: 120 failures/min', sev: 'Medium', mitre: 'T1110.001' },
    { time: '09:30:04', src: '192.168.1.50', dst: 'External-DNS', event: 'DNS Tunneling Suspicious Query Length', sev: 'High', mitre: 'T1071.004' }
  ];

  return (
    <div ref={root} className="soc-app-stage app-scroll">
      {/* Top Header */}
      <header className="soc-header">
        <div className="soc-title-wrap">
          <div className="soc-icon-badge">
            <BespokeSocIcon size={32} />
          </div>
          <div>
            <h1>SOC Command & Threat Hunting Center</h1>
            <p>BTL1 Certified Playbooks · Custom Sigma, Suricata & YARA Detection Engineering</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="soc-nav-tabs">
          <button
            className={`soc-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Icon name="shield" size={15} />
            <span>Detection Rules ({rules.length})</span>
          </button>

          <button
            className={`soc-tab-btn ${activeTab === 'stream' ? 'active' : ''}`}
            onClick={() => setActiveTab('stream')}
          >
            <Icon name="bolt" size={15} />
            <span>Live SIEM Stream</span>
          </button>

          <button
            className={`soc-tab-btn ${activeTab === 'mitre' ? 'active' : ''}`}
            onClick={() => setActiveTab('mitre')}
          >
            <Icon name="grid" size={15} />
            <span>MITRE ATT&CK Matrix</span>
          </button>
        </div>
      </header>

      {/* SECTION 1: DETECTION RULES */}
      {activeTab === 'rules' && (
        <div className="soc-body-grid">
          {/* Rules Sidebar */}
          <aside className="soc-sidebar">
            <div className="sidebar-label">Published Detection Rules</div>
            <div className="soc-rules-list">
              {rules.map(r => (
                <button
                  key={r.id}
                  className={`soc-rule-item ${selectedRuleId === r.id ? 'active' : ''}`}
                  onClick={() => setSelectedRuleId(r.id)}
                >
                  <div className="rule-item-top">
                    <span className={`rule-format-badge ${r.format.toLowerCase()}`}>{r.format.toUpperCase()}</span>
                    <span className={`rule-sev-badge ${r.severity.toLowerCase()}`}>{r.severity}</span>
                  </div>
                  <strong>{r.title}</strong>
                  <div className="rule-item-bottom">
                    <code>{r.mitreTechniqueId}</code>
                    <span>{r.mitreTactic}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Rule Detail View */}
          <main className="soc-content">
            {currentRule && (
              <article className="soc-rule-card">
                <AudienceSwitch value={audience} onChange={setAudience} />
                <div className="rule-header-meta">
                  <div>
                    <div className="rule-badge-row">
                      <span className={`rule-format-pill ${currentRule.format}`}>{currentRule.format.toUpperCase()} RULE</span>
                      <span className="mitre-tag">{currentRule.mitreTechniqueId} · {currentRule.mitreTactic}</span>
                    </div>
                    <h2>{currentRule.title}</h2>
                    <p className="rule-desc">{currentRule.description}</p>
                  </div>

                  {audience === 'technical' && <button className="tactical-pill-btn copy" onClick={handleCopy}>
                    <Icon name="code" size={15} />
                    <span>{copied ? 'Copied Rule!' : 'Copy Rule Code'}</span>
                  </button>}
                </div>

                {audience === 'executive' ? <ExecutiveView briefing={currentRule.executiveBriefing} /> : <>
                <TechnicalView briefing={currentRule.technicalBriefing} />

                {/* Rule Code Block */}
                <div className="code-block-wrapper">
                  <div className="code-block-bar">
                    <span>{currentRule.format.toUpperCase()} SPECIFICATION</span>
                    <span className="code-lang">YAML / ASCII</span>
                  </div>
                  <pre className="rule-syntax-pre">
                    <code>{currentRule.ruleSyntax}</code>
                  </pre>
                </div>

                {/* Telemetry Log Sample */}
                {currentRule.logSample && (
                  <div className="log-sample-wrapper">
                    <h4>Correlated Log Telemetry Sample</h4>
                    <pre className="log-sample-pre">
                      <code>{currentRule.logSample}</code>
                    </pre>
                  </div>
                )}
                </>}
              </article>
            )}
            {!currentRule && <p className="funnel-empty">No detection rules published yet. Check back for hunting evidence.</p>}
          </main>
        </div>
      )}

      {/* SECTION 2: LIVE SIEM STREAM */}
      {activeTab === 'stream' && (
        <section className="siem-stream-view">
          <div className="stream-header-bar">
            <div>
              <h3>Simulated SIEM Event Correlation Engine</h3>
              <p>Real-time telemetry ingestion from Linux Sysmon, Suricata NIDS, and Suricata zeek logs</p>
            </div>
            <div className="stream-status-pill">
              <span className="pulse-dot" /> LIVE INGESTION ACTIVE
            </div>
          </div>

          <div className="siem-table-wrap">
            <table className="siem-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Correlated Security Event</th>
                  <th>Severity</th>
                  <th>MITRE ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {simulatedStream.map((row, idx) => (
                  <tr key={idx}>
                    <td><code>{row.time}</code></td>
                    <td><code>{row.src}</code></td>
                    <td><code>{row.dst}</code></td>
                    <td><strong>{row.event}</strong></td>
                    <td><span className={`sev-tag ${row.sev.toLowerCase()}`}>{row.sev}</span></td>
                    <td><code>{row.mitre}</code></td>
                    <td>
                      <button
                        className="triage-btn"
                        onClick={() => {
                          s.notify(`Triage opened for alert: ${row.event}`);
                          s.open('defense');
                        }}
                      >
                        Triage Alert →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 3: MITRE ATT&CK NAVIGATOR */}
      {activeTab === 'mitre' && (
        <section className="mitre-view">
          <div className="mitre-header">
            <h3>MITRE ATT&CK Matrix Coverage</h3>
            <p>Documented defensive telemetry and detection engineering coverage across key adversarial tactics</p>
          </div>

          <div className="mitre-matrix-grid">
            <div className="mitre-column">
              <h4>Reconnaissance</h4>
              <div className="mitre-card covered">
                <strong>T1595 Active Scanning</strong>
                <small>Nmap port sweeps detected via iptables rate-limits & Suricata</small>
              </div>
              <div className="mitre-card covered">
                <strong>T1590 Gather Org Identity</strong>
                <small>Passive DNS anomaly detection in Zeek</small>
              </div>
            </div>

            <div className="mitre-column">
              <h4>Initial Access</h4>
              <div className="mitre-card covered">
                <strong>T1190 Exploit Public-Facing App</strong>
                <small>WAF SQLi & RCE signatures, Nginx ingress filters</small>
              </div>
              <div className="mitre-card covered">
                <strong>T1133 External Remote Services</strong>
                <small>SSH & VPN brute force fail2ban correlation</small>
              </div>
            </div>

            <div className="mitre-column">
              <h4>Credential Access</h4>
              <div className="mitre-card covered active-highlight">
                <strong>T1003.001 LSASS Memory</strong>
                <small>Sysmon Event ID 10 access mask 0x1010 detection</small>
              </div>
              <div className="mitre-card covered">
                <strong>T1558.003 Kerberoasting</strong>
                <small>Event ID 4769 SPN RC4 ticket request alerts</small>
              </div>
            </div>

            <div className="mitre-column">
              <h4>Command & Control</h4>
              <div className="mitre-card covered active-highlight">
                <strong>T1071.001 Web Protocols</strong>
                <small>Suricata Malleable C2 HTTP beaconing threshold rules</small>
              </div>
              <div className="mitre-card covered">
                <strong>T1071.004 DNS Tunneling</strong>
                <small>High Shannon entropy TXT/NULL record queries</small>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
