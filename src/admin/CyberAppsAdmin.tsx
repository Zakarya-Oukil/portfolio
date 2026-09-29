import React from 'react';
import { FastPassEditor, ReportBriefingEditor } from './RecruitmentEditors';
import {
  PentestReportItem,
  SocDetectionRule,
  MastersResearchData,
  NetHunterConfig,
  NetHunterPayload
} from '../os/state';
import { DEFAULT_PENTEST_REPORTS } from '../os/PentestReportsApp';
import { DEFAULT_SOC_RULES } from '../os/SocCommandApp';
import { DEFAULT_MASTERS_RESEARCH } from '../os/MastersResearchApp';
import { DEFAULT_NETHUNTER_PAYLOADS } from '../os/NetHunterApps';

interface CyberAppsAdminProps {
  data: any;
  setData: (data: any) => void;
  section: 'pentestReports' | 'socRules' | 'mastersResearch' | 'netHunter' | 'recruiterFastPass';
  triggerToast: (msg: string) => void;
}

export function CyberAppsAdmin({ data, setData, section, triggerToast }: CyberAppsAdminProps) {
  // Update helpers
  const updateConfig = (key: string, value: any) => {
    setData({
      ...data,
      config: {
        ...data.config,
        [key]: value
      }
    });
  };

  if (section === 'recruiterFastPass') return <FastPassEditor value={data.config?.recruiterFastPass} onChange={value => updateConfig('recruiterFastPass', value)} />;
  // --- 1. PENTEST AUDITS CMS ---
  if (section === 'pentestReports') {
    const reports: PentestReportItem[] = data.config?.pentestReports || DEFAULT_PENTEST_REPORTS;

    const handleUpdateReport = (index: number, field: keyof PentestReportItem, value: any) => {
      const updated = [...reports];
      updated[index] = { ...updated[index], [field]: value };
      updateConfig('pentestReports', updated);
    };

    const handleAddReport = () => {
      const newReport: PentestReportItem = {
        id: `audit-${Date.now()}`,
        title: 'New Red Team Penetration Test',
        clientCode: `ENG-SEC-${Math.floor(100 + Math.random() * 900)}`,
        date: 'CURRENT',
        scope: 'External / Internal Network Scope',
        severity: 'High',
        cvssScore: 8.2,
        cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
        executiveSummary: 'Identified critical path enabling compromise of internal network assets.',
        attackVector: 'Reconnaissance -> Exploitation -> Post-Exploitation',
        exploitChain: [
          {
            phase: '01. Initial Access',
            description: 'Identified unauthenticated remote service exposure.',
            codeSnippet: 'nmap -sV -sC -p- 10.10.10.15'
          }
        ],
        remediation: [
          'Restrict exposed administrative endpoints to management VPN.',
          'Enforce multi-factor authentication (MFA) across all authentication barriers.'
        ],
        verifiedStatus: 'Pending Verification'
      };
      updateConfig('pentestReports', [newReport, ...reports]);
      triggerToast('Added new pentest audit engagement.');
    };

    const handleDeleteReport = (index: number) => {
      if (!confirm(`Delete audit "${reports[index].title}"?`)) return;
      const updated = reports.filter((_, i) => i !== index);
      updateConfig('pentestReports', updated);
      triggerToast('Deleted pentest audit engagement.');
    };

    return (
      <div className="cyber-admin-section">
        <div className="admin-view-header">
          <div>
            <h2>Offensive Pentest Audits & CVE Vault</h2>
            <p>Manage real-world penetration test reports, CVSS ratings, exploit chains, and remediation proofs.</p>
          </div>
          <button className="admin-primary-btn" onClick={handleAddReport}>
            <span>+</span> Add Pentest Engagement
          </button>
        </div>

        {reports.map((report, idx) => (
          <div className="admin-card" key={report.id || idx}>
            <div className="admin-card-header">
              <h3>
                <span className={`tab-severity-badge ${report.severity.toLowerCase()}`}>{report.severity}</span>
                {report.title} <small>({report.clientCode})</small>
              </h3>
              <button className="admin-danger-btn" onClick={() => handleDeleteReport(idx)}>
                Delete Engagement
              </button>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Engagement Title</label>
                <input
                  className="admin-input"
                  value={report.title}
                  onChange={e => handleUpdateReport(idx, 'title', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Client / Lab Engagement Code</label>
                <input
                  className="admin-input"
                  value={report.clientCode}
                  onChange={e => handleUpdateReport(idx, 'clientCode', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Audit Date</label>
                <input
                  className="admin-input"
                  value={report.date}
                  onChange={e => handleUpdateReport(idx, 'date', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Severity Level</label>
                <select
                  className="admin-select"
                  value={report.severity}
                  onChange={e => handleUpdateReport(idx, 'severity', e.target.value)}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="admin-field">
                <label>CVSS v3.1 Base Score (0.0 — 10.0)</label>
                <input
                  className="admin-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={report.cvssScore}
                  onChange={e => handleUpdateReport(idx, 'cvssScore', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="admin-field">
                <label>CVSS Vector String</label>
                <input
                  className="admin-input"
                  value={report.cvssVector}
                  onChange={e => handleUpdateReport(idx, 'cvssVector', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Target Scope</label>
              <input
                className="admin-input"
                value={report.scope}
                onChange={e => handleUpdateReport(idx, 'scope', e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Executive Summary</label>
              <textarea
                className="admin-textarea"
                rows={3}
                value={report.executiveSummary}
                onChange={e => handleUpdateReport(idx, 'executiveSummary', e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Exploit Vector Summary</label>
              <input
                className="admin-input"
                value={report.attackVector}
                onChange={e => handleUpdateReport(idx, 'attackVector', e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Remediation Proof Status</label>
              <input
                className="admin-input"
                value={report.verifiedStatus}
                onChange={e => handleUpdateReport(idx, 'verifiedStatus', e.target.value)}
              />
            </div>
            <ReportBriefingEditor executive={report.executiveBriefing} technical={report.technicalBriefing} onExecutive={value => handleUpdateReport(idx, 'executiveBriefing', value)} onTechnical={value => handleUpdateReport(idx, 'technicalBriefing', value)} />
            <h3>Exploit chain</h3>
            {report.exploitChain.map((step, stepIndex) => <div key={stepIndex} className="admin-card">
              {(['phase', 'description', 'codeSnippet'] as const).map(field => <label className="admin-field" key={field}>{field}<textarea className="admin-textarea" rows={field === 'codeSnippet' ? 4 : 2} value={step[field] || ''} onChange={e => handleUpdateReport(idx, 'exploitChain', report.exploitChain.map((item, i) => i === stepIndex ? { ...item, [field]: e.target.value } : item))}/></label>)}
              <button className="admin-danger-btn" onClick={() => handleUpdateReport(idx, 'exploitChain', report.exploitChain.filter((_, i) => i !== stepIndex))}>Remove phase {stepIndex + 1}</button>
            </div>)}
            <button className="admin-primary-btn" onClick={() => handleUpdateReport(idx, 'exploitChain', [...report.exploitChain, { phase: 'New phase', description: '', codeSnippet: '' }])}>Add exploit phase</button>
            <label className="admin-field">Remediation steps (one per line)<textarea className="admin-textarea" rows={4} value={report.remediation.join('\n')} onChange={e => handleUpdateReport(idx, 'remediation', e.target.value.split('\n'))}/></label>
          </div>
        ))}
      </div>
    );
  }

  // --- 2. SOC & DETECTION RULES CMS ---
  if (section === 'socRules') {
    const rules: SocDetectionRule[] = data.config?.socRules || DEFAULT_SOC_RULES;

    const handleUpdateRule = (index: number, field: keyof SocDetectionRule, value: any) => {
      const updated = [...rules];
      updated[index] = { ...updated[index], [field]: value };
      updateConfig('socRules', updated);
    };

    const handleAddRule = () => {
      const newRule: SocDetectionRule = {
        id: `rule-${Date.now()}`,
        title: 'New Blue Team Detection Rule',
        format: 'sigma',
        severity: 'High',
        mitreTactic: 'Execution',
        mitreTechniqueId: 'T1059.001',
        description: 'Detects suspicious PowerShell command-line flags and base64 encoded strings.',
        ruleSyntax: `title: Suspicious Encoded PowerShell
id: ${crypto.randomUUID()}
status: production
description: Detects encoded PowerShell command execution
author: Zakarya Oukil
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    CommandLine|contains:
      - '-enc'
      - '-EncodedCommand'
  condition: selection
level: high`,
        logSample: `powershell.exe -NoProfile -NonInteractive -EncodedCommand SQBFAFgA`
      };
      updateConfig('socRules', [newRule, ...rules]);
      triggerToast('Added new SOC detection rule.');
    };

    const handleDeleteRule = (index: number) => {
      if (!confirm(`Delete detection rule "${rules[index].title}"?`)) return;
      const updated = rules.filter((_, i) => i !== index);
      updateConfig('socRules', updated);
      triggerToast('Deleted SOC detection rule.');
    };

    return (
      <div className="cyber-admin-section">
        <div className="admin-view-header">
          <div>
            <h2>SOC Threat Hunting & Detection Engineering</h2>
            <p>Publish custom Sigma, Suricata, and YARA rules mapped to MITRE ATT&CK techniques.</p>
          </div>
          <button className="admin-primary-btn" onClick={handleAddRule}>
            <span>+</span> Add Detection Rule
          </button>
        </div>

        {rules.map((rule, idx) => (
          <div className="admin-card" key={rule.id || idx}>
            <div className="admin-card-header">
              <h3>
                <span className={`rule-format-badge ${rule.format.toLowerCase()}`}>{rule.format.toUpperCase()}</span>
                {rule.title}
              </h3>
              <button className="admin-danger-btn" onClick={() => handleDeleteRule(idx)}>
                Delete Rule
              </button>
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label>Rule Title</label>
                <input
                  className="admin-input"
                  value={rule.title}
                  onChange={e => handleUpdateRule(idx, 'title', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Rule Format</label>
                <select
                  className="admin-select"
                  value={rule.format}
                  onChange={e => handleUpdateRule(idx, 'format', e.target.value)}
                >
                  <option value="sigma">Sigma Rule (SIEM / EDR)</option>
                  <option value="suricata">Suricata Rule (NIDS / Snort)</option>
                  <option value="yara">YARA Rule (Binary / Memory)</option>
                </select>
              </div>

              <div className="admin-field">
                <label>Severity</label>
                <select
                  className="admin-select"
                  value={rule.severity}
                  onChange={e => handleUpdateRule(idx, 'severity', e.target.value)}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="admin-field">
                <label>MITRE ATT&CK Technique ID</label>
                <input
                  className="admin-input"
                  value={rule.mitreTechniqueId}
                  onChange={e => handleUpdateRule(idx, 'mitreTechniqueId', e.target.value)}
                  placeholder="e.g. T1003.001"
                />
              </div>

              <div className="admin-field">
                <label>MITRE Tactic</label>
                <input
                  className="admin-input"
                  value={rule.mitreTactic}
                  onChange={e => handleUpdateRule(idx, 'mitreTactic', e.target.value)}
                  placeholder="e.g. Credential Access"
                />
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Description & Detection Logic</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={rule.description}
                onChange={e => handleUpdateRule(idx, 'description', e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Rule Syntax Specification (YAML / ASCII)</label>
              <textarea
                className="admin-textarea"
                style={{ fontFamily: 'monospace', fontSize: 13 }}
                rows={10}
                value={rule.ruleSyntax}
                onChange={e => handleUpdateRule(idx, 'ruleSyntax', e.target.value)}
              />
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label>Correlated Log Sample (JSON / Syslog)</label>
              <textarea
                className="admin-textarea"
                style={{ fontFamily: 'monospace', fontSize: 12 }}
                rows={3}
                value={rule.logSample || ''}
                onChange={e => handleUpdateRule(idx, 'logSample', e.target.value)}
              />
            </div>
            <ReportBriefingEditor executive={rule.executiveBriefing} technical={rule.technicalBriefing} onExecutive={value => handleUpdateRule(idx, 'executiveBriefing', value)} onTechnical={value => handleUpdateRule(idx, 'technicalBriefing', value)} />
          </div>
        ))}
      </div>
    );
  }

  // --- 3. MASTER'S RESEARCH CMS ---
  if (section === 'mastersResearch') {
    const research: MastersResearchData = data.config?.mastersResearch || DEFAULT_MASTERS_RESEARCH;

    const handleUpdateResearch = (field: keyof MastersResearchData, value: any) => {
      updateConfig('mastersResearch', {
        ...research,
        [field]: value
      });
    };

    const handleUpdateMetric = (index: number, field: 'label' | 'value', val: string) => {
      const updated = [...research.metrics];
      updated[index] = { ...updated[index], [field]: val };
      handleUpdateResearch('metrics', updated);
    };

    return (
      <div className="cyber-admin-section">
        <div className="admin-view-header">
          <div>
            <h2>Academic Research & Master's Thesis Hub</h2>
            <p>Manage your Master's degree thesis abstract, defense status, benchmarks, and citations.</p>
          </div>
        </div>

        <div className="admin-card">
          <h3>Thesis Meta & Academic Affiliation</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Thesis Title</label>
              <input
                className="admin-input"
                value={research.thesisTitle}
                onChange={e => handleUpdateResearch('thesisTitle', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Degree Name</label>
              <input
                className="admin-input"
                value={research.degreeName}
                onChange={e => handleUpdateResearch('degreeName', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>University / Institution</label>
              <input
                className="admin-input"
                value={research.institution}
                onChange={e => handleUpdateResearch('institution', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Academic Year</label>
              <input
                className="admin-input"
                value={research.year}
                onChange={e => handleUpdateResearch('year', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Defense / Publication Status</label>
              <input
                className="admin-input"
                value={research.defenseStatus}
                onChange={e => handleUpdateResearch('defenseStatus', e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Citations Count</label>
              <input
                className="admin-input"
                type="number"
                value={research.citationsCount || 0}
                onChange={e => handleUpdateResearch('citationsCount', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="admin-field" style={{ marginTop: 14 }}>
            <label>Executive Thesis Abstract</label>
            <textarea
              className="admin-textarea"
              rows={5}
              value={research.abstract}
              onChange={e => handleUpdateResearch('abstract', e.target.value)}
            />
          </div>
        </div>

        <div className="admin-card">
          <h3>Empirical Benchmark Metrics</h3>
          <p>Key experimental results displayed in the interactive benchmark visualizer.</p>
          <div className="admin-form-grid">
            {research.metrics.map((m, idx) => (
              <div key={idx} className="admin-field">
                <label>Metric #{idx + 1} Label</label>
                <input
                  className="admin-input"
                  value={m.label}
                  onChange={e => handleUpdateMetric(idx, 'label', e.target.value)}
                />
                <label style={{ marginTop: 6 }}>Metric #{idx + 1} Value</label>
                <input
                  className="admin-input"
                  value={m.value}
                  onChange={e => handleUpdateMetric(idx, 'value', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 4. NETHUNTER MOBILE CMS ---
  if (section === 'netHunter') {
    const netHunter: NetHunterConfig = data.config?.netHunter || {
      usbArsenalStatus: 'Active (Mass Storage, RNDIS, HID Emulation)',
      hidStatus: 'Mounted (/dev/hidg0, /dev/hidg1)',
      monitorMode: true,
      activePayloadId: 'payload-rev-shell',
      payloads: DEFAULT_NETHUNTER_PAYLOADS,
      recruiterQuickBrief: {
        tagline: "Master's Candidate · eJPT Certified · BTL1 SOC Analyst",
        summary: 'High-impact security researcher and systems architect specializing in zero-trust engineering, kernel-level eBPF sandboxing, and adversarial ML.',
        topHighlights: [
          'eJPT Certified & BTL1 SOC Operations',
          'Linux Kernel 6.x & eBPF Security Systems',
          'Adversarial Machine Learning Defense'
        ]
      }
    };

    const handleUpdateNetHunter = (patch: Partial<NetHunterConfig>) => {
      updateConfig('netHunter', {
        ...netHunter,
        ...patch
      });
    };

    const handleUpdatePayload = (index: number, field: keyof NetHunterPayload, value: string) => {
      const updated = [...netHunter.payloads];
      updated[index] = { ...updated[index], [field]: value };
      handleUpdateNetHunter({ payloads: updated });
    };

    return (
      <div className="cyber-admin-section">
        <div className="admin-view-header">
          <div>
            <h2>Kali NetHunter Tactical Mobile Deck</h2>
            <p>Configure the mobile cyber rig status, DuckHunter BadUSB presets, and mobile recruiter quick-brief.</p>
          </div>
        </div>

        <div className="admin-card">
          <h3>Hardware & Tactical Interface Telemetry</h3>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>USB Arsenal State</label>
              <input
                className="admin-input"
                value={netHunter.usbArsenalStatus}
                onChange={e => handleUpdateNetHunter({ usbArsenalStatus: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label>HID Interface State</label>
              <input
                className="admin-input"
                value={netHunter.hidStatus}
                onChange={e => handleUpdateNetHunter({ hidStatus: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3>Mobile 60s Recruiter Briefing Card</h3>
          <div className="admin-field">
            <label>Recruiter Subtitle / Tagline</label>
            <input
              className="admin-input"
              value={netHunter.recruiterQuickBrief?.tagline || ''}
              onChange={e =>
                handleUpdateNetHunter({
                  recruiterQuickBrief: {
                    ...netHunter.recruiterQuickBrief,
                    tagline: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="admin-field" style={{ marginTop: 12 }}>
            <label>Recruiter Summary Paragraph</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={netHunter.recruiterQuickBrief?.summary || ''}
              onChange={e =>
                handleUpdateNetHunter({
                  recruiterQuickBrief: {
                    ...netHunter.recruiterQuickBrief,
                    summary: e.target.value
                  }
                })
              }
            />
          </div>
        </div>

        <div className="admin-card">
          <h3>DuckHunter (BadUSB DuckyScript Payloads)</h3>
          {netHunter.payloads.map((p, idx) => (
            <div key={p.id || idx} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Payload Title</label>
                  <input
                    className="admin-input"
                    value={p.title}
                    onChange={e => handleUpdatePayload(idx, 'title', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Target Operating System</label>
                  <input
                    className="admin-input"
                    value={p.targetOs}
                    onChange={e => handleUpdatePayload(idx, 'targetOs', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field" style={{ marginTop: 8 }}>
                <label>Description</label>
                <input
                  className="admin-input"
                  value={p.description}
                  onChange={e => handleUpdatePayload(idx, 'description', e.target.value)}
                />
              </div>

              <div className="admin-field" style={{ marginTop: 8 }}>
                <label>DuckyScript v2 Code</label>
                <textarea
                  className="admin-textarea"
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                  rows={6}
                  value={p.script}
                  onChange={e => handleUpdatePayload(idx, 'script', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
