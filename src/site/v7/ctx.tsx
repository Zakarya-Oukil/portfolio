import React from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { navigate } from '../router';
import { scrollToId, wipe } from './motion7';

export interface Motion { reduce: boolean; fine: boolean }
export const MotionCtx = React.createContext<Motion>({ reduce: false, fine: false });

/** Real anchor that runs a sheet-wipe before an in-app route change, and scrolls smoothly for on-page anchors. */
export function SheetLink({ to, className, children, label = 'Next sheet' }: { to: string; className?: string; children: React.ReactNode; label?: string }) {
  const { reduce } = React.useContext(MotionCtx);
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const [path, hash] = to.split('#');
    const samePage = path === '' || path === window.location.pathname;
    if (hash && samePage) { window.history.replaceState({}, '', `${path || window.location.pathname}#${hash}`); scrollToId(hash, reduce); return; }
    if (!hash && samePage) { const smoother = ScrollSmoother.get(); if (smoother) smoother.scrollTo(0, !reduce); else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
    wipe(reduce, label, () => navigate(to));
  };
  return <a href={to} className={className} onClick={onClick}>{children}</a>;
}
