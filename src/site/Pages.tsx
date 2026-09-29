import React from 'react';
import { CASE_STUDIES, REPOS, ROLES, caseBySlug } from './content';
import { CONTACT, mailto } from './site-config';
import { Link } from './router';

export function CaseStudyPage({ slug }: { slug: string }) {
  const study = caseBySlug(slug);
  if (!study) return <NotFound />;
  const role = ROLES.find(item => item.id === study.role);
  const next = CASE_STUDIES[(CASE_STUDIES.findIndex(item => item.slug === slug) + 1) % CASE_STUDIES.length];
  const email = mailto(`About: ${study.title}`);
  return <article className="st-page">
    <div className="st-wrap">
      <Link to="/#work" className="st-back">Back to work</Link>
      <h1>{study.title}</h1>
      <p className="st-kind">{study.kind}</p>
      <figure className="st-page-fig"><img src={study.image.src} alt={study.image.alt} width={1600} height={1000} /><figcaption>{study.image.alt}</figcaption></figure>
      <div className="st-case">
        <aside className="st-case-side"><dl>
          {study.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          <div><dt>Stack</dt><dd style={{ fontSize: '1.05rem', fontWeight: 500 }}>{study.stack.join(', ')}</dd></div>
        </dl></aside>
        <div className="st-case-main">
          <section><h2>What it is</h2><p style={{ marginTop: 16 }}>{study.summary}</p>{study.note && <p style={{ marginTop: 12 }}>{study.note}</p>}</section>
          {study.problem && <section><h2>The problem</h2><p style={{ marginTop: 16 }}>{study.problem}</p></section>}
          <section><h2>What I built</h2><ul>{study.built.map(step => <li key={step}>{step}</li>)}</ul></section>
          <section><h2>Read it yourself</h2>
            <div className="st-item-links">
              <a className="st-tlink" href={study.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a>
              {study.demoUrl && <a className="st-tlink" href={study.demoUrl} target="_blank" rel="noreferrer noopener">Live demo</a>}
              {role && <a className="st-tlink" href={role.cv.href} download={role.cv.filename}>Download the matching CV</a>}
              {email && <a className="st-tlink" href={email}>Email me about this project</a>}
            </div>
          </section>
        </div>
      </div>
      <div style={{ marginTop: 'clamp(64px, 9vw, 128px)' }}><Link to={`/work/${next.slug}`} className="st-tlink">Next: {next.title}</Link></div>
    </div>
  </article>;
}

export function WorkIndexPage() {
  return <section className="st-page">
    <div className="st-wrap">
      <Link to="/" className="st-back">Home</Link>
      <h1>All projects</h1>
      <p className="st-kind">Public repositories on GitHub. The first three have full write-ups.</p>
      <ul className="st-index">{REPOS.map(repo => {
        const study = CASE_STUDIES.find(item => item.repo === repo.url);
        return <li key={repo.name}>
          <h3>{repo.name}</h3><small>{repo.language}</small>
          {repo.description && <p>{repo.description}</p>}
          <div className="st-item-links" style={{ marginTop: 10 }}>
            {study && <Link className="st-tlink" to={`/work/${study.slug}`}>Read the case study</Link>}
            <a className="st-tlink" href={repo.url} target="_blank" rel="noreferrer noopener">Code on GitHub</a>
          </div>
        </li>;
      })}</ul>
      {CONTACT.github && <p style={{ marginTop: 32 }}><a className="st-tlink" href={CONTACT.github} target="_blank" rel="noreferrer noopener">All repositories on GitHub</a></p>}
    </div>
  </section>;
}

export function NotFound() {
  return <section className="st-page"><div className="st-wrap">
    <h1>Page not found</h1>
    <p className="st-kind">That address does not exist on this site.</p>
    <div style={{ marginTop: 32 }}><Link className="st-btn" to="/">Back to home</Link></div>
  </div></section>;
}
