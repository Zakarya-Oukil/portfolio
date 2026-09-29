import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './v2.css';
import { CASE_STUDIES, CONTACT_COPY, PROFILE, ROLES } from '../content';
import { CONTACT, mailto } from '../site-config';
import { Link, usePath } from '../router';
import { parseRoute, titleFor } from '../routes';
import { CaseView, IndexView, MissingView, usePageChrome } from '../shared/InnerPages';
import { VersionSwitcher } from '../versions/VersionSwitcher';

gsap.registerPlugin(useGSAP);
const SUBJECT = 'Opportunity for Zakarya Oukil';

function Masthead() {
  const email = mailto(SUBJECT);
  return <header className="v2-mast"><div className="v2-mast-in">
    <Link to="/" className="v2-brand">Zakarya Oukil</Link>
    <nav className="v2-nav" aria-label="Primary">
      <Link to="/#roles">Roles</Link><Link to="/#work">Work</Link><Link to="/#contact">Contact</Link><a href="/lab">Lab</a>
      <VersionSwitcher />
      {email ? <a className="v2-btn" href={email}>Email</a> : <Link className="v2-btn" to="/#contact">Contact</Link>}
    </nav>
  </div><div className="v2-double" aria-hidden="true" /></header>;
}

function Cover() {
  const email = mailto(SUBJECT);
  return <section className="v2-cover"><div className="v2-cover-in">
    <div className="v2-cover-text">
      <h1 className="v2-h1"><span className="v2-mask"><span data-rise>Zakarya</span></span><span className="v2-mask"><span data-rise>Oukil</span></span></h1>
      <p className="v2-dek" data-fade>{PROFILE.line}</p>
      <div className="v2-actions" data-fade>
        {email && <a className="v2-btn v2-btn-lg" href={email}>Email</a>}
        {CONTACT.bookingUrl && <a className="v2-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
      </div>
    </div>
    <figure className="v2-cover-fig" data-develop>
      <img src="/img/portrait-color.webp" width={900} height={1125} alt="Portrait of Zakarya Oukil" {...{ fetchpriority: 'high' }} />
      <figcaption>Zakarya Oukil, security engineer.</figcaption>
    </figure>
  </div></section>;
}

function Story() {
  return <section className="v2-story"><div className="v2-wrap">
    <h2 className="v2-h2">Profile</h2>
    <div className="v2-cols">
      <p className="v2-dropcap">{PROFILE.statement}</p>
      <p>I am looking for roles in offensive security, SOC and threat hunting, and security systems work on Linux and eBPF. Each is described below with the project that best shows it and a CV written for that role.</p>
    </div>
    <blockquote className="v2-quote">I build tools end to end, from reconnaissance to threat intelligence to multi-agent systems.</blockquote>
  </div></section>;
}

function Roles() {
  return <section className="v2-section" id="roles" aria-labelledby="v2-roles"><div className="v2-wrap v2-split">
    <div>
      <h2 className="v2-h2" id="v2-roles">The roles</h2>
      {ROLES.map(role => {
        const study = CASE_STUDIES.find(item => item.slug === role.caseSlug);
        return <article className="v2-role" key={role.id}>
          <div><h3>{role.title}</h3><p>{role.line}</p></div>
          <div>
            <ul>{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
            <div className="v2-links">
              {study && <Link className="v2-link" to={`/work/${study.slug}`}>Read the {study.title} case study</Link>}
              <a className="v2-link" href={role.cv.href} download={role.cv.filename}>Download CV</a>
            </div>
          </div>
        </article>;
      })}
    </div>
    <aside className="v2-facts" aria-labelledby="v2-creds">
      <h2 id="v2-creds">Credentials</h2>
      <dl>{PROFILE.credentials.map(item => <div key={item.name}><dt>{item.name}</dt><dd data-status={item.status}>{item.status}</dd><dd className="v2-meaning">{item.meaning}</dd></div>)}</dl>
    </aside>
  </div></section>;
}

function Work() {
  return <section className="v2-section" id="work" aria-labelledby="v2-work"><div className="v2-wrap">
    <h2 className="v2-h2" id="v2-work">Selected work</h2>
    <p className="v2-lede">Each project links to its public repository. <Link className="v2-link" to="/work">All projects</Link></p>
    {CASE_STUDIES.map((item, index) => <article className={`v2-spread v2-spread-${index + 1}`} key={item.slug}>
      <figure><img src={item.imageColor || item.image.src} alt={item.image.alt} width={1600} height={1000} loading="lazy" /><figcaption>{item.image.alt}</figcaption></figure>
      <div className="v2-spread-text">
        <h3><Link to={`/work/${item.slug}`}>{item.title}</Link></h3>
        <p className="v2-kind">{item.kind}</p>
        <p>{item.summary}</p>
        <p className="v2-stack">{item.stack.join(', ')}</p>
        <div className="v2-links"><Link className="v2-link" to={`/work/${item.slug}`}>Read the case study</Link><a className="v2-link" href={item.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a></div>
      </div>
    </article>)}
  </div></section>;
}

function Colophon() {
  return <section className="v2-section v2-colophon" id="contact" aria-labelledby="v2-contact"><div className="v2-wrap v2-colophon-in">
    <div>
      <h2 className="v2-h2 v2-big" id="v2-contact">Write to me.</h2>
      {CONTACT.email && <a className="v2-mail" href={mailto(SUBJECT)}>{CONTACT.email}</a>}
      <div className="v2-links">
        {CONTACT.bookingUrl && <a className="v2-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
        {CONTACT.github && <a className="v2-link" href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}
      </div>
    </div>
    <div>
      <dl className="v2-contact-facts">{CONTACT_COPY.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p className="v2-note">{CONTACT_COPY.note}</p>
      <div className="v2-links">{ROLES.map(role => <a className="v2-link" key={role.id} href={role.cv.href} download={role.cv.filename}>{role.title} CV</a>)}</div>
    </div>
  </div></section>;
}

function Footer() {
  return <footer className="v2-footer"><div className="v2-wrap v2-footer-in">
    <span>Zakarya Oukil</span>
    <nav aria-label="Footer"><Link to="/work">All projects</Link><a href="/lab">Lab</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}</nav>
  </div></footer>;
}

function useCoverMotion(root: React.RefObject<HTMLElement>, active: boolean) {
  useGSAP(() => {
    if (!active || !root.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root.current!);
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(q('[data-rise]'), { yPercent: 105 }, { yPercent: 0, duration: 0.95, stagger: 0.1, clearProps: 'transform' }, 0)
        .fromTo(q('[data-develop]'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.15)
        .fromTo(q('[data-fade]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, clearProps: 'opacity,visibility,transform' }, 0.5);
      const skip = () => { tl.progress(1); };
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });
      return () => { window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); tl.kill(); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active] });
}

/** Version 2: editorial magazine profile. */
export default function V2() {
  const route = parseRoute(usePath());
  const root = useRef<HTMLDivElement>(null);
  usePageChrome('#f2f1ed', 'light');
  useEffect(() => { document.title = titleFor(route); }, [route]);
  useCoverMotion(root, route.name === 'home');
  return <div className="v2" ref={root} style={{ '--vs-bg': '#f2f1ed', '--vs-ink': '#141412', '--vs-line': 'rgba(20,20,18,.45)', '--vs-accent': '#2a3cc4', '--vs-font': "'Switzer', sans-serif" } as React.CSSProperties}>
    <a className="v2-skip" href="#main">Skip to content</a>
    <Masthead />
    <main id="main">
      {route.name === 'home' && <><Cover /><Story /><Roles /><Work /><Colophon /></>}
      {route.name === 'work' && <IndexView />}
      {route.name === 'case' && <CaseView slug={route.slug} imageKey="color" />}
      {route.name === 'missing' && <MissingView />}
    </main>
    <Footer />
  </div>;
}
