import React, { useState } from 'react';
import { useSystemContext } from './state';
import { safeLink } from './portfolio-store';
import { BespokeCertSigIcon } from './Icon';

interface DisplayCredential {
  id: string;
  title: string;
  issuer?: string;
  badge?: string;
  status?: string;
  credentialId?: string;
  verifyUrl?: string;
  accent?: string;
  active?: boolean;
}

export function CredentialSigModal() {
  const s = useSystemContext();
  const [copied, setCopied] = useState(false);
  const credentials: DisplayCredential[] = (s.config?.widgets?.certs || []).filter((cert: DisplayCredential) => cert.active !== false);
  const publicKey = safeLink(s.config?.recruiterFastPass?.publicKeyUrl);

  const copyKeyLink = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(new URL(publicKey, window.location.href).href);
      setCopied(true);
      s.notify('Public key link copied. Check its fingerprint independently before use.');
    } catch {
      s.notify('Clipboard unavailable. Open the public key link to copy its address.');
    }
  };

  return <div className="cert-sig-modal app-scroll">
    <header className="cert-sig-header"><div className="sig-title-row">
      <div className="sig-icon-badge"><BespokeCertSigIcon size={34}/></div>
      <div><h1>Credentials &amp; verification</h1><p>Candidate-provided status and evidence links. No signature is verified in this browser.</p></div></div>
    </header>
    <div className="sig-terminal-box">
      <div className="sig-terminal-bar"><span>Verification boundary</span><span className="sig-status-indicator">NOT CRYPTOGRAPHICALLY VERIFIED</span></div>
      <p className="sig-terminal-output">This portfolio does not run GPG or attest a signed credential manifest. A public key, if published, is a download for independent fingerprint verification; it does not encrypt your message or establish credential validity.</p>
      <div className="sig-action-buttons">
        {publicKey ? <><a className="tactical-pill-btn primary" href={publicKey} target="_blank" rel="noreferrer">Open published public key ↗</a><button className="tactical-pill-btn" onClick={copyKeyLink}>{copied ? 'Link copied' : 'Copy public key link'}</button></> : <p className="funnel-note">No public PGP key has been published yet. Ask for direct verification evidence during screening.</p>}
      </div>
    </div>
    <div className="sig-certs-grid">
      {credentials.map(cert => <article className="sig-cert-card" key={cert.id} style={{ '--cert-glow': cert.accent || '#8bb8ff' } as React.CSSProperties}>
        <div className="sig-card-top"><span className="sig-badge-pill">{cert.status === 'in-progress' ? 'In progress' : cert.badge || cert.status || 'Status not published'}</span>{cert.credentialId && <code className="sig-cert-id">{cert.credentialId}</code>}</div>
        <h3>{cert.title}</h3><p className="sig-issuer">{cert.issuer || 'Issuer not published'}</p>
        <div className="sig-card-bottom"><span className="sig-valid-text">Candidate-provided status</span>{safeLink(cert.verifyUrl) ? <a href={safeLink(cert.verifyUrl)} target="_blank" rel="noreferrer" className="sig-verify-link">View published evidence ↗</a> : <span className="sig-pending-link">Verification link not published</span>}</div>
      </article>)}
      {!credentials.length && <p className="funnel-empty">No credentials have been published yet.</p>}
    </div>
  </div>;
}
