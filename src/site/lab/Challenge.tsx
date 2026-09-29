import React, { useEffect, useMemo, useState } from 'react';
import { mailto } from '../site-config';

/** A sandboxed login with a deliberate JWT flaw (alg none is accepted). Everything runs in this page; no server is involved. */
const SECRET = 'lab-secret-not-guessable-xk29';
const FLAG = 'FLAG{alg_none_is_never_ok}';
const enc = new TextEncoder();

const b64uFromBytes = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uFromText = (text: string) => b64uFromBytes(enc.encode(text));
const textFromB64u = (value: string) => { const pad = value.replace(/-/g, '+').replace(/_/g, '/'); return decodeURIComponent(escape(atob(pad + '==='.slice((pad.length + 3) % 4)))); };

async function sign(data: string): Promise<string> {
  if (!globalThis.crypto?.subtle) return 'sandbox-signature';
  const key = await crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64uFromBytes(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data))));
}

/** The vulnerable "server". */
async function verify(token: string): Promise<{ status: number; body: string }> {
  const parts = token.trim().split('.');
  if (parts.length < 2) return { status: 400, body: 'Malformed token.' };
  let header: { alg?: string }, payload: { sub?: string; role?: string };
  try { header = JSON.parse(textFromB64u(parts[0])); payload = JSON.parse(textFromB64u(parts[1])); } catch { return { status: 400, body: 'Token is not valid base64url JSON.' }; }
  if (header.alg === 'none') { /* the flaw: an unsigned token is trusted */ }
  else if (header.alg === 'HS256') { if ((await sign(`${parts[0]}.${parts[1]}`)) !== parts[2]) return { status: 401, body: 'Signature check failed.' }; }
  else return { status: 401, body: 'Unsupported algorithm.' };
  if (payload.role === 'admin') return { status: 200, body: `Welcome, ${payload.sub ?? 'admin'}. Vault opened. ${FLAG}` };
  return { status: 403, body: `Hello, ${payload.sub ?? 'guest'}. The vault needs role "admin".` };
}

const HINTS = [
  'A token has three dot-separated parts: header, payload and signature. The first two are just base64url-encoded JSON.',
  'The payload says who you are. What would you change? And the header says how the server should check the signature. Which value means “do not check”?',
  'Set the header algorithm to none and the role to admin, encode both, and leave the signature empty after the second dot.'
];

export function Challenge() {
  const [guest, setGuest] = useState('');
  const [token, setToken] = useState('');
  const [reply, setReply] = useState<{ status: number; body: string } | null>(null);
  const [decoded, setDecoded] = useState('');
  const [hints, setHints] = useState(0);
  const solved = reply?.status === 200;

  useEffect(() => {
    (async () => {
      const head = b64uFromText(JSON.stringify({ alg: 'HS256', typ: 'JWT' })), body = b64uFromText(JSON.stringify({ sub: 'guest', role: 'guest' }));
      const value = `${head}.${body}.${await sign(`${head}.${body}`)}`;
      setGuest(value); setToken(value);
    })();
  }, []);

  const decode = () => {
    try { const [h, p] = token.trim().split('.'); setDecoded(`header   ${textFromB64u(h)}\npayload  ${textFromB64u(p)}`); } catch { setDecoded('Could not decode that token.'); }
  };
  const send = async () => setReply(await verify(token));
  const email = useMemo(() => mailto('I solved your break-in challenge'), []);

  return <div className="v7-lab-grid">
    <div>
      <p className="v7-lab-story">A small vault API trusts a signed token. You hold a guest token. The vault only opens for role <code>admin</code>. Your job: get in without knowing the secret.</p>
      <label className="v7-field"><span>Your token</span><textarea value={token} onChange={event => setToken(event.target.value)} rows={5} spellCheck={false} aria-describedby="v7-token-help" /></label>
      <p id="v7-token-help" className="v7-lab-empty">Starts as your guest token. Edit it, then send it to the vault.</p>
      <div className="v7-lab-actions">
        <button type="button" className="v7-btn" onClick={send}>Send to the vault</button>
        <button type="button" className="v7-btn v7-btn-ghost" onClick={decode}>Decode it</button>
        <button type="button" className="v7-link" onClick={() => { setToken(guest); setReply(null); setDecoded(''); }}>Reset to guest</button>
      </div>
      {decoded && <pre className="v7-out" aria-live="polite">{decoded}</pre>}
      {reply && <pre className={`v7-out ${solved ? 'is-win' : ''}`} role="status">{`HTTP ${reply.status}\n${reply.body}`}</pre>}
    </div>
    <aside className="v7-findings">
      <h2>Hints <span>{hints} of {HINTS.length}</span></h2>
      <ol className="v7-hints">{HINTS.slice(0, hints).map(hint => <li key={hint}>{hint}</li>)}</ol>
      {hints < HINTS.length && <button type="button" className="v7-link" onClick={() => setHints(hints + 1)}>Show a hint</button>}
      {solved && <div className="v7-report">
        <h3>You are in.</h3>
        <p>The server accepted a token with <code>alg: none</code> and never checked a signature, so anyone can claim any role. This is the classic JWT “none algorithm” flaw.</p>
        <h4>The fix</h4>
        <ul><li>Keep an allow-list of algorithms and reject anything else, including none.</li><li>Always verify the signature with a fixed key and algorithm chosen by the server, never by the token.</li></ul>
        {email && <a className="v7-btn" href={email}>Tell me you solved it</a>}
      </div>}
      <p className="v7-report-note">Everything here runs in your browser. The source is readable on purpose, since the point is the idea and not the secret.</p>
    </aside>
  </div>;
}
