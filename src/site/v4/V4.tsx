import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './v4.css';
import { CASE_STUDIES, CONTACT_COPY, PROFILE, ROLES } from '../content';
import { CONTACT, mailto } from '../site-config';
import { Link, usePath } from '../router';
import { parseRoute, titleFor } from '../routes';
import { CaseView, IndexView, MissingView, usePageChrome } from '../shared/InnerPages';
import { VersionSwitcher } from '../versions/VersionSwitcher';

gsap.registerPlugin(useGSAP);
const SUBJECT = 'Opportunity for Zakarya Oukil';

function Head() {
  const email = mailto(SUBJECT);
  return <header className="v4-head">
    <Link to="/" className="v4-brand">Zakarya Oukil</Link>
    <nav className="v4-nav" aria-label="Primary">
      <Link to="/#roles">Roles</Link><Link to="/#work">Work</Link><Link to="/#contact">Contact</Link><a href="/lab">Lab</a>
      <VersionSwitcher />
      {email ? <a className="v4-btn" href={email}>Email</a> : <Link className="v4-btn" to="/#contact">Contact</Link>}
    </nav>
  </header>;
}

function Hero() {
  const email = mailto(SUBJECT);
  const calls = PROFILE.credentials;
  return <section className="v4-hero" aria-labelledby="v4-name">
    <div className="v4-hero-text">
      <h1 className="v4-h1" id="v4-name">Zakarya Oukil</h1>
      <p className="v4-line">{PROFILE.line}</p>
      <div className="v4-actions">
        {email && <a className="v4-btn v4-btn-lg" href={email}>Email</a>}
        {CONTACT.bookingUrl && <a className="v4-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
      </div>
    </div>
    <div className="v4-plate">
      <div className="v4-frame" data-frame>
        <img src="/img/portrait-color.webp" width={900} height={1125} alt="Portrait of Zakarya Oukil" {...{ fetchpriority: 'high' }} />
        <span className="v4-corner v4-c1" /><span className="v4-corner v4-c2" /><span className="v4-corner v4-c3" /><span className="v4-corner v4-c4" />
      </div>
      <ul className="v4-callouts" aria-label="Credentials">
        {calls.map((item, index) => <li key={item.name} className={`v4-call v4-call-${index + 1}`} data-call data-status={item.status}>
          <i className="v4-lead" aria-hidden="true" /><span><strong>{item.name}</strong> {item.status}</span>
        </li>)}
      </ul>
    </div>
  </section>;
}

function View({ role }: { role: (typeof ROLES)[number] }) {
  const study = CASE_STUDIES.find(item => item.slug === role.caseSlug);
  return <article className="v4-view">
    <h3 className="v4-view-title">{role.title}</h3>
    <div className="v4-view-body">
      <p className="v4-view-line">{role.line}</p>
      <ul>{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="v4-links">
        {study && <Link className="v4-link" to={`/work/${study.slug}`}>Read the {study.title} case study</Link>}
        <a className="v4-link" href={role.cv.href} download={role.cv.filename}>Download CV</a>
      </div>
    </div>
  </article>;
}

function Roles() {
  return <section className="v4-section" id="roles" aria-labelledby="v4-roles">
    <h2 className="v4-h2" id="v4-roles">Roles</h2>
    <div className="v4-views">
      <div className="v4-v1"><View role={ROLES[0]} /></div>
      <div className="v4-v2"><View role={ROLES[1]} /></div>
      <div className="v4-v3"><View role={ROLES[2]} /></div>
    </div>
  </section>;
}

function Work() {
  return <section className="v4-section" id="work" aria-labelledby="v4-work">
    <h2 className="v4-h2" id="v4-work">Work</h2>
    <p className="v4-lede">Each project links to its public repository. <Link className="v4-link" to="/work">All projects</Link></p>
    <div className="v4-assemblies">{CASE_STUDIES.map(item => <article className="v4-assembly" key={item.slug}>
      <figure className="v4-asm-fig"><img src={item.image.src} alt={item.image.alt} width={1600} height={1000} loading="lazy" /></figure>
      <div className="v4-asm-text">
        <h3><Link to={`/work/${item.slug}`}>{item.title}</Link></h3>
        <p className="v4-kind">{item.kind}</p>
        <p>{item.summary}</p>
        <table className="v4-bom"><caption>Stack</caption><tbody>{item.stack.map(part => <tr key={part}><td>{part}</td></tr>)}</tbody></table>
        <div className="v4-links"><Link className="v4-link" to={`/work/${item.slug}`}>Read the case study</Link><a className="v4-link" href={item.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a></div>
      </div>
    </article>)}</div>
  </section>;
}

function TitleBlock() {
  return <section className="v4-section v4-block" id="contact" aria-labelledby="v4-contact">
    <h2 className="v4-h2" id="v4-contact">Contact</h2>
    <table className="v4-title-block">
      <tbody>
        <tr><th scope="row">Name</th><td>{PROFILE.name}</td></tr>
        <tr><th scope="row">Role</th><td>Security engineer</td></tr>
        {CONTACT.email && <tr><th scope="row">Email</th><td><a className="v4-mail" href={mailto(SUBJECT)}>{CONTACT.email}</a></td></tr>}
        {CONTACT.bookingUrl && <tr><th scope="row">Calendar</th><td><a className="v4-link" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a></td></tr>}
        {CONTACT.github && <tr><th scope="row">GitHub</th><td><a className="v4-link" href={CONTACT.github} target="_blank" rel="noreferrer noopener">Zakarya-Oukil</a></td></tr>}
        {CONTACT_COPY.facts.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}
        <tr><th scope="row">CVs</th><td className="v4-cvs"><div>{ROLES.map(role => <a className="v4-link" key={role.id} href={role.cv.href} download={role.cv.filename}>{role.title}</a>)}</div></td></tr>
      </tbody>
    </table>
    <p className="v4-note">{CONTACT_COPY.note}</p>
  </section>;
}

function Foot() {
  return <footer className="v4-foot"><span>Zakarya Oukil</span><nav aria-label="Footer"><Link to="/work">All projects</Link><a href="/lab">Lab</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}</nav></footer>;
}

function useDrawMotion(root: React.RefObject<HTMLElement>, active: boolean) {
  useGSAP(() => {
    if (!active || !root.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root.current!);
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(q('[data-frame]'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.1)
        .fromTo(q('.v4-lead'), { scaleX: 0, transformOrigin: 'right center' }, { scaleX: 1, duration: 0.55, stagger: 0.14, clearProps: 'transform' }, 0.8)
        .fromTo(q('[data-call] span'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.14, clearProps: 'opacity,visibility' }, 1.1);
      const skip = () => { tl.progress(1); };
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });
      return () => { window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); tl.kill(); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active] });
}

/** Version 4: engineering drawing sheet. */
export default function V4() {
  const route = parseRoute(usePath());
  const root = useRef<HTMLDivElement>(null);
  usePageChrome('#e9e7e0', 'light');
  useEffect(() => { document.title = titleFor(route); }, [route]);
  useDrawMotion(root, route.name === 'home');
  return <div className="v4" ref={root} style={{ '--vs-bg': '#e9e7e0', '--vs-ink': '#12110f', '--vs-line': 'rgba(18,17,15,.6)', '--vs-accent': '#d0402a', '--vs-font': "'Switzer', sans-serif" } as React.CSSProperties}>
    <a className="v4-skip" href="#main">Skip to content</a>
    <div className="v4-sheet">
      <span className="v4-ruler v4-ruler-x" aria-hidden="true" /><span className="v4-ruler v4-ruler-y" aria-hidden="true" />
      <Head />
      <main id="main">
        {route.name === 'home' && <><Hero /><Roles /><Work /><TitleBlock /></>}
        {route.name === 'work' && <IndexView />}
        {route.name === 'case' && <CaseView slug={route.slug} />}
        {route.name === 'missing' && <MissingView />}
      </main>
      <Foot />
    </div>
  </div>;
}
