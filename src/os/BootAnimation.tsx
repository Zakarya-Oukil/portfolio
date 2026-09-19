import React, { useEffect, useState, useRef } from 'react';
import { Mode } from './state';
import { MacBookIntro } from './MacBookIntro';

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
      // Handled inside MacBookIntro with realistic hinge timing
      return;
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

  if (mode === 'macos') {
    return <MacBookIntro onComplete={finish} />;
  }

  useEffect(() => {
    // Try to trigger sound
    playStartupSound(mode);

    // Progress bar and stage timeline
    const duration = mode === 'ios' ? 2400 : 2200;
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
