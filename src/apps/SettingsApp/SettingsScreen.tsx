import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useOS } from '../../context/OSContext';
import { DEVELOPER_PROFILE, WALLPAPERS } from '../../data/portfolioData';
import { OSMode, ThemeMode, WallpaperId } from '../../types';

export const SettingsScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    osMode,
    setOSMode,
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    closeApp,
    batteryLevel,
    isRealMobile,
  } = useOS();

  const osOptions: { id: OSMode; label: string; desc: string; icon: string }[] = [
    {
      id: 'ios',
      label: 'iOS 18 (iPhone 16 Pro)',
      desc: 'Dynamic Island, continuous squircles & glass backdrops',
      icon: '',
    },
    {
      id: 'android',
      label: 'Android 15 (Material You)',
      desc: 'Punch-hole camera, tonal colors & 3-button system nav',
      icon: '🤖',
    },
    {
      id: 'desktop',
      label: 'Desktop Web (macOS / Web OS)',
      desc: 'Windowed multitasking, traffic lights & system dock',
      icon: '🖥',
    },
  ];

  const themeOptions: { id: ThemeMode; label: string; color: string }[] = [
    { id: 'dark', label: 'Dark (Midnight Slate)', color: '#0F172A' },
    { id: 'light', label: 'Light (Minimal Studio)', color: '#F1F5F9' },
    { id: 'cyberpunk', label: 'Cyberpunk OLED', color: '#05050A' },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SYSTEM PREFERENCES</Text>
          <Text style={styles.title}>Control Center</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close Settings"
          onPress={() => closeApp()}
          style={({ pressed }) => [
            styles.exitBtn,
            pressed && styles.exitBtnPressed,
          ]}
        >
          <Text style={styles.exitGlyph}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. OS Switcher Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DEVICE FRAMEWORK & OS MODE</Text>
            <Text style={styles.sectionSubtitle}>
              Re-skins status bar, navigation chrome, and bezels instantly
            </Text>
          </View>

          <View style={styles.osButtonGroup}>
            {osOptions.map((opt) => {
              const isSelected = osMode === opt.id;

              return (
                <Pressable
                  key={opt.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${opt.label}`}
                  onPress={() => setOSMode(opt.id)}
                  style={({ pressed }) => [
                    styles.osOptionCard,
                    isSelected && styles.osOptionCardActive,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.osIconCircle}>
                    <Text style={styles.osIconText}>{opt.icon}</Text>
                  </View>

                  <View style={styles.osTextContainer}>
                    <Text style={styles.osLabel}>{opt.label}</Text>
                    <Text style={styles.osDesc}>{opt.desc}</Text>
                  </View>

                  {/* Radio Indicator */}
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 3. Theme Selector */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>COLOR PALETTE & APPEARANCE</Text>
          </View>

          <View style={styles.themeGroup}>
            {themeOptions.map((t) => {
              const isSelected = theme === t.id;

              return (
                <Pressable
                  key={t.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${t.label} theme`}
                  onPress={() => setTheme(t.id)}
                  style={({ pressed }) => [
                    styles.themeButton,
                    isSelected && styles.themeButtonActive,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={[styles.colorPreview, { backgroundColor: t.color }]} />
                  <Text
                    style={[
                      styles.themeButtonText,
                      isSelected && styles.themeButtonTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 4. Wallpaper Gallery */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DYNAMIC SYSTEM WALLPAPERS</Text>
          </View>

          <View style={styles.wallpaperGrid}>
            {WALLPAPERS.map((w) => {
              const isSelected = wallpaper === w.id;

              return (
                <Pressable
                  key={w.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Apply ${w.name} wallpaper`}
                  onPress={() => setWallpaper(w.id as WallpaperId)}
                  style={({ pressed }) => [
                    styles.wallpaperCard,
                    isSelected && styles.wallpaperCardActive,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Image source={{ uri: w.url }} style={styles.wallpaperThumbnail} />
                  <View style={styles.wallpaperCardFooter}>
                    <Text numberOfLines={1} style={styles.wallpaperName}>
                      {w.name}
                    </Text>
                    {isSelected && <Text style={styles.activeCheck}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 5. System Diagnostics */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>HARDWARE & RUNTIME TELEMETRY</Text>
          </View>

          <View style={styles.diagGrid}>
            <View style={styles.diagItem}>
              <Text style={styles.diagLabel}>HOST RUNTIME</Text>
              <Text style={styles.diagVal}>React Native Web + Vite</Text>
            </View>
            <View style={styles.diagItem}>
              <Text style={styles.diagLabel}>VIEWPORT MODE</Text>
              <Text style={styles.diagVal}>
                {isRealMobile ? 'Physical Mobile Viewport' : 'Desktop Simulated Frame'}
              </Text>
            </View>
            <View style={styles.diagItem}>
              <Text style={styles.diagLabel}>DIMENSIONS</Text>
              <Text style={styles.diagVal}>
                {Math.round(width)}px × {Math.round(height)}px
              </Text>
            </View>
            <View style={styles.diagItem}>
              <Text style={styles.diagLabel}>SIMULATED BATTERY</Text>
              <Text style={styles.diagVal}>{batteryLevel}% Nominal</Text>
            </View>
          </View>

          <View style={styles.aboutDevBox}>
            <Text style={styles.devName}>{DEVELOPER_PROFILE.name}</Text>
            <Text style={styles.devRole}>{DEVELOPER_PROFILE.role}</Text>
            <Text style={styles.devBio}>{DEVELOPER_PROFILE.bio}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    userSelect: 'none',
  },
  header: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  exitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  exitGlyph: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },

  /* Section Cards */
  sectionCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  /* OS Options */
  osButtonGroup: {
    gap: 8,
  },
  osOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  osOptionCardActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    borderColor: '#38BDF8',
    boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
  osIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  osIconText: {
    fontSize: 18,
  },
  osTextContainer: {
    flex: 1,
  },
  osLabel: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  osDesc: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioOuterActive: {
    borderColor: '#38BDF8',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
  },

  /* Theme Options */
  themeGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  themeButtonActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    borderColor: '#38BDF8',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 6,
  },
  themeButtonText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  themeButtonTextActive: {
    color: '#FFFFFF',
  },

  /* Wallpaper Grid */
  wallpaperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wallpaperCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wallpaperCardActive: {
    borderColor: '#38BDF8',
    borderWidth: 2,
  },
  wallpaperThumbnail: {
    width: '100%',
    height: 65,
  },
  wallpaperCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  wallpaperName: {
    color: '#E2E8F0',
    fontSize: 9.5,
    fontWeight: '700',
    flex: 1,
  },
  activeCheck: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 4,
  },

  /* Diagnostics */
  diagGrid: {
    gap: 8,
    marginBottom: 12,
  },
  diagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  diagLabel: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '700',
  },
  diagVal: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  aboutDevBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
  },
  devName: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  devRole: {
    color: '#38BDF8',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1,
  },
  devBio: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
  },
});
