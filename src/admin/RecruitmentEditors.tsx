import React from 'react';
import type { ExecutiveBriefing, TechnicalBriefing, RecruiterFastPassConfig, RecruiterRole } from '../os/state';
import { emptyExecutive, emptyTechnical } from '../os/ReportAudience';
import { DEFAULT_FAST_PASS } from '../os/recruitment-data';

export function ReportBriefingEditor({ executive, technical, onExecutive, onTechnical }: {
  executive?: ExecutiveBriefing; technical?: TechnicalBriefing;
  onExecutive: (value: ExecutiveBriefing) => void; onTechnical: (value: TechnicalBriefing) => void;
}) {
  const business = { ...emptyExecutive, ...executive };
  const engineering = { ...emptyTechnical, ...technical };
  return <div className="report-briefing-editor">
    <h3>Executive briefing / C-Suite</h3>
    <p>Publish evidence and assumptions. Financial estimates and regulatory applicability need engagement-specific review.</p>
    <div className="admin-form-grid">{([
      ['financialExposure', 'Financial loss exposure'], ['regulatoryImpact', 'Regulatory impact (GDPR / PCI DSS / NIS2)'],
      ['downtimeRisk', 'Business downtime risk'], ['mitigationRoi', 'Executive ROI of mitigation'], ['assumptions', 'Evidence & assumptions']
    ] as [keyof ExecutiveBriefing, string][]).map(([key, label]) => <label className="admin-field" key={key}>{label}<textarea className="admin-textarea" rows={3} value={business[key]} onChange={e => onExecutive({ ...business, [key]: e.target.value })}/></label>)}</div>
    <h3>Technical PoC / Engineering</h3>
    <div className="admin-form-grid">{([
      ['mapping', 'CVE / MITRE mapping'], ['commands', 'Terminal commands / Payload scripts'], ['patches', 'Low-level patches / Containment'], ['validation', 'Validation & limitations']
    ] as [keyof TechnicalBriefing, string][]).map(([key, label]) => <label className="admin-field" key={key}>{label}<textarea className="admin-textarea" rows={5} value={engineering[key]} onChange={e => onTechnical({ ...engineering, [key]: e.target.value })}/></label>)}</div>
  </div>;
}

export function FastPassEditor({ value, onChange }: { value?: RecruiterFastPassConfig; onChange: (value: RecruiterFastPassConfig) => void }) {
  const data = { ...DEFAULT_FAST_PASS, ...value };
  const updateRole = (index: number, patch: Partial<RecruiterRole>) => onChange({ ...data, roles: data.roles.map((r, i) => i === index ? { ...r, ...patch } : r) });
  return <section className="cyber-admin-section"><div className="admin-view-header"><div><h2>Recruiter Fast-Pass</h2><p>Role-specific evidence, CV variants and screening essentials. Edit priority email and booking URL in Appearance → Recruiter brief &amp; contact.</p></div></div>
    <div className="admin-card"><h3>Screening essentials</h3><div className="admin-form-grid">{([
      ['workAuthorization', 'Work authorization (include applicable jurisdiction)'], ['availability', 'Notice period / Availability'], ['workPreference', 'Work preference'], ['clearance', 'Security clearance / Trust'], ['publicKeyUrl', 'Public PGP key URL (optional)']
    ] as const).map(([key, label]) => <label key={key} className="admin-field">{label}<input className="admin-input" value={data[key]} onChange={e => onChange({ ...data, [key]: e.target.value })}/></label>)}</div></div>
    {data.roles.map((role, index) => <div className="admin-card" key={role.id}><h3>{role.label}</h3><div className="admin-form-grid">
      <label className="admin-field">Role label<input className="admin-input" value={role.label} onChange={e => updateRole(index, { label: e.target.value })}/></label>
      <label className="admin-field">Summary<textarea className="admin-textarea" value={role.summary} onChange={e => updateRole(index, { summary: e.target.value })}/></label>
      <label className="admin-field">Certification badges (one per line; preserve status)<textarea className="admin-textarea" value={role.certifications.join('\n')} onChange={e => updateRole(index, { certifications: e.target.value.split('\n') })}/></label>
      <label className="admin-field">CV file URL<input className="admin-input" value={role.resumeUrl} onChange={e => updateRole(index, { resumeUrl: e.target.value })}/></label>
      {role.competencies.map((skill, i) => <label className="admin-field" key={i}>Competency {i + 1}<input className="admin-input" value={skill} onChange={e => { const next = [...role.competencies] as RecruiterRole['competencies']; next[i] = e.target.value; updateRole(index, { competencies: next }); }}/></label>)}
    </div></div>)}
  </section>;
}
