import React, { useEffect } from 'react';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './fonts.css';
import './site.css';
import { CASE_STUDIES } from './content';
import { Home, SiteFooter, SiteHeader } from './Home';
import { CaseStudyPage, NotFound, WorkIndexPage } from './Pages';
import { usePath } from './router';

const BASE_TITLE = 'Zakarya Oukil | Security Engineer';

function titleFor(path: string): string {
  const clean = path.replace(/\/$/, '');
  const study = CASE_STUDIES.find(item => `/work/${item.slug}` === clean);
  if (study) return `${study.title} | Zakarya Oukil`;
  if (clean === '/work') return 'All projects | Zakarya Oukil';
  return BASE_TITLE;
}

export default function Site() {
  const path = usePath();
  const clean = path.replace(/\/$/, '') || '/';
  useEffect(() => { document.title = titleFor(path); }, [path]);

  let page: React.ReactNode;
  if (clean === '/') page = <Home />;
  else if (clean === '/work') page = <WorkIndexPage />;
  else if (clean.startsWith('/work/')) page = <CaseStudyPage slug={clean.slice(6)} />;
  else page = <NotFound />;

  return <div className="st-root">
    <a className="st-skip" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">{page}</main>
    <SiteFooter />
  </div>;
}
