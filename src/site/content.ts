import { DEFAULT_FAST_PASS } from '../os/recruitment-data';

/**
 * Public site content. Everything here is taken from existing portfolio data or the owner's
 * stated facts. Do not add metrics, logos, testimonials or credentials without a source.
 * Case-study sections are optional: an absent section renders nothing.
 */

export type CredentialStatus = 'Certified' | 'In progress' | 'Candidate';

export interface Credential { name: string; status: CredentialStatus }

export const PROFILE = {
  name: 'Zakarya Oukil',
  headline: ['I break systems,', 'then build the defenses.'],
  intro: 'Security engineer working both sides of the attack: penetration testing, detection engineering, and Linux kernel security research.',
  credentials: [
    { name: 'eJPT', status: 'Certified' },
    { name: 'BTL1', status: 'In progress' },
    { name: 'CompTIA Security+', status: 'In progress' },
    { name: "Master's in cybersecurity", status: 'Candidate' }
  ] as Credential[]
};

export interface RolePath {
  id: 'pentest' | 'soc' | 'systems';
  title: string;
  line: string;
  competencies: string[];
  cv: { href: string; filename: string };
  caseSlug: string;
}

const roleText = (id: RolePath['id']) => DEFAULT_FAST_PASS.roles.find(r => r.id === id)!;

export const ROLES: RolePath[] = [
  { id: 'pentest', title: 'Offensive security', line: roleText('pentest').summary, competencies: roleText('pentest').competencies, cv: { href: roleText('pentest').resumeUrl, filename: roleText('pentest').resumeFilename || 'CV.pdf' }, caseSlug: 'dmz-assessment' },
  { id: 'soc', title: 'SOC and threat hunting', line: roleText('soc').summary, competencies: roleText('soc').competencies, cv: { href: roleText('soc').resumeUrl, filename: roleText('soc').resumeFilename || 'CV.pdf' }, caseSlug: 'ml-intrusion-detection' },
  { id: 'systems', title: 'Security systems and eBPF', line: roleText('systems').summary, competencies: roleText('systems').competencies, cv: { href: roleText('systems').resumeUrl, filename: roleText('systems').resumeFilename || 'CV.pdf' }, caseSlug: 'ebpf-kernel-sandbox' }
];

export interface CaseStudy {
  slug: string;
  /** id of the matching record in src/data/seed.json */
  seedId: string;
  role: RolePath['id'];
  title: string;
  kind: string;
  summary: string;
  stack: string[];
  /** Optional, owner-supplied and verifiable. Rendered only when present. */
  problem?: string;
  approach?: string[];
  evidence?: { label: string; value: string; source?: string }[];
  outcome?: string;
  codeUrl?: string;
  demoUrl?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'dmz-assessment', seedId: 'sec-ejpt', role: 'pentest', title: 'eJPT and HTB DMZ suite', kind: 'Active Directory assessment',
    summary: 'Automated lateral movement, BloodHound pivoting, Kerberoasting, and token impersonation pipelines for DMZ penetration testing.',
    stack: ['Kali', 'Chisel', 'Kerberos', 'Active Directory', 'Pivoting']
  },
  {
    slug: 'ml-intrusion-detection', seedId: 'sec-ml-ids', role: 'soc', title: 'ML intrusion detection', kind: 'Random forest and Streamlit',
    summary: 'Trained an ensemble classifier on packet telemetry to detect volumetric DoS and DDoS anomalies in real time.',
    stack: ['Python', 'Scikit-Learn', 'Streamlit', 'Packet telemetry', 'Anomaly detection']
  },
  {
    slug: 'ebpf-kernel-sandbox', seedId: 'sec-ebpf', role: 'systems', title: 'eBPF kernel sandbox', kind: 'Zero-trust security monitor',
    summary: 'Attached hook points to trace execve and connect syscalls in real time, stopping unauthorized privilege escalations.',
    stack: ['C', 'Linux kernel', 'Go', 'eBPF', 'Syscall tracing']
  }
];

export const caseBySlug = (slug: string) => CASE_STUDIES.find(item => item.slug === slug);
