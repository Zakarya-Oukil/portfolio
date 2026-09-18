import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ImageWithFallbackProps {
  source: string;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  children?: React.ReactNode;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  source,
  style,
  resizeMode = 'cover',
  children,
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [source]);

  return (
    <View style={[style, styles.imageFallback]}>
      {!failed ? (
        <Image
          source={{ uri: source }}
          resizeMode={resizeMode}
          style={StyleSheet.absoluteFill}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.failedImage]}>
          <Text style={styles.fallbackGlyph}>◈</Text>
          <Text style={styles.failedImageText}>Visual asset preview</Text>
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  imageFallback: {
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  failedImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
  },
  fallbackGlyph: {
    fontSize: 26,
    color: '#38BDF8',
    fontWeight: '700',
  },
  failedImageText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
});
