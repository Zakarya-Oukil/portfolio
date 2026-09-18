import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useOS } from '../../context/OSContext';

export const AndroidStatusBar: React.FC<{ lightContent?: boolean }> = ({
  lightContent = true,
}) => {
  const { currentTime, batteryLevel } = useOS();
  const textColor = lightContent ? '#FFFFFF' : '#1F2937';

  return (
    <View style={styles.container}>
      {/* Left: Clock and Notification Badges */}
      <View style={styles.leftSection}>
        <Text style={[styles.timeText, { color: textColor }]}>{currentTime}</Text>
        <View style={styles.notifIcons}>
          <Text style={[styles.notifGlyph, { color: textColor }]}>⚡</Text>
          <Text style={[styles.notifGlyph, { color: textColor }]}>🛡</Text>
        </View>
      </View>

      {/* Center: Camera Punch Hole Cutout */}
      <View style={styles.punchHoleContainer}>
        <View style={styles.punchHole} />
      </View>

      {/* Right: Signal, Wi-Fi, Battery */}
      <View style={styles.rightSection}>
        <Text style={[styles.statusIcon, { color: textColor }]}>▲</Text>
        <Text style={[styles.statusIcon, { color: textColor }]}>📶</Text>
        <View style={styles.batteryContainer}>
          <Text style={[styles.batteryText, { color: textColor }]}>
            {batteryLevel}%
          </Text>
          <View style={[styles.batteryPill, { borderColor: textColor }]}>
            <View
              style={[
                styles.batteryLevel,
                {
                  height: `${Math.min(100, Math.max(10, batteryLevel))}%`,
                  backgroundColor: textColor,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 38,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 100,
    userSelect: 'none',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'sans-serif-medium',
  },
  notifIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.85,
  },
  notifGlyph: {
    fontSize: 10,
  },
  punchHoleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: '#1e293b',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  statusIcon: {
    fontSize: 10,
    opacity: 0.9,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  batteryPill: {
    width: 9,
    height: 15,
    borderWidth: 1.2,
    borderRadius: 2,
    padding: 1,
    justifyContent: 'flex-end',
  },
  batteryLevel: {
    width: '100%',
    borderRadius: 1,
  },
});
