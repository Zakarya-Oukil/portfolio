import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { safeLink } from './portfolio-store';
import { DEFAULT_FAST_PASS } from './recruitment-data';
import { AppId, RecruiterFastPassConfig, RecruiterRoleId, useSystemContext } from './state';

interface RecruiterEntryProps {
  onExplore: () => void;
  onEvidence: (id: AppId) => void;
  onContact: (role: RecruiterRoleId) => void;
}

export function RecruiterEntry({ onExplore, onEvidence, onContact }: RecruiterEntryProps) {
  const s = useSystemContext();
  const root = useRef<HTMLElement>(null);
  const [roleId, setRoleId] = useState<RecruiterRoleId>('pentest');
  const fastPass: RecruiterFastPassConfig = { ...DEFAULT_FAST_PASS, ...s.config?.recruiterFastPass };
  const roles = fastPass.roles?.length ? fastPass.roles : DEFAULT_FAST_PASS.roles;
  const role = roles.find(item => item.id === roleId) || roles[0];
  const resume = safeLink(role.resumeUrl);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-entry-reveal]', { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', clearProps: 'all'
      });
    });
    return () => media.revert();
  }, { scope: root });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-role-detail]', { autoAlpha: 0, y: 9 }, {
        autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.035, ease: 'power2.out', clearProps: 'all'
      });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [role.id], revertOnUpdate: true });

  return <main ref={root} className="recruiter-entry">
    <nav className="entry-navigation" aria-label="Portfolio entry">
      <a className="entry-wordmark" href="/" aria-current="page">ZAKARYA <span>OUKIL</span><small> / SECURITY PORTFOLIO</small></a>
      <button className="entry-explore-link" onClick={onExplore}>Explore the Portfolio OS <span aria-hidden="true">↗</span></button>
    </nav>

    <div className="entry-layout">
      <section className="entry-intro" aria-labelledby="entry-title">
        <p className="entry-overline" data-entry-reveal>Security research, engineering, response</p>
        <h1 id="entry-title" data-entry-reveal>Security work,<br/><em>made legible.</em></h1>
        <p className="entry-intro-copy" data-entry-reveal>I'm Zakarya Oukil. Explore the evidence behind my offensive security, threat detection, and systems research, then go deeper in the interactive workstation.</p>
        <div className="entry-intro-actions" data-entry-reveal>
          <button className="entry-button entry-button-primary" onClick={() => onContact(role.id)}>Start a conversation <span aria-hidden="true">↗</span></button>
          <button className="entry-button entry-button-quiet" onClick={onExplore}>Enter the workstation <span aria-hidden="true">→</span></button>
        </div>
        <p className="entry-provenance" data-entry-reveal>Portfolio OS is a browser-based simulation. Credentials, research targets, and lab scenarios are labeled by status in the evidence.</p>
      </section>

      <section className="entry-evidence" aria-labelledby="entry-evidence-title" data-entry-reveal>
        <div className="entry-evidence-heading"><span>Recruiter access</span><span>Choose your role →</span></div>
        <h2 id="entry-evidence-title">The relevant work, up front.</h2>
        <div className="entry-role-list" role="group" aria-label="Role paths">
          {roles.map((item, index) => <button key={item.id} type="button" className={`entry-role ${role.id === item.id ? 'is-selected' : ''}`} aria-pressed={role.id === item.id} onClick={() => setRoleId(item.id)}>
            <span className="entry-role-number">0{index + 1}</span><span className="entry-role-name">{item.label.replace(/^[^\p{L}\p{N}]+/u, '')}</span><span aria-hidden="true">↗</span>
          </button>)}
        </div>
        <div className="entry-role-detail" key={role.id}>
          <p className="entry-detail-label" data-role-detail>Selected path / {role.label.replace(/^[^\p{L}\p{N}]+/u, '')}</p>
          <h3 data-role-detail>{role.summary}</h3>
          <ul className="entry-competencies" data-role-detail>{role.competencies.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="entry-certifications" data-role-detail>Credential status: {role.certifications.join(', ')}</p>
          <div className="entry-evidence-actions" data-role-detail>
            <button className="entry-button entry-button-primary" onClick={() => onEvidence(role.evidenceApp)}>View role evidence <span aria-hidden="true">↗</span></button>
            {resume ? <a className="entry-button entry-button-outline" href={resume} download={role.resumeFilename}>Download role CV <span aria-hidden="true">↓</span></a> : <span className="entry-unavailable">This role CV has not been published.</span>}
          </div>
        </div>
      </section>
    </div>
    <footer className="entry-footer"><span>Evidence before spectacle.</span><span>Prefer the full experience? <button onClick={onExplore}>Open the OS →</button></span></footer>
  </main>;
}
