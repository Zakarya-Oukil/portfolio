import React, { useEffect, useRef, useState } from 'react';
import { useSystemContext } from './state';
import { safeLink } from './portfolio-store';

export function HardwareTransition() {
  const s = useSystemContext();
  const video = useRef<HTMLVideoElement>(null);
  const transition = s.transition!;
  const pair = `${transition.from}:${transition.to}`;

  const url =
    pair === 'macos:ios'
      ? safeLink(s.config.media?.macosToIos || '/media/macos-ios.mp4')
      : pair === 'ios:macos'
      ? safeLink(s.config.media?.iosToMacos || '/media/ios-macos.mp4')
      : pair === 'macos:android'
      ? safeLink(s.config.media?.macosToAndroid || '/media/macos-android.mp4')
      : pair === 'android:macos'
      ? safeLink(s.config.media?.androidToMacos || '/media/android-macos.mp4')
      : pair === 'ios:android'
      ? safeLink(s.config.media?.iosToAndroid || '/media/ios-android.mp4')
      : pair === 'android:ios'
      ? safeLink(s.config.media?.androidToIos || '/media/android-ios.mp4')
      : undefined;

  const [fadingOut, setFadingOut] = useState(false);

  const finish = () => {
    setFadingOut(true);
    setTimeout(() => s.setTransition(null), 250);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.setTransition(null);
      return;
    }
    // Natural, cinematic 4.0s transition (finishes automatically on end or timeout)
    const timer = setTimeout(finish, 4000);
    return () => clearTimeout(timer);
  }, [transition, url]);

  return (
    <div
      className={`hardware-transition ${fadingOut ? 'hardware-exit' : ''}`}
      aria-label={`Switching to ${transition.to}`}
    >
      <div className="hardware-sweep" />
      {url && (
        <video
          ref={video}
          src={url}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finish}
          onError={e => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <span>
        {transition.to === 'macos'
          ? 'WORKSPACE'
          : transition.to === 'ios'
          ? 'A DIFFERENT PERSPECTIVE'
          : 'ANOTHER WAY TO EXPLORE'}
      </span>
      <button onClick={finish}>Skip transition ↗</button>
    </div>
  );
}

