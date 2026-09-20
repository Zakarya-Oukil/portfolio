import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('server/data.json', 'utf8'));
data.config.recruiter = { degree: 'Final Year Master’s Degree in Cybersecurity & Systems Architecture', focus: 'Zero-Trust • Systems Defense', email: '', bookingUrl: '', resumeUrl: '', philosophy: 'Assume breach. Minimize trust. Make every defensive decision observable, testable, and reversible.', whyHire: 'I connect offensive security thinking with full-stack engineering: understanding how systems fail, then building interfaces and defenses people can actually use.' };
data.config.widgets.certs = [
  { id: 'ejpt', title: 'eJPT', badge: 'Certified', status: 'certified', issuer: 'INE Security', date: '', credentialId: '', verifyUrl: '', active: true, accent: '#71e8bc' },
  { id: 'btl1', title: 'BTL1', badge: 'In Progress', status: 'in-progress', issuer: 'Security Blue Team', date: '', credentialId: '', verifyUrl: '', active: true, accent: '#8bb8ff' },
  { id: 'security-plus', title: 'CompTIA Security+', badge: 'In Progress', status: 'in-progress', issuer: 'CompTIA', date: '', credentialId: '', verifyUrl: '', active: true, accent: '#c4a7ff' }
];
data.config.widgets.order = ['about', 'certs', 'neofetch', 'github', 'clock', 'telemetry', 'notes'];
data.config.media = { macosToIos: '', iosToAndroid: '' };
for (const [i, project] of data.projects.entries()) {
  project.featured = [0, 4, 12].includes(i);
  project.codeUrl = ''; project.demoUrl = '';
  project.metrics = [];
  project.architecture = project.location.split(' / ').map((label, n) => ({ id: `node-${n}`, label, detail: `${label} — part of the project’s reported technology stack. Add implementation details in admin.` }));
}
fs.writeFileSync('src/data/seed.json', JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync('server/data.json', JSON.stringify(data, null, 2) + '\n');
