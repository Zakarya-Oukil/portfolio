import fs from 'node:fs';
// Hostinger copies only the build output folder next to the Node entry file, so ship the server, the built site and the seed data together.
// The static-site .htaccess is left out: it would rewrite every request to a missing index.html.
const out = 'deploy-admin';
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync('dist', `${out}/dist`, { recursive: true, filter: source => !source.endsWith('.htaccess') });
for (const file of ['server/start.mjs', 'server/portfolio-api.mjs', 'src/data/seed.json']) fs.cpSync(file, `${out}/${file}`);
// The host looks for a package.json at the app root; the server uses only Node built-ins, so there are no dependencies to install.
fs.writeFileSync(`${out}/package.json`, JSON.stringify({ name: 'portfolio-admin', private: true, type: 'module', main: 'server/start.mjs', scripts: { start: 'node server/start.mjs' } }, null, 2));
console.log(`Packed ${out}/`);
