import React, { lazy, Suspense, useEffect, useState } from 'react';
import { SystemProvider } from './os/state';
import { Shell } from './os/Shell';
const AdminDashboard = lazy(() => import('./admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
import './os/styles.css';
import './os/command-center.css';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return window.location.pathname.startsWith('/admin');
  });

  useEffect(() => {
    const handleLocation = () => {
      setIsAdmin(window.location.pathname.startsWith('/admin'));
    };
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  if (isAdmin) {
    return <Suspense fallback={<div style={{ padding: 40, background: '#0b0f19', color: '#cad7e8', minHeight: '100vh' }}>Opening admin workstation…</div>}><AdminDashboard /></Suspense>;
  }

  return (
    <SystemProvider>
      <Shell />
    </SystemProvider>
  );
}
