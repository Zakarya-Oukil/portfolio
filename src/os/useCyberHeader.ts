import { useLayoutEffect, useRef } from 'react';

/** Keep the evidence sidebar below a header even when its controls wrap. */
export function useCyberHeader() {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    const header = element?.querySelector('header');
    if (!element || !header) return;
    const update = () => element.style.setProperty('--cyber-header-height', `${header.getBoundingClientRect().height + 16}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  return root;
}
