import React from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Project } from '../../types';

interface ArchitectureSheetProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

export const ArchitectureSheet: React.FC<ArchitectureSheetProps> = ({
  project,
  isOpen,
  onClose,
  slideAnim,
}) => {
  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close architecture panel"
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        />
      </Pressable>

      {/* Slide-Up Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.eyebrow}>ARCHITECTURE SPECIFICATIONS</Text>
            <Text numberOfLines={1} style={styles.title}>
              {project.title}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.closeBtnPressed,
            ]}
          >
            <Text style={styles.closeBtnGlyph}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Metrics Grid */}
          <Text style={styles.sectionLabel}>PERFORMANCE BENCHMARKS</Text>
          <View style={styles.metricsGrid}>
            {project.metrics.map((m, idx) => (
              <View key={idx} style={styles.metricCard}>
                <Text style={styles.metricVal}>{m.value}</Text>
                <Text style={styles.metricLbl}>{m.label}</Text>
              </View>
            ))}
          </View>

          {/* Architecture Layer Breakdown */}
          <Text style={styles.sectionLabel}>SYSTEM LAYERS</Text>
          <View style={styles.layersContainer}>
            {project.architecture.frontend && (
              <View style={styles.layerRow}>
                <View style={styles.layerIconBox}>
                  <Text style={styles.layerIcon}>🖥</Text>
                </View>
                <View style={styles.layerInfo}>
                  <Text style={styles.layerTitle}>UI & Presentation</Text>
                  <Text style={styles.layerDesc}>
                    {project.architecture.frontend}
                  </Text>
                </View>
              </View>
            )}

            {project.architecture.backend && (
              <View style={styles.layerRow}>
                <View style={styles.layerIconBox}>
                  <Text style={styles.layerIcon}>⚙</Text>
                </View>
                <View style={styles.layerInfo}>
                  <Text style={styles.layerTitle}>Runtime & Microservices</Text>
                  <Text style={styles.layerDesc}>
                    {project.architecture.backend}
                  </Text>
                </View>
              </View>
            )}

            {project.architecture.security && (
              <View style={styles.layerRow}>
                <View style={styles.layerIconBox}>
                  <Text style={styles.layerIcon}>🛡</Text>
                </View>
                <View style={styles.layerInfo}>
                  <Text style={styles.layerTitle}>Security & Access Boundary</Text>
                  <Text style={styles.layerDesc}>
                    {project.architecture.security}
                  </Text>
                </View>
              </View>
            )}

            {project.architecture.dataPipeline && (
              <View style={styles.layerRow}>
                <View style={styles.layerIconBox}>
                  <Text style={styles.layerIcon}>⚡</Text>
                </View>
                <View style={styles.layerInfo}>
                  <Text style={styles.layerTitle}>Data Bus & Pipeline</Text>
                  <Text style={styles.layerDesc}>
                    {project.architecture.dataPipeline}
                  </Text>
                </View>
              </View>
            )}

            {project.architecture.deployment && (
              <View style={styles.layerRow}>
                <View style={styles.layerIconBox}>
                  <Text style={styles.layerIcon}>☁</Text>
                </View>
                <View style={styles.layerInfo}>
                  <Text style={styles.layerTitle}>Infrastructure & IaC</Text>
                  <Text style={styles.layerDesc}>
                    {project.architecture.deployment}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Action Links */}
          <View style={styles.actionsContainer}>
            {project.liveUrl && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Launch Live Demo"
                onPress={() => window.open(project.liveUrl, '_blank')}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.primaryBtnText}>Launch Live Instance ↗</Text>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View GitHub Repository"
              onPress={() => window.open(project.githubUrl, '_blank')}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.secondaryBtnText}>
                Inspect Code on GitHub ↗
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(10, 15, 30, 0.75)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '82%',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.65)',
    zIndex: 200,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
    marginRight: 10,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  closeBtnGlyph: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionLabel: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginVertical: 10,
  },

  /* Metrics Grid */
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricVal: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '800',
  },
  metricLbl: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 2,
  },

  /* Layers */
  layersContainer: {
    gap: 10,
    marginBottom: 20,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  layerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  layerIcon: {
    fontSize: 18,
  },
  layerInfo: {
    flex: 1,
  },
  layerTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  layerDesc: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  /* Actions */
  actionsContainer: {
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryBtnText: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
});
