import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './v5.css';
import { CASE_STUDIES, CONTACT_COPY, PROFILE, ROLES } from '../content';
import { CONTACT, mailto } from '../site-config';
import { Link, usePath } from '../router';
import { parseRoute, titleFor } from '../routes';
import { CaseView, IndexView, MissingView, usePageChrome } from '../shared/InnerPages';
import { VersionSwitcher } from '../versions/VersionSwitcher';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const SUBJECT = 'Opportunity for Zakarya Oukil';

function Head() {
  const email = mailto(SUBJECT);
  return <header className="v5-head"><div className="v5-head-in">
    <Link to="/" className="v5-brand">Zakarya Oukil</Link>
    <nav className="v5-nav" aria-label="Primary">
      <Link to="/#roles">Roles</Link><Link to="/#work">Work</Link><Link to="/#contact">Contact</Link><a href="/lab">Lab</a>
      <VersionSwitcher />
      {email ? <a className="v5-btn" href={email}>Email</a> : <Link className="v5-btn" to="/#contact">Contact</Link>}
    </nav>
  </div></header>;
}

function Hero() {
  const email = mailto(SUBJECT);
  return <section className="v5-hero" aria-labelledby="v5-name">
    <img className="v5-hero-img" src="/img/portrait-wide.webp" width={1800} height={1200} alt="Portrait of Zakarya Oukil" {...{ fetchpriority: 'high' }} />
    <div className="v5-hero-scrim" />
    <div className="v5-hero-text">
      <h1 className="v5-h1" id="v5-name"><span className="v5-mask"><span data-rise>Zakarya Oukil</span></span></h1>
      <div className="v5-hero-row">
        <p className="v5-line" data-fade>{PROFILE.line}</p>
        <div className="v5-actions" data-fade>
          {email && <a className="v5-btn v5-btn-lg" href={email}>Email</a>}
          {CONTACT.bookingUrl && <a className="v5-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
        </div>
      </div>
    </div>
  </section>;
}

function Reel() {
  return <section className="v5-reel" id="work" aria-labelledby="v5-work">
    <div className="v5-track" data-track>
      <div className="v5-intro">
        <h2 className="v5-h2" id="v5-work">Work you can read the code for.</h2>
        <p>Each project links to its public repository. <Link className="v5-link" to="/work">All projects</Link></p>
      </div>
      {CASE_STUDIES.map(item => <article className="v5-panel" key={item.slug}>
        <img src={item.imageColor || item.image.src} alt={item.image.alt} width={1600} height={1000} loading="lazy" />
        <div className="v5-panel-scrim" />
        <div className="v5-panel-text">
          <h3><Link to={`/work/${item.slug}`}>{item.title}</Link></h3>
          <p className="v5-kind">{item.kind}</p>
          <p className="v5-sum">{item.summary}</p>
          <div className="v5-panel-links"><Link className="v5-link" to={`/work/${item.slug}`}>Read the case study</Link><a className="v5-link" href={item.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a></div>
        </div>
      </article>)}
    </div>
  </section>;
}

function Roles() {
  const [openId, setOpenId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const role = ROLES.find(item => item.id === openId) || null;
  const study = role ? CASE_STUDIES.find(item => item.slug === role.caseSlug) : undefined;

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (openId && !node.open) node.showModal();
    if (!openId && node.open) node.close();
  }, [openId]);

  return <section className="v5-section" id="roles" aria-labelledby="v5-roles">
    <h2 className="v5-h2" id="v5-roles">Pick the role you are hiring for.</h2>
    <ul className="v5-roles">{ROLES.map(item => <li key={item.id}>
      <button type="button" className="v5-role" aria-haspopup="dialog" onClick={() => setOpenId(item.id)}>{item.title}</button>
    </li>)}</ul>
    <p className="v5-creds">{PROFILE.credentials.map(item => <span key={item.name}>{item.name}, <em data-status={item.status}>{item.status.toLowerCase()}</em>. </span>)}</p>
    <dialog ref={dialog} className="v5-sheet" aria-labelledby="v5-sheet-title" onClose={() => setOpenId(null)} onClick={event => { if (event.target === dialog.current) setOpenId(null); }}>
      {role && <div className="v5-sheet-in">
        <button type="button" className="v5-close" onClick={() => setOpenId(null)}>Close</button>
        <h3 id="v5-sheet-title">{role.title}</h3>
        <p className="v5-sheet-line">{role.line}</p>
        <ul>{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
        <div className="v5-panel-links">
          {study && <Link className="v5-link" to={`/work/${study.slug}`} onClick={() => setOpenId(null)}>Read the {study.title} case study</Link>}
          <a className="v5-link" href={role.cv.href} download={role.cv.filename}>Download CV</a>
        </div>
      </div>}
    </dialog>
  </section>;
}

function Contact() {
  return <section className="v5-contact" id="contact" aria-labelledby="v5-contact"><div className="v5-contact-grid">
    <figure className="v5-contact-fig"><img src="/img/portrait-color.webp" width={900} height={1125} alt="Zakarya Oukil" loading="lazy" /></figure>
    <div>
      <h2 className="v5-h2" id="v5-contact">Let&rsquo;s talk about your role.</h2>
      {CONTACT.email && <a className="v5-mail" href={mailto(SUBJECT)}>{CONTACT.email}</a>}
      <div className="v5-panel-links">
        {CONTACT.bookingUrl && <a className="v5-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
        {CONTACT.github && <a className="v5-link" href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}
      </div>
      <dl className="v5-facts">{CONTACT_COPY.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p className="v5-note">{CONTACT_COPY.note}</p>
      <div className="v5-panel-links">{ROLES.map(item => <a className="v5-link" key={item.id} href={item.cv.href} download={item.cv.filename}>{item.title} CV</a>)}</div>
    </div>
  </div></section>;
}

function Foot() {
  return <footer className="v5-foot"><span>Zakarya Oukil</span><nav aria-label="Footer"><Link to="/work">All projects</Link><a href="/lab">Lab</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}</nav></footer>;
}

/** Hero zoom-in and line rise, plus the pinned horizontal reel on wide screens (canonical pin and scrub pattern). */
function useCinemaMotion(root: React.RefObject<HTMLElement>, active: boolean) {
  useGSAP(() => {
    if (!active || !root.current) return;
    const el = root.current;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(q('.v5-hero-img'), { scale: 1.09 }, { scale: 1, duration: 2.4, ease: 'power2.out', clearProps: 'transform' }, 0)
        .fromTo(q('[data-rise]'), { yPercent: 110 }, { yPercent: 0, duration: 1, clearProps: 'transform' }, 0.2)
        .fromTo(q('[data-fade]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, clearProps: 'opacity,visibility,transform' }, 0.6);
      const skip = () => { tl.progress(1); };
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });
      return () => { window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); tl.kill(); };
    });
    media.add('(min-width: 900px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)', () => {
      const reel = el.querySelector<HTMLElement>('.v5-reel');
      const track = el.querySelector<HTMLElement>('[data-track]');
      if (!reel || !track) return;
      reel.classList.add('is-pinned');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: reel, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      return () => { tween.scrollTrigger?.kill(); tween.kill(); reel.classList.remove('is-pinned'); gsap.set(track, { clearProps: 'transform' }); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active] });
}

/** Version 5: cinematic, photography-led. */
export default function V5() {
  const route = parseRoute(usePath());
  const root = useRef<HTMLDivElement>(null);
  usePageChrome('#0c0c0d', 'dark');
  useEffect(() => { document.title = titleFor(route); }, [route]);
  useCinemaMotion(root, route.name === 'home');
  return <div className="v5" ref={root} style={{ '--vs-bg': '#0c0c0d', '--vs-ink': '#f1eee8', '--vs-line': 'rgba(241,238,232,.4)', '--vs-accent': '#f2a33a', '--vs-font': "'Switzer', sans-serif" } as React.CSSProperties}>
    <a className="v5-skip" href="#main">Skip to content</a>
    <Head />
    <main id="main">
      {route.name === 'home' && <><Hero /><Reel /><Roles /><Contact /></>}
      {route.name === 'work' && <IndexView />}
      {route.name === 'case' && <CaseView slug={route.slug} imageKey="color" />}
      {route.name === 'missing' && <MissingView />}
    </main>
    <Foot />
  </div>;
}
