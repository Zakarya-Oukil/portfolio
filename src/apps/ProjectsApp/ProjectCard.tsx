import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Project } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProjectCardProps {
  item: Project;
  index: number;
  scrollX: Animated.Value;
  cardWidth: number;
  cardHeight: number;
  spacing: number;
  onOpen: (item: Project) => void;
  saved: boolean;
  onSave: (id: string) => void;
  didDragRef: React.MutableRefObject<boolean>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  item,
  index,
  scrollX,
  cardWidth,
  cardHeight,
  spacing,
  onOpen,
  saved,
  onSave,
  didDragRef,
}) => {
  const itemSize = cardWidth + spacing;

  const inputRange = [
    (index - 1) * itemSize,
    index * itemSize,
    (index + 1) * itemSize,
  ];

  /* Exact Mathematical Interpolations from Reference Code */
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.88, 1, 0.88],
    extrapolate: 'clamp',
  });

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [18, 0, 18],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.72, 1, 0.72],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.08, 0.25, 0.08],
    extrapolate: 'clamp',
  });

  const handlePress = () => {
    // Web Click vs Drag isolation safeguard
    if (didDragRef.current) {
      return;
    }
    onOpen(item);
  };

  return (
    <Animated.View
      style={{
        width: cardWidth,
        height: cardHeight,
        marginRight: spacing,
        opacity,
        transform: [{ scale }, { translateY }],
      }}
    >
      <Animated.View
        style={[
          styles.cardShadow,
          {
            width: cardWidth,
            height: cardHeight,
            shadowOpacity,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open project ${item.title}`}
          onPress={handlePress}
          style={({ pressed }) => [
            styles.cardPressable,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            },
          ]}
        >
          <ImageWithFallback source={item.image} style={styles.cardImage}>
            {/* Top & Bottom Readability Overlays */}
            <View style={styles.cardTopOverlay} />
            <View style={styles.cardBottomOverlay} />

            {/* Top Left: Complexity Badge */}
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{item.complexity}</Text>
            </View>

            {/* Top Right: Favorite / Star Action Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                saved ? `Unstar ${item.title}` : `Star ${item.title}`
              }
              hitSlop={12}
              onPress={(event) => {
                event.stopPropagation?.();
                onSave(item.id);
              }}
              style={({ pressed }) => [
                styles.saveButton,
                {
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
            >
              <Text style={[styles.starGlyph, saved && styles.starGlyphActive]}>
                {saved ? '★' : '☆'}
              </Text>
            </Pressable>

            {/* Bottom Content Metadata */}
            <View style={styles.cardCopy}>
              <Text style={styles.cardCategory}>{item.category}</Text>
              <Text numberOfLines={2} style={styles.cardTitle}>
                {item.title}
              </Text>

              {/* 5-Star Rating Row */}
              <View style={styles.ratingRow}>
                {[0, 1, 2, 3, 4].map((star) => (
                  <Text key={star} style={styles.ratingStar}>
                    ★
                  </Text>
                ))}
                <Text style={styles.starsCountText}>({item.stars})</Text>
              </View>
            </View>
          </ImageWithFallback>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: 30,
    shadowColor: '#0284C7',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 28,
    elevation: 15,
  },
  cardPressable: {
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  cardTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  cardBottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    backgroundColor: 'rgba(10, 15, 30, 0.85)',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(2, 132, 199, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  starGlyph: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 20,
  },
  starGlyphActive: {
    color: '#F59E0B',
  },
  cardCopy: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    alignItems: 'flex-start',
  },
  cardCategory: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 6,
  },
  ratingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 13,
    marginRight: 2,
  },
  starsCountText: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '600',
    marginLeft: 6,
  },
});
