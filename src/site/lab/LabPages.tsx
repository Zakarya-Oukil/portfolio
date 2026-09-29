import React from 'react';
import { LAB_SHEETS, labBySlug } from './registry';
import { SheetLink } from '../v7/ctx';
import { SpiderRun } from './SpiderRun';
import { Chain } from './Chain';
import { Audit } from './Audit';
import { Challenge } from './Challenge';
import { Detection, Infrastructure, Radar } from './Small';
import { MissingView } from '../shared/InnerPages';

const BODY: Record<string, React.ComponentType> = {
  'spider-run': SpiderRun, 'attack-chain': Chain, audit: Audit, 'break-in': Challenge, detection: Detection, radar: Radar, infrastructure: Infrastructure
};
const NOTE: Record<string, string> = {
  Simulation: 'Simulation. Runs in your browser against a fictional target. No real system is contacted.',
  'Live check': 'Live check. Reads what this server sent you. Nothing leaves your browser.',
  Puzzle: 'Puzzle. A sandbox with a deliberate flaw. Runs in your browser.',
  'Study notes': 'Study notes. Learning material, not production work.',
  Notes: 'Notes.'
};

/** The register of lab sheets, styled as a drawing index. */
export function LabIndex() {
  return <section className="v7-section v7-lab" data-section="Lab" aria-labelledby="v7-lab-h">
    <h1 className="v7-h2" id="v7-lab-h">The lab</h1>
    <p className="v7-lede">Tools you can run right now. Each one runs in your browser against a labelled demo target, and nothing here scans a real system. Simulations say so on the sheet.</p>
    <table className="v7-register">
      <caption className="v7-sr">Lab sheet register</caption>
      <thead><tr><th scope="col">Sheet</th><th scope="col">Title</th><th scope="col">What it shows</th><th scope="col">Type</th></tr></thead>
      <tbody>{LAB_SHEETS.map(sheet => <tr key={sheet.slug}>
        <td className="v7-reg-no">{sheet.no}</td>
        <th scope="row"><SheetLink to={`/lab/${sheet.slug}`} label={sheet.title}>{sheet.title}</SheetLink></th>
        <td>{sheet.blurb}</td>
        <td className="v7-reg-kind">{sheet.kind}</td>
      </tr>)}</tbody>
    </table>
  </section>;
}

export function LabSheetView({ slug }: { slug: string }) {
  const sheet = labBySlug(slug);
  const Body = BODY[slug];
  if (!sheet || !Body) return <MissingView />;
  const index = LAB_SHEETS.findIndex(item => item.slug === slug);
  const next = LAB_SHEETS[(index + 1) % LAB_SHEETS.length];
  return <section className="v7-section v7-lab" data-section="Lab" aria-labelledby="v7-sheet-h">
    <SheetLink className="v7-link" to="/lab">All lab sheets</SheetLink>
    <h1 className="v7-h2" id="v7-sheet-h">{sheet.title}</h1>
    <p className="v7-lede">{sheet.blurb}</p>
    <p className="v7-lab-kind">{sheet.no} · {NOTE[sheet.kind]}</p>
    <div className="v7-lab-body"><Body /></div>
    <p className="v7-lab-next">Next: <SheetLink className="v7-link" to={`/lab/${next.slug}`}>{next.title}</SheetLink></p>
  </section>;
}
