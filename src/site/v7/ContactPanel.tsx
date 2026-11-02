import React, { useRef, useState } from 'react';

const TOPICS = ['Hiring', 'Freelance work', 'A security question', 'Something else'];
const API = ((import.meta.env as Record<string, string | undefined>).VITE_API_URL || '').replace(/\/$/, '');

type Props = { email: string; mailHref: string; bookingUrl: string };

/** "Contact me" button plus a slide-in panel with the form. Posts to the portfolio API; email and calendar stay as fallbacks. */
export function ContactPanel({ email, mailHref, bookingUrl }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const close = () => dialog.current?.close();
  const open = () => { setState('idle'); setError(''); dialog.current?.showModal(); };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState('sending');
    try {
      const response = await fetch(`${API}/api/mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.get('name'), email: data.get('email'), subject: data.get('topic'), message: data.get('message'), website: data.get('website') })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The message could not be sent.');
      setState('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The message could not be sent.');
      setState('error');
    }
  }

  return <>
    <button type="button" className="v7-btn v7-btn-red v7-contact-open" onClick={open}>Contact me</button>
    <dialog ref={dialog} className="v7-panel" aria-labelledby="v7-panel-title" onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="v7-panel-in">
        <div className="v7-panel-head">
          <h2 id="v7-panel-title">Contact me</h2>
          <button type="button" className="v7-panel-x" onClick={close} aria-label="Close contact form">Close</button>
        </div>
        {state === 'sent' ? <div role="status">
          <p className="v7-lede">Thanks, your message is in my inbox. I will reply by email.</p>
          <button type="button" className="v7-btn" onClick={close}>Done</button>
        </div> : <form onSubmit={submit} className="v7-form">
          <label>Your name<input name="name" required maxLength={120} autoComplete="name" /></label>
          <label>Your email<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
          <label>I am reaching out about<select name="topic" defaultValue={TOPICS[0]}>{TOPICS.map(topic => <option key={topic}>{topic}</option>)}</select></label>
          <label>Message<textarea name="message" required rows={6} maxLength={4000} /></label>
          <label className="v7-hp" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
          {state === 'error' && <p className="v7-form-error" role="alert">{error} You can still use the links below.</p>}
          <button type="submit" className="v7-btn v7-btn-red" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
        </form>}
        <p className="v7-note">Or reach me directly:{' '}
          {email && <a className="v7-link" href={mailHref}>{email}</a>}
          {bookingUrl && <> · <a className="v7-link" href={bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a></>}
        </p>
      </div>
    </dialog>
  </>;
}
