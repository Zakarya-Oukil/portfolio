import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowUpRight, CalendarBlank, DownloadSimple, EnvelopeSimple } from '@phosphor-icons/react';
import { DEFAULT_FAST_PASS } from '../os/recruitment-data';
import { CASE_STUDIES, PROFILE, ROLES, RolePath, caseBySlug } from './content';
import { CONTACT, mailto } from './site-config';
import { Link } from './router';
import { TraceCanvas } from './TraceCanvas';
import { revealOnScroll } from './motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ICON = { weight: 'bold' as const, 'aria-hidden': true };

export function SiteNav() {
  const email = mailto('Opportunity for Zakarya Oukil');
  return <div className="st-nav-wrap"><nav className="st-nav" aria-label="Primary">
    <Link to="/" className="st-mark">Zakarya Oukil</Link>
    <div className="st-nav-links">
      <Link to="/#roles">Roles</Link><Link to="/#work">Work</Link><Link to="/#contact">Contact</Link><a href="/lab">Lab</a>
    </div>
    {email ? <a className="st-btn st-btn-primary" href={email}>Email me</a> : <Link className="st-btn st-btn-primary" to="/#contact">Contact</Link>}
  </nav></div>;
}

function Hero() {
  const email = mailto('Opportunity for Zakarya Oukil');
  return <header className="st-hero">
    <TraceCanvas className="st-hero-canvas" />
    <div className="st-hero-inner">
      <h1 data-hero-line><span data-hero-line>{PROFILE.headline[0]}</span><em data-hero-line>{PROFILE.headline[1]}</em></h1>
      <p className="st-hero-copy" data-hero-line>{PROFILE.intro}</p>
      <div className="st-actions" data-hero-line>
        {email
          ? <><a className="st-btn st-btn-primary" href={email}><EnvelopeSimple {...ICON} />Email me</a><Link className="st-btn" to="/#work">See the work<ArrowRight {...ICON} /></Link></>
          : <Link className="st-btn st-btn-primary" to="/#work">See the work<ArrowRight {...ICON} /></Link>}
      </div>
    </div>
  </header>;
}

function Roles() {
  const [active, setActive] = useState<RolePath['id']>('pentest');
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panel = useRef<HTMLDivElement>(null);
  const role = ROLES.find(item => item.id === active) || ROLES[0];
  const study = caseBySlug(role.caseSlug);

  const onKey = (event: React.KeyboardEvent) => {
    const index = ROLES.findIndex(item => item.id === active);
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
    if (!step && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? ROLES.length - 1 : (index + step + ROLES.length) % ROLES.length;
    setActive(ROLES[next].id);
    tabs.current[ROLES[next].id]?.focus();
  };

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-role-swap]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out', clearProps: 'opacity,visibility,transform' });
    });
    return () => media.revert();
  }, { scope: panel, dependencies: [active], revertOnUpdate: true });

  return <section className="st-section" id="roles" aria-labelledby="roles-title"><div className="st-wrap">
    <h2 className="st-h2" id="roles-title" data-reveal>Pick your role. See the proof.</h2>
    <p className="st-lede" data-reveal>Each path shows the skills, the strongest matching project, and a CV written for that role.</p>
    <div className="st-roles" data-reveal>
      <div className="st-role-tabs" role="tablist" aria-label="Role paths" aria-orientation="vertical" onKeyDown={onKey}>
        {ROLES.map(item => <button key={item.id} ref={node => { tabs.current[item.id] = node; }} role="tab" id={`tab-${item.id}`} aria-selected={active === item.id} aria-controls="role-panel" tabIndex={active === item.id ? 0 : -1} className="st-role-tab" onClick={() => setActive(item.id)}>
          <strong>{item.title}</strong><span aria-hidden="true"><ArrowRight weight="bold" size={20} /></span>
        </button>)}
      </div>
      <div className="st-role-panel" id="role-panel" role="tabpanel" aria-labelledby={`tab-${role.id}`} ref={panel}>
        <p className="st-role-line" data-role-swap>{role.line}</p>
        <ul className="st-competencies" data-role-swap>{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
        <div className="st-role-actions" data-role-swap>
          {study && <Link className="st-btn st-btn-primary" to={`/work/${study.slug}`}>Read the case study<ArrowUpRight {...ICON} /></Link>}
          <a className="st-btn" href={role.cv.href} download={role.cv.filename}>Download CV<DownloadSimple {...ICON} /></a>
        </div>
      </div>
    </div>
  </div></section>;
}

function Credentials() {
  return <section className="st-section" style={{ paddingTop: 0 }} aria-labelledby="creds-title"><div className="st-wrap">
    <h2 className="st-h2" id="creds-title" data-reveal>Credentials, with their real status.</h2>
    <p className="st-lede" data-reveal>Certified means passed and held. In progress means studying, not yet earned.</p>
    <ul className="st-creds" data-reveal>{PROFILE.credentials.map(item => <li className="st-cred" key={item.name} data-status={item.status}><strong>{item.name}</strong><span>{item.status}</span></li>)}</ul>
  </div></section>;
}

function Work() {
  return <section className="st-section" style={{ paddingTop: 0 }} id="work" aria-labelledby="work-title"><div className="st-wrap">
    <h2 className="st-h2" id="work-title" data-reveal>Three projects, one for each path.</h2>
    <p className="st-lede" data-reveal>Deeper write-ups for each. The full list is one click away.</p>
    <div className="st-work">
      {CASE_STUDIES.map(item => <Link key={item.slug} to={`/work/${item.slug}`} className="st-case" data-role={item.role} data-reveal>
        <small>{item.kind}</small><h3>{item.title}</h3><p>{item.summary}</p>
        <ul className="st-stack" aria-label="Stack">{item.stack.slice(0, 4).map(tag => <li key={tag}>{tag}</li>)}</ul>
        <span className="st-link">Read the case study<ArrowUpRight {...ICON} /></span>
      </Link>)}
    </div>
    <Link to="/work" className="st-link" data-reveal style={{ marginTop: 24 }}>Browse all projects<ArrowRight {...ICON} /></Link>
  </div></section>;
}

function LabBand() {
  return <section className="st-section" style={{ paddingTop: 0 }} aria-labelledby="lab-title"><div className="st-wrap"><div className="st-lab" data-reveal>
    <div><h2 className="st-h2" id="lab-title">Prefer to explore? Open the lab.</h2><p>A browser simulation of a Kali Linux workstation and a NetHunter phone, with my reports, terminal and research inside. It is a simulation, not a live system, and it is not affiliated with OffSec.</p></div>
    <div className="st-lab-actions"><a className="st-btn" href="/lab">Open the lab<ArrowUpRight {...ICON} /></a></div>
  </div></div></section>;
}

function Contact() {
  const email = mailto('Opportunity for Zakarya Oukil');
  const facts: [string, string][] = [
    ['Availability', DEFAULT_FAST_PASS.availability], ['Work preference', DEFAULT_FAST_PASS.workPreference],
    ['Work authorization', DEFAULT_FAST_PASS.workAuthorization], ['Clearance', DEFAULT_FAST_PASS.clearance]
  ];
  return <section className="st-section st-contact" style={{ paddingTop: 0 }} id="contact" aria-labelledby="contact-title"><div className="st-wrap">
    <h2 id="contact-title" data-reveal>Let&rsquo;s talk about your role.</h2>
    <div className="st-actions" data-reveal>
      {email && <a className="st-btn st-btn-primary" href={email}><EnvelopeSimple {...ICON} />Email me</a>}
      {CONTACT.bookingUrl && <a className="st-btn" href={CONTACT.bookingUrl} target="_blank" rel="noreferrer noopener"><CalendarBlank {...ICON} />Book 15 minutes</a>}
      {!email && !CONTACT.bookingUrl && import.meta.env.DEV && <p className="st-note">Development notice: set VITE_CONTACT_EMAIL (and optionally VITE_BOOKING_URL) so visitors can reach you.</p>}
    </div>
    <dl className="st-facts" data-reveal>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className="st-note" data-reveal>Candidate-provided details. Clearance eligibility is not an issued clearance, and requirements are confirmed during screening.</p>
    <div className="st-cv-list" data-reveal>{ROLES.map(item => <a className="st-link" key={item.id} href={item.cv.href} download={item.cv.filename}>{item.title} CV<DownloadSimple {...ICON} /></a>)}</div>
  </div></section>;
}

export function SiteFooter() {
  return <footer className="st-footer"><span>Zakarya Oukil</span><nav aria-label="Footer"><Link to="/work">All projects</Link><a href="/lab">Lab</a>{CONTACT.github && <a href={CONTACT.github} target="_blank" rel="noreferrer noopener">GitHub</a>}{CONTACT.linkedin && <a href={CONTACT.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>}</nav></footer>;
}

/** Hero intro (interruptible) and scroll reveals. Content stays visible unless motion is allowed and GSAP runs. */
function useHomeMotion(root: React.RefObject<HTMLElement>) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro.fromTo('[data-hero-line]:not(h1)', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, clearProps: 'opacity,visibility,transform' });
      const skip = () => intro.progress(1);
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });

      const stopReveal = revealOnScroll('[data-reveal]');
      return () => { stopReveal(); window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); };
    });
    return () => media.revert();
  }, { scope: root });
}

export function Home() {
  const root = useRef<HTMLDivElement>(null);
  useHomeMotion(root);
  return <div ref={root}>
    <Hero /><main id="main"><Roles /><Credentials /><Work /><LabBand /><Contact /></main>
  </div>;
}
