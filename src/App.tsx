import React, { lazy, Suspense } from 'react';
import { usePath } from './site/router';

const Site = lazy(() => import('./site/Site'));
const Lab = lazy(() => import('./lab/Lab'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));

const loading = (label: string) => <div role="status" style={{ padding: 40, background: '#070b0d', color: '#9fb2aa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>{label}</div>;

/** Route split: main site by default, the Kali lab at /lab, the editor at /admin. */
export default function App() {
  const path = usePath();
  if (path.startsWith('/admin')) return <Suspense fallback={loading('Opening admin workstation...')}><AdminDashboard /></Suspense>;
  if (path === '/lab' || path.startsWith('/lab/')) return <Suspense fallback={loading('Booting the lab...')}><Lab /></Suspense>;
  return <Suspense fallback={loading('Loading...')}><Site /></Suspense>;
}
