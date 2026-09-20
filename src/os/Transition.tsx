import React, { useEffect, useState } from 'react';
import { useSystemContext } from './state';
import { playSound } from './audio';

export function HardwareTransition() {
  const s = useSystemContext();
  const transition = s.transition!;
  const [fadingOut, setFadingOut] = useState(false);

  const finish = () => {
    setFadingOut(true);
    setTimeout(() => s.setTransition(null), 180);
  };

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.setTransition(null);
      return;
    }
    if (s.soundOn) playSound('hardware');
    // Snappy, clean 460ms transition with smooth exit
    const timer = setTimeout(finish, 460);
    return () => clearTimeout(timer);
  }, [transition]);

  const targetLabel =
    transition.to === 'macos'
      ? 'macOS Sonoma'
      : transition.to === 'ios'
      ? 'iPhone 16 Pro'
      : 'Pixel 9 Pro';

  const targetSub =
    transition.to === 'macos'
      ? 'Desktop Command Center'
      : transition.to === 'ios'
      ? 'iOS 18 Virtual Workspace'
      : 'Material You Virtual Workspace';

  const targetIcon =
    transition.to === 'macos' ? (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M2 20h20M9 16v4M15 16v4" />
      </svg>
    ) : transition.to === 'ios' ? (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <line x1="11" y1="5" x2="13" y2="5" />
        <circle cx="12" cy="18" r="0.8" />
      </svg>
    ) : (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="2.5" />
        <circle cx="12" cy="5" r="0.8" />
        <line x1="10" y1="19" x2="14" y2="19" />
      </svg>
    );

  return (
    <div
      className={`hardware-transition simple-handoff ${fadingOut ? 'hardware-exit' : ''}`}
      aria-label={`Switching to ${transition.to}`}
      onClick={finish}
      role="button"
      tabIndex={0}
    >
      <div className="hardware-sweep" />
      <div className="handoff-card">
        <div className="handoff-icon">{targetIcon}</div>
        <div className="handoff-info">
          <span className="handoff-subtitle">SWITCHING ENVIRONMENT</span>
          <strong className="handoff-title">{targetLabel}</strong>
          <small className="handoff-detail">{targetSub}</small>
        </div>
        <div className="handoff-bar">
          <div className="handoff-bar-fill" />
        </div>
      </div>
    </div>
  );
}
