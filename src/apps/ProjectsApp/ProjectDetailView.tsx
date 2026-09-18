import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { PROJECTS } from '../../data/portfolioData';
import { Project } from '../../types';
import { ArchitectureSheet } from './ArchitectureSheet';
import { ImageWithFallback } from './ImageWithFallback';

interface ProjectDetailViewProps {
  project: Project;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onClose,
  onSelectProject,
  savedIds,
  onToggleSave,
}) => {
  const { width, height } = useWindowDimensions();

  // Animation values from reference code
  const openingProgress = useRef(new Animated.Value(0)).current;
  const contentProgress = useRef(new Animated.Value(0)).current;
  const switchProgress = useRef(new Animated.Value(1)).current;
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const switchingRef = useRef(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [outgoingProject, setOutgoingProject] = useState<Project | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string>(project.id);

  // Related projects row references & safeguards
  const relatedScrollRef = useRef<any>(null);
  const relatedScrollOffsetRef = useRef(0);
  const relatedDragStartOffsetRef = useRef(0);
  const relatedDragStartTimestamp = useRef(0);
  const relatedDragDistance = useRef(0);
  const relatedDidDragRef = useRef(false);

  const heroHeight = Math.min(520, Math.max(380, height * 0.58));
  const relatedCardWidth = Math.min(142, Math.max(115, width * 0.32));
  const relatedCardHeight = Math.min(130, Math.max(105, heroHeight * 0.23));
  const relatedCardSpacing = 12;

  // 1. Maintain Fixed Order for Related Projects
  const relatedProjects = useMemo(
    () => PROJECTS.filter((p) => p.category === project.category),
    [project.category]
  );

  const relatedContentWidth =
    22 +
    34 +
    relatedProjects.length * relatedCardWidth +
    Math.max(0, relatedProjects.length - 1) * relatedCardSpacing;

  const relatedMaxScrollOffset = Math.max(0, relatedContentWidth - width);
  const relatedSnapInterval = relatedCardWidth + relatedCardSpacing;

  // 2. PanResponder with Web Drag vs. Click Isolation
  const relatedDesktopDragHandlers = useMemo(() => {
    if (Platform.OS !== 'web') {
      return {};
    }

    const shouldStartDragging = (_: any, gestureState: any) => {
      const hDist = Math.abs(gestureState.dx);
      const vDist = Math.abs(gestureState.dy);
      return hDist > 6 && hDist > vDist;
    };

    const finishDragging = (_: any, gestureState: any) => {
      const now = Date.now();
      const duration = now - relatedDragStartTimestamp.current;
      const totalDx = Math.abs(gestureState.dx);

      if (totalDx > 6 || duration < 180) {
        relatedDidDragRef.current = true;
      }

      const projectedOffset = Math.min(
        relatedMaxScrollOffset,
        Math.max(
          0,
          relatedDragStartOffsetRef.current -
            gestureState.dx -
            gestureState.vx * 120
        )
      );

      const snappedOffset = Math.min(
        relatedMaxScrollOffset,
        Math.max(
          0,
          Math.round(projectedOffset / relatedSnapInterval) *
            relatedSnapInterval
        )
      );

      relatedScrollRef.current?.scrollTo({
        x: snappedOffset,
        animated: true,
      });

      // Active 150ms lock before resetting drag ref
      setTimeout(() => {
        relatedDidDragRef.current = false;
      }, 150);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: shouldStartDragging,
      onMoveShouldSetPanResponderCapture: shouldStartDragging,

      onPanResponderGrant: () => {
        relatedDragStartOffsetRef.current = relatedScrollOffsetRef.current;
        relatedDragStartTimestamp.current = Date.now();
        relatedDragDistance.current = 0;
        relatedDidDragRef.current = false;
      },

      onPanResponderMove: (_: any, gestureState: any) => {
        relatedDragDistance.current = Math.abs(gestureState.dx);
        if (relatedDragDistance.current > 6) {
          relatedDidDragRef.current = true;
        }

        const nextOffset = Math.min(
          relatedMaxScrollOffset,
          Math.max(0, relatedDragStartOffsetRef.current - gestureState.dx)
        );

        relatedScrollRef.current?.scrollTo({
          x: nextOffset,
          animated: false,
        });
      },

      onPanResponderRelease: finishDragging,
      onPanResponderTerminate: finishDragging,
      onPanResponderTerminationRequest: () => false,
    }).panHandlers;
  }, [relatedMaxScrollOffset, relatedSnapInterval]);

  const saved = savedIds.includes(project.id);

  useEffect(() => {
    setSelectedCardId(project.id);
  }, [project.id]);

  useEffect(() => {
    relatedProjects.forEach((p) => {
      Image.prefetch(p.image).catch(() => {});
    });
  }, [relatedProjects]);

  // Initial Mount Animation
  useEffect(() => {
    Animated.sequence([
      Animated.timing(openingProgress, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentProgress, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentProgress, openingProgress]);

  // Dismiss Detail Screen
  const handleClose = () => {
    if (switchingRef.current) return;

    Animated.parallel([
      Animated.timing(contentProgress, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(openingProgress, {
        toValue: 0,
        duration: 260,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  // 3. Zero-Flash Overwrite Crossfade Transition
  const switchProject = (nextProject: Project) => {
    if (
      switchingRef.current ||
      !nextProject ||
      nextProject.id === project.id
    ) {
      return;
    }

    switchingRef.current = true;
    setSelectedCardId(nextProject.id);
    setOutgoingProject(project);

    switchProgress.stopAnimation();
    switchProgress.setValue(1);

    // Old content fades down slightly
    Animated.timing(switchProgress, {
      toValue: 0,
      duration: 175,
      easing: Easing.bezier(0.55, 0, 0.9, 0.45),
      useNativeDriver: true,
    }).start(() => {
      onSelectProject(nextProject);

      requestAnimationFrame(() => {
        // New content fades and rises
        Animated.timing(switchProgress, {
          toValue: 1,
          duration: 470,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          useNativeDriver: true,
        }).start(() => {
          setOutgoingProject(null);
          switchingRef.current = false;
        });
      });
    });
  };

  // Sheet Controls
  const openSheet = () => {
    setSheetOpen(true);
    Animated.spring(sheetAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 22,
      stiffness: 180,
      mass: 0.85,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 240,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setSheetOpen(false));
  };

  /* Exact Overwrite Interpolations */
  const switchContentOpacity = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.34, 1],
  });

  const switchTranslateX = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  const switchTextTranslateY = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  const outgoingImageOpacity = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const outgoingImageScale = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.035],
  });

  const switchVeilOpacity = switchProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0],
  });

  const switchingContentOpacity = Animated.multiply(
    contentProgress,
    switchContentOpacity
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.screenAnimated,
          {
            opacity: openingProgress,
            transform: [
              {
                scale: openingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.94, 1],
                }),
              },
              {
                translateY: openingProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Photographic Section */}
          <ImageBackground
            source={{ uri: project.image }}
            resizeMode="cover"
            style={[styles.heroBackground, { height: heroHeight }]}
          >
            {/* Outgoing Image for Zero-Flash Crossfade */}
            {outgoingProject && (
              <Animated.Image
                pointerEvents="none"
                source={{ uri: outgoingProject.image }}
                resizeMode="cover"
                style={[
                  styles.outgoingImage,
                  {
                    opacity: outgoingImageOpacity,
                    transform: [{ scale: outgoingImageScale }],
                  },
                ]}
              />
            )}

            {/* Overlays */}
            <View style={styles.topFade} />
            <View style={styles.bottomFade} />

            {/* Top Navigation Controls */}
            <View style={styles.topControlRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to projects"
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.glassBtn,
                  pressed && styles.glassBtnPressed,
                ]}
              >
                <Text style={styles.backGlyph}>‹</Text>
              </Pressable>

              <View style={styles.topRightControls}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save project"
                  onPress={() => onToggleSave(project.id)}
                  style={({ pressed }) => [
                    styles.glassBtn,
                    pressed && styles.glassBtnPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.starActionGlyph,
                      saved && styles.starActionGlyphActive,
                    ]}
                  >
                    {saved ? '★' : '☆'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Main Hero Information Copy */}
            <Animated.View
              style={[
                styles.heroCopy,
                {
                  opacity: switchingContentOpacity,
                  transform: [
                    {
                      translateY: contentProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [28, 0],
                      }),
                    },
                    { translateX: switchTranslateX },
                    { translateY: switchTextTranslateY },
                  ],
                },
              ]}
            >
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>{project.complexity}</Text>
              </View>

              <Text style={styles.heroCategory}>{project.category}</Text>
              <Text numberOfLines={2} style={styles.heroTitle}>
                {project.title}
              </Text>

              {/* Duration & Complexity Metadata */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaGlyph}>⏱</Text>
                  <Text style={styles.metaText}>{project.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaGlyph}>⚑</Text>
                  <Text style={styles.metaText}>{project.badge}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Floating Engagement Counters */}
            <Animated.View
              style={[
                styles.floatingCounters,
                {
                  opacity: switchingContentOpacity,
                  transform: [
                    {
                      translateX: contentProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [35, 0],
                      }),
                    },
                    { translateY: switchTextTranslateY },
                  ],
                },
              ]}
            >
              <View style={styles.counterBubble}>
                <Text style={styles.counterGlyph}>★</Text>
                <Text style={styles.counterText}>{project.stars}</Text>
              </View>
              <View style={styles.counterBubble}>
                <Text style={styles.counterGlyph}>👁</Text>
                <Text style={styles.counterText}>{project.views}</Text>
              </View>
              <View style={styles.counterBubble}>
                <Text style={styles.counterGlyph}>♥</Text>
                <Text style={styles.counterText}>{project.likes}</Text>
              </View>
            </Animated.View>

            {/* Related Projects Horizontal Row */}
            <Animated.View
              style={[
                styles.relatedWrapper,
                {
                  opacity: contentProgress,
                  transform: [
                    {
                      translateY: contentProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [45, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.relatedLabel}>
                MORE IN {project.category.toUpperCase()}
              </Text>

              <ScrollView
                ref={relatedScrollRef}
                {...relatedDesktopDragHandlers}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={relatedSnapInterval}
                decelerationRate="fast"
                disableIntervalMomentum
                contentContainerStyle={styles.relatedScrollContent}
              >
                {relatedProjects.map((item) => {
                  const isActive = item.id === selectedCardId;

                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${item.title}`}
                      onPress={() => {
                        if (relatedDidDragRef.current || isActive) {
                          return;
                        }
                        switchProject(item);
                      }}
                      style={({ pressed }) => [
                        styles.relatedCard,
                        isActive && styles.relatedCardActive,
                        {
                          width: relatedCardWidth,
                          height: relatedCardHeight,
                          transform: [{ scale: pressed ? 0.96 : 1 }],
                        },
                      ]}
                    >
                      <ImageWithFallback
                        source={item.image}
                        style={styles.relatedCardImage}
                      >
                        <View style={styles.relatedCardOverlay} />

                        {/* White Selection Active Badge */}
                        {isActive && (
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>ACTIVE</Text>
                          </View>
                        )}

                        <View style={styles.relatedCardTextContainer}>
                          <Text numberOfLines={1} style={styles.relatedCardTitle}>
                            {item.title}
                          </Text>
                        </View>
                      </ImageWithFallback>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </ImageBackground>

          {/* Bottom Specifications Container */}
          <Animated.View
            style={[
              styles.bottomPanel,
              {
                opacity: contentProgress,
                transform: [
                  {
                    translateY: contentProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [60, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.panelHandle} />

            <View style={styles.panelHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.panelSubtitle}>{project.subtitle}</Text>
                <Text style={styles.panelCategoryTag}>{project.category}</Text>
              </View>
            </View>

            {/* Detailed Technical Description */}
            <Text style={styles.panelDescription}>{project.description}</Text>

            {/* Architecture Pipeline Note */}
            <View style={styles.archSummaryBox}>
              <Text style={styles.archSummaryTitle}>PIPELINE & TOPOLOGY</Text>
              <Text style={styles.archSummaryText}>
                {project.architectureNotes}
              </Text>
            </View>

            {/* Tech Stack Chips */}
            <Text style={styles.techStackLabel}>TECHNOLOGY STACK</Text>
            <View style={styles.techStackContainer}>
              {project.techStack.map((tech, idx) => (
                <View key={idx} style={styles.techChip}>
                  <Text style={styles.techChipText}>{tech}</Text>
                </View>
              ))}
            </View>

            {/* Big Action Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Inspect Architecture Specifications"
              onPress={openSheet}
              style={({ pressed }) => [
                styles.primaryActionBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.primaryActionBtnText}>
                Inspect Architecture & Specs ↗
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>

        {/* Subtle dark veil during crossfade */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.switchVeil,
            { opacity: switchVeilOpacity },
          ]}
        />
      </Animated.View>

      {/* Architecture Bottom Sheet */}
      <ArchitectureSheet
        project={project}
        isOpen={sheetOpen}
        onClose={closeSheet}
        slideAnim={sheetAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  screenAnimated: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  /* Hero Section */
  heroBackground: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#0284C7',
    position: 'relative',
  },
  outgoingImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(10, 15, 30, 0.45)',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '52%',
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
  },
  switchVeil: {
    backgroundColor: '#070C16',
  },

  /* Top Control Row */
  topControlRow: {
    paddingTop: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  glassBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassBtnPressed: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  backGlyph: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '300',
    marginTop: -2,
  },
  starActionGlyph: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 20,
  },
  starActionGlyphActive: {
    color: '#F59E0B',
  },

  /* Hero Copy */
  heroCopy: {
    position: 'absolute',
    left: 18,
    top: '22%',
    width: '64%',
  },
  heroBadge: {
    backgroundColor: 'rgba(2, 132, 199, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroCategory: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaGlyph: {
    fontSize: 12,
  },
  metaText: {
    color: '#E2E8F0',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Floating Counters */
  floatingCounters: {
    position: 'absolute',
    right: 16,
    top: '25%',
    alignItems: 'flex-end',
    gap: 8,
  },
  counterBubble: {
    minWidth: 50,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    gap: 4,
  },
  counterGlyph: {
    color: '#F59E0B',
    fontSize: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },

  /* Related Projects Row */
  relatedWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
  },
  relatedLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 18,
    marginBottom: 8,
  },
  relatedScrollContent: {
    paddingLeft: 18,
    paddingRight: 24,
  },
  relatedCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  relatedCardActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.45)',
  },
  relatedCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  relatedCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.35)',
  },
  activeBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: '#0F172A',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  relatedCardTextContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
  },
  relatedCardTitle: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* Bottom Panel */
  bottomPanel: {
    marginTop: -16,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.6)',
  },
  panelHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelSubtitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  panelCategoryTag: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  panelDescription: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    marginTop: 10,
  },
  archSummaryBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  archSummaryTitle: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  archSummaryText: {
    color: '#E2E8F0',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'monospace',
  },
  techStackLabel: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  techStackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 18,
  },
  techChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  techChipText: {
    color: '#38BDF8',
    fontSize: 10.5,
    fontWeight: '700',
  },
  primaryActionBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(2, 132, 199, 0.45)',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
