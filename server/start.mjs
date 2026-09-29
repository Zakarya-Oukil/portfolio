import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createPortfolioApi } from './portfolio-api.mjs';
process.env.NODE_ENV ||= 'production';
const root = path.resolve('dist');
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build first.');
const api = createPortfolioApi({ directory: process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve('server') });
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.mp4':'video/mp4', '.mp3':'audio/mpeg', '.woff2':'font/woff2', '.pdf':'application/pdf' };
const server = http.createServer((req, res) => api(req, res, () => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let pathname; try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end(); return; }
  const target = path.resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  let file = target;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    if (path.extname(pathname)) { res.writeHead(404); res.end(); return; }
    file = path.join(root, 'index.html');
  }
  const size = fs.statSync(file).size;
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', file.endsWith('index.html') ? 'no-cache' : pathname.startsWith('/assets/') ? 'public,max-age=86400' : 'public,max-age=3600');
  res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','strict-origin-when-cross-origin'); res.setHeader('X-Frame-Options','DENY'); res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=()'); res.setHeader('Cross-Origin-Opener-Policy','same-origin'); if (req.headers['x-forwarded-proto'] === 'https') res.setHeader('Strict-Transport-Security','max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; media-src 'self' https:; connect-src 'self' https://api.github.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range) { const start = +range[1], end = range[2] ? Math.min(+range[2], size - 1) : size - 1; if (start >= size || end < start) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); res.end(); return; } res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges':'bytes', 'Content-Length':end-start+1 }); if (req.method === 'HEAD') res.end(); else fs.createReadStream(file, { start, end }).pipe(res); }
  else { res.setHeader('Content-Length',size); if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res); }
}));
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => console.log(`Portfolio server listening on port ${process.env.PORT || 3000}`));
