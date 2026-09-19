import React, { useEffect, useRef, useState, Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { useSystemContext } from './state';

interface MacBookIntroProps {
  onComplete: () => void;
  splineUrl?: string;
}

// Authentic Apple F# Major Startup Chord synthesized via Web Audio API
function playMacStartupChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // F#2, C#3, F#3, A#3, C#4, F#4
    const freqs = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99];
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.01, now);
    master.gain.exponentialRampToValueAtTime(0.3, now + 0.12);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 3.2);

    master.connect(filter);
    filter.connect(ctx.destination);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx < 2 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.7, now);
      osc.connect(master);
      osc.start(now);
      osc.stop(now + 4.0);
    });
  } catch {
    // Audio autoplay might be blocked before first user gesture
  }
}

export function MacBookIntro({ onComplete, splineUrl }: MacBookIntroProps) {
  const s = useSystemContext();
  const activeSplineUrl = splineUrl || localStorage.getItem('zak.spline.macbook') || '';
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [lidOpen, setLidOpen] = useState(false);
  const [screenPowered, setScreenPowered] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const completedRef = useRef(false);

  // Mouse tilt parallax on the scene
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const handleComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setZooming(true);
    setTimeout(() => {
      onComplete();
    }, 750);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    // 1. Initial pause, then begin lid opening
    const openTimer = setTimeout(() => {
      setLidOpen(true);
      playMacStartupChime();
    }, 450);

    // 2. Screen powers up during the lid opening
    const powerTimer = setTimeout(() => {
      setScreenPowered(true);
    }, 1100);

    // 3. Ready for user entry prompt
    const readyTimer = setTimeout(() => {
      setReadyToEnter(true);
    }, 2200);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleComplete();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        if (completedRef.current) return;
        completedRef.current = true;
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(powerTimer);
      clearTimeout(readyTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 8; // -4deg to +4deg
    const y = (clientY / innerHeight - 0.5) * -6; // -3deg to +3deg
    setMouseTilt({ x, y });
  };

  return (
    <div
      className={`macbook-intro-stage ${zooming ? 'zooming-in' : ''}`}
      onClick={handleComplete}
      onMouseMove={handleMouseMove}
      role="dialog"
      aria-label="3D MacBook Opening sequence"
    >
      {/* Background Aurora Nebula & Studio Atmosphere */}
      <div className="intro-aurora-bg">
        <div className="aurora-orb aurora-teal" />
        <div className="aurora-orb aurora-indigo" />
        <div className="aurora-orb aurora-emerald" />
        <div className="intro-stars" />
        <div className="intro-spotlight" />
      </div>

      {/* Skip Button */}
      <button className="boot-skip-btn intro-skip-btn" onClick={handleSkip} aria-label="Skip laptop intro">
        Skip ↗
      </button>

      {/* If Spline Scene URL is configured, render live Spline canvas */}
      {activeSplineUrl ? (
        <div className="spline-3d-wrapper">
          <Suspense fallback={<div className="spline-loading-spinner"><span className="welcome-pulse" /> Loading 3D Spline Scene…</div>}>
            <Spline
              scene={activeSplineUrl}
              onLoad={() => {
                setSplineLoaded(true);
                setReadyToEnter(true);
              }}
            />
          </Suspense>
        </div>
      ) : (
        /* Native 3D Scene Wrapper with Dynamic Parallax */
        <div
          className="macbook-3d-scene"
          style={{
            transform: `perspective(1800px) rotateX(${18 + mouseTilt.y}deg) rotateY(${mouseTilt.x}deg)`
          }}
        >
        {/* Tabletop Reflection & Floor Shadow */}
        <div className={`laptop-floor-shadow ${lidOpen ? 'lid-open-shadow' : ''}`} />
        <div className={`laptop-reflection ${screenPowered ? 'screen-glow-active' : ''}`} />

        {/* The 3D MacBook Unit */}
        <div className="macbook-body">
          {/* Base Chassis (Keyboard Deck, Trackpad, Speaker Grilles) */}
          <div className="macbook-base">
            <div className="base-top-deck">
              {/* Speaker Grille Left */}
              <div className="speaker-grille left" />

              {/* Magic Keyboard Well */}
              <div className="keyboard-well">
                <div className="keyboard-deck">
                  {/* Function Row */}
                  <div className="kb-row kb-fn-row">
                    <span className="kb-key kb-fn">esc</span>
                    <span className="kb-key kb-fn">F1</span>
                    <span className="kb-key kb-fn">F2</span>
                    <span className="kb-key kb-fn">F3</span>
                    <span className="kb-key kb-fn">F4</span>
                    <span className="kb-key kb-fn">F5</span>
                    <span className="kb-key kb-fn">F6</span>
                    <span className="kb-key kb-fn">F7</span>
                    <span className="kb-key kb-fn">F8</span>
                    <span className="kb-key kb-fn">F9</span>
                    <span className="kb-key kb-fn">F10</span>
                    <span className="kb-key kb-fn">F11</span>
                    <span className="kb-key kb-fn">F12</span>
                    <span className="kb-key kb-touch-id" />
                  </div>

                  {/* Number Row */}
                  <div className="kb-row">
                    <span className="kb-key">~</span>
                    <span className="kb-key">1</span>
                    <span className="kb-key">2</span>
                    <span className="kb-key">3</span>
                    <span className="kb-key">4</span>
                    <span className="kb-key">5</span>
                    <span className="kb-key">6</span>
                    <span className="kb-key">7</span>
                    <span className="kb-key">8</span>
                    <span className="kb-key">9</span>
                    <span className="kb-key">0</span>
                    <span className="kb-key">-</span>
                    <span className="kb-key">=</span>
                    <span className="kb-key kb-delete">delete</span>
                  </div>

                  {/* QWERTY Row */}
                  <div className="kb-row">
                    <span className="kb-key kb-tab">tab</span>
                    <span className="kb-key">Q</span>
                    <span className="kb-key">W</span>
                    <span className="kb-key">E</span>
                    <span className="kb-key">R</span>
                    <span className="kb-key">T</span>
                    <span className="kb-key">Y</span>
                    <span className="kb-key">U</span>
                    <span className="kb-key">I</span>
                    <span className="kb-key">O</span>
                    <span className="kb-key">P</span>
                    <span className="kb-key">[</span>
                    <span className="kb-key">]</span>
                    <span className="kb-key">\</span>
                  </div>

                  {/* ASDF Row */}
                  <div className="kb-row">
                    <span className="kb-key kb-caps">caps</span>
                    <span className="kb-key">A</span>
                    <span className="kb-key">S</span>
                    <span className="kb-key">D</span>
                    <span className="kb-key">F</span>
                    <span className="kb-key">G</span>
                    <span className="kb-key">H</span>
                    <span className="kb-key">J</span>
                    <span className="kb-key">K</span>
                    <span className="kb-key">L</span>
                    <span className="kb-key">;</span>
                    <span className="kb-key">'</span>
                    <span className="kb-key kb-return">return</span>
                  </div>

                  {/* ZXCV Row */}
                  <div className="kb-row">
                    <span className="kb-key kb-shift">shift</span>
                    <span className="kb-key">Z</span>
                    <span className="kb-key">X</span>
                    <span className="kb-key">C</span>
                    <span className="kb-key">V</span>
                    <span className="kb-key">B</span>
                    <span className="kb-key">N</span>
                    <span className="kb-key">M</span>
                    <span className="kb-key">,</span>
                    <span className="kb-key">.</span>
                    <span className="kb-key">/</span>
                    <span className="kb-key kb-shift-r">shift</span>
                  </div>

                  {/* Bottom Modifier & Space Row */}
                  <div className="kb-row kb-bottom-row">
                    <span className="kb-key kb-ctrl">fn</span>
                    <span className="kb-key kb-opt">control</span>
                    <span className="kb-key kb-cmd">option</span>
                    <span className="kb-key kb-cmd-main">command</span>
                    <span className="kb-key kb-space" />
                    <span className="kb-key kb-cmd-main">command</span>
                    <span className="kb-key kb-opt">option</span>
                    <div className="kb-arrows">
                      <span className="kb-key kb-arrow left">◀</span>
                      <div className="kb-arrow-v">
                        <span className="kb-key kb-arrow up">▲</span>
                        <span className="kb-key kb-arrow down">▼</span>
                      </div>
                      <span className="kb-key kb-arrow right">▶</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaker Grille Right */}
              <div className="speaker-grille right" />

              {/* Force Touch Trackpad */}
              <div className="macbook-trackpad" />

              {/* Front Thumb Notch Recess */}
              <div className="base-front-notch" />
            </div>

            {/* Base Front Edge & Bevel */}
            <div className="base-front-edge" />
            <div className="base-side-edge left" />
            <div className="base-side-edge right" />
          </div>

          {/* Screen Lid Assembly (Hinged at back) */}
          <div className={`macbook-lid ${lidOpen ? 'lid-open' : 'lid-closed'}`}>
            {/* Outer Lid Shell with Apple Logo (Facing Back / Top when closed) */}
            <div className="lid-outer-shell">
              <div className="lid-apple-logo">
                <svg width="42" height="52" viewBox="0 0 170 170" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.79-11.7-14.25-5.78-9.14-10.33-19.46-13.65-30.95-3.32-11.49-4.98-22.56-4.98-33.22 0-14.28 3.59-25.96 10.77-35.04 7.18-9.08 16.14-13.7 26.88-13.86 4.93 0 10.36 1.3 16.29 3.91 5.93 2.61 9.87 4.01 11.83 4.19 1.74-.29 5.86-1.74 12.37-4.35 6.51-2.61 11.96-3.8 16.36-3.56 12.45.69 22.38 5.21 29.8 13.56-10.96 6.64-16.31 15.77-16.05 27.38.27 9.17 3.79 16.89 10.57 23.14 6.77 6.26 14.88 10.02 24.32 11.29-2.14 6.32-4.67 12.63-7.58 18.91zM119.22 33.58c0-7.39 2.67-14.39 8.01-21 5.34-6.61 12.06-10.87 20.15-12.78.33 1.38.49 2.69.49 3.94 0 7.39-2.73 14.33-8.19 20.82-5.46 6.49-12.28 10.66-20.46 12.51z" />
                </svg>
              </div>
            </div>

            {/* Inner Display Bezel & Liquid Retina XDR Screen */}
            <div className="lid-inner-display">
              {/* Top Camera Notch */}
              <div className="display-camera-notch">
                <span className="notch-camera-lens" />
                <span className="notch-indicator-green" />
              </div>

              {/* Screen Glass Surface */}
              <div className={`screen-content-surface ${screenPowered ? 'powered-on' : 'powered-off'}`}>
                {/* Live macOS Desktop Preview inside the screen */}
                <div className={`screen-desktop-preview wallpaper-${s.wallpaper} theme-${s.theme}`}>
                  {/* Top macOS Menu Bar */}
                  <div className="screen-mock-menubar">
                    <div className="mock-menu-left">
                      <span className="mock-apple-icon"></span>
                      <strong className="mock-menu-app">Finder</strong>
                      <span>File</span>
                      <span>Edit</span>
                      <span>View</span>
                      <span>Window</span>
                      <span>Help</span>
                    </div>
                    <div className="mock-menu-right">
                      <span>100% 🔋</span>
                      <span>Wi-Fi</span>
                      <span>{s.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Desktop Center Brand */}
                  <div className="screen-mock-center">
                    <div className="mock-hero-brand">
                      <h1>Zakarya<span>.</span></h1>
                      <p>Security Researcher & Systems Engineer</p>
                    </div>

                    {/* Bento Mini-Widgets */}
                    <div className="screen-mock-widgets">
                      <div className="mock-widget">
                        <span className="mock-w-badge">ABOUT ME</span>
                        <strong>Zakarya Oukil</strong>
                        <small>Systems & Security</small>
                      </div>
                      <div className="mock-widget">
                        <span className="mock-w-badge">CTF & HTB</span>
                        <strong>eJPT · Pro Rank</strong>
                        <small>Active Directory / Pivoting</small>
                      </div>
                      <div className="mock-widget">
                        <span className="mock-w-badge">SYSTEM SPECS</span>
                        <strong>macOS 27 (ZakOS)</strong>
                        <small>Kernel x86_64 · AES-256</small>
                      </div>
                    </div>
                  </div>

                  {/* Screen Dock at Bottom */}
                  <div className="screen-mock-dock">
                    <span className="mock-dock-icon icon-p">📁</span>
                    <span className="mock-dock-icon icon-t">⌨️</span>
                    <span className="mock-dock-icon icon-s">⚙️</span>
                    <span className="mock-dock-icon icon-m">✉️</span>
                    <span className="mock-dock-icon icon-a">👤</span>
                  </div>
                </div>

                {/* Glass Reflection Glare on the screen */}
                <div className="screen-glass-sheen" />
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Welcoming Interactive CTA Banner */}
      <div className={`intro-welcome-cta ${readyToEnter ? 'visible' : ''}`}>
        <div className="welcome-tag">
          <span className="welcome-pulse" />
          <span>Interactive 3D Workspace</span>
        </div>
        <h2>Welcome to Zakarya's Portfolio</h2>
        <p>A Different <span className="intro-cursive-swash">Perspective.</span></p>

        <div className="intro-enter-action">
          <button className="intro-enter-btn" onClick={handleComplete} aria-label="Enter Workspace">
            <span>Enter Workspace</span>
            <kbd>Space</kbd>
            <span className="intro-arrow">→</span>
          </button>
          <span className="intro-click-hint">or click anywhere to enter</span>
        </div>
      </div>
    </div>
  );
}
