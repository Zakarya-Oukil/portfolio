import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

/** Sheet-wipe: a bone drawing sheet slides up over the page, the action runs under it, then it leaves. */
export function wipe(reduce: boolean, label: string, go: () => void, leaves = true) {
  if (reduce) { go(); return; }
  const sheet = document.createElement('div');
  sheet.className = 'v7-wipe';
  sheet.setAttribute('aria-hidden', 'true');
  sheet.innerHTML = `<span class="v7-wipe-label">${label}</span>`;
  document.body.appendChild(sheet);
  const tl = gsap.timeline();
  tl.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'power3.inOut', onComplete: go });
  if (leaves) tl.to(sheet, { yPercent: -100, duration: 0.6, delay: 0.1, ease: 'power3.inOut', onComplete: () => sheet.remove() });
}

/** Scrolls to an element id, through the smoother when it is running. */
export function scrollToId(id: string, reduce = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(el, !reduce, 'top 24px');
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Runs fire once when the element first enters view, and never strands content after anchor jumps. */
export function onceVisible(el: Element, fire: () => void, start = 'top 82%') {
  let done = false;
  const run = () => { if (done) return; done = true; fire(); };
  const trigger = ScrollTrigger.create({ trigger: el, start, onEnter: run, onEnterBack: run, onRefresh: self => { if (self.progress > 0) run(); } });
  return () => trigger.kill();
}
