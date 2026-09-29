import React, { useEffect } from 'react';
import './v1.css';
import { Home, SiteFooter, SiteHeader } from './Home';
import { CaseStudyPage, NotFound, WorkIndexPage } from './Pages';
import { usePath } from '../router';
import { parseRoute, titleFor } from '../routes';
import { usePageChrome } from '../shared/InnerPages';

/** Version 1: declassified case file. */
export default function V1() {
  const route = parseRoute(usePath());
  usePageChrome('#1b1a18', 'dark');
  useEffect(() => { document.title = titleFor(route); }, [route]);
  let page: React.ReactNode;
  if (route.name === 'home') page = <Home />;
  else if (route.name === 'work') page = <WorkIndexPage />;
  else if (route.name === 'case') page = <CaseStudyPage slug={route.slug} />;
  else page = <NotFound />;
  return <div className="st-root" style={{ '--vs-bg': '#1b1a18', '--vs-ink': '#ece6d8', '--vs-line': 'rgba(236,230,216,.36)', '--vs-accent': '#e2452e', '--vs-font': "'Switzer', sans-serif" } as React.CSSProperties}>
    <a className="st-skip" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">{page}</main>
    <SiteFooter />
  </div>;
}
