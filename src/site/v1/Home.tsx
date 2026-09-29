import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CASE_STUDIES, CONTACT_COPY, PROFILE, ROLES } from '../content';
import { CONTACT, mailto } from '../site-config';
import { Link } from '../router';
import { heroIntro, liftRedactions, scrubWords, workImages } from '../motion';
import { VersionSwitcher } from '../versions/VersionSwitcher';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SUBJECT = 'Opportunity for Zakarya Oukil';

export function SiteHeader() {
  const email = mailto(SUBJECT);
  return <header className="st-header"><div className="st-header-in">
    <Link to="/" className="st-brand">Zakarya Oukil</Link>
    <nav className="st-nav" aria-label="Primary">
      <Link to="/#roles">Roles</Link><Link to="/#work">Work</Link><Link to="/#contact">Contact</Link><a href="/lab">Lab</a>
      <VersionSwitcher />
      {email ? <a className="st-btn" href={email}>Email</a> : <Link className="st-btn" to="/#contact">Contact</Link>}
    </nav>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="st-footer"><div className="st-footer-in">
    <span>Zakarya Oukil</span>
    <nav aria-label="Footer"><Link to="/work">All projects</Link><a href="/lab">Lab</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}{CONTACT.linkedin && <a href={CONTACT.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>}</nav>
  </div></footer>;
}

function Hero() {
  const email = mailto(SUBJECT);
  return <section className="st-hero" aria-labelledby="name"><div className="st-hero-in">
    <h1 id="name">
      <span className="st-line"><span data-line style={{ display: 'block' }}>{PROFILE.surname[0]}</span></span>
      <span className="st-line"><span data-line style={{ display: 'block' }}>{PROFILE.surname[1]}</span></span>
    </h1>
    <p className="st-hero-line" data-hero-fade>{PROFILE.line}</p>
    <div className="st-hero-actions" data-hero-fade>
      {email && <a className="st-btn" href={email}>Email</a>}
      {CONTACT.bookingUrl && <a className="st-tlink" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
      {!email && <Link className="st-btn" to="/#work">See the work</Link>}
    </div>
    <div className="st-portrait" data-portrait><img src="/img/portrait.webp" width={828} height={1058} alt="Portrait of Zakarya Oukil" {...{ fetchpriority: 'high' }} /></div>
  </div></section>;
}

function Statement() {
  const words = PROFILE.statement.split(' ');
  return <section className="st-statement" aria-label="Profile" data-statement>
    <p className="st-sr">{PROFILE.statement}</p>
    <p aria-hidden="true">{words.map((word, i) => <span key={i} data-w>{word}{' '}</span>)}</p>
  </section>;
}

function Roles() {
  const [open, setOpen] = useState<string>(ROLES[0].id);
  return <section className="st-section" id="roles" aria-labelledby="roles-title">
    <div className="st-wrap">
      <h2 className="st-h2" id="roles-title">Pick the role you are hiring for.</h2>
      <p className="st-lede">Each slice shows the skills, the matching project and a CV written for that role.</p>
      <div className="st-slices">
        {ROLES.map(role => {
          const isOpen = open === role.id;
          const study = CASE_STUDIES.find(item => item.slug === role.caseSlug);
          return <article key={role.id} className="st-slice" data-open={isOpen} onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(role.id); }}>
            <button type="button" className="st-slice-toggle" id={`slice-${role.id}`} aria-expanded={isOpen} aria-controls={`panel-${role.id}`} onClick={() => setOpen(role.id)}>
              <span className="st-slice-v">{role.title}</span>
            </button>
            <div className="st-slice-body" id={`panel-${role.id}`} role="region" aria-labelledby={`slice-${role.id}`}>
              <h3 className="st-slice-title">{role.title}</h3>
              <p className="st-slice-line">{role.line}</p>
              <ul className="st-slice-skills">{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
              <div className="st-slice-links">
                {study && <Link className="st-tlink" to={`/work/${study.slug}`}>Read the {study.title} case study</Link>}
                <a className="st-tlink" href={role.cv.href} download={role.cv.filename}>Download CV</a>
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}

function Credentials() {
  return <section className="st-section" aria-labelledby="creds-title"><div className="st-wrap">
    <h2 className="st-h2" id="creds-title">Credentials, with their real status.</h2>
    <p className="st-lede">Certified means passed and held. In progress means studying, not yet earned.</p>
    <ul className="st-ledger" data-ledger>
      {PROFILE.credentials.map(item => <li className="st-cred" key={item.name} data-status={item.status}>
        <span className="st-cred-name">{item.name}</span>
        <span className="st-cred-cell"><span className="st-cred-status">{item.status}</span><span className="st-redact" aria-hidden="true" /></span>
        <span className="st-cred-cell"><span className="st-cred-meaning">{item.meaning}</span><span className="st-redact" aria-hidden="true" /></span>
      </li>)}
    </ul>
  </div></section>;
}

function Work() {
  return <section className="st-section" id="work" aria-labelledby="work-title"><div className="st-wrap st-work">
    <div className="st-work-side">
      <h2 className="st-h2" id="work-title">Work you can read the code for.</h2>
      <p className="st-lede">Each project links to its public repository. Screenshots and demos are added as they are published.</p>
      <Link to="/work" className="st-tlink" style={{ marginTop: 12 }}>All projects</Link>
    </div>
    <div className="st-work-list">
      {CASE_STUDIES.map(item => <article className="st-item" key={item.slug}>
        <figure className="st-item-fig" data-work-fig><img src={item.image.src} alt={item.image.alt} width={1600} height={1000} loading="lazy" /></figure>
        <h3><Link to={`/work/${item.slug}`}>{item.title}</Link></h3>
        <p className="st-item-kind">{item.kind}</p>
        <p className="st-item-sum">{item.summary}</p>
        <p className="st-item-stack">{item.stack.join(', ')}</p>
        <div className="st-item-links">
          <Link className="st-tlink" to={`/work/${item.slug}`}>Read the case study</Link>
          <a className="st-tlink" href={item.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a>
        </div>
      </article>)}
    </div>
  </div></section>;
}

function Lab() {
  return <section className="st-lab" aria-labelledby="lab-title"><div className="st-lab-in">
    <h2 id="lab-title" style={{ margin: 0 }}><a className="st-lab-link" href="/lab">Open the lab</a></h2>
    <p>A browser simulation of a Kali Linux workstation and a NetHunter phone, with my reports, terminal and research inside. It is a simulation, not a live system, and it is not affiliated with OffSec.</p>
  </div></section>;
}

function Contact() {
  return <section className="st-section st-contact" id="contact" aria-labelledby="contact-title"><div className="st-wrap">
    <h2 className="st-h2" id="contact-title">Let&rsquo;s talk about your role.</h2>
    {CONTACT.email
      ? <a className="st-contact-mail" href={mailto(SUBJECT)}>{CONTACT.email}</a>
      : import.meta.env.DEV && <p className="st-note">Development notice: set VITE_CONTACT_EMAIL so visitors can reach you.</p>}
    <div className="st-contact-actions">
      {CONTACT.bookingUrl && <a className="st-tlink" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
      {CONTACT.github && <a className="st-tlink" href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}
    </div>
    <dl className="st-facts">{CONTACT_COPY.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className="st-note">{CONTACT_COPY.note}</p>
    <div className="st-cvs">{ROLES.map(role => <a className="st-tlink" key={role.id} href={role.cv.href} download={role.cv.filename}>{role.title} CV</a>)}</div>
  </div></section>;
}

/** Sparse, purposeful motion. Everything is visible by default; effects exist only when motion is allowed. */
function useHomeMotion(root: React.RefObject<HTMLElement>) {
  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const stops = [
        heroIntro(el),
        scrubWords(el.querySelector('[data-statement]') as HTMLElement),
        liftRedactions(gsap.utils.toArray<HTMLElement>('[data-ledger] .st-cred', el)),
        workImages(gsap.utils.toArray<HTMLElement>('[data-work-fig]', el))
      ];
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh, { once: true });
      return () => { window.removeEventListener('load', refresh); stops.forEach(stop => stop()); };
    });
    return () => media.revert();
  }, { scope: root });
}

export function Home() {
  const root = useRef<HTMLDivElement>(null);
  useHomeMotion(root);
  return <div ref={root}><Hero /><Statement /><Roles /><Credentials /><Work /><Lab /><Contact /></div>;
}
