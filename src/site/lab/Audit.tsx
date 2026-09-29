import React, { useCallback, useEffect, useState } from 'react';

type Status = 'pass' | 'warn' | 'fail' | 'info';
interface Check { id: string; name: string; status: Status; detail: string; why: string }

const directives = (csp: string) => {
  const map: Record<string, string> = {};
  csp.split(';').map(part => part.trim()).filter(Boolean).forEach(part => { const [name, ...rest] = part.split(/\s+/); map[name.toLowerCase()] = rest.join(' '); });
  return map;
};

/** Reads the headers this same-origin page was served with and grades them. Nothing leaves the browser. */
async function audit(): Promise<{ checks: Check[]; url: string }> {
  const res = await fetch(window.location.pathname === '/lab/audit' ? '/' : window.location.href, { cache: 'no-store' });
  const h = (name: string) => res.headers.get(name);
  const https = window.location.protocol === 'https:';
  const checks: Check[] = [];
  const add = (id: string, name: string, status: Status, detail: string, why: string) => checks.push({ id, name, status, detail, why });

  add('https', 'Served over HTTPS', https ? 'pass' : 'warn', https ? 'This page was delivered over TLS.' : 'This page came over plain HTTP, which is expected only on a local test server.', 'Without TLS, anyone on the network path can read or change the page.');

  const csp = h('content-security-policy');
  if (!csp) add('csp', 'Content-Security-Policy', 'fail', 'Header not sent.', 'A CSP limits where scripts and other resources may load from, which contains cross-site scripting.');
  else {
    const d = directives(csp), script = d['script-src'] || d['default-src'] || '';
    const weak = /'unsafe-inline'|'unsafe-eval'/.test(script) || script.includes('*');
    add('csp', 'Content-Security-Policy', weak ? 'warn' : 'pass', `script-src: ${script || 'not set'}`, 'A CSP limits where scripts and other resources may load from, which contains cross-site scripting.');
    add('csp-frame', 'Clickjacking protection', d['frame-ancestors'] || h('x-frame-options') ? 'pass' : 'fail', `frame-ancestors: ${d['frame-ancestors'] ?? 'not set'} · X-Frame-Options: ${h('x-frame-options') ?? 'not set'}`, 'Stops other sites from framing this page to trick visitors into clicking.');
    add('csp-base', 'Base URI and form targets locked', d['base-uri'] && d['form-action'] ? 'pass' : 'warn', `base-uri: ${d['base-uri'] ?? 'not set'} · form-action: ${d['form-action'] ?? 'not set'}`, 'Prevents injected markup from redirecting relative links or form submissions.');
  }
  if (!csp) add('csp-frame', 'Clickjacking protection', h('x-frame-options') ? 'pass' : 'fail', `X-Frame-Options: ${h('x-frame-options') ?? 'not set'}`, 'Stops other sites from framing this page to trick visitors into clicking.');

  add('nosniff', 'X-Content-Type-Options', h('x-content-type-options')?.toLowerCase() === 'nosniff' ? 'pass' : 'fail', h('x-content-type-options') ?? 'Header not sent.', 'Stops the browser from guessing file types, which blocks a class of content-confusion attacks.');
  add('referrer', 'Referrer-Policy', h('referrer-policy') ? 'pass' : 'fail', h('referrer-policy') ?? 'Header not sent.', 'Limits how much of the page address is sent to other sites when a visitor follows a link.');
  add('hsts', 'Strict-Transport-Security', !https ? 'info' : h('strict-transport-security') ? 'pass' : 'fail', !https ? 'Not applicable over HTTP.' : h('strict-transport-security') ?? 'Header not sent.', 'Tells browsers to use HTTPS only, which defeats downgrade attacks on later visits.');
  add('permissions', 'Permissions-Policy', h('permissions-policy') ? 'pass' : 'warn', h('permissions-policy') ?? 'Header not sent.', 'Turns off browser features (camera, microphone, location) this site never needs.');
  add('coop', 'Cross-Origin-Opener-Policy', h('cross-origin-opener-policy') ? 'pass' : 'warn', h('cross-origin-opener-policy') ?? 'Header not sent.', 'Isolates this page from windows opened by other sites.');
  const leak = h('x-powered-by') || h('server');
  add('banner', 'Server banner', h('x-powered-by') ? 'warn' : 'pass', leak ? `Sent: ${leak}` : 'No server or framework banner sent.', 'Version banners help an attacker pick exploits. Less is better.');
  add('cookies', 'Cookies', document.cookie ? 'warn' : 'pass', document.cookie ? 'Script-readable cookies are present.' : 'No script-readable cookies. The site does not track you.', 'Cookies are a common place to leak session data.');
  const external = new Set(performance.getEntriesByType('resource').map(entry => { try { const url = new URL(entry.name); return url.protocol.startsWith('http') ? url.origin : ''; } catch { return ''; } }).filter(origin => origin && origin !== window.location.origin));
  add('thirdparty', 'Third-party requests', external.size ? 'warn' : 'pass', external.size ? `Loaded from: ${[...external].join(', ')}` : 'Everything on this page loaded from this origin.', 'Every outside script or font is another party you must trust.');
  let txt = false;
  try { const t = await fetch('/.well-known/security.txt', { cache: 'no-store' }); txt = t.ok && (t.headers.get('content-type') || '').includes('text/plain'); } catch { txt = false; }
  add('sectxt', 'security.txt', txt ? 'pass' : 'info', txt ? 'A security contact is published.' : 'No security.txt published yet.', 'Gives researchers a documented way to report a problem.');
  return { checks, url: res.url };
}

const WORD: Record<Status, string> = { pass: 'Pass', warn: 'Weak', fail: 'Missing', info: 'Note' };

export function Audit() {
  const [state, setState] = useState<{ checks: Check[]; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = useCallback(async () => {
    setBusy(true); setError('');
    try { setState(await audit()); } catch { setError('The check could not read this server’s response.'); }
    setBusy(false);
  }, []);
  useEffect(() => { void run(); }, [run]);

  const graded = state?.checks.filter(check => check.status !== 'info') ?? [];
  const score = graded.filter(check => check.status === 'pass').length;
  return <div>
    <div className="v7-lab-bar">
      <p className="v7-lab-target">Server <b>{window.location.host}</b> <span>{state ? `${score} of ${graded.length} checks pass` : 'checking'}</span></p>
      <button type="button" className="v7-btn" onClick={run} disabled={busy}>{busy ? 'Checking' : 'Check again'}</button>
    </div>
    {error && <p className="v7-lab-empty" role="alert">{error}</p>}
    <ul className="v7-audit" aria-live="polite">
      {state?.checks.map(check => <li key={check.id} className={`v7-audit-row is-${check.status}`}>
        <b className="v7-audit-status">{WORD[check.status]}</b>
        <div><h3>{check.name}</h3><p className="v7-audit-detail">{check.detail}</p><p className="v7-audit-why">{check.why}</p></div>
      </li>)}
    </ul>
    <p className="v7-report-note">This grades the response of the server that delivered this page. A local development server sends fewer headers than the production server, so run it on the live site for the real result. Nothing is sent anywhere else.</p>
  </div>;
}
