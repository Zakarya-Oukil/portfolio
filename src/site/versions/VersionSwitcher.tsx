import React, { useEffect, useRef, useState } from 'react';
import './switcher.css';
import { VERSIONS, setVersion, useVersion } from './registry';

/** Review tool: lets the owner flip between design versions. Styled from the host version's CSS variables. */
export function VersionSwitcher() {
  const current = useVersion();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const active = VERSIONS.find(v => v.id === current) || VERSIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return <div className="vs" ref={root}>
    <button ref={button} type="button" className="vs-button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
      Version {VERSIONS.indexOf(active) + 1}
    </button>
    {open && <ul className="vs-menu" role="menu" aria-label="Design version">
      {VERSIONS.map((v, i) => <li key={v.id} role="none">
        <button type="button" role="menuitemradio" aria-checked={v.id === current} className="vs-item" onClick={() => { setVersion(v.id); setOpen(false); }}>
          <strong>{i + 1}. {v.name}</strong><span>{v.note}</span>
        </button>
      </li>)}
    </ul>}
  </div>;
}
