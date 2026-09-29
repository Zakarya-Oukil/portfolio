import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs `fire` once per element when it first comes into view, and can never strand content:
 * elements that were scrolled past (anchor jumps, restored scroll) are fired by a sweep after
 * scroll settles, on refresh, on resize and after a short safety timeout.
 * Call inside a gsap.matchMedia handler or useGSAP so it is reverted with the rest of the context.
 */
export function onceInView(items: HTMLElement[], fire: (el: HTMLElement) => void, start = 'top 82%') {
  const done = new WeakSet<HTMLElement>();
  const run = (el: HTMLElement) => { if (done.has(el)) return; done.add(el); fire(el); };
  const triggers = items.map(el => ScrollTrigger.create({ trigger: el, start, onEnter: () => run(el), onLeave: () => run(el), onEnterBack: () => run(el) }));
  const sweep = () => items.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight * 0.9) run(el); });
  ScrollTrigger.addEventListener('scrollEnd', sweep);
  ScrollTrigger.addEventListener('refresh', sweep);
  window.addEventListener('resize', sweep);
  const safety = window.setTimeout(sweep, 1500);
  return () => {
    window.clearTimeout(safety);
    window.removeEventListener('resize', sweep);
    ScrollTrigger.removeEventListener('scrollEnd', sweep);
    ScrollTrigger.removeEventListener('refresh', sweep);
    triggers.forEach(trigger => trigger.kill());
  };
}

/** Cover-sheet entrance: name lines rise out of a mask, the portrait settles onto the page. Interruptible. */
export function heroIntro(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .fromTo(q('[data-line]'), { yPercent: 108 }, { yPercent: 0, duration: 1, stagger: 0.12, clearProps: 'transform' }, 0)
    .fromTo(q('[data-portrait]'), { y: -80, rotate: -5, autoAlpha: 0 }, { y: 0, rotate: 2.4, autoAlpha: 1, duration: 1.05, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 0.3)
    .fromTo(q('[data-hero-fade]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,visibility,transform' }, 0.55);
  const skip = () => { intro.progress(1); };
  window.addEventListener('pointerdown', skip, { once: true });
  window.addEventListener('keydown', skip, { once: true });
  return () => { window.removeEventListener('pointerdown', skip); window.removeEventListener('keydown', skip); intro.kill(); };
}

/** Words of a paragraph light up in reading order as it scrolls through the viewport. */
export function scrubWords(root: HTMLElement) {
  const words = root.querySelectorAll('[data-w]');
  if (!words.length) return () => undefined;
  const tween = gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 55%', scrub: 0.4 } });
  return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(words, { clearProps: 'opacity' }); };
}

/** Credentials start under redaction bars, which wipe away row by row as each enters view. */
export function liftRedactions(rows: HTMLElement[]) {
  rows.forEach(row => row.classList.add('is-redacted'));
  const stop = onceInView(rows, row => {
    gsap.to(row.querySelectorAll('.st-redact'), { scaleX: 0, duration: 0.75, ease: 'power3.inOut', stagger: 0.09, delay: 0.12, onComplete: () => row.classList.remove('is-redacted') });
  }, 'top 85%');
  return () => { stop(); rows.forEach(row => { row.classList.remove('is-redacted'); gsap.set(row.querySelectorAll('.st-redact'), { clearProps: 'transform' }); }); };
}

/** Each work image grows into place as it arrives and dims as it leaves. Scroll-linked, so state is always correct. */
export function workImages(figs: HTMLElement[]) {
  const tweens: gsap.core.Tween[] = [];
  figs.forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    tweens.push(gsap.fromTo(img, { scale: 0.82, opacity: 0.55 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: fig, start: 'top 92%', end: 'top 40%', scrub: true } }));
    tweens.push(gsap.to(img, { scale: 0.95, opacity: 0.3, ease: 'none', immediateRender: false, scrollTrigger: { trigger: fig, start: 'bottom 42%', end: 'bottom -5%', scrub: true } }));
  });
  return () => tweens.forEach(t => { t.scrollTrigger?.kill(); t.kill(); });
}
