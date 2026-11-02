import fs from 'node:fs';
// Hostinger copies only the build output folder next to the Node entry file, so ship the server, the built site and the seed data together.
// The static-site .htaccess is left out: it would rewrite every request to a missing index.html.
const out = 'deploy-admin';
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync('dist', `${out}/dist`, { recursive: true, filter: source => !source.endsWith('.htaccess') });
for (const file of ['server/start.mjs', 'server/portfolio-api.mjs', 'src/data/seed.json']) fs.cpSync(file, `${out}/${file}`);
console.log(`Packed ${out}/`);
