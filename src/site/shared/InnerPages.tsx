import React, { useEffect } from 'react';
import { CASE_STUDIES, REPOS, ROLES, caseBySlug } from '../content';
import { useLiveContent, mailtoFor } from '../live';
import { Link } from '../router';

/** Sets the page background behind a version (overscroll area) and restores it on exit. */
export function usePageChrome(background: string, scheme: 'light' | 'dark') {
  useEffect(() => {
    const html = document.documentElement, body = document.body;
    const prev = { hb: html.style.background, bb: body.style.background, cs: html.style.colorScheme };
    html.style.background = background; body.style.background = background; html.style.colorScheme = scheme;
    return () => { html.style.background = prev.hb; body.style.background = prev.bb; html.style.colorScheme = prev.cs; };
  }, [background, scheme]);
}

/** Semantic case-study page. Each version styles the x-* classes in its own way. */
export function CaseView({ slug, imageKey = 'image' }: { slug: string; imageKey?: 'image' | 'color' }) {
  const study = caseBySlug(slug);
  if (!study) return <MissingView />;
  const role = ROLES.find(item => item.id === study.role);
  const next = CASE_STUDIES[(CASE_STUDIES.findIndex(item => item.slug === slug) + 1) % CASE_STUDIES.length];
  const live = useLiveContent();
  const email = mailtoFor(live.email, `About: ${study.title}`);
  const cv = role ? live.cv[role.id] || live.cv.general : undefined;
  const src = imageKey === 'color' && study.imageColor ? study.imageColor : study.image.src;
  return <article className="x-page"><div className="x-wrap">
    <Link to="/#work" className="x-back">Back to work</Link>
    <h1 className="x-title">{study.title}</h1>
    <p className="x-kind">{study.kind}</p>
    <figure className="x-fig"><img src={src} alt={study.image.alt} width={1600} height={1000} /><figcaption>{study.image.alt}</figcaption></figure>
    <div className="x-case">
      <aside className="x-side"><dl>
        {study.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
        <div><dt>Stack</dt><dd>{study.stack.join(', ')}</dd></div>
      </dl></aside>
      <div className="x-main">
        <section><h2>What it is</h2><p>{study.summary}</p>{study.note && <p>{study.note}</p>}</section>
        {study.problem && <section><h2>The problem</h2><p>{study.problem}</p></section>}
        <section><h2>What I built</h2><ul>{study.built.map(step => <li key={step}>{step}</li>)}</ul></section>
        <section><h2>Read it yourself</h2><div className="x-links">
          <a className="x-link" href={study.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a>
          {study.demoUrl && <a className="x-link" href={study.demoUrl} target="_blank" rel="noreferrer noopener">Live demo</a>}
          {cv && <a className="x-link" href={cv.href} download={cv.filename}>Download the matching CV</a>}
          {email && <a className="x-link" href={email}>Email me about this project</a>}
        </div></section>
      </div>
    </div>
    <p className="x-next"><Link to={`/work/${next.slug}`} className="x-link">Next: {next.title}</Link></p>
  </div></article>;
}

export function IndexView() {
  const live = useLiveContent();
  return <section className="x-page"><div className="x-wrap">
    <Link to="/" className="x-back">Home</Link>
    <h1 className="x-title">All projects</h1>
    <p className="x-kind">Public repositories on GitHub. The first three have full write-ups.</p>
    <ul className="x-index">{REPOS.map(repo => {
      const study = CASE_STUDIES.find(item => item.repo === repo.url);
      return <li key={repo.name}>
        <h3>{repo.name}</h3><small>{repo.language}</small>
        {repo.description && <p>{repo.description}</p>}
        <div className="x-links">
          {study && <Link className="x-link" to={`/work/${study.slug}`}>Read the case study</Link>}
          <a className="x-link" href={repo.url} target="_blank" rel="noreferrer noopener">Code on GitHub</a>
        </div>
      </li>;
    })}</ul>
    {live.github && <p className="x-next"><a className="x-link" href={live.github} target="_blank" rel="noreferrer noopener">All repositories on GitHub</a></p>}
  </div></section>;
}

export function MissingView() {
  return <section className="x-page"><div className="x-wrap">
    <h1 className="x-title">Page not found</h1>
    <p className="x-kind">That address does not exist on this site.</p>
    <p className="x-next"><Link className="x-link" to="/">Back to home</Link></p>
  </div></section>;
}
