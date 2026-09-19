import React, { useState } from 'react';
import { Icon } from './Icon';
import { useSystemContext } from './state';

interface IPhonePreviewCardProps {
  isSelected: boolean;
  onSelect: () => void;
}

export function IPhonePreviewCard({ isSelected, onSelect }: IPhonePreviewCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to +0.5
    setTilt({
      x: x * 22, // -11deg to +11deg
      y: y * -18 // -9deg to +9deg
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className={`iphone-3d-card-wrapper ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label="Switch to iPhone 16 Pro Max iOS 18 experience"
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* 3D Viewport Stage */}
      <div className="iphone-3d-stage">
        {/* Ambient Glow behind phones */}
        <div className={`iphone-stage-glow ${isHovered ? 'active' : ''}`} />

        <div
          className="iphone-dual-group"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          }}
        >
          {/* Phone 2: Background Right (Projects Screen) */}
          <div className="iphone-3d-device phone-bg">
            <div className="iphone-frame-outer">
              <div className="iphone-titanium-rim" />
              <div className="iphone-screen-chassis">
                {/* Dynamic Island */}
                <div className="iphone-mini-island">
                  <span className="mini-island-cam" />
                </div>
                {/* Image Screenshot */}
                <img
                  src="/assets/iphone-preview-projects.png"
                  alt="iOS Projects Screen Preview"
                  className="iphone-screen-img"
                  loading="lazy"
                />
                <div className="iphone-specular-sheen" />
              </div>
            </div>
            {/* Phone Cast Shadow */}
            <div className="iphone-device-shadow phone-bg-shadow" />
          </div>

          {/* Phone 1: Foreground Left (About Me Screen) */}
          <div className="iphone-3d-device phone-fg">
            <div className="iphone-frame-outer">
              <div className="iphone-titanium-rim" />
              <div className="iphone-screen-chassis">
                {/* Dynamic Island */}
                <div className="iphone-mini-island">
                  <span className="mini-island-cam" />
                </div>
                {/* Image Screenshot */}
                <img
                  src="/assets/iphone-preview-about.png"
                  alt="iOS About Me Screen Preview"
                  className="iphone-screen-img"
                  loading="lazy"
                />
                <div className="iphone-specular-sheen" />
              </div>
            </div>
            {/* Phone Cast Shadow */}
            <div className="iphone-device-shadow phone-fg-shadow" />
          </div>
        </div>
      </div>

      {/* Meta details & Select state */}
      <div className="iphone-card-info">
        <div className="iphone-card-meta">
          <div className="iphone-title-row">
            <Icon name="phone" size={17} />
            <strong>iPhone 16 Pro Max</strong>
            <span className="iphone-chip-badge">A18 Pro</span>
          </div>
          <small>iOS 18 experience with interactive Dynamic Island & fluid gestures</small>
        </div>

        {isSelected ? (
          <span className="iphone-check-badge active" title="Active Experience">
            <Icon name="check" size={13} />
          </span>
        ) : (
          <span className="iphone-select-hint">Click to switch</span>
        )}
      </div>
    </div>
  );
}
