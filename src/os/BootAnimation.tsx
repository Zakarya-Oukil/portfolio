import React, { useEffect, useState, useRef } from 'react';
import { Mode } from './state';

interface BootAnimationProps {
  mode: Mode;
  onComplete: () => void;
}

// Audio synthesizer for authentic OS startup sounds
function playStartupSound(mode: Mode) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (mode === 'macos') {
      // Authentic Apple F# Major Startup Chord (F#2, C#3, F#3, A#3, C#4, F#4)
      const now = ctx.currentTime;
      const freqs = [92.5, 138.59, 185.0, 233.08, 277.18, 369.99];
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.01, now);
      master.gain.exponentialRampToValueAtTime(0.25, now + 0.15);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(900, now + 3.0);

      master.connect(filter);
      filter.connect(ctx.destination);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx < 2 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.8, now);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 3.5);
      });
    } else if (mode === 'ios') {
      // iOS soft harmonic glass chime
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.09);
        gain.gain.setValueAtTime(0, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 1.4);
      });
    } else if (mode === 'android') {
      // Android Material You playful ascending notes
      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.9);
      });
    }
  } catch (e) {
    // Audio autoplay might be blocked before first user gesture
  }
}

export function BootAnimation({ mode, onComplete }: BootAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  const completedRef = useRef(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    // Try to trigger sound
    playStartupSound(mode);

    // Progress bar and stage timeline
    const duration = mode === 'macos' ? 2600 : mode === 'ios' ? 2400 : 2200;
    const interval = 25;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(p => {
        const next = Math.min(100, p + step);
        if (next > 30) setStage(1);
        if (next > 70) setStage(2);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(finish, 350);
        }
        return next;
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [mode]);

  return (
    <div
      className={`boot-overlay boot-${mode}`}
      onClick={finish}
      role="dialog"
      aria-label={`${mode} startup sequence`}
    >
      <button className="boot-skip-btn" onClick={finish} aria-label="Skip startup animation">
        Skip ↗
      </button>

      {/* 1. macOS 27 Startup Sequence */}
      {mode === 'macos' && (
        <div className="boot-container boot-macos-container">
          <div className="boot-apple-logo">
            <svg width="78" height="96" viewBox="0 0 170 170" fill="currentColor">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.79-11.7-14.25-5.78-9.14-10.33-19.46-13.65-30.95-3.32-11.49-4.98-22.56-4.98-33.22 0-14.28 3.59-25.96 10.77-35.04 7.18-9.08 16.14-13.7 26.88-13.86 4.93 0 10.36 1.3 16.29 3.91 5.93 2.61 9.87 4.01 11.83 4.19 1.74-.29 5.86-1.74 12.37-4.35 6.51-2.61 11.96-3.8 16.36-3.56 12.45.69 22.38 5.21 29.8 13.56-10.96 6.64-16.31 15.77-16.05 27.38.27 9.17 3.79 16.89 10.57 23.14 6.77 6.26 14.88 10.02 24.32 11.29-2.14 6.32-4.67 12.63-7.58 18.91zM119.22 33.58c0-7.39 2.67-14.39 8.01-21 5.34-6.61 12.06-10.87 20.15-12.78.33 1.38.49 2.69.49 3.94 0 7.39-2.73 14.33-8.19 20.82-5.46 6.49-12.28 10.66-20.46 12.51z" />
            </svg>
            <div className="boot-specular-shine" />
          </div>

          <div className="boot-progress-track">
            <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="boot-copy-group">
            <h2>macOS 27</h2>
            <p className="boot-user-greet">
              Zakarya Workspace <span className="boot-neural-dot" /> Silicon Neural 4
            </p>
            <span className="boot-micro-status">
              {progress < 40 ? 'Verifying kernel sandbox…' : progress < 80 ? 'Mounting encrypted volume…' : 'Welcome, Zakarya.'}
            </span>
          </div>
        </div>
      )}

      {/* 2. iPhone 16 Pro Max Startup Sequence */}
      {mode === 'ios' && (
        <div className="boot-container boot-ios-container">
          {/* Dynamic Island Expand */}
          <div className={`boot-dynamic-island ${stage > 0 ? 'expanded' : ''}`}>
            <div className="boot-di-content">
              <span className="boot-di-cam" />
              <div className="boot-di-wave">
                <span /><span /><span /><span />
              </div>
              <span className="boot-di-text">Zakarya's iPhone</span>
            </div>
          </div>

          {/* Cursive "Hello" / "Zakarya" calligraphy */}
          <div className="boot-ios-center">
            <div className="boot-cursive-wrapper">
              <svg className="boot-cursive-svg" viewBox="0 0 380 120">
                <path
                  className="boot-cursive-path"
                  d="M 30 75 C 30 35, 60 20, 75 55 C 85 80, 95 85, 110 50 C 120 25, 135 60, 145 75 C 160 95, 180 35, 195 55 C 210 75, 230 45, 245 60 C 265 80, 280 40, 300 70 C 315 90, 340 30, 360 65"
                  fill="none"
                  stroke="url(#iosGoldGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="iosGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              <h1 className="boot-cursive-text">Hello, Zakarya</h1>
            </div>

            <p className="boot-ios-tagline">iPhone 16 Pro Max · iOS 18</p>
          </div>

          <div className="boot-ios-bottom">
            <div className="boot-ios-swipe-indicator">
              <div className="boot-ios-chevron" />
              <span>Tap anywhere to unlock</span>
            </div>
            <div className="boot-ios-bar" />
          </div>
        </div>
      )}

      {/* 3. Android 15 Startup Sequence */}
      {mode === 'android' && (
        <div className="boot-container boot-android-container">
          {/* Concentric Material You Generative Color Circles */}
          <div className="boot-material-ripples">
            <div className="ripple ripple-1" />
            <div className="ripple ripple-2" />
            <div className="ripple ripple-3" />
            <div className="ripple ripple-4" />
          </div>

          <div className="boot-android-center">
            <div className="boot-android-badge">
              <span className="boot-monogram-z">Z</span>
              <div className="boot-bugroid-antennas">
                <span className="antenna left" />
                <span className="antenna right" />
              </div>
            </div>

            <div className="boot-android-titles">
              <span className="boot-pill-badge">Android 15 · Material You</span>
              <h1>ZakOS</h1>
              <p>Crafted & Engineered by Zakarya</p>
            </div>

            <div className="boot-android-dots">
              <span className="dot dot-teal" />
              <span className="dot dot-coral" />
              <span className="dot dot-violet" />
              <span className="dot dot-gold" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
