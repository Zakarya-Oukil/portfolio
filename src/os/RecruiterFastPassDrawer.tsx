import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { DEFAULT_FAST_PASS } from './recruitment-data';
import { safeLink } from './portfolio-store';
import { RecruiterFastPassConfig, RecruiterRoleId, useSystemContext } from './state';

export function RecruiterFastPassDrawer({ initialRole = 'pentest', onEvidenceOpen }: { initialRole?: RecruiterRoleId; onEvidenceOpen?: () => void }) {
  const s = useSystemContext();
  const dialog = useRef<HTMLDialogElement>(null);
  const [roleId, setRoleId] = useState<RecruiterRoleId>(initialRole);
  const [contactMode, setContactMode] = useState<'screen' | 'inquiry' | null>(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const pending = useRef(false);
  const request = useRef<AbortController>();
  const fastPass: RecruiterFastPassConfig = { ...DEFAULT_FAST_PASS, ...s.config?.recruiterFastPass };
  const roles = fastPass.roles?.length ? fastPass.roles : DEFAULT_FAST_PASS.roles;
  const role = roles.find(r => r.id === roleId) || roles[0];
  const contact = s.config?.recruiter;
  const email = typeof contact?.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? contact.email : '';
  const bookingUrl = safeLink(contact?.bookingUrl);
  const webBooking = bookingUrl && /^https?:\/\//i.test(bookingUrl) ? bookingUrl : undefined;
  const publicKey = safeLink(fastPass.publicKeyUrl);
  const resume = safeLink(role.resumeUrl);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.fastpass-surface', { x: 28, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.34, ease: 'power3.out', clearProps: 'all' });
    });
    return () => media.revert();
  }, { scope: dialog });
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.role-evidence', { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out', clearProps: 'all' });
    });
    return () => media.revert();
  }, { scope: dialog, dependencies: [role.id], revertOnUpdate: true });
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.showModal();
    return () => { request.current?.abort(); node?.close(); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, []);

  const sendRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const when = String(fields.get('when') || '');
    if (contactMode === 'screen' && (!when || new Date(when).getTime() <= Date.now())) {
      setFeedback('Choose a future date and time for your proposed screen.'); return;
    }
    pending.current = true; setSending(true); setFeedback('');
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/mail', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({
          name: fields.get('name'), email: fields.get('email'),
          subject: `${contactMode === 'screen' ? '15-minute technical screen request' : 'Priority recruitment inquiry'} — ${role.label}`,
          message: `${contactMode === 'screen' ? `Proposed time: ${new Date(when).toISOString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone}). Duration: 15 minutes. Awaiting confirmation.\n\n` : ''}${fields.get('message') || 'Please contact me about this role.'}`
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The request could not be saved.');
      setFeedback(contactMode === 'screen' ? 'Request saved. The time is proposed; Zakarya will contact you to confirm.' : 'Inquiry saved to Zakarya’s portfolio inbox.');
      form.reset();
    } catch (error) {
      if (dialog.current?.isConnected) setFeedback(error instanceof Error && error.name !== 'AbortError' ? error.message : 'The request timed out. Please try again; your entries are preserved.');
    } finally { window.clearTimeout(timeout); pending.current = false; setSending(false); }
  };
  const showForm = (mode: 'screen' | 'inquiry') => { setContactMode(mode); setFeedback(''); };
  return <dialog ref={dialog} className="fastpass-drawer" aria-labelledby="fastpass-title" onCancel={e => { e.preventDefault(); s.setFastPassOpen(false); }} onKeyDown={e => e.stopPropagation()} onClick={e => { if (e.target === e.currentTarget) s.setFastPassOpen(false); }}>
    <div className="fastpass-surface">
      <header className="fastpass-header"><div><span className="funnel-eyebrow">ZAKARYA OUKIL / RECRUITER ACCESS</span><h1 id="fastpass-title">Role-specific briefing</h1><p>Evidence, a relevant CV, and an honest way to get in touch.</p></div><button aria-label="Close recruiter briefing" onClick={() => s.setFastPassOpen(false)}>×</button></header>
      <div className="fastpass-body">
        <fieldset className="role-selector"><legend>Choose the role you’re hiring for</legend>{roles.map(item => <label key={item.id} className={item.id === role.id ? 'selected' : ''}><input type="radio" name="recruiter-role" value={item.id} checked={item.id === role.id} onChange={() => { setRoleId(item.id); setFeedback(''); }}/><span>{item.label}</span></label>)}</fieldset>
        <section className="role-evidence" aria-label="Role match">
          <p className="role-summary">{role.summary}</p>
          <div className="matching-certs" aria-label="Matching certifications">{role.certifications.map(cert => <span key={cert}>{cert}</span>)}</div>
          <h2>Four competencies to screen</h2><ol>{role.competencies.map(skill => <li key={skill}>{skill}</li>)}</ol>
          <div className="fastpass-evidence-actions">{resume ? <a className="funnel-primary" href={resume} download={role.resumeFilename}>↓ Download {role.id === 'soc' ? 'SOC' : role.id === 'pentest' ? 'Pentest' : 'Systems'} CV</a> : <span className="funnel-note">This CV has not been published.</span>}<button onClick={() => { onEvidenceOpen?.(); s.setFastPassOpen(false); s.open(role.evidenceApp); }}>View matching evidence ↗</button></div>
        </section>
        <section className="screening-essentials"><h2>Screening essentials</h2><dl>{([
          ['Work authorization', fastPass.workAuthorization], ['Notice period / Availability', fastPass.availability],
          ['Work preference', fastPass.workPreference], ['Security clearance / Trust', fastPass.clearance]
        ] as const).map(([label, value]) => <div key={label}><dt><span aria-hidden="true">●</span> {label}</dt><dd>{value}</dd></div>)}</dl><p className="funnel-note">Candidate-provided details. Clearance eligibility is not an issued clearance; jurisdiction and role requirements are confirmed during screening.</p></section>
        <section className="fastpass-contact"><h2>Start the conversation</h2>
          {webBooking ? <a className="funnel-primary" href={webBooking} target="_blank" rel="noreferrer">Open scheduling page ↗</a> : <button className="funnel-primary" onClick={() => showForm('screen')}>Request a 15-minute technical screen</button>}
          {email ? <a href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Priority inquiry — ${role.label}`)}`}>Compose an email inquiry</a> : <button onClick={() => showForm('inquiry')}>Send an inquiry to the portfolio inbox</button>}
          {publicKey ? <p className="funnel-note"><a href={publicKey} target="_blank" rel="noreferrer">Download public PGP key ↗</a>. Verify its fingerprint and enable encryption in your mail client before sending. The launcher does not encrypt automatically.</p> : <p className="funnel-note">A PGP key has not been published. This contact form does not provide end-to-end encryption.</p>}
          {contactMode && <form key={contactMode} className="screen-request-form" onSubmit={sendRequest}>
            <h3>{contactMode === 'screen' ? 'Propose a 15-minute screen' : 'Priority inquiry'}</h3>
            {contactMode === 'screen' && <p>This sends a request, not a confirmed calendar reservation.</p>}
            <label>Your name<input name="name" required maxLength={160} autoComplete="name" disabled={sending}/></label>
            <label>Work email<input name="email" type="email" required maxLength={254} autoComplete="email" disabled={sending}/></label>
            {contactMode === 'screen' && <label>Proposed time · {Intl.DateTimeFormat().resolvedOptions().timeZone}<input name="when" type="datetime-local" required disabled={sending}/></label>}
            <label>Role &amp; context<textarea name="message" rows={3} maxLength={6000} required disabled={sending}/></label>
            <button className="funnel-primary" disabled={sending} type="submit">{sending ? 'Saving request…' : 'Send request'}</button>
            <button type="button" disabled={sending} onClick={() => { setContactMode(null); setFeedback(''); }}>Cancel</button>
            <p role="status">{feedback}</p>
          </form>}
        </section>
        <footer className="fastpass-footer"><button onClick={() => { onEvidenceOpen?.(); s.setFastPassOpen(false); s.open('incident-replay'); }}>Watch the Red vs. Blue replay →</button><button onClick={() => { onEvidenceOpen?.(); s.setFastPassOpen(false); s.startBrief(); }}>Open full recruiter briefing →</button></footer>
      </div>
    </div>
  </dialog>;
}
