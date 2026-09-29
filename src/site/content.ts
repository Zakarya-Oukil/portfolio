import { DEFAULT_FAST_PASS } from '../os/recruitment-data';

/**
 * Public site content (seed). It is the single source the pages read, shaped so the admin can replace it
 * later. Everything here comes from the owner's stated facts or from code verified in the public repos.
 * Do not add metrics, logos, testimonials or credentials without a source.
 */

export type CredentialStatus = 'Certified' | 'In progress' | 'Candidate';
export interface Credential { name: string; status: CredentialStatus; meaning: string }

export const PROFILE = {
  name: 'Zakarya Oukil',
  surname: ['Zakarya', 'Oukil'] as const,
  line: 'Security engineer: penetration testing, detection engineering and Linux kernel security.',
  statement: 'I am a security engineer working across penetration testing, detection engineering and Linux kernel security. I hold the eJPT, I am studying for BTL1 and Security+, and I am a Master’s candidate. I build tools end to end, from reconnaissance to threat intelligence to multi-agent systems.',
  credentials: [
    { name: 'eJPT', status: 'Certified', meaning: 'Exam passed and certificate held.' },
    { name: 'BTL1', status: 'In progress', meaning: 'Studying. Not yet earned.' },
    { name: 'CompTIA Security+', status: 'In progress', meaning: 'Studying. Not yet earned.' },
    { name: 'Master’s in cybersecurity', status: 'Candidate', meaning: 'Enrolled. Degree not yet awarded.' }
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
const roleOf = (id: RolePath['id'], title: string, caseSlug: string): RolePath => {
  const r = roleText(id);
  return { id, title, line: r.summary, competencies: r.competencies, cv: { href: r.resumeUrl, filename: r.resumeFilename || 'CV.pdf' }, caseSlug };
};
export const ROLES: RolePath[] = [
  roleOf('pentest', 'Offensive security', 'zaks-spider'),
  roleOf('soc', 'SOC and threat hunting', 'sentinel-shield'),
  roleOf('systems', 'Security systems and eBPF', 'zakos')
];

export interface Fact { label: string; value: string }
export interface CaseStudy {
  slug: string;
  role: RolePath['id'];
  title: string;
  kind: string;
  summary: string;
  stack: string[];
  image: { src: string; alt: string };
  /** Full-colour copy for light or photographic versions. Only set when the image is a real screenshot. */
  imageColor?: string;
  repo: string;
  /** Owner-supplied later through the admin; rendered only when present. */
  demoUrl?: string;
  problem?: string;
  built: string[];
  facts: Fact[];
  note?: string;
}

const ILLUSTRATIVE = 'Illustrative stock photograph, printed as a halftone. It is not a screenshot of this project.';

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'zaks-spider', role: 'pentest', title: 'Zak’s Spider', kind: 'Reconnaissance and pentest toolkit',
    summary: 'A web toolkit for authorized security testing. It pairs a library of 130 pentest commands, with live target substitution, with a reconnaissance crawler and a linked notes graph.',
    stack: ['TypeScript', 'React', 'Vite', 'Vercel serverless functions', 'Mermaid'],
    image: { src: '/img/work-spider.webp', alt: 'Screenshot of the Audit Arsenal view in Zak’s Spider, showing a command with its flag explanations. Addresses shown are lab placeholders.' },
    imageColor: '/img/work-spider-color.webp',
    repo: 'https://github.com/Zakarya-Oukil/Zaks_Spider',
    built: [
      'A command library of 130 entries in 9 categories, from reconnaissance and web exploitation to Active Directory, pivoting and password cracking.',
      'Placeholders for target, port, wordlist and user are substituted across every command as you type.',
      'A reconnaissance crawler covering DNS and certificate inspection, subdomain discovery through certificate transparency logs, robots.txt parsing and security-header grading.',
      'A graph that links targets, commands and notes together, for keeping engagement notes in one place.'
    ],
    facts: [
      { label: 'Command entries', value: '130' },
      { label: 'Categories', value: '9' },
      { label: 'Language', value: 'TypeScript' }
    ],
    note: 'Built for authorized lab and training use.'
  },
  {
    slug: 'sentinel-shield', role: 'soc', title: 'Sentinel Shield', kind: 'Phishing detection platform for SOC analysts',
    summary: 'A phishing-detection service with a case-management dashboard for analysts: a Next.js front end over a FastAPI back end, with role-based access and a scikit-learn model.',
    stack: ['Python', 'FastAPI', 'scikit-learn', 'Next.js', 'PostgreSQL or SQLite', 'Docker'],
    image: { src: '/img/work-sentinel.webp', alt: ILLUSTRATIVE },
    repo: 'https://github.com/Zakarya-Oukil/sentinel-shield',
    built: [
      'A FastAPI service with ten route modules: authentication, detections, cases, analytics, models, notifications, settings, users, admin and chat.',
      'A text classifier built from TF-IDF features (up to 15,000, unigrams and bigrams) and class-balanced logistic regression, evaluated with accuracy, precision, recall and F1.',
      'JWT authentication with role-based access control, so analysts, managers and viewers see different things.',
      'A dashboard for detections, analyst cases and model management, and Docker files for self-hosting.'
    ],
    facts: [
      { label: 'API route modules', value: '10' },
      { label: 'Model', value: 'TF-IDF and logistic regression' },
      { label: 'Deployment', value: 'Docker, self-hosted' }
    ]
  },
  {
    slug: 'zakos', role: 'systems', title: 'ZakOS', kind: 'Multi-agent operating system in the browser',
    summary: 'A browser-based personal operating system: a command palette, a graph explorer, a markdown studio that reads and writes a local vault, and a cockpit for specialised AI agents.',
    stack: ['TypeScript', 'React', 'Express', 'Monaco editor', 'GSAP', 'Python and Scrapy'],
    image: { src: '/img/work-zakos.webp', alt: ILLUSTRATIVE },
    repo: 'https://github.com/Zakarya-Oukil/ZakOS',
    built: [
      'An Express server that reads and writes a local markdown vault, so notes edited in the browser stay on disk.',
      'A dual-pane editor built on Monaco with live markdown preview, diagrams and frontmatter handling.',
      'A force-directed graph of notes and links, and a searchable command matrix with parameter substitution.',
      'Agents for research, coding, pentesting, study and summarising, plus Scrapy spiders that collect AI news, CVE feeds and security blogs.'
    ],
    facts: [
      { label: 'Server code', value: 'About 1,500 lines of TypeScript' },
      { label: 'Data collectors', value: '4 Scrapy spiders' },
      { label: 'Language', value: 'TypeScript, with Python' }
    ]
  }
];
export const caseBySlug = (slug: string) => CASE_STUDIES.find(item => item.slug === slug);

export const CONTACT_COPY = {
  facts: [
    ['Availability', DEFAULT_FAST_PASS.availability],
    ['Work preference', DEFAULT_FAST_PASS.workPreference],
    ['Work authorization', DEFAULT_FAST_PASS.workAuthorization],
    ['Clearance', DEFAULT_FAST_PASS.clearance]
  ] as [string, string][],
  note: 'Candidate-provided details. Clearance eligibility is not an issued clearance, and requirements are confirmed during screening.'
};

export interface Repo { name: string; language: string; description?: string; url: string }
const gh = (name: string) => `https://github.com/Zakarya-Oukil/${name}`;
/** Public repositories, copied from GitHub. Descriptions appear only where the repository has one. */
export const REPOS: Repo[] = [
  { name: 'Zaks_Spider', language: 'TypeScript', description: 'Cyber recon, pentest arsenal and neural web.', url: gh('Zaks_Spider') },
  { name: 'sentinel-shield', language: 'TypeScript and Python', description: 'AI-powered threat intelligence for the modern SOC.', url: gh('sentinel-shield') },
  { name: 'ZakOS', language: 'TypeScript', description: 'Multi-agent AI web operating system and second-brain portfolio.', url: gh('ZakOS') },
  { name: 'Zaks_Web_Scanner', language: 'TypeScript', url: gh('Zaks_Web_Scanner') },
  { name: 'Spider-LinkGuard', language: 'TypeScript', url: gh('Spider-LinkGuard') },
  { name: 'Sentinel-AI', language: 'TypeScript', url: gh('Sentinel-AI') },
  { name: 'CryptoGraphyProject', language: 'TypeScript', url: gh('CryptoGraphyProject') },
  { name: 'BioAuth', language: 'TypeScript', description: 'Biometric authentication app with face recognition and a Supabase backend.', url: gh('BioAuth') },
  { name: 'AgenticOS', language: 'JavaScript', description: 'A personal operating system in the style of a voice-assistant cockpit.', url: gh('AgenticOS') },
  { name: 'za-campus', language: 'TypeScript', description: 'University learning management system.', url: gh('za-campus') },
  { name: 'raqaba-cloud-saas', language: 'TypeScript', description: 'Arabic-first cloud POS and inventory SaaS for Algerian retailers.', url: gh('raqaba-cloud-saas') },
  { name: 'za-chat', language: 'TypeScript', description: 'Privacy-first real-time messaging platform.', url: gh('za-chat') },
  { name: 'DzPrimeAcademy', language: 'TypeScript', description: 'Academy application.', url: gh('DzPrimeAcademy') }
];
