export type LabKind = 'Simulation' | 'Live check' | 'Puzzle' | 'Study notes' | 'Notes';
export interface LabSheet { slug: string; no: string; title: string; blurb: string; kind: LabKind }

/** The lab register. Everything here runs in the visitor's browser against a labelled demo target. */
export const LAB_SHEETS: LabSheet[] = [
  { slug: 'spider-run', no: 'L1', title: 'Zak’s Spider, live run', blurb: 'Watch the reconnaissance steps run against a decoy target, then open a finding as a report entry.', kind: 'Simulation' },
  { slug: 'attack-chain', no: 'L2', title: 'Attack chain scrubber', blurb: 'Drag through a lab intrusion with the attack and detection traces side by side.', kind: 'Simulation' },
  { slug: 'audit', no: 'L3', title: 'Audit this site', blurb: 'Grades the security headers this server sent you, right now.', kind: 'Live check' },
  { slug: 'break-in', no: 'L4', title: 'Break-in challenge', blurb: 'A sandboxed login with a classic token flaw. Forge your way in.', kind: 'Puzzle' },
  { slug: 'detection', no: 'L5', title: 'Detection rule study', blurb: 'Sigma and Suricata rules I am practising while I study for BTL1.', kind: 'Study notes' },
  { slug: 'radar', no: 'L6', title: 'Subnet radar', blurb: 'A simulated sweep of a lab subnet.', kind: 'Simulation' },
  { slug: 'infrastructure', no: 'L7', title: 'Where this site runs', blurb: 'Docker on my own VPS, and how to check the headers yourself.', kind: 'Notes' }
];
export const labBySlug = (slug: string) => LAB_SHEETS.find(sheet => sheet.slug === slug);
