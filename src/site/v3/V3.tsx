import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './v3.css';
import { CASE_STUDIES, CONTACT_COPY, PROFILE, ROLES } from '../content';
import { CONTACT, mailto } from '../site-config';
import { Link, usePath } from '../router';
import { parseRoute, titleFor } from '../routes';
import { CaseView, IndexView, MissingView, usePageChrome } from '../shared/InnerPages';
import { VersionSwitcher } from '../versions/VersionSwitcher';

gsap.registerPlugin(useGSAP);
const SUBJECT = 'Opportunity for Zakarya Oukil';

function Bar() {
  const email = mailto(SUBJECT);
  return <header className="v3-bar"><div className="v3-bar-in">
    <Link to="/" className="v3-brand">Zakarya Oukil</Link>
    <nav className="v3-nav" aria-label="Primary">
      <Link to="/#roles">Roles</Link><Link to="/#work">Work</Link><Link to="/#contact">Contact</Link><a href="/lab">Lab</a>
      <VersionSwitcher />
      {email ? <a className="v3-btn" href={email}>Email</a> : <Link className="v3-btn" to="/#contact">Contact</Link>}
    </nav>
  </div></header>;
}

function Hero() {
  const email = mailto(SUBJECT);
  return <section className="v3-hero" aria-labelledby="v3-name">
    <div className="v3-hero-grid">
      <h1 className="v3-name" id="v3-name">
        <span className="v3-mask"><span data-rise>Zakarya</span></span>
        <span className="v3-mask"><span data-rise>Oukil</span></span>
      </h1>
      <figure className="v3-print" data-print>
        <img src="/img/portrait-color.webp" width={900} height={1125} alt="Portrait of Zakarya Oukil, printed in one colour" {...{ fetchpriority: 'high' }} />
      </figure>
    </div>
    <div className="v3-strip">
      <p className="v3-line" data-fade>{PROFILE.line}</p>
      <div className="v3-actions" data-fade>
        {email && <a className="v3-btn v3-btn-red" href={email}>Email</a>}
        {CONTACT.bookingUrl && <a className="v3-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
      </div>
    </div>
  </section>;
}

function Roles() {
  return <section className="v3-section" id="roles" aria-labelledby="v3-roles"><div className="v3-wrap">
    <h2 className="v3-h2" id="v3-roles">The roles</h2>
    <div className="v3-rows">
      {ROLES.map((role, index) => {
        const study = CASE_STUDIES.find(item => item.slug === role.caseSlug);
        return <details className="v3-row" key={role.id} open={index === 0} {...{ name: 'v3-roles' }}>
          <summary><span className="v3-row-title">{role.title}</span><span className="v3-plus" aria-hidden="true" /></summary>
          <div className="v3-row-body">
            <p className="v3-row-line">{role.line}</p>
            <ul>{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
            <div className="v3-row-links">
              {study && <Link className="v3-link" to={`/work/${study.slug}`}>Read the {study.title} case study</Link>}
              <a className="v3-link" href={role.cv.href} download={role.cv.filename}>Download CV</a>
            </div>
          </div>
        </details>;
      })}
    </div>
  </div></section>;
}

function Credentials() {
  return <section className="v3-section v3-tight" aria-labelledby="v3-creds"><div className="v3-wrap">
    <h2 className="v3-h2" id="v3-creds">Credentials</h2>
    <ul className="v3-creds">{PROFILE.credentials.map(item => <li key={item.name} data-status={item.status}>
      <strong>{item.name}</strong><span className="v3-status">{item.status}</span><span className="v3-meaning">{item.meaning}</span>
    </li>)}</ul>
  </div></section>;
}

function Work() {
  return <section className="v3-section" id="work" aria-labelledby="v3-work"><div className="v3-wrap">
    <h2 className="v3-h2" id="v3-work">Work</h2>
    <p className="v3-lede">Each project links to its public repository. <Link className="v3-link" to="/work">All projects</Link></p>
    <div className="v3-works">{CASE_STUDIES.map(item => <article className="v3-work" key={item.slug}>
      <div className="v3-work-text">
        <h3><Link to={`/work/${item.slug}`}>{item.title}</Link></h3>
        <p className="v3-kind">{item.kind}</p>
        <p>{item.summary}</p>
        <p className="v3-stack">{item.stack.join(', ')}</p>
        <div className="v3-row-links"><Link className="v3-link" to={`/work/${item.slug}`}>Read the case study</Link><a className="v3-link" href={item.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a></div>
      </div>
      <figure><img src={item.image.src} alt={item.image.alt} width={1600} height={1000} loading="lazy" /></figure>
    </article>)}</div>
  </div></section>;
}

function Contact() {
  return <section className="v3-contact" id="contact" aria-labelledby="v3-contact"><div className="v3-wrap">
    <h2 className="v3-h2" id="v3-contact">Let&rsquo;s talk about your role.</h2>
    {CONTACT.email && <a className="v3-mail" href={mailto(SUBJECT)}>{CONTACT.email}</a>}
    <div className="v3-contact-grid">
      <dl>{CONTACT_COPY.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div>
        <p className="v3-note">{CONTACT_COPY.note}</p>
        <div className="v3-row-links">
          {CONTACT.bookingUrl && <a className="v3-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
          {CONTACT.github && <a className="v3-link" href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}
          {ROLES.map(role => <a className="v3-link" key={role.id} href={role.cv.href} download={role.cv.filename}>{role.title} CV</a>)}
        </div>
      </div>
    </div>
  </div></section>;
}

function Foot() {
  return <footer className="v3-foot"><div className="v3-foot-in"><span>Zakarya Oukil</span>
    <nav aria-label="Footer"><Link to="/work">All projects</Link><a href="/lab">Lab</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}</nav></div></footer>;
}

function useHeroMotion(root: React.RefObject<HTMLElement>, active: boolean) {
  useGSAP(() => {
    if (!active || !root.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root.current!);
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.fromTo(q('[data-print]'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath' }, 0)
        .fromTo(q('[data-rise]'), { yPercent: 108 }, { yPercent: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform' }, 0.2)
        .fromTo(q('[data-fade]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, clearProps: 'opacity,visibility,transform' }, 0.6);
      const skip = () => { tl.progress(1); };
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });
      return () => { window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); tl.kill(); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active] });
}

/** Version 3: Swiss typographic poster. */
export default function V3() {
  const route = parseRoute(usePath());
  const root = useRef<HTMLDivElement>(null);
  usePageChrome('#f3f3ef', 'light');
  useEffect(() => { document.title = titleFor(route); }, [route]);
  useHeroMotion(root, route.name === 'home');
  return <div className="v3" ref={root} style={{ '--vs-bg': '#0b0b0b', '--vs-ink': '#f3f3ef', '--vs-line': 'rgba(243,243,239,.5)', '--vs-accent': '#e1251b', '--vs-font': "'Switzer', sans-serif" } as React.CSSProperties}>
    <a className="v3-skip" href="#main">Skip to content</a>
    <Bar />
    <main id="main">
      {route.name === 'home' && <><Hero /><Roles /><Credentials /><Work /><Contact /></>}
      {route.name === 'work' && <IndexView />}
      {route.name === 'case' && <CaseView slug={route.slug} />}
      {route.name === 'missing' && <MissingView />}
    </main>
    <Foot />
  </div>;
}
