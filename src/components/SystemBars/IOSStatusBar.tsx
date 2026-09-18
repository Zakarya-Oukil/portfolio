import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useOS } from '../../context/OSContext';

export const IOSStatusBar: React.FC<{ lightContent?: boolean }> = ({
  lightContent = true,
}) => {
  const { currentTime, batteryLevel } = useOS();
  const textColor = lightContent ? '#FFFFFF' : '#111827';

  return (
    <View style={styles.container}>
      {/* Left: Clock */}
      <View style={styles.leftSection}>
        <Text style={[styles.timeText, { color: textColor }]}>{currentTime}</Text>
      </View>

      {/* Center: Dynamic Island */}
      <View style={styles.dynamicIslandContainer}>
        <View style={styles.dynamicIsland}>
          {/* Camera aperture lens */}
          <View style={styles.cameraLens} />
          {/* Proximity / status dot */}
          <View style={styles.sensorDot} />
        </View>
      </View>

      {/* Right: Cellular, WiFi, Battery */}
      <View style={styles.rightSection}>
        {/* Cellular 4 bars */}
        <View style={styles.cellularIcon}>
          <View style={[styles.cellBar, { height: 4, backgroundColor: textColor }]} />
          <View style={[styles.cellBar, { height: 6, backgroundColor: textColor }]} />
          <View style={[styles.cellBar, { height: 8, backgroundColor: textColor }]} />
          <View style={[styles.cellBar, { height: 10, backgroundColor: textColor }]} />
        </View>

        {/* 5G label */}
        <Text style={[styles.netText, { color: textColor }]}>5G</Text>

        {/* Battery Container with fill */}
        <View style={[styles.batteryOuter, { borderColor: textColor }]}>
          <View
            style={[
              styles.batteryInner,
              {
                width: `${Math.min(100, Math.max(10, batteryLevel))}%`,
                backgroundColor: textColor,
              },
            ]}
          />
          <View style={[styles.batteryNub, { backgroundColor: textColor }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    zIndex: 100,
    userSelect: 'none',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
    fontFamily: 'system-ui',
  },
  dynamicIslandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dynamicIsland: {
    width: 110,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  cameraLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0b1329',
    borderWidth: 1.5,
    borderColor: '#1e293b',
    marginRight: 6,
  },
  sensorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#047857',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  cellularIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 11,
    gap: 1.5,
  },
  cellBar: {
    width: 2.5,
    borderRadius: 0.75,
  },
  netText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  batteryOuter: {
    width: 22,
    height: 11,
    borderWidth: 1.2,
    borderRadius: 3.5,
    padding: 1.5,
    justifyContent: 'center',
    position: 'relative',
  },
  batteryInner: {
    height: '100%',
    borderRadius: 1.5,
  },
  batteryNub: {
    position: 'absolute',
    right: -3,
    width: 1.5,
    height: 4,
    borderRadius: 1,
  },
});
