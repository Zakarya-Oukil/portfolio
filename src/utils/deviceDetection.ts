import { DeviceInfo, OSMode } from '../types';

/**
 * Detect initial OS mode based on client user agent and screen geometry.
 */
export function detectInitialOS(): OSMode {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  const ua = window.navigator.userAgent || '';

  // 1. iOS Detection (iPhone, iPad, iPod)
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

  if (isIOS) {
    return 'ios';
  }

  // 2. Android Detection
  const isAndroid = /Android/i.test(ua);
  if (isAndroid) {
    return 'android';
  }

  // 3. Fallback: If small screen with touch, pick mobile OS
  const isSmallScreen = window.innerWidth <= 768;
  const hasTouch = 'ontouchstart' in window || window.navigator.maxTouchPoints > 0;

  if (isSmallScreen && hasTouch) {
    // Guess based on vendor
    return /Apple/i.test(window.navigator.vendor) ? 'ios' : 'android';
  }

  // 4. Default to Desktop Web view for PCs, laptops, and wide screens
  return 'desktop';
}

/**
 * Checks if the user is visiting on a physical mobile device.
 * When true, the device bezel is hidden and the OS fills 100% of the screen.
 */
export function checkIsRealMobile(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const ua = window.navigator.userAgent || '';
  const isMobileUA =
    /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

  const isNarrowScreen = window.innerWidth <= 768;

  return isMobileUA || isNarrowScreen;
}

/**
 * Retrieve comprehensive client telemetry.
 */
export function getClientDeviceInfo(): DeviceInfo {
  const os = detectInitialOS();
  const isRealMobile = checkIsRealMobile();

  return {
    deviceType: os,
    isRealMobile,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    platform: typeof window !== 'undefined' ? window.navigator.platform : 'Unknown',
    screenDimensions: {
      width: typeof window !== 'undefined' ? window.innerWidth : 1200,
      height: typeof window !== 'undefined' ? window.innerHeight : 800,
    },
  };
}
