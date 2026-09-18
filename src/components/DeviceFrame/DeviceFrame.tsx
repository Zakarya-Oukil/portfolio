import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useOS } from '../../context/OSContext';
import { WALLPAPERS } from '../../data/portfolioData';
import { OSMode } from '../../types';
import { AndroidStatusBar } from '../SystemBars/AndroidStatusBar';
import { IOSStatusBar } from '../SystemBars/IOSStatusBar';
import {
  AndroidNavigationBar,
  IOSHomeIndicator,
} from '../SystemBars/SystemNavBars';
import { AndroidBezel } from './AndroidBezel';
import { DesktopWorkspace } from './DesktopWorkspace';
import { IOSBezel } from './IOSBezel';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const { osMode, setOSMode, wallpaper, isRealMobile } = useOS();

  // Find active wallpaper
  const activeWallpaper =
    WALLPAPERS.find((w) => w.id === wallpaper) || WALLPAPERS[0];

  /* -------------------------------------------------------------------------- */
  /*                       1. REAL MOBILE VIEWPORT (100% FILL)                  */
  /* -------------------------------------------------------------------------- */
  if (isRealMobile) {
    return (
      <ImageBackground
        source={{ uri: activeWallpaper.url }}
        resizeMode="cover"
        style={styles.fullScreen}
      >
        <View
          style={[
            styles.fullScreen,
            { backgroundColor: activeWallpaper.darkOverlay },
          ]}
        >
          {/* Status Bar */}
          {osMode === 'ios' && <IOSStatusBar lightContent={true} />}
          {osMode === 'android' && <AndroidStatusBar lightContent={true} />}

          {/* App Viewport */}
          <View style={styles.mobileViewport}>{children}</View>

          {/* Bottom System Navigation */}
          {osMode === 'ios' && <IOSHomeIndicator lightBar={true} />}
          {osMode === 'android' && <AndroidNavigationBar lightIcons={true} />}
        </View>
      </ImageBackground>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                  2. DESKTOP VIEWPORT (BEZEL OR DESKTOP WORKSPACE)          */
  /* -------------------------------------------------------------------------- */

  // Calculate proportional device bezel dimensions
  const deviceHeight = Math.min(840, Math.max(680, height * 0.90));
  const deviceWidth = Math.round(deviceHeight * 0.475);

  return (
    <ImageBackground
      source={{ uri: activeWallpaper.url }}
      resizeMode="cover"
      style={styles.fullScreen}
    >
      <View
        style={[
          styles.desktopBackdrop,
          { backgroundColor: activeWallpaper.darkOverlay },
        ]}
      >
        {/* Quick OS Switcher Badge (Top Right) */}
        <View style={styles.quickSwitcherBar}>
          <Text style={styles.quickSwitcherLabel}>VIRTUAL OS:</Text>
          <View style={styles.switcherPillGroup}>
            {(['ios', 'android', 'desktop'] as OSMode[]).map((mode) => {
              const isSelected = osMode === mode;
              const modeLabel =
                mode === 'ios'
                  ? 'iOS (iPhone 16 Pro)'
                  : mode === 'android'
                    ? 'Android (Pixel 9)'
                    : 'Desktop (Web OS)';

              return (
                <Pressable
                  key={mode}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${modeLabel}`}
                  onPress={() => setOSMode(mode)}
                  style={({ pressed }) => [
                    styles.switcherButton,
                    isSelected && styles.switcherButtonActive,
                    pressed && styles.switcherButtonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.switcherButtonText,
                      isSelected && styles.switcherButtonTextActive,
                    ]}
                  >
                    {modeLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dynamic Shell based on OS Mode */}
        {osMode === 'desktop' ? (
          <DesktopWorkspace>{children}</DesktopWorkspace>
        ) : (
          <View style={styles.bezelCenterContainer}>
            {osMode === 'ios' && (
              <IOSBezel
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
              >
                {children}
              </IOSBezel>
            )}

            {osMode === 'android' && (
              <AndroidBezel
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
              >
                {children}
              </AndroidBezel>
            )}
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  mobileViewport: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  desktopBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  bezelCenterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    zIndex: 20,
  },

  /* Quick OS Switcher Bar */
  quickSwitcherBar: {
    position: 'absolute',
    top: 14,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    backdropFilter: 'blur(16px)',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
    zIndex: 10000,
    userSelect: 'none',
  },
  quickSwitcherLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  switcherPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  switcherButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  switcherButtonActive: {
    backgroundColor: '#0284C7',
    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
  },
  switcherButtonPressed: {
    opacity: 0.75,
  },
  switcherButtonText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  switcherButtonTextActive: {
    color: '#FFFFFF',
  },
});
