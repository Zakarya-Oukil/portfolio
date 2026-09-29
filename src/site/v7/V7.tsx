import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';
import { animate } from 'motion';
import './v7.css';
import './lab.css';
import { CASE_STUDIES, PROFILE, REPOS, ROLES, CaseStudy } from '../content';
import { mailtoFor, useLiveContent } from '../live';
import { usePath } from '../router';
import { parseRoute, titleFor } from '../routes';
import { CaseView, IndexView, MissingView, usePageChrome } from '../shared/InnerPages';
import { onceVisible, scrollToId } from './motion7';
import { MotionCtx, SheetLink } from './ctx';
import { Plotter } from './Plotter';

const LabIndex = lazy(() => import('../lab/LabPages').then(m => ({ default: m.LabIndex })));
const LabSheetView = lazy(() => import('../lab/LabPages').then(m => ({ default: m.LabSheetView })));

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin);
const SUBJECT = 'Opportunity for Zakarya Oukil';
const HERO_TITLE = 'Junior penetration tester and software engineer.';
const HERO_SUB = 'Master’s student in cybersecurity, eJPT certified, studying for BTL1 and Security+. I build the tools I use, and I keep learning in public.';

const useMedia = (query: string) => {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const sync = () => setMatch(list.matches);
    list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, [query]);
  return match;
};

function LabLink({ className, children, to = '/lab' }: { className?: string; children: React.ReactNode; to?: string }) {
  return <SheetLink to={to} className={className} label="Opening the lab">{children}</SheetLink>;
}

function Head() {
  const live = useLiveContent();
  const email = mailtoFor(live.email, SUBJECT);
  return <header className="v7-head">
    <SheetLink to="/" className="v7-brand">Zakarya Oukil</SheetLink>
    <nav className="v7-nav" aria-label="Primary">
      <SheetLink to="/#roles">Roles</SheetLink><SheetLink to="/#work">Work</SheetLink><SheetLink to="/#contact">Contact</SheetLink><LabLink>Lab</LabLink>
      {email ? <a className="v7-btn" href={email}>Email</a> : <SheetLink className="v7-btn" to="/#contact">Contact</SheetLink>}
    </nav>
  </header>;
}

/** The fixed drawing-sheet frame: double border, two rulers and a marker that reports scroll position and section. */
function SheetFrame() {
  return <div className="v7-frame" aria-hidden="true" data-frame>
    <i className="v7-fl v7-fl-t" /><i className="v7-fl v7-fl-r" /><i className="v7-fl v7-fl-b" /><i className="v7-fl v7-fl-l" />
    <i className="v7-fl2 v7-fl2-t" /><i className="v7-fl2 v7-fl2-r" /><i className="v7-fl2 v7-fl2-b" /><i className="v7-fl2 v7-fl2-l" />
    <span className="v7-ruler v7-ruler-x" /><span className="v7-ruler v7-ruler-y" />
    <div className="v7-marker" data-marker><span className="v7-marker-tick" /><span className="v7-marker-label" data-marker-label>Cover</span></div>
  </div>;
}

function Hero() {
  const { reduce, fine } = React.useContext(MotionCtx);
  const live = useLiveContent();
  const email = mailtoFor(live.email, SUBJECT);
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduce || !root.current) return;
    const q = gsap.utils.selector(root.current);
    const split = SplitText.create(q('[data-split]')[0], { type: 'lines,chars', mask: 'lines', linesClass: 'v7-line' });
    const img = q('[data-img]')[0] as HTMLElement;
    img.classList.add('is-dev');
    gsap.set(img, { '--r': '0%' });
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(split.chars, { yPercent: 108, duration: 0.9, stagger: 0.028 }, 0.2)
      .from(q('[data-card]'), { y: -70, rotate: -9, autoAlpha: 0, duration: 1, ease: 'back.out(1.4)' }, 0.25)
      .to(img, { '--r': '100%', duration: 1.7, ease: 'power2.inOut', onComplete: () => { img.classList.remove('is-dev'); img.style.removeProperty('--r'); } }, 0.5)
      .from(q('[data-corner]'), { scale: 2.4, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: 'back.out(2)' }, 1.4)
      .fromTo(q('[data-lead]'), { scaleX: 0 }, { scaleX: 1, duration: 0.55, stagger: 0.13 }, 1.7)
      .from(q('[data-call] span'), { autoAlpha: 0, x: -8, duration: 0.45, stagger: 0.13 }, 1.9)
      .from(q('[data-fade]'), { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1 }, 0.9);
    const skip = () => { tl.progress(1); };
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => { window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); tl.kill(); split.revert(); img.classList.remove('is-dev'); img.style.removeProperty('--r'); };
  }, { scope: root, dependencies: [reduce] });

  // The print leans toward the pointer on a soft spring. Fine pointers only.
  useEffect(() => {
    const card = root.current?.querySelector<HTMLElement>('[data-card]');
    const fig = root.current?.querySelector<HTMLElement>('[data-print]');
    if (!card || !fig || reduce || !fine) return;
    const move = (event: PointerEvent) => {
      const box = fig.getBoundingClientRect();
      const px = (event.clientX - box.left) / box.width - 0.5, py = (event.clientY - box.top) / box.height - 0.5;
      animate(card, { rotateY: px * 12, rotateX: -py * 9 }, { type: 'spring', stiffness: 140, damping: 16 });
    };
    const leave = () => { animate(card, { rotateX: 0, rotateY: 0 }, { type: 'spring', stiffness: 120, damping: 14 }); };
    fig.addEventListener('pointermove', move); fig.addEventListener('pointerleave', leave);
    return () => { fig.removeEventListener('pointermove', move); fig.removeEventListener('pointerleave', leave); };
  }, [reduce, fine]);

  return <section className="v7-hero" ref={root} data-section="Cover" aria-labelledby="v7-name">
    <Plotter reduce={reduce} fine={fine} />
    <div className="v7-hero-text">
      <h1 className="v7-h1" id="v7-name" data-split>Zakarya Oukil</h1>
      <p className="v7-dek" data-fade>{HERO_TITLE}</p>
      <p className="v7-sub" data-fade>{HERO_SUB}</p>
      <div className="v7-actions" data-fade>
        <LabLink to="/lab/spider-run" className="v7-btn v7-btn-lg v7-btn-red">Try the live demo</LabLink>
        {email && <a className="v7-btn v7-btn-lg" href={email}>Email</a>}
        {live.bookingUrl && <a className="v7-link" href={live.bookingUrl} target="_blank" rel="noreferrer noopener">Book 30 minutes</a>}
      </div>
    </div>
    <figure className="v7-print" data-print>
      <div className="v7-card" data-card>
        <span className="v7-tape" aria-hidden="true" />
        <div className="v7-photo">
          <img className="v7-img" data-img src="/img/portrait-color.webp" width={900} height={1125} alt="Portrait of Zakarya Oukil" {...{ fetchpriority: 'high' }} />
          {[1, 2, 3, 4].map(n => <span key={n} className={`v7-corner v7-c${n}`} data-corner />)}
        </div>
        <figcaption>Zakarya Oukil, junior penetration tester</figcaption>
      </div>
      <ul className="v7-callouts" aria-label="Credentials">
        {PROFILE.credentials.map((item, index) => <li key={item.name} className={`v7-call v7-call-${index + 1}`} data-call data-status={item.status}>
          <i className="v7-lead" data-lead aria-hidden="true" /><span><strong>{item.name}</strong> {item.status}</span>
        </li>)}
      </ul>
    </figure>
  </section>;
}

interface RoleRow { id: string; title: string; line: string; comps: string[]; slug?: string }
/** Role text written to match what is actually earned and built. It replaces the older seed text in content data. */
const ROLE_COPY: Record<string, { title: string; line: string; comps: string[] }> = {
  pentest: { title: 'Offensive security', line: 'Trace the attack path. Explain the exposure. Verify the fix.', comps: ['Reconnaissance and enumeration (eJPT, Zak’s Spider)', 'Host and network penetration testing fundamentals', 'Web application testing basics', 'Writing findings as clear report entries'] },
  soc: { title: 'SOC and detection', line: 'Learning to connect evidence to detection logic. Studying for BTL1.', comps: ['Sentinel Shield: a phishing-detection platform I built', 'Detection rule formats: Sigma and Suricata (study samples)', 'MITRE ATT&CK for mapping what I learn', 'BTL1 in progress'] },
  systems: { title: 'Systems and DevOps', line: 'Building and running systems I can secure: containers, servers and tooling.', comps: ['Docker and Kubernetes for my own projects', 'Linux server administration on a VPS', 'Studying Linux kernel security and eBPF', 'Full-stack TypeScript tooling (ZakOS)'] }
};
const ROWS: RoleRow[] = [
  ...ROLES.map(role => ({ id: role.id, title: ROLE_COPY[role.id].title, line: ROLE_COPY[role.id].line, comps: ROLE_COPY[role.id].comps, slug: role.caseSlug })),
  { id: 'software', title: 'Software engineering', line: 'Full-stack TypeScript, shipped in public.', comps: ['React, TypeScript and Node', 'Docker for sandboxes and web projects', `${REPOS.length} public repositories`] }
];

function Roles() {
  const { reduce } = React.useContext(MotionCtx);
  const live = useLiveContent();
  const [open, setOpen] = useState(ROWS[0].id);
  const list = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLElement>(null);

  const scramble = (row: Element | null) => {
    if (reduce || !row) return;
    row.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el, i) => {
      const text = el.dataset.scramble || '';
      gsap.fromTo(el, { scrambleText: { text: '', chars: '01/\\|<>_', speed: 0.9 } }, { scrambleText: { text, chars: '01/\\|<>_', speed: 0.9, revealDelay: 0.12 }, duration: 0.9, delay: i * 0.08, ease: 'none' });
    });
  };

  /** Rows fold like drawers: the old body collapses while the new one opens, both clipped, so text never overlaps. */
  const toggle = (id: string) => {
    if (id === open) return;
    const root = list.current;
    if (reduce || !root) { setOpen(id); return; }
    const prev = root.querySelector<HTMLElement>('.v7-role.is-open .v7-role-body');
    const prevHeight = prev ? prev.offsetHeight : 0;
    flushSync(() => setOpen(id));
    const next = root.querySelector<HTMLElement>(`[data-role="${id}"] .v7-role-body`);
    const done = () => ScrollTrigger.refresh();
    if (prev && prev !== next) gsap.fromTo(prev, { height: prevHeight, visibility: 'visible' }, { height: 0, duration: 0.55, ease: 'power3.inOut', clearProps: 'height,visibility', overwrite: true });
    if (next) {
      gsap.fromTo(next, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'power3.inOut', clearProps: 'height', overwrite: true, onComplete: done });
      gsap.fromTo(next.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, delay: 0.18, stagger: 0.06, ease: 'power3.out', clearProps: 'opacity,visibility,transform' });
    }
    scramble(root.querySelector(`[data-role="${id}"]`));
  };

  useGSAP(() => {
    if (reduce || !box.current || !list.current) return;
    const stops: (() => void)[] = [];
    stops.push(onceVisible(list.current, () => scramble(list.current!.querySelector(`[data-role="${ROWS[0].id}"]`)), 'top 75%'));
    const rules = box.current.querySelectorAll('[data-rule]');
    const stamp = box.current.querySelector('[data-stamp]');
    gsap.set(rules, { scaleX: 0 });
    gsap.set(box.current.querySelectorAll('[data-edge-h]'), { scaleX: 0 });
    gsap.set(box.current.querySelectorAll('[data-edge-v]'), { scaleY: 0 });
    gsap.set(box.current.querySelectorAll('[data-cred]'), { autoAlpha: 0, y: 10 });
    if (stamp) gsap.set(stamp, { autoAlpha: 0 });
    stops.push(onceVisible(box.current, () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      tl.to(box.current!.querySelectorAll('[data-edge-h]'), { scaleX: 1, duration: 0.7, stagger: 0.1 }, 0)
        .to(box.current!.querySelectorAll('[data-edge-v]'), { scaleY: 1, duration: 0.7, stagger: 0.1 }, 0.1)
        .to(rules, { scaleX: 1, duration: 0.6, stagger: 0.12 }, 0.5)
        .to(box.current!.querySelectorAll('[data-cred]'), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, 0.6)
        .add(() => { if (stamp) { gsap.set(stamp, { autoAlpha: 1 }); animate(stamp as HTMLElement, { scale: [1.9, 1], rotate: [-9, -3] }, { type: 'spring', stiffness: 380, damping: 15 }); } }, 1.3);
    }, 'top 78%'));
    return () => stops.forEach(stop => stop());
  }, { scope: box, dependencies: [reduce] });

  return <section className="v7-section" id="roles" data-section="Roles" aria-labelledby="v7-roles"><div className="v7-split">
    <div>
      <h2 className="v7-h2" id="v7-roles">The roles</h2>
      <div className="v7-roles" ref={list}>
        {ROWS.map(row => {
          const study = row.slug ? CASE_STUDIES.find(item => item.slug === row.slug) : undefined;
          const isOpen = open === row.id;
          return <article key={row.id} className={`v7-role${isOpen ? ' is-open' : ''}`} data-role={row.id}>
            <h3><button type="button" className="v7-role-btn" aria-expanded={isOpen} aria-controls={`v7-body-${row.id}`} onClick={() => toggle(row.id)}><span>{row.title}</span><i className="v7-plus" aria-hidden="true" /></button></h3>
            <div className="v7-role-body" id={`v7-body-${row.id}`} {...(isOpen ? {} : ({ inert: '' } as object))}>
              <p className="v7-role-line">{row.line}</p>
              <ul className="v7-comps">{row.comps.map(item => <li key={item}><span aria-hidden="true" data-scramble={item}>{item}</span><span className="v7-sr">{item}</span></li>)}</ul>
              <div className="v7-links">
                {study && <SheetLink className="v7-link" to={`/work/${study.slug}`}>Read the {study.title} case study</SheetLink>}
                {!study && <SheetLink className="v7-link" to="/work">See the public repositories</SheetLink>}
                {(live.cv[row.id] || live.cv.general) && <a className="v7-link" href={(live.cv[row.id] || live.cv.general).href} download={(live.cv[row.id] || live.cv.general).filename}>Download CV</a>}
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
    <aside className="v7-creds" ref={box} aria-labelledby="v7-creds">
      <i className="v7-edge v7-edge-t" data-edge-h /><i className="v7-edge v7-edge-b" data-edge-h /><i className="v7-edge v7-edge-l" data-edge-v /><i className="v7-edge v7-edge-r" data-edge-v />
      <h2 id="v7-creds">Credentials</h2>
      <i className="v7-rule" data-rule />
      <dl>{PROFILE.credentials.map(item => <div key={item.name} data-cred>
        <dt>{item.name}</dt>
        <dd className={`v7-status${item.status === 'Certified' ? ' is-earned' : ''}`} data-status={item.status} {...(item.status === 'Certified' ? { 'data-stamp': true } : {})}>{item.status === 'Certified' ? 'Certified' : item.status}</dd>
        <dd className="v7-meaning">{item.meaning}</dd>
        {item.name === 'eJPT' && live.ejptVerify && <dd><a className="v7-link" href={live.ejptVerify} target="_blank" rel="noreferrer noopener">Verify the certificate</a></dd>}
        <dd className="v7-ruleholder" aria-hidden="true"><i className="v7-rule" data-rule /></dd>
      </div>)}</dl>
    </aside>
  </div></section>;
}

/** One case study as a drawing sheet. The screenshot is scanned in, and real screenshots get a loupe. */
function Sheet({ item, index }: { item: CaseStudy; index: number }) {
  const { reduce, fine } = React.useContext(MotionCtx);
  const fig = useRef<HTMLElement>(null);
  const lens = useRef<HTMLElement>(null);
  const real = !!item.imageColor;
  const src = item.imageColor || item.image.src;

  useEffect(() => {
    if (!real || !fine || reduce || !fig.current || !lens.current) return;
    const el = fig.current, lensEl = lens.current;
    el.classList.add('has-lens');
    const zoom = 2.4, size = 168;
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const x = event.clientX - box.left, y = event.clientY - box.top;
      lensEl.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      lensEl.style.backgroundSize = `${box.width * zoom}px ${box.height * zoom}px`;
      lensEl.style.backgroundPosition = `${-(x * zoom - size / 2)}px ${-(y * zoom - size / 2)}px`;
    };
    const enter = () => { lensEl.style.opacity = '1'; };
    const leave = () => { lensEl.style.opacity = '0'; };
    el.addEventListener('pointermove', move); el.addEventListener('pointerenter', enter); el.addEventListener('pointerleave', leave);
    return () => { el.classList.remove('has-lens'); el.removeEventListener('pointermove', move); el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave); };
  }, [real, fine, reduce]);

  return <article className="v7-sheet" data-sheet>
    <figure className="v7-exhibit" ref={fig} data-exhibit>
      <img src={src} alt={item.image.alt} width={1600} height={1000} loading="lazy" data-shot />
      <i className="v7-scan" data-scan aria-hidden="true" />
      {real && <i className="v7-lens" ref={lens} style={{ backgroundImage: `url(${src})` }} aria-hidden="true" />}
      <figcaption>{real ? (fine && !reduce ? 'Real screenshot. Move over it to inspect.' : 'Real screenshot.') : 'Illustrative image, not a screenshot of this project.'}</figcaption>
    </figure>
    <span className="v7-plate" aria-hidden="true">Sheet {index + 1} / {CASE_STUDIES.length}</span>
    <div className="v7-sheet-text">
      <h3><SheetLink to={`/work/${item.slug}`}>{item.title}</SheetLink></h3>
      <p className="v7-sub">{item.kind}</p>
      <p>{item.summary}</p>
      <p className="v7-stack">{item.stack.join(' · ')}</p>
      <div className="v7-links"><SheetLink className="v7-link" to={`/work/${item.slug}`}>Read the case study</SheetLink><a className="v7-link" href={item.repo} target="_blank" rel="noreferrer noopener">Code on GitHub</a></div>
    </div>
  </article>;
}

function Work() {
  const { reduce } = React.useContext(MotionCtx);
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 900px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)', () => {
      const reel = root.current!.querySelector<HTMLElement>('[data-reel]')!;
      const sheets = gsap.utils.toArray<HTMLElement>('[data-sheet]', root.current!);
      if (sheets.length < 2) return;
      reel.classList.add('is-pinned');
      const shot = (s: HTMLElement) => s.querySelector('[data-shot]');
      const scan = (s: HTMLElement) => s.querySelector('[data-scan]');
      gsap.set(sheets.slice(1), { xPercent: 112, rotation: 1.2 });
      sheets.slice(1).forEach(s => gsap.set(shot(s), { clipPath: 'inset(0 100% 0 0)' }));
      const first = onceVisible(reel, () => {
        gsap.fromTo(shot(sheets[0]), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut', clearProps: 'clipPath' });
        gsap.fromTo(scan(sheets[0]), { left: '0%', opacity: 1 }, { left: '100%', duration: 1.1, ease: 'power2.inOut', onComplete: () => { gsap.set(scan(sheets[0]), { opacity: 0 }); } });
      }, 'top 70%');
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: reel, start: 'center center', end: `+=${(sheets.length - 1) * 105}%`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true } });
      sheets.forEach((s, i) => {
        if (i === 0) return;
        const t = i - 1;
        tl.to(sheets[i - 1], { scale: 0.93, y: -22, rotation: -0.8, opacity: 0.45, duration: 1 }, t)
          .to(s, { xPercent: 0, rotation: 0, duration: 1, ease: 'power2.out' }, t)
          .to(shot(s), { clipPath: 'inset(0 0% 0 0)', duration: 0.6 }, t + 0.35)
          .fromTo(scan(s), { left: '0%', opacity: 1 }, { left: '100%', duration: 0.6 }, t + 0.35)
          .to(scan(s), { opacity: 0, duration: 0.02 }, t + 0.96);
      });
      // Keyboard: focusing a link inside an off-screen sheet scrolls the pin to that sheet.
      const onFocus = (index: number) => () => {
        const st = tl.scrollTrigger;
        if (!st) return;
        const y = st.start + (st.end - st.start) * (index / (sheets.length - 1));
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(y, false); else window.scrollTo({ top: y, behavior: 'auto' });
      };
      const focusers = sheets.map((s, i) => { const fn = onFocus(i); s.addEventListener('focusin', fn); return () => s.removeEventListener('focusin', fn); });
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      return () => { focusers.forEach(off => off()); first(); tl.scrollTrigger?.kill(); tl.kill(); reel.classList.remove('is-pinned'); sheets.forEach(s => gsap.set([s, shot(s), scan(s)], { clearProps: 'all' })); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [reduce] });

  return <section className="v7-section v7-work" id="work" data-section="Work" ref={root} aria-labelledby="v7-work">
    <div className="v7-work-head">
      <h2 className="v7-h2" id="v7-work">Selected work</h2>
      <p className="v7-lede">Each project links to its public repository. <SheetLink className="v7-link" to="/work">All projects</SheetLink></p>
    </div>
    <div className="v7-reel" data-reel><div className="v7-stack">{CASE_STUDIES.map((item, index) => <Sheet key={item.slug} item={item} index={index} />)}</div></div>
  </section>;
}

function LabTeaser() {
  const picks = [['L1', 'Zak’s Spider, live run', 'spider-run'], ['L2', 'Attack chain scrubber', 'attack-chain'], ['L3', 'Audit this site', 'audit'], ['L4', 'Break-in challenge', 'break-in']];
  return <section className="v7-section" id="lab" data-section="Lab" aria-labelledby="v7-lab">
    <h2 className="v7-h2" id="v7-lab">Try the tools</h2>
    <p className="v7-lede">Run them right here. Each one works in your browser against a labelled demo target. <SheetLink className="v7-link" to="/lab">All lab sheets</SheetLink></p>
    <ul className="v7-title-block v7-lab-teaser">{picks.map(([no, title, slug]) => <li key={slug}><SheetLink to={`/lab/${slug}`} label={title}><span className="v7-row-in"><span className="v7-row-label">{no}</span><b>{title}</b></span></SheetLink></li>)}</ul>
  </section>;
}

function Contact() {
  const { reduce, fine } = React.useContext(MotionCtx);
  const live = useLiveContent();
  const root = useRef<HTMLElement>(null);
  const channels: { label: string; value: string; href: string; ext?: boolean; scramble?: boolean }[] = [
    live.email && { label: 'Email', value: live.email, href: mailtoFor(live.email, SUBJECT), scramble: true },
    live.phone && { label: 'Phone', value: live.phone, href: `tel:${live.phone.replace(/[^+\d]/g, '')}` },
    live.whatsapp && { label: 'WhatsApp', value: 'Send a message', href: `https://wa.me/${live.whatsapp.replace(/\D/g, '')}`, ext: true },
    live.bookingUrl && { label: 'Calendar', value: 'Book 30 minutes', href: live.bookingUrl, ext: true },
    live.linkedin && { label: 'LinkedIn', value: 'Connect', href: live.linkedin, ext: true },
    live.github && { label: 'GitHub', value: 'Zakarya-Oukil', href: live.github, ext: true },
    live.instagram && { label: 'Instagram', value: 'Follow', href: live.instagram, ext: true }
  ].filter(Boolean) as { label: string; value: string; href: string; ext?: boolean; scramble?: boolean }[];

  useGSAP(() => {
    if (reduce || !root.current) return;
    const mail = root.current.querySelector<HTMLElement>('[data-mail]');
    const stops: (() => void)[] = [];
    if (mail) stops.push(onceVisible(mail, () => gsap.fromTo(mail, { scrambleText: { text: '', chars: '0123456789abcdef@.', speed: 0.8 } }, { scrambleText: { text: mail.dataset.mail || '', chars: '0123456789abcdef@.', speed: 0.8, revealDelay: 0.15 }, duration: 1.2, ease: 'none' }), 'top 85%'));
    const rows = root.current.querySelectorAll<HTMLElement>('[data-row]');
    gsap.set(rows, { autoAlpha: 0, y: 14 });
    stops.push(onceVisible(root.current, () => gsap.to(rows, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }), 'top 75%'));
    return () => stops.forEach(stop => stop());
  }, { scope: root, dependencies: [reduce, channels.length] });

  const spring = (el: HTMLElement, x: number) => { if (!reduce && fine) animate(el.querySelector('.v7-row-in') as HTMLElement, { x }, { type: 'spring', stiffness: 520, damping: 26 }); };
  return <section className="v7-section v7-contact" id="contact" data-section="Contact" ref={root} aria-labelledby="v7-contact">
    <h2 className="v7-h2" id="v7-contact">Write to me.</h2>
    <p className="v7-lede">Pick whichever channel is easiest. I read all of them.</p>
    <div className="v7-contact-grid">
      <ul className="v7-title-block">{channels.map(channel => <li key={channel.label} data-row onPointerEnter={event => spring(event.currentTarget, 10)} onPointerLeave={event => spring(event.currentTarget, 0)}>
        <a href={channel.href} {...(channel.ext ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>
          <span className="v7-row-in"><span className="v7-row-label">{channel.label}</span>{channel.scramble ? <><b aria-hidden="true" data-mail={channel.value}>{channel.value}</b><span className="v7-sr">{channel.value}</span></> : <b>{channel.value}</b>}</span>
        </a>
      </li>)}</ul>
      <aside className="v7-contact-side">
        {live.facts.length > 0 && <><dl className="v7-facts">{live.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="v7-note">Details are given by me and confirmed during screening.</p></>}
        <div className="v7-links">{Object.entries(live.cv).map(([id, file]) => <a className="v7-link" key={id} href={file.href} download={file.filename}>{id === 'general' ? 'Download my CV' : `${ROLE_COPY[id]?.title || id} CV`}</a>)}</div>
      </aside>
    </div>
  </section>;
}

function Foot() {
  const live = useLiveContent();
  return <footer className="v7-foot"><span>Zakarya Oukil</span><nav aria-label="Footer"><SheetLink to="/work">All projects</SheetLink><LabLink>Lab</LabLink>{live.github && <a href={live.github} target="_blank" rel="noreferrer noopener">GitHub</a>}</nav></footer>;
}

/** Inertial smooth scroll, only where it is safe. Rendered before the page so it exists before any ScrollTrigger pin is built. */
function Smoother({ active }: { active: boolean }) {
  useGSAP(() => {
    if (!active) return;
    const smoother = ScrollSmoother.create({ wrapper: '#v7-wrapper', content: '#v7-content', smooth: 1, effects: false, normalizeScroll: false });
    ScrollTrigger.refresh();
    return () => { smoother.kill(); };
  }, { dependencies: [active] });
  return null;
}

/** Version 7: the mix. Dark paper, engineering-sheet frame, editorial layout, serif name with mono callouts. */
export default function V7() {
  const route = parseRoute(usePath());
  const root = useRef<HTMLDivElement>(null);
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const wide = useMedia('(min-width: 1024px)');
  usePageChrome('#1b1a18', 'dark');
  useEffect(() => { document.title = titleFor(route); }, [route]);

  // Frame: draws itself, then the marker follows scroll and names the section in view.
  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    if (!reduce) {
      gsap.timeline({ defaults: { ease: 'power2.inOut' } })
        .fromTo(q('.v7-fl-t, .v7-fl-b, .v7-fl2-t, .v7-fl2-b'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.1 }, 0)
        .fromTo(q('.v7-fl-l, .v7-fl-r, .v7-fl2-l, .v7-fl2-r'), { scaleY: 0 }, { scaleY: 1, duration: 1.1, stagger: 0.1 }, 0.1)
        .fromTo(q('.v7-ruler-x'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2 }, 0.4)
        .fromTo(q('.v7-ruler-y'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2 }, 0.5);
    }
    const marker = q('[data-marker]')[0] as HTMLElement, label = q('[data-marker-label]')[0] as HTMLElement, frame = q('[data-frame]')[0] as HTMLElement;
    const setY = gsap.quickSetter(marker, 'y', 'px');
    const range = () => Math.max(0, frame.clientHeight - 110);
    const sectionEls = gsap.utils.toArray<HTMLElement>('[data-section]', el);
    const name = () => {
      const line = window.innerHeight * 0.55;
      const hit = sectionEls.find(section => { const r = section.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
      if (hit && label.textContent !== hit.dataset.section) label.textContent = hit.dataset.section || '';
    };
    const progress = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { setY(self.progress * range()); name(); }, onRefresh: self => { setY(self.progress * range()); name(); } });
    const sections: ScrollTrigger[] = [];
    return () => { progress.kill(); sections.forEach(s => s.kill()); };
  }, { scope: root, dependencies: [route.name] });

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && route.name === 'home') requestAnimationFrame(() => scrollToId(hash, reduce));
    else if (route.name !== 'home') ScrollSmoother.get()?.scrollTop(0);
  }, [route.name]);

  return <MotionCtx.Provider value={{ reduce, fine }}>
    <div className="v7" ref={root} style={{ '--vs-bg': '#1b1a18', '--vs-ink': '#ece6d8', '--vs-line': 'rgba(236,230,216,.4)', '--vs-accent': '#e2452e', '--vs-font': "'Switzer', sans-serif" } as React.CSSProperties}>
      <a className="v7-skip" href="#main">Skip to content</a>
      <SheetFrame />
      <Smoother active={!reduce && fine && wide} />
      <Head />
      <div id="v7-wrapper"><div id="v7-content">
        <main id="main">
          {route.name === 'home' && <><Hero /><Roles /><Work /><LabTeaser /><Contact /></>}
          {route.name === 'lab' && <Suspense fallback={<p className="v7-section">Loading the lab</p>}><LabIndex /></Suspense>}
          {route.name === 'labSheet' && <Suspense fallback={<p className="v7-section">Loading the sheet</p>}><LabSheetView slug={route.slug} /></Suspense>}
          {route.name === 'work' && <IndexView />}
          {route.name === 'case' && <CaseView slug={route.slug} imageKey="color" />}
          {route.name === 'missing' && <MissingView />}
        </main>
        <Foot />
      </div></div>
    </div>
  </MotionCtx.Provider>;
}
