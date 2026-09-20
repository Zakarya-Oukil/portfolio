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
      : pair === 'ios:android'
      ? safeLink(s.config.media?.iosToAndroid || '/media/ios-android.mp4')
      : pair === 'macos:android'
      ? safeLink(s.config.media?.macosToAndroid)
      : undefined;

  const [fadingOut, setFadingOut] = useState(false);

  const finish = () => {
    setFadingOut(true);
    setTimeout(() => s.setTransition(null), 250);
  };

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.setTransition(null);
      return;
    }
    // If no video is present, fallback gradient sweep lasts 1200ms
    if (!url) {
      const timer = setTimeout(finish, 1200);
      return () => clearTimeout(timer);
    }
    // Safety timer in case video stalls
    const safetyTimer = setTimeout(finish, 7500);
    return () => clearTimeout(safetyTimer);
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
          muted={!s.soundOn}
          playsInline
          preload="auto"
          onLoadedMetadata={() => {
            if (video.current) {
              // 1.25x playback rate plays the 8s Veo render in a crisp ~6.4s
              video.current.playbackRate = 1.25;
            }
          }}
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

