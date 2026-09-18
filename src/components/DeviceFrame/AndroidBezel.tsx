import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AndroidStatusBar } from '../SystemBars/AndroidStatusBar';
import { AndroidNavigationBar } from '../SystemBars/SystemNavBars';

interface AndroidBezelProps {
  children: React.ReactNode;
  deviceWidth?: number;
  deviceHeight?: number;
}

export const AndroidBezel: React.FC<AndroidBezelProps> = ({
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
      {/* Right Side Buttons: Volume Rocker & Power */}
      <View style={styles.volumeRocker} />
      <View style={styles.powerButton} />

      {/* Screen Bezel */}
      <View style={styles.screenBezel}>
        <View style={styles.screenContainer}>
          {/* Android Material 3 Status Bar */}
          <AndroidStatusBar lightContent={true} />

          {/* Screen Content Viewport */}
          <View style={styles.screenContent}>{children}</View>

          {/* Android 3-Button Navigation Bar */}
          <AndroidNavigationBar lightIcons={true} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerChassis: {
    position: 'relative',
    backgroundColor: '#181C24',
    borderRadius: 44,
    padding: 9,
    boxShadow:
      '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 2px rgba(255, 255, 255, 0.10), inset 0 0 0 1.5px #334155',
    userSelect: 'none',
  },
  screenBezel: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  screenContent: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  /* Hardware Buttons */
  volumeRocker: {
    position: 'absolute',
    right: -4,
    top: 140,
    width: 4,
    height: 70,
    backgroundColor: '#475569',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  powerButton: {
    position: 'absolute',
    right: -4,
    top: 230,
    width: 4,
    height: 44,
    backgroundColor: '#475569',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
