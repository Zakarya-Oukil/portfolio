import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useOS } from '../../context/OSContext';
import { DesktopMenuBar } from '../SystemBars/DesktopMenuBar';
import { DesktopDock } from '../SystemBars/SystemNavBars';

interface DesktopWorkspaceProps {
  children: React.ReactNode;
}

export const DesktopWorkspace: React.FC<DesktopWorkspaceProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const {
    activeApp,
    closeApp,
    toggleMaximize,
    toggleMinimize,
    windowState,
    openApp,
  } = useOS();

  const isMaximized = windowState.isMaximized;
  const isMinimized = windowState.isMinimized;

  // Window sizing: responsive to screen dimensions
  const windowWidth = isMaximized
    ? width - 20
    : Math.min(1080, Math.max(680, width * 0.78));

  const windowHeight = isMaximized
    ? height - 120
    : Math.min(760, Math.max(540, height * 0.74));

  const appTitle = activeApp
    ? activeApp === 'projects'
      ? 'Projects Explorer — ZakOS'
      : activeApp === 'terminal'
        ? 'bash — zsh — Terminal 80x24'
        : activeApp === 'settings'
          ? 'System Settings'
          : 'Developer Profile & Contact'
    : 'Finder';

  return (
    <View style={styles.container}>
      {/* Top macOS Menu Bar */}
      <DesktopMenuBar />

      {/* Main Desktop Workspace Area */}
      <View style={styles.workspaceArea}>
        {/* Desktop Icons (shown when in desktop mode) */}
        {!activeApp && (
          <View style={styles.desktopIconsGrid}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Projects"
              onPress={() => openApp('projects')}
              style={({ pressed }) => [
                styles.desktopShortcut,
                pressed && styles.desktopShortcutPressed,
              ]}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#0284C7' }]}>
                <Text style={styles.shortcutIconGlyph}>📂</Text>
              </View>
              <Text style={styles.shortcutLabel}>Projects</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Terminal"
              onPress={() => openApp('terminal')}
              style={({ pressed }) => [
                styles.desktopShortcut,
                pressed && styles.desktopShortcutPressed,
              ]}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#0F172A' }]}>
                <Text style={styles.shortcutIconGlyph}>⌨</Text>
              </View>
              <Text style={styles.shortcutLabel}>Terminal</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Settings"
              onPress={() => openApp('settings')}
              style={({ pressed }) => [
                styles.desktopShortcut,
                pressed && styles.desktopShortcutPressed,
              ]}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#475569' }]}>
                <Text style={styles.shortcutIconGlyph}>⚙</Text>
              </View>
              <Text style={styles.shortcutLabel}>Settings</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open Contact"
              onPress={() => openApp('contact')}
              style={({ pressed }) => [
                styles.desktopShortcut,
                pressed && styles.desktopShortcutPressed,
              ]}
            >
              <View style={[styles.shortcutIconBox, { backgroundColor: '#059669' }]}>
                <Text style={styles.shortcutIconGlyph}>👤</Text>
              </View>
              <Text style={styles.shortcutLabel}>Contact</Text>
            </Pressable>
          </View>
        )}

        {/* Floating Application Window (when an app is open and not minimized) */}
        {activeApp && !isMinimized && (
          <View
            style={[
              styles.appWindow,
              {
                width: windowWidth,
                height: windowHeight,
              },
            ]}
          >
            {/* Window Title Bar with macOS Traffic Lights */}
            <View style={styles.windowTitleBar}>
              {/* Traffic Light Buttons */}
              <View style={styles.trafficLights}>
                {/* Red: Close */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close window"
                  onPress={() => closeApp()}
                  style={styles.trafficLightRed}
                >
                  <Text style={styles.trafficLightSymbol}>×</Text>
                </Pressable>

                {/* Yellow: Minimize */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Minimize window"
                  onPress={() => toggleMinimize()}
                  style={styles.trafficLightYellow}
                >
                  <Text style={styles.trafficLightSymbol}>−</Text>
                </Pressable>

                {/* Green: Maximize */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Maximize window"
                  onPress={() => toggleMaximize()}
                  style={styles.trafficLightGreen}
                >
                  <Text style={styles.trafficLightSymbol}>+</Text>
                </Pressable>
              </View>

              {/* Centered Window Title */}
              <View style={styles.windowTitleContainer}>
                <Text numberOfLines={1} style={styles.windowTitleText}>
                  {appTitle}
                </Text>
              </View>

              {/* Spacer for symmetry */}
              <View style={styles.titleBarRightSpacer} />
            </View>

            {/* Window App Viewport */}
            <View style={styles.windowViewport}>{children}</View>
          </View>
        )}
      </View>

      {/* macOS Bottom Dock */}
      <DesktopDock />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  workspaceArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 72, // Room for dock
    position: 'relative',
  },

  /* Desktop Shortcuts */
  desktopIconsGrid: {
    position: 'absolute',
    top: 24,
    left: 28,
    flexDirection: 'column',
    gap: 20,
    zIndex: 10,
  },
  desktopShortcut: {
    alignItems: 'center',
    width: 76,
    padding: 6,
    borderRadius: 8,
  },
  desktopShortcutPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  shortcutIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  shortcutIconGlyph: {
    fontSize: 26,
  },
  shortcutLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Application Window */
  appWindow: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    boxShadow:
      '0 30px 70px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50,
  },
  windowTitleBar: {
    height: 38,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    userSelect: 'none',
  },
  trafficLights: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 60,
  },
  trafficLightRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficLightYellow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficLightGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficLightSymbol: {
    fontSize: 8,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.5)',
    lineHeight: 10,
  },
  windowTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowTitleText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  titleBarRightSpacer: {
    width: 60,
  },
  windowViewport: {
    flex: 1,
    backgroundColor: '#090D16',
    position: 'relative',
    overflow: 'hidden',
  },
});
