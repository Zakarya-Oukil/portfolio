import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useOS } from '../../context/OSContext';

export const DesktopMenuBar: React.FC = () => {
  const {
    activeApp,
    currentTime,
    currentDateString,
    batteryLevel,
    closeApp,
    openApp,
  } = useOS();

  const appDisplayName = activeApp
    ? activeApp.charAt(0).toUpperCase() + activeApp.slice(1)
    : 'Finder';

  return (
    <View style={styles.menuBar}>
      {/* Left Menu Items */}
      <View style={styles.leftGroup}>
        <Pressable
          onPress={() => closeApp()}
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
          <Text style={styles.appleLogo}>◈</Text>
        </Pressable>

        <Pressable
          onPress={() => {}}
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
          <Text style={styles.appName}>{appDisplayName}</Text>
        </Pressable>

        <Pressable
          onPress={() => openApp('projects')}
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
          <Text style={styles.menuText}>Projects</Text>
        </Pressable>

        <Pressable
          onPress={() => openApp('terminal')}
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
          <Text style={styles.menuText}>Terminal</Text>
        </Pressable>

        <Pressable
          onPress={() => openApp('settings')}
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
          <Text style={styles.menuText}>Settings</Text>
        </Pressable>

        <Pressable
          onPress={() => openApp('contact')}
          style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
        >
          <Text style={styles.menuText}>Contact</Text>
        </Pressable>
      </View>

      {/* Right System Tray */}
      <View style={styles.rightGroup}>
        <View style={styles.trayItem}>
          <Text style={styles.trayIcon}>⚡</Text>
          <Text style={styles.trayText}>{batteryLevel}%</Text>
        </View>

        <View style={styles.trayItem}>
          <Text style={styles.trayIcon}>📶</Text>
        </View>

        <View style={styles.trayItem}>
          <Text style={styles.trayIcon}>⌕</Text>
        </View>

        <View style={styles.trayItem}>
          <Text style={styles.trayIcon}>🎛</Text>
        </View>

        <View style={styles.timeItem}>
          <Text style={styles.trayText}>
            {currentDateString} {currentTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    height: 32,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 1000,
    userSelect: 'none',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  menuItem: {
    paddingHorizontal: 9,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  appleLogo: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'system-ui',
  },
  menuText: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '500',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 4,
  },
  trayIcon: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  trayText: {
    color: '#F1F5F9',
    fontSize: 12,
    fontWeight: '500',
  },
  timeItem: {
    marginLeft: 4,
    paddingHorizontal: 6,
  },
});
