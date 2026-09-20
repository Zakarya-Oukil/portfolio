import React, { useEffect, useRef } from 'react';
import { useSystemContext } from './state';
import { safeLink } from './portfolio-store';

export function HardwareTransition() {
  const s = useSystemContext(); const video = useRef<HTMLVideoElement>(null);
  const transition = s.transition!;
  const pair = `${transition.from}:${transition.to}`;
  const url = pair === 'macos:ios' ? safeLink(s.config.media?.macosToIos) : pair === 'ios:android' ? safeLink(s.config.media?.iosToAndroid) : undefined;
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { s.setTransition(null); return; }
    const timer = setTimeout(() => s.setTransition(null), 1200);
    return () => clearTimeout(timer);
  }, [transition]);
  return <div className="hardware-transition" aria-label={`Switching to ${transition.to}`}><div className="hardware-sweep"/>{url && <video ref={video} src={url} autoPlay muted playsInline preload="none" onLoadedMetadata={() => { if (video.current) video.current.playbackRate = Math.max(1, Math.min(8, video.current.duration / 1.2)); }} onError={e => { e.currentTarget.style.display = 'none'; }}/>}<span>{transition.to === 'macos' ? 'WORKSPACE' : transition.to === 'ios' ? 'A DIFFERENT PERSPECTIVE' : 'ANOTHER WAY TO EXPLORE'}</span><button onClick={() => s.setTransition(null)}>Skip transition</button></div>;
}
