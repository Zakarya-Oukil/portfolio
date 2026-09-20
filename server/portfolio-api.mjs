import fs from 'node:fs';
import path from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

export function passwordHash(password, salt = randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
function passwordMatches(password, hash) {
  try { const [salt, expected] = hash.split(':'); const actual = scryptSync(password, salt, 64); const target = Buffer.from(expected, 'hex'); return target.length === actual.length && timingSafeEqual(target, actual); } catch { return false; }
}
const digest = value => createHash('sha256').update(value).digest('hex');
const readJson = (file, fallback) => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } };
function writeJson(file, value) { const temporary = `${file}.${randomBytes(6).toString('hex')}.tmp`; fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(temporary, JSON.stringify(value, null, 2), { mode: 0o600 }); fs.renameSync(temporary, file); }
function safeUrl(value, image = false) {
  if (!value) return true;
  if (typeof value !== 'string' || value.length > (image ? 2800000 : 2048)) return false;
  if (image && /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value)) return true;
  if (/^\/(?!\/)/.test(value) && !value.includes('\\')) return true;
  try { return ['https:', 'http:', 'mailto:'].includes(new URL(value).protocol); } catch { return false; }
}
export function validatePortfolio(data) {
  if (!data || !Array.isArray(data.tabs) || !Array.isArray(data.projects) || !data.config?.bio || !data.config?.widgets || data.projects.length > 100 || data.tabs.length > 30) return false;
  const strings = (item, keys) => item && keys.every(k => typeof item[k] === 'string' && item[k].length < 20000);
  if (!data.tabs.every(t => strings(t, ['id','name','slogan','title','subtitle','icon']))) return false;
  if (new Set(data.tabs.map(t => t.id)).size !== data.tabs.length || new Set(data.tabs.map(t => t.name)).size !== data.tabs.length) return false;
  if (!data.projects.every(p => strings(p, ['id','country','title','subtitle','location','description','duration','distance']) && typeof p.image === 'string' && data.tabs.some(t => t.name === p.country) && (!p.tags || (Array.isArray(p.tags) && p.tags.every(t => typeof t === 'string'))) && (!p.architecture || (Array.isArray(p.architecture) && p.architecture.every(n => strings(n, ['id','label','detail'])))) && (!p.metrics || (Array.isArray(p.metrics) && p.metrics.every(m => strings(m, ['label','value','source'])))))) return false;
  if (new Set(data.projects.map(p => p.id)).size !== data.projects.length) return false;
  if (!Array.isArray(data.config.widgets.certs) || !data.config.widgets.certs.every(c => strings(c, ['id','title','issuer','badge','date']) && (!c.status || ['certified','in-progress'].includes(c.status)) && (c.progress == null || (Number.isFinite(c.progress) && c.progress >= 0 && c.progress <= 100)))) return false;
  if (!data.config.widgets.visibility || !data.config.widgets.about || !data.config.widgets.neofetch) return false;
  if (data.config.widgets.order && (!Array.isArray(data.config.widgets.order) || !data.config.widgets.order.every(k => ['about','certs','github','neofetch','clock','telemetry','notes'].includes(k)))) return false;
  let valid = true;
  function walk(item, parent = '', depth = 0) {
    if (depth > 12) { valid = false; return; }
    if (!item || typeof item !== 'object') return;
    for (const [key, value] of Object.entries(item)) {
      if (['__proto__','constructor','prototype'].includes(key)) valid = false;
      if (typeof value === 'string' && (/url$/i.test(key) || parent === 'media' || ['image','avatar','macosToIos','iosToMacos','macosToAndroid','androidToMacos','iosToAndroid','androidToIos'].includes(key) || ['macos','ios','android'].includes(parent))) {
        if (!safeUrl(value, parent === 'media' || ['image','avatar'].includes(key) || ['macos','ios','android'].includes(parent))) valid = false;
      }
      if (typeof value === 'object') walk(value, key, depth + 1);
    }
  }
  walk(data); return valid;
}
async function readBody(req, limit = 8000000) {
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > limit) { const error = new Error('Request too large'); error.status = 413; throw error; } chunks.push(chunk); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { const error = new Error('Invalid JSON'); error.status = 400; throw error; }
}
export function createPortfolioApi({ directory = path.resolve('server'), seedFile = path.resolve('src/data/seed.json'), auth: suppliedAuth, now = Date.now } = {}) {
  const dataFile = path.join(directory, 'data.json'), sessionFile = path.join(directory, 'sessions.local.json'), messagesFile = path.join(directory, 'messages.json');
  const localAuth = readJson(path.join(directory, 'auth.local.json'), {});
  const auth = suppliedAuth || { username: process.env.ADMIN_USERNAME || localAuth.username, passwordHash: process.env.ADMIN_PASSWORD_HASH || localAuth.passwordHash };
  const sessions = readJson(sessionFile, {}), attempts = new Map();
  const saveSessions = () => writeJson(sessionFile, sessions);
  const json = (res, status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.end(JSON.stringify(body)); };
  return async function portfolioApi(req, res, next) {
    const route = (req.url || '').split('?')[0];
    if (!route.startsWith('/api/')) return next?.();
    try {
      const key = digest((req.headers.cookie || '').split(';').map(p => p.trim()).find(p => p.startsWith('zak_session='))?.slice(12) || '');
      const authenticated = !!sessions[key] && sessions[key] > now();
      const cookie = (token, age) => `zak_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      if (!['GET','HEAD'].includes(req.method)) {
        const origin = req.headers.origin;
        if ((origin && new URL(origin).host !== req.headers.host) || req.headers['sec-fetch-site'] === 'cross-site') return json(res, 403, { error: 'Cross-origin writes are not allowed' });
        if (!req.headers['content-type']?.startsWith('application/json')) return json(res, 415, { error: 'JSON required' });
      }
      if (route === '/api/admin/session' && req.method === 'GET') return json(res, authenticated ? 200 : 401, { authenticated });
      if (route === '/api/admin/login' && req.method === 'POST') {
        if (!auth.username || !auth.passwordHash) return json(res, 503, { error: 'Admin credentials must be configured on the server.' });
        const ip = req.socket.remoteAddress || 'local', attempt = attempts.get(ip);
        if (attempt && attempt.expires > now() && attempt.count >= 5) return json(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
        const body = await readBody(req, 4096);
        const validPassword = typeof body.password === 'string' && body.password.length <= 1024 && passwordMatches(body.password, auth.passwordHash);
        if (body.username !== auth.username || !validPassword) {
          if (attempts.size > 10000) attempts.clear();
          attempts.set(ip, { count: (attempt?.expires > now() ? attempt.count : 0) + 1, expires: now() + 900000 });
          return json(res, 401, { error: 'Invalid username or password.' });
        }
        attempts.delete(ip); const token = randomBytes(32).toString('hex');
        for (const id of Object.keys(sessions)) if (sessions[id] <= now()) delete sessions[id];
        delete sessions[key]; sessions[digest(token)] = now() + 7 * 86400000; saveSessions();
        res.setHeader('Set-Cookie', cookie(token, 7 * 86400)); return json(res, 200, { success: true });
      }
      if (route === '/api/admin/logout' && req.method === 'POST') { delete sessions[key]; saveSessions(); res.setHeader('Set-Cookie', cookie('', 0)); return json(res, 200, { success: true }); }
      if (route === '/api/portfolio-data' && req.method === 'GET') return json(res, 200, readJson(dataFile, readJson(seedFile, {})));
      if (route === '/api/mail' && req.method === 'POST') {
        const ip = `mail:${req.socket.remoteAddress}`, attempt = attempts.get(ip);
        if (attempt?.expires > now() && attempt.count >= 5) return json(res, 429, { error: 'Please wait before sending another inquiry.' });
        const body = await readBody(req, 20000);
        if (!['name','email','subject','message'].every(k => typeof body[k] === 'string' && body[k].trim() && body[k].length <= 8000) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return json(res, 400, { error: 'Complete all inquiry fields with a valid email.' });
        attempts.set(ip, { count: (attempt?.expires > now() ? attempt.count : 0) + 1, expires: now() + 900000 });
        const messages = readJson(messagesFile, []); if (messages.length >= 1000) return json(res, 503, { error: 'Inbox is full. Please use a published contact link.' });
        const id = randomBytes(12).toString('hex'); messages.unshift({ id, name: body.name, email: body.email, subject: body.subject, message: body.message, timestamp: new Date(now()).toISOString(), read: false }); writeJson(messagesFile, messages);
        return json(res, 200, { success: true, id, message: 'Inquiry saved to the portfolio inbox.' });
      }
      if (!authenticated) return json(res, 401, { error: 'Your admin session has expired. Sign in again.' });
      if (route === '/api/portfolio-data' && req.method === 'POST') {
        const body = await readBody(req);
        if (!validatePortfolio(body)) return json(res, 400, { error: 'Invalid portfolio data. Check categories, required fields, progress, and URLs.' });
        delete body._localOnly; body.lastUpdated = new Date(now()).toISOString(); writeJson(dataFile, body); return json(res, 200, { success: true, data: body });
      }
      if (route === '/api/messages' && req.method === 'GET') return json(res, 200, readJson(messagesFile, []));
      if (route === '/api/messages/delete' && req.method === 'POST') { const { id } = await readBody(req, 4096); writeJson(messagesFile, readJson(messagesFile, []).filter(m => m.id !== id)); return json(res, 200, { success: true }); }
      return json(res, 404, { error: 'Endpoint not found' });
    } catch (error) { return json(res, error.status || 500, { error: error.status ? error.message : 'The server could not complete this request.' }); }
  };
}
