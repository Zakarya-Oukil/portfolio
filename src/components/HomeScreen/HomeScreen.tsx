import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useOS } from '../../context/OSContext';
import { DEVELOPER_PROFILE } from '../../data/portfolioData';
import { AppId } from '../../types';
import { AppIcon } from './AppIcon';

export const HomeScreen: React.FC = () => {
  const { openApp, currentTime, currentDateString, osMode } = useOS();

  const apps: {
    id: AppId;
    title: string;
    icon: string;
    gradient: [string, string];
    badge?: string;
  }[] = [
    {
      id: 'projects',
      title: 'Projects',
      icon: '📂',
      gradient: ['#0284C7', '#0369A1'],
      badge: '16',
    },
    {
      id: 'terminal',
      title: 'Terminal',
      icon: '⌨',
      gradient: ['#1E293B', '#0F172A'],
      badge: 'BASH',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙',
      gradient: ['#475569', '#334155'],
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: '👤',
      gradient: ['#059669', '#047857'],
      badge: 'NEW',
    },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Large Dynamic Clock & Widget Area */}
      <View style={styles.widgetCard}>
        <Text style={styles.widgetDate}>{currentDateString}</Text>
        <Text style={styles.widgetTime}>{currentTime}</Text>

        <View style={styles.statusPill}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>{DEVELOPER_PROFILE.status}</Text>
        </View>

        <View style={styles.developerProfileSnippet}>
          <Text style={styles.devName}>{DEVELOPER_PROFILE.name}</Text>
          <Text style={styles.devRole}>{DEVELOPER_PROFILE.role}</Text>
        </View>
      </View>

      {/* 2. Apps Launcher Grid */}
      <View style={styles.appGrid}>
        {apps.map((app) => (
          <AppIcon
            key={app.id}
            appId={app.id}
            title={app.title}
            icon={app.icon}
            gradientColors={app.gradient}
            badge={app.badge}
            onPress={() => openApp(app.id)}
          />
        ))}
      </View>

      {/* 3. Quick Stats Mini-Widget */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statVal}>16</Text>
          <Text style={styles.statLbl}>PROJECTS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>4</Text>
          <Text style={styles.statLbl}>DOMAINS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statVal}>99.4%</Text>
          <Text style={styles.statLbl}>NIDS ACC</Text>
        </View>
      </View>

      {/* 4. Bottom Dock Area (for mobile home screen) */}
      <View style={styles.dockContainer}>
        <View
          style={[
            styles.mobileDockPill,
            osMode === 'ios' ? styles.iosDockPill : styles.androidDockPill,
          ]}
        >
          {apps.map((app) => (
            <Pressable
              key={app.id}
              accessibilityRole="button"
              accessibilityLabel={`Launch ${app.title}`}
              onPress={() => openApp(app.id)}
              style={({ pressed }) => [
                styles.dockButton,
                { transform: [{ scale: pressed ? 0.9 : 1 }] },
              ]}
            >
              <View
                style={[
                  styles.dockIconBox,
                  {
                    backgroundColor: app.gradient[0],
                    borderRadius: osMode === 'ios' ? 14 : 18,
                  },
                ]}
              >
                <Text style={styles.dockIconText}>{app.icon}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
    userSelect: 'none',
  },

  /* Clock & Bio Widget */
  widgetCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  widgetDate: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  widgetTime: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 52,
    marginVertical: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 10,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  developerProfileSnippet: {
    alignItems: 'center',
    marginTop: 2,
  },
  devName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  devRole: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },

  /* App Grid */
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 10,
  },

  /* Stats Card */
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '800',
  },
  statLbl: {
    color: '#94A3B8',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },

  /* Bottom Dock Area */
  dockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  mobileDockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
  },
  iosDockPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  androidDockPill: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  dockButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockIconBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  dockIconText: {
    fontSize: 22,
  },
});
