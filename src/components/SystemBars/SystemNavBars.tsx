import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';

/* -------------------------------------------------------------------------- */
/*                            iOS HOME INDICATOR                              */
/* -------------------------------------------------------------------------- */

export const IOSHomeIndicator: React.FC<{
  lightBar?: boolean;
  onHomePress?: () => void;
}> = ({ lightBar = true, onHomePress }) => {
  const { closeApp, activeApp } = useOS();

  const handlePress = () => {
    if (onHomePress) {
      onHomePress();
    } else if (activeApp) {
      closeApp();
    }
  };

  return (
    <View style={styles.iosHomeArea} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Home indicator"
        onPress={handlePress}
        hitSlop={{ top: 18, bottom: 18, left: 30, right: 30 }}
        style={({ pressed }) => [
          styles.iosHomeBar,
          {
            backgroundColor: lightBar
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(15, 23, 42, 0.75)',
            opacity: pressed ? 0.5 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      />
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                         ANDROID NAVIGATION BAR (3-BUTTON)                  */
/* -------------------------------------------------------------------------- */

export const AndroidNavigationBar: React.FC<{
  onBackPress?: () => void;
  onHomePress?: () => void;
  onRecentsPress?: () => void;
  lightIcons?: boolean;
}> = ({ onBackPress, onHomePress, onRecentsPress, lightIcons = true }) => {
  const { closeApp, activeApp, activeProjectDetailId, setActiveProjectDetailId } = useOS();
  const iconColor = lightIcons ? '#E5E7EB' : '#1F2937';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (activeProjectDetailId) {
      setActiveProjectDetailId(null);
    } else if (activeApp) {
      closeApp();
    }
  };

  const handleHome = () => {
    if (onHomePress) {
      onHomePress();
    } else {
      closeApp();
    }
  };

  const handleRecents = () => {
    if (onRecentsPress) {
      onRecentsPress();
    }
  };

  return (
    <View style={styles.androidNavContainer}>
      {/* Back Triangle */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={handleBack}
        hitSlop={15}
        style={({ pressed }) => [
          styles.navButton,
          { opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.88 : 1 }] },
        ]}
      >
        <Text style={[styles.androidNavGlyph, { color: iconColor }]}>◀</Text>
      </Pressable>

      {/* Home Circle */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Home"
        onPress={handleHome}
        hitSlop={15}
        style={({ pressed }) => [
          styles.navButton,
          { opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.88 : 1 }] },
        ]}
      >
        <View style={[styles.androidHomeCircle, { borderColor: iconColor }]} />
      </Pressable>

      {/* Recents Square */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Recent apps"
        onPress={handleRecents}
        hitSlop={15}
        style={({ pressed }) => [
          styles.navButton,
          { opacity: pressed ? 0.5 : 1, transform: [{ scale: pressed ? 0.88 : 1 }] },
        ]}
      >
        <View style={[styles.androidRecentsSquare, { borderColor: iconColor }]} />
      </Pressable>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/*                               DESKTOP DOCK                                 */
/* -------------------------------------------------------------------------- */

export const DesktopDock: React.FC = () => {
  const { activeApp, openApp, closeApp } = useOS();

  const dockApps: { id: AppId; name: string; icon: string; bg: string }[] = [
    {
      id: 'projects',
      name: 'Projects',
      icon: '📂',
      bg: 'linear-gradient(135deg, #0284c7, #0369a1)',
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: '⌨',
      bg: 'linear-gradient(135deg, #0f172a, #1e293b)',
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙',
      bg: 'linear-gradient(135deg, #475569, #334155)',
    },
    {
      id: 'contact',
      name: 'Contact',
      icon: '👤',
      bg: 'linear-gradient(135deg, #059669, #047857)',
    },
  ];

  const handleDockItem = (id: AppId) => {
    if (activeApp === id) {
      // Toggle or bring to focus
      openApp(id);
    } else {
      openApp(id);
    }
  };

  return (
    <View style={styles.dockWrapper} pointerEvents="box-none">
      <View style={styles.dockBar}>
        {dockApps.map((app) => {
          const isActive = activeApp === app.id;
          return (
            <Pressable
              key={app.id}
              accessibilityRole="button"
              accessibilityLabel={`Open ${app.name}`}
              onPress={() => handleDockItem(app.id)}
              style={({ pressed }) => [
                styles.dockItem,
                {
                  transform: [{ scale: pressed ? 0.92 : 1 }],
                },
              ]}
            >
              <View style={[styles.dockIconBox]}>
                <Text style={styles.dockIconGlyph}>{app.icon}</Text>
              </View>

              {/* Running indicator dot */}
              {isActive && <View style={styles.dockActiveDot} />}
            </Pressable>
          );
        })}

        {/* Separator */}
        <View style={styles.dockDivider} />

        {/* Desktop Home / Minimizer */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show Desktop"
          onPress={() => closeApp()}
          style={({ pressed }) => [
            styles.dockItem,
            { transform: [{ scale: pressed ? 0.92 : 1 }] },
          ]}
        >
          <View style={[styles.dockIconBox, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
            <Text style={styles.dockIconGlyph}>🖥</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* iOS Home */
  iosHomeArea: {
    height: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  iosHomeBar: {
    width: 134,
    height: 5,
    borderRadius: 3,
  },

  /* Android Navigation */
  androidNavContainer: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    userSelect: 'none',
  },
  navButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidNavGlyph: {
    fontSize: 14,
    fontWeight: '800',
  },
  androidHomeCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  androidRecentsSquare: {
    width: 12,
    height: 12,
    borderRadius: 2.5,
    borderWidth: 2,
  },

  /* Desktop Dock */
  dockWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 900,
  },
  dockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    gap: 8,
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 52,
  },
  dockIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  dockIconGlyph: {
    fontSize: 22,
  },
  dockActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
    marginTop: 3,
  },
  dockDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    marginHorizontal: 4,
  },
});
