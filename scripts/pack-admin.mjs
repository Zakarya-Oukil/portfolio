import fs from 'node:fs';
// admin.zakaryaoukil.com is the built site at the web root plus the PHP API in api/ (Hostinger runs PHP; the Node runner never started).
// The static-site .htaccess is replaced by server/php/admin.htaccess, and the sitemap/robots are dropped so the admin stays out of search.
const out = 'deploy-admin';
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync('dist', out, { recursive: true, filter: source => !source.endsWith('.htaccess') });
fs.cpSync('server/php/api.php', `${out}/api/index.php`);
fs.cpSync('src/data/seed.json', `${out}/api/seed.json`);
fs.cpSync('server/php/admin.htaccess', `${out}/.htaccess`);
fs.rmSync(`${out}/sitemap.xml`, { force: true });
fs.writeFileSync(`${out}/robots.txt`, 'User-agent: *\nDisallow: /\n');
console.log(`Packed ${out}/`);
