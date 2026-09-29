import React from 'react';
import '@fontsource-variable/geist/wght.css';
import './lab.css';
import '../os/styles.css';
import '../os/command-center.css';
import { SystemProvider } from '../os/state';
import { Shell } from '../os/Shell';

/**
 * The Kali workstation and NetHunter simulation. Loaded on its own route so its global
 * stylesheets never affect the main site. Leaving the lab is a full navigation on purpose.
 */
export default function Lab() {
  return <SystemProvider>
    <Shell skipEntry />
    <a href="/" className="lab-exit">Back to portfolio</a>
  </SystemProvider>;
}
