import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useOS } from '../../context/OSContext';
import { CATEGORIES, PROJECTS } from '../../data/portfolioData';
import { Project, ProjectCategory } from '../../types';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailView } from './ProjectDetailView';

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export const ProjectsScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const { osMode, closeApp } = useOS();

  const [activeCategory, setActiveCategory] =
    useState<ProjectCategory>('Security & CTF');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(['nids-ml', 'agentic-web-os']);

  // Proportional Responsive Card Geometry
  const horizontalPadding = clamp(width * 0.055, 18, 26);
  const spacing = clamp(width * 0.045, 14, 20);
  const cardWidth = clamp(width * 0.74, 250, 336);
  const cardHeight = clamp(height - 235, 380, 520);
  const sideInset = Math.max((width - cardWidth) / 2, horizontalPadding);

  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<any>(null);
  const currentScrollOffset = useRef(0);
  const dragStartOffset = useRef(0);

  // Critical Requirement 1: Click vs. Drag Isolation (Zero Ghost Clicks)
  const dragStartTimestamp = useRef(0);
  const dragDistance = useRef(0);
  const didDragRef = useRef(false);

  const filteredProjects = useMemo(
    () => PROJECTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const snapInterval = cardWidth + spacing;
  const maxScrollOffset = Math.max(
    0,
    (filteredProjects.length - 1) * snapInterval
  );

  // Desktop Web PanResponder Drag-and-Drop Implementation
  const desktopDragHandlers = useMemo(() => {
    if (Platform.OS !== 'web') {
      return {};
    }

    const shouldStartDragging = (_: any, gestureState: any) => {
      const horizontalDistance = Math.abs(gestureState.dx);
      const verticalDistance = Math.abs(gestureState.dy);
      return horizontalDistance > 6 && horizontalDistance > verticalDistance;
    };

    const finishDragging = (_: any, gestureState: any) => {
      const now = Date.now();
      const duration = now - dragStartTimestamp.current;
      const totalDx = Math.abs(gestureState.dx);

      // Enforce drag detection if displacement exceeds 6px or fast flick gesture
      if (totalDx > 6 || duration < 180) {
        didDragRef.current = true;
      }

      const projectedOffset = clamp(
        dragStartOffset.current - gestureState.dx - gestureState.vx * 150,
        0,
        maxScrollOffset
      );

      const snappedOffset =
        Math.round(projectedOffset / snapInterval) * snapInterval;

      listRef.current?.scrollToOffset({
        offset: clamp(snappedOffset, 0, maxScrollOffset),
        animated: true,
      });

      // Active 150ms lock before resetting didDragRef to prevent ghost clicks
      setTimeout(() => {
        didDragRef.current = false;
      }, 150);
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: shouldStartDragging,
      onMoveShouldSetPanResponderCapture: shouldStartDragging,

      onPanResponderGrant: () => {
        dragStartOffset.current = currentScrollOffset.current;
        dragStartTimestamp.current = Date.now();
        dragDistance.current = 0;
        didDragRef.current = false;
      },

      onPanResponderMove: (_: any, gestureState: any) => {
        dragDistance.current = Math.abs(gestureState.dx);
        if (dragDistance.current > 6) {
          didDragRef.current = true;
        }

        const nextOffset = clamp(
          dragStartOffset.current - gestureState.dx,
          0,
          maxScrollOffset
        );

        listRef.current?.scrollToOffset({
          offset: nextOffset,
          animated: false,
        });
      },

      onPanResponderRelease: finishDragging,
      onPanResponderTerminate: finishDragging,
      onPanResponderTerminationRequest: () => false,
    }).panHandlers;
  }, [maxScrollOffset, snapInterval]);

  const changeCategory = (category: ProjectCategory) => {
    setActiveCategory(category);
    currentScrollOffset.current = 0;
    scrollX.setValue(0);

    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    });
  };

  const toggleSave = (id: string) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const openProject = (item: Project) => {
    if (didDragRef.current) {
      return;
    }
    setSelectedProject(item);
  };

  /* -------------------------------------------------------------------------- */
  /*                        FULL-SCREEN NAVIGATION RULE                         */
  /* -------------------------------------------------------------------------- */
  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
        savedIds={savedIds}
        onToggleSave={toggleSave}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Header Bar */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <View>
          <Text style={styles.eyebrow}>DEV PORTFOLIO</Text>
          <Text style={styles.title}>Projects & Labs</Text>
        </View>

        {/* Back / Home Exit Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close Projects and return to Home"
          onPress={() => closeApp()}
          style={({ pressed }) => [
            styles.exitButton,
            pressed && styles.exitButtonPressed,
          ]}
        >
          <Text style={styles.exitIcon}>⌂</Text>
        </Pressable>
      </View>

      {/* 2. Horizontal Tech Category Filters */}
      <View style={styles.categoryArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingRight: horizontalPadding + 20,
          }}
        >
          {CATEGORIES.map((category) => {
            const isSelected = category === activeCategory;

            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => changeCategory(category)}
                style={({ pressed }) => [
                  styles.categoryPill,
                  isSelected && styles.categoryPillActive,
                  {
                    opacity: pressed ? 0.72 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Main Project Carousel Area with PanResponder */}
      <View style={styles.carouselArea}>
        <Animated.FlatList
          ref={listRef}
          {...desktopDragHandlers}
          horizontal
          data={filteredProjects}
          keyExtractor={(item: Project) => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={snapInterval}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum
          bounces
          contentContainerStyle={{
            paddingLeft: sideInset,
            paddingRight: sideInset - spacing,
            alignItems: 'center',
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
              listener: (event: any) => {
                currentScrollOffset.current = event.nativeEvent.contentOffset.x;
              },
            }
          )}
          onMomentumScrollEnd={(event: any) => {
            currentScrollOffset.current = event.nativeEvent.contentOffset.x;
          }}
          renderItem={({ item, index }: { item: Project; index: number }) => (
            <ProjectCard
              item={item}
              index={index}
              scrollX={scrollX}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              spacing={spacing}
              onOpen={openProject}
              saved={savedIds.includes(item.id)}
              onSave={toggleSave}
              didDragRef={didDragRef}
            />
          )}
        />
      </View>

      {/* 4. Bottom Category Navigation / Indicator Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            marginHorizontal: horizontalPadding,
          },
          osMode === 'ios' && styles.bottomBarIOS,
        ]}
      >
        <View style={styles.bottomBarItem}>
          <Text style={styles.bottomBarTextActive}>{activeCategory}</Text>
          <View style={styles.bottomBarActiveDot} />
        </View>

        <View style={styles.bottomBarItem}>
          <Text style={styles.bottomBarHint}>
            {filteredProjects.length} Verified Systems
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Return home"
          onPress={() => closeApp()}
          style={styles.bottomBarItem}
        >
          <Text style={styles.bottomBarIcon}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'space-between',
    userSelect: 'none',
  },

  /* Header */
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    zIndex: 10,
  },
  eyebrow: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 2,
  },
  exitButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  exitButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  exitIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
  },

  /* Categories */
  categoryArea: {
    height: 48,
    justifyContent: 'center',
    zIndex: 4,
  },
  categoryPill: {
    height: 32,
    minWidth: 78,
    paddingHorizontal: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  categoryPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
  },
  categoryText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },

  /* Carousel */
  carouselArea: {
    flex: 1,
    justifyContent: 'center',
  },

  /* Bottom Navigation */
  bottomBar: {
    height: 52,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  bottomBarIOS: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  bottomBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarTextActive: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  bottomBarActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
    marginTop: 3,
  },
  bottomBarHint: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '600',
  },
  bottomBarIcon: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
});
