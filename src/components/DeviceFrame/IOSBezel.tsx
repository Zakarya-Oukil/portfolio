import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IOSStatusBar } from '../SystemBars/IOSStatusBar';
import { IOSHomeIndicator } from '../SystemBars/SystemNavBars';

interface IOSBezelProps {
  children: React.ReactNode;
  deviceWidth?: number;
  deviceHeight?: number;
}

export const IOSBezel: React.FC<IOSBezelProps> = ({
  children,
  deviceWidth = 400,
  deviceHeight = 840,
}) => {
  return (
    <View
      style={[
        styles.outerChassis,
        {
          width: deviceWidth,
          height: deviceHeight,
        },
      ]}
    >
      {/* Hardware Buttons - Left Side */}
      <View style={styles.actionButton} />
      <View style={styles.volumeUpButton} />
      <View style={styles.volumeDownButton} />

      {/* Hardware Buttons - Right Side */}
      <View style={styles.powerButton} />

      {/* Inner Screen Bezel */}
      <View style={styles.screenBezel}>
        {/* Antenna band highlights */}
        <View style={styles.screenContainer}>
          {/* iOS Top Status Bar with Dynamic Island */}
          <IOSStatusBar lightContent={true} />

          {/* Screen Application Viewport */}
          <View style={styles.screenContent}>{children}</View>

          {/* iOS Bottom Home Indicator */}
          <IOSHomeIndicator lightBar={true} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerChassis: {
    position: 'relative',
    backgroundColor: '#1E232A',
    borderRadius: 55,
    padding: 11,
    boxShadow:
      '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 2px rgba(255, 255, 255, 0.12), inset 0 0 0 2px #334155',
    userSelect: 'none',
  },
  screenBezel: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 45,
    overflow: 'hidden',
    position: 'relative',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0A0E17',
    position: 'relative',
    overflow: 'hidden',
  },
  screenContent: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  /* Side Hardware Buttons */
  actionButton: {
    position: 'absolute',
    left: -4,
    top: 115,
    width: 4,
    height: 26,
    backgroundColor: '#475569',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeUpButton: {
    position: 'absolute',
    left: -4,
    top: 160,
    width: 4,
    height: 52,
    backgroundColor: '#475569',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeDownButton: {
    position: 'absolute',
    left: -4,
    top: 225,
    width: 4,
    height: 52,
    backgroundColor: '#475569',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  powerButton: {
    position: 'absolute',
    right: -4,
    top: 180,
    width: 4,
    height: 75,
    backgroundColor: '#475569',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
