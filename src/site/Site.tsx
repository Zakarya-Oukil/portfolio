import React, { Suspense, lazy } from 'react';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './fonts.css';
import './base.css';
import { useVersion, VersionId } from './versions/registry';

/** Picks the active design version (see versions/registry.ts). Each version is its own code-split chunk. */
const LOADERS: Partial<Record<VersionId, React.LazyExoticComponent<React.ComponentType>>> = {
  casefile: lazy(() => import('./v1/V1')),
  editorial: lazy(() => import('./v2/V2')),
  swiss: lazy(() => import('./v3/V3')),
  blueprint: lazy(() => import('./v4/V4')),
  cinematic: lazy(() => import('./v5/V5'))
};

const Fallback = () => <div role="status" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', font: '500 15px system-ui, sans-serif', color: '#8f8878', background: '#1b1a18' }}>Loading</div>;

export default function Site() {
  const version = useVersion();
  const View = LOADERS[version] || LOADERS.casefile!;
  return <Suspense fallback={<Fallback />}><View key={version} /></Suspense>;
}
