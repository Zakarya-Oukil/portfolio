import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';

interface AppIconProps {
  appId: AppId;
  title: string;
  icon: string;
  gradientColors: [string, string];
  badge?: string;
  onPress: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
  title,
  icon,
  gradientColors,
  badge,
  onPress,
}) => {
  const { osMode } = useOS();

  // OS-specific shape styling
  const iconRadius = osMode === 'ios' ? 16 : osMode === 'android' ? 22 : 14;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${title}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.iconBox,
          {
            borderRadius: iconRadius,
            backgroundColor: gradientColors[0],
            transform: [{ scale: pressed ? 0.91 : 1 }],
          },
        ]}
      >
        {/* iOS Glossy Top Sheen */}
        {osMode === 'ios' && <View style={styles.iosGlossSheen} />}

        {/* Icon Glyph */}
        <Text style={styles.iconGlyph}>{icon}</Text>

        {/* Notification Badge */}
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Pressable>

      {/* App Label */}
      <Text numberOfLines={1} style={styles.appTitle}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 76,
    marginVertical: 10,
    userSelect: 'none',
  },
  iconBox: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iosGlossSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  iconGlyph: {
    fontSize: 28,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    maxWidth: 72,
  },
});
