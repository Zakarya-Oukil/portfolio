import React, { useCallback, useEffect, useState } from 'react';

/** Minimal pathname router: no dependency, works on static hosts with an SPA rewrite. */
export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return path;
}

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  const hash = to.split('#')[1];
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { to: string }

/** Real anchor (opens in new tab, copy link, SEO) that navigates client-side on plain clicks. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handle = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  }, [to, onClick]);
  return <a href={to} onClick={handle} {...rest}>{children}</a>;
}
