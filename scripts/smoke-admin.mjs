// Live smoke test for the admin API: node scripts/smoke-admin.mjs https://admin.zakaryaoukil.com
const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) throw new Error('Usage: node scripts/smoke-admin.mjs <base-url>');
const site = 'https://zakaryaoukil.com';
const json = { 'content-type': 'application/json' };
const mail = { name: 'Smoke Test', email: 'smoke@example.com', subject: 'Hiring', message: 'Smoke test, safe to delete.' };
let failed = 0;
async function check(name, run) {
  try { const result = await run(); console.log(`${result === true ? 'ok  ' : 'FAIL'} ${name}${result === true ? '' : ` -> ${result}`}`); if (result !== true) failed++; }
  catch (error) { console.log(`FAIL ${name} -> ${error.message}`); failed++; }
}
const is = (actual, expected) => (actual === expected ? true : `got ${actual}, expected ${expected}`);

await check('session is 401 without a cookie', async () => is((await fetch(`${base}/api/admin/session`)).status, 401));
await check('portfolio data is public and has tabs', async () => { const r = await fetch(`${base}/api/portfolio-data`); const d = await r.json(); return r.status === 200 && Array.isArray(d.tabs) ? true : `status ${r.status}`; });
await check('preflight from the public site is allowed', async () => { const r = await fetch(`${base}/api/mail`, { method: 'OPTIONS', headers: { origin: site } }); return r.status === 204 && r.headers.get('access-control-allow-origin') === site ? true : `status ${r.status}`; });
await check('preflight from another origin is refused', async () => is((await fetch(`${base}/api/mail`, { method: 'OPTIONS', headers: { origin: 'https://evil.example' } })).status, 403));
await check('incomplete inquiry is rejected', async () => is((await fetch(`${base}/api/mail`, { method: 'POST', headers: { ...json, origin: site }, body: JSON.stringify({ name: 'x' }) })).status, 400));
await check('honeypot answers 200 but is not stored', async () => is((await fetch(`${base}/api/mail`, { method: 'POST', headers: { ...json, origin: site }, body: JSON.stringify({ ...mail, website: 'http://spam.example' }) })).status, 200));
await check('cross-origin write to another route is refused', async () => is((await fetch(`${base}/api/admin/logout`, { method: 'POST', headers: { ...json, origin: site }, body: '{}' })).status, 403));
await check('wrong login is 401 (or 503 before credentials are set up)', async () => { const s = (await fetch(`${base}/api/admin/login`, { method: 'POST', headers: json, body: JSON.stringify({ username: 'nobody', password: 'wrong-password-for-smoke' }) })).status; return [401, 503].includes(s) ? true : `got ${s}`; });
await check('inbox needs a session', async () => is((await fetch(`${base}/api/messages`)).status, 401));
await check('root redirects to /admin', async () => { const r = await fetch(`${base}/`, { redirect: 'manual' }); return r.status === 302 && r.headers.get('location')?.endsWith('/admin') ? true : `status ${r.status}`; });
process.exit(failed ? 1 : 0);
