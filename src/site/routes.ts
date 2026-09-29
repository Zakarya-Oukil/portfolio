import { CASE_STUDIES } from './content';

export type Route = { name: 'home' } | { name: 'work' } | { name: 'case'; slug: string } | { name: 'missing' };

export function parseRoute(path: string): Route {
  const clean = path.replace(/\/$/, '') || '/';
  if (clean === '/') return { name: 'home' };
  if (clean === '/work') return { name: 'work' };
  if (clean.startsWith('/work/')) {
    const slug = clean.slice(6);
    return CASE_STUDIES.some(item => item.slug === slug) ? { name: 'case', slug } : { name: 'missing' };
  }
  return { name: 'missing' };
}

export function titleFor(route: Route): string {
  if (route.name === 'case') return `${CASE_STUDIES.find(item => item.slug === route.slug)?.title} | Zakarya Oukil`;
  if (route.name === 'work') return 'All projects | Zakarya Oukil';
  return 'Zakarya Oukil | Security Engineer';
}
