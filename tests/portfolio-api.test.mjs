import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createPortfolioApi, passwordHash, validatePortfolio } from '../server/portfolio-api.mjs';
const seed = JSON.parse(fs.readFileSync(new URL('../src/data/seed.json', import.meta.url), 'utf8'));
const auth = { username: 'test-admin', passwordHash: passwordHash('test-password-only-123') };
async function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-api-'));
  let clock = Date.now(); const api = createPortfolioApi({ directory, auth, now: () => clock });
  const server = http.createServer((req,res) => api(req,res,() => { res.writeHead(404); res.end(); }));
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); fs.rmSync(directory,{ recursive:true,force:true }); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (url, options = {}) => fetch(base + url, options);
  const post = (url, body, cookie, extra = {}) => request(url,{ method:'POST', headers:{ 'content-type':'application/json', ...(cookie ? { cookie } : {}), ...extra }, body:JSON.stringify(body) });
  const login = async () => { const res = await post('/api/admin/login',{ username:'test-admin',password:'test-password-only-123' }); assert.equal(res.status,200); return res.headers.get('set-cookie').split(';')[0]; };
  return { directory, request, post, login, advance: ms => { clock += ms; } };
}
test('seed data validates and preserves requested certification statuses', () => {
  assert.equal(validatePortfolio(seed),true);
  assert.deepEqual(seed.config.widgets.certs.map(c => c.status), ['certified','in-progress','in-progress']);
});
test('public reads work while unauthorized writes and inbox reads fail closed', async t => {
  const f = await fixture(t);
  assert.equal((await f.request('/api/portfolio-data')).status,200);
  assert.equal((await f.post('/api/portfolio-data',seed)).status,401);
  assert.equal((await f.request('/api/messages')).status,401);
  assert.equal((await f.post('/api/upload',{})).status,401);
  assert.equal((await f.post('/api/messages/delete',{id:'anything'})).status,401);
});
test('login sets an HttpOnly persistent cookie; forged tokens are rejected', async t => {
  const f = await fixture(t), cookie = await f.login();
  const session = await f.request('/api/admin/session',{ headers:{ cookie } }); assert.equal(session.status,200);
  const invalid = await f.request('/api/admin/session',{ headers:{cookie:'zak_session=forged'} }); assert.equal(invalid.status,401);
  const res = await f.post('/api/admin/login',{ username:'test-admin', password:'test-password-only-123' });
  const value = res.headers.get('set-cookie'); assert.match(value,/HttpOnly/); assert.match(value,/SameSite=Strict/); assert.match(value,/Max-Age=604800/);
  assert.equal((await res.json()).token, undefined);
});
test('authenticated publishing is persistent and visible to a fresh visitor', async t => {
  const f = await fixture(t), cookie = await f.login(); const data = structuredClone(seed); data.config.recruiter.email = 'hiring@example.com'; data._localOnly = true;
  assert.equal((await f.post('/api/portfolio-data',data,cookie)).status,200);
  const visitor = await (await f.request('/api/portfolio-data')).json(); assert.equal(visitor.config.recruiter.email,'hiring@example.com'); assert.equal(visitor._localOnly,undefined);
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.directory,'data.json'))).config.recruiter.email,'hiring@example.com');
});
test('malformed payloads and executable links are rejected', async t => {
  const f = await fixture(t), cookie = await f.login();
  assert.equal((await f.post('/api/portfolio-data',{},cookie)).status,400);
  const unsafe = structuredClone(seed); unsafe.config.recruiter.resumeUrl = 'javascript:alert(1)'; assert.equal((await f.post('/api/portfolio-data',unsafe,cookie)).status,400);
  const invalid = structuredClone(seed); invalid.projects[0].country = 'missing'; assert.equal(validatePortfolio(invalid),false);
  const duplicate = structuredClone(seed); duplicate.projects.push(duplicate.projects[0]); assert.equal(validatePortfolio(duplicate),false);
});
test('cross-origin publishing is blocked even with a valid session', async t => {
  const f = await fixture(t), cookie = await f.login();
  assert.equal((await f.post('/api/portfolio-data',seed,cookie,{ origin:'https://attacker.example' })).status,403);
});
test('logout revokes the token and expired sessions are rejected', async t => {
  const f = await fixture(t), cookie = await f.login();
  assert.equal((await f.post('/api/admin/logout',{},cookie)).status,200);
  assert.equal((await f.request('/api/admin/session',{headers:{cookie}})).status,401);
  const next = await f.login(); f.advance(8*86400000);
  assert.equal((await f.request('/api/admin/session',{headers:{cookie:next}})).status,401);
});
test('login throttles repeated failures and expires the lockout', async t => {
  const f = await fixture(t);
  for (let i=0;i<5;i++) assert.equal((await f.post('/api/admin/login',{username:'test-admin',password:'wrong'})).status,401);
  assert.equal((await f.post('/api/admin/login',{username:'test-admin',password:'wrong'})).status,429);
  f.advance(900001); await f.login();
});
test('inquiries are validated and visible only in the authenticated inbox', async t => {
  const f = await fixture(t);
  assert.equal((await f.post('/api/mail',{name:'bad'})).status,400);
  const result = await f.post('/api/mail',{name:'Test Person',email:'test@example.com',subject:'Test inquiry',message:'Local test fixture only.'}); assert.equal(result.status,200);
  const cookie = await f.login(), messages = await (await f.request('/api/messages',{headers:{cookie}})).json(); assert.equal(messages.length,1);
  assert.equal((await f.post('/api/messages/delete',{id:messages[0].id},cookie)).status,200);
  assert.deepEqual(await (await f.request('/api/messages',{headers:{cookie}})).json(),[]);
});
