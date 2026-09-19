import React, { useEffect, useState } from 'react';
import { SystemProvider } from './os/state';
import { Shell } from './os/Shell';
import { AdminDashboard } from './admin/AdminDashboard';
import './os/styles.css';

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
    return <AdminDashboard />;
  }

  return (
    <SystemProvider>
      <Shell />
    </SystemProvider>
  );
}
