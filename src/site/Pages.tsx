import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import seed from '../data/seed.json';
import { CASE_STUDIES, ROLES, caseBySlug } from './content';
import { mailto } from './site-config';
import { Link } from './router';
import { revealOnScroll } from './motion';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const ICON = { weight: 'bold' as const, 'aria-hidden': true };

/** Reveals story blocks as they enter the viewport. Content stays visible without motion. */
function useStoryMotion(root: React.RefObject<HTMLElement>, key: string) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      return revealOnScroll('[data-story]', { y: 28, duration: 0.7 });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [key], revertOnUpdate: true });
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const root = useRef<HTMLElement>(null);
  const study = caseBySlug(slug);
  useStoryMotion(root, slug);
  if (!study) return <NotFound />;
  const role = ROLES.find(item => item.id === study.role);
  const index = CASE_STUDIES.findIndex(item => item.slug === slug);
  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];
  const email = mailto(`About: ${study.title}`);
  const hasStory = Boolean(study.problem || study.approach?.length || study.evidence?.length || study.outcome);

  return <article className="st-page" ref={root}>
    <div className="st-wrap">
      <Link to="/#work" className="st-back"><ArrowLeft {...ICON} />All work</Link>
      <h1>{study.title}</h1>
      <p className="st-kind">{study.kind}</p>
      <p className="st-summary">{study.summary}</p>
      <ul className="st-stack" aria-label="Stack" style={{ marginTop: 28 }}>{study.stack.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <div className="st-actions">
        {email && <a className="st-btn st-btn-primary" href={email}><EnvelopeSimple {...ICON} />Email me</a>}
        {study.codeUrl && <a className="st-btn" href={study.codeUrl} target="_blank" rel="noreferrer noopener">View code<ArrowUpRight {...ICON} /></a>}
        {study.demoUrl && <a className="st-btn" href={study.demoUrl} target="_blank" rel="noreferrer noopener">Live demo<ArrowUpRight {...ICON} /></a>}
        {role && <a className="st-btn" href={role.cv.href} download={role.cv.filename}>Download the matching CV</a>}
      </div>

      {hasStory && <div className="st-story">
        <div className="st-story-side"><h2>How it was built and what it proved</h2></div>
        <div className="st-story-body">
          {study.problem && <section data-story><h3>Problem</h3><p>{study.problem}</p></section>}
          {study.approach?.length ? <section data-story><h3>Approach</h3><ul>{study.approach.map(step => <li key={step}>{step}</li>)}</ul></section> : null}
          {study.evidence?.length ? <section data-story><h3>Evidence</h3><ul>{study.evidence.map(row => <li key={row.label}><strong>{row.value}</strong> {row.label}{row.source ? ` (${row.source})` : ''}</li>)}</ul></section> : null}
          {study.outcome && <section data-story><h3>Outcome</h3><p>{study.outcome}</p></section>}
        </div>
      </div>}

      <div style={{ marginTop: 'clamp(64px, 9vw, 120px)' }}>
        <Link to={`/work/${next.slug}`} className="st-link">Next: {next.title}<ArrowRight {...ICON} /></Link>
      </div>
    </div>
  </article>;
}

interface SeedProject { id: string; title: string; subtitle?: string; description?: string; tags?: string[]; country?: string }

export function WorkIndexPage() {
  const projects = (seed as { projects: SeedProject[] }).projects;
  return <section className="st-page">
    <div className="st-wrap">
      <Link to="/" className="st-back"><ArrowLeft {...ICON} />Home</Link>
      <h1>All projects</h1>
      <p className="st-summary">Security, systems and full-stack work. Projects with a full write-up link to their case study.</p>
      <ul className="st-index">{projects.map(item => {
        const study = CASE_STUDIES.find(entry => entry.seedId === item.id);
        const body = <><h3>{item.title}</h3><small>{item.subtitle || item.country}</small><p>{item.description}</p>{item.tags?.length ? <ul className="st-stack">{item.tags.slice(0, 4).map(tag => <li key={tag}>{tag}</li>)}</ul> : null}</>;
        return <li key={item.id}>{study ? <Link to={`/work/${study.slug}`}>{body}<span className="st-link">Read the case study<ArrowUpRight {...ICON} /></span></Link> : body}</li>;
      })}</ul>
    </div>
  </section>;
}

export function NotFound() {
  return <section className="st-page"><div className="st-wrap">
    <h1>Page not found</h1>
    <p className="st-summary">That address does not exist on this site.</p>
    <div className="st-actions"><Link className="st-btn st-btn-primary" to="/">Back to home</Link></div>
  </div></section>;
}
