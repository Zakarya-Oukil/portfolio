import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll reveal that can never strand content. Elements start hidden only when motion is allowed,
 * animate in as they approach the viewport, and a sweep after every scroll settles (or resize/refresh)
 * reveals anything already above or inside the viewport, so anchor jumps and restored scroll positions
 * never leave blank sections. Call inside a gsap.matchMedia handler (or useGSAP) so it is reverted.
 */
export function revealOnScroll(selector: string, options: { y?: number; duration?: number } = {}) {
  const { y = 32, duration = 0.75 } = options;
  const items = gsap.utils.toArray<HTMLElement>(selector);
  if (!items.length) return () => undefined;
  gsap.set(items, { autoAlpha: 0, y });

  const shown = new WeakSet<HTMLElement>();
  const show = (batch: HTMLElement[], instant = false) => {
    const fresh = batch.filter(el => !shown.has(el));
    if (!fresh.length) return;
    fresh.forEach(el => shown.add(el));
    gsap.to(fresh, { autoAlpha: 1, y: 0, duration: instant ? 0 : duration, stagger: instant ? 0 : 0.08, ease: 'power3.out', overwrite: true, clearProps: 'opacity,visibility,transform' });
  };

  const triggers = ScrollTrigger.batch(items, { start: 'top 90%', onEnter: batch => show(batch as HTMLElement[]), onEnterBack: batch => show(batch as HTMLElement[], true) });

  const sweep = () => show(items.filter(el => el.getBoundingClientRect().top < window.innerHeight), true);
  ScrollTrigger.addEventListener('scrollEnd', sweep);
  ScrollTrigger.addEventListener('refresh', sweep);
  window.addEventListener('resize', sweep);
  const safety = window.setTimeout(sweep, 1200);

  return () => {
    window.clearTimeout(safety);
    window.removeEventListener('resize', sweep);
    ScrollTrigger.removeEventListener('scrollEnd', sweep);
    ScrollTrigger.removeEventListener('refresh', sweep);
    (triggers as ScrollTrigger[]).forEach(trigger => trigger.kill());
  };
}
