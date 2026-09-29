import React from 'react';
import type { ExecutiveBriefing, TechnicalBriefing } from './state';

export type ReportAudience = 'executive' | 'technical';
export const emptyExecutive: ExecutiveBriefing = {
  financialExposure: 'Not quantified for this engagement.',
  regulatoryImpact: 'Assess affected data, sector and jurisdiction before assigning compliance exposure.',
  downtimeRisk: 'Recovery scope and service dependencies require validation.',
  mitigationRoi: 'Compare implementation cost with expected incident loss avoided.',
  assumptions: 'Qualitative scenario assessment; no measured financial loss or legal determination.'
};
export const emptyTechnical: TechnicalBriefing = { mapping: '', commands: '', patches: '', validation: '' };

export function AudienceSwitch({ value, onChange }: { value: ReportAudience; onChange: (value: ReportAudience) => void }) {
  return <div className="audience-switch" role="group" aria-label="Report audience">
    <button aria-pressed={value === 'executive'} onClick={() => onChange('executive')}>👔 Executive Briefing <small>C-Suite</small></button>
    <button aria-pressed={value === 'technical'} onClick={() => onChange('technical')}>💻 Technical PoC &amp; Payload <small>Engineering</small></button>
  </div>;
}
export function ExecutiveView({ briefing }: { briefing?: ExecutiveBriefing }) {
  const data = { ...emptyExecutive, ...briefing };
  return <section className="executive-briefing" aria-label="Executive business risk">
    <dl>{([
      ['Financial loss exposure', data.financialExposure], ['Regulatory impact', data.regulatoryImpact],
      ['Business downtime risk', data.downtimeRisk], ['Executive ROI of mitigation', data.mitigationRoi]
    ] as const).map(([title, content]) => <div key={title}><dt>{title}</dt><dd>{content}</dd></div>)}</dl>
    <p className="funnel-note">Assessment basis: {data.assumptions}</p>
  </section>;
}
export function TechnicalView({ briefing }: { briefing?: TechnicalBriefing }) {
  if (!briefing) return <p className="funnel-note">Additional engineering notes have not been published. Review the evidence below.</p>;
  return <section className="technical-briefing" aria-label="Engineering implementation notes">
    <h3>CVE / MITRE mapping</h3><p>{briefing.mapping || 'No mapping published.'}</p>
    {briefing.commands && <><h3>Commands &amp; payload notes</h3><pre><code>{briefing.commands}</code></pre></>}
    {briefing.patches && <><h3>Low-level patches &amp; containment</h3><pre><code>{briefing.patches}</code></pre></>}
    <h3>Validation &amp; limitations</h3><p>{briefing.validation || 'Validation notes not yet published.'}</p>
  </section>;
}
