import { CASE_STUDIES } from './content';
import { labBySlug } from './lab/registry';

export type Route = { name: 'home' } | { name: 'work' } | { name: 'case'; slug: string } | { name: 'lab' } | { name: 'labSheet'; slug: string } | { name: 'missing' };

export function parseRoute(path: string): Route {
  const clean = path.replace(/\/$/, '') || '/';
  if (clean === '/') return { name: 'home' };
  if (clean === '/work') return { name: 'work' };
  if (clean === '/lab') return { name: 'lab' };
  if (clean.startsWith('/lab/')) { const slug = clean.slice(5); return labBySlug(slug) ? { name: 'labSheet', slug } : { name: 'missing' }; }
  if (clean.startsWith('/work/')) {
    const slug = clean.slice(6);
    return CASE_STUDIES.some(item => item.slug === slug) ? { name: 'case', slug } : { name: 'missing' };
  }
  return { name: 'missing' };
}

export function titleFor(route: Route): string {
  if (route.name === 'case') return `${CASE_STUDIES.find(item => item.slug === route.slug)?.title} | Zakarya Oukil`;
  if (route.name === 'work') return 'All projects | Zakarya Oukil';
  if (route.name === 'lab') return 'The lab | Zakarya Oukil';
  if (route.name === 'labSheet') return `${labBySlug(route.slug)?.title} | Zakarya Oukil`;
  return 'Zakarya Oukil | Junior Penetration Tester and Software Engineer';
}
