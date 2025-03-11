import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { Icon } from './IconProvider';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  quality?: number;
  blur?: boolean;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 75,
  blur = true,
  priority = false,
  style,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  // Generate optimized image URL with CDN parameters
  const getOptimizedUrl = (url: string) => {
    // Example CDN URL transformation (replace with your actual CDN configuration)
    const baseUrl = process.env.NEXT_PUBLIC_CDN_URL || '';
    if (!baseUrl) return url;

    const params = new URLSearchParams({
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      blur: blur ? 'true' : 'false',
    });

    return `${baseUrl}/${encodeURIComponent(url)}?${params.toString()}`;
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <View style={[styles.container, { width, height }]}>
      {isLoading && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      )}
      <Image
        source={{ uri: optimizedSrc }}
        style={[
          styles.image,
          { width, height },
          isLoading && styles.loading,
          style,
        ]}
        onLoadStart={() => !priority && setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        accessible={true}
        accessibilityLabel={alt}
        {...props}
      />
      {error && (
        <View style={[styles.errorContainer, { width, height }]}>
          <Icon name="broken-image" size="lg" color={theme.colors.text.secondary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.background.secondary,
  },
  image: {
    resizeMode: 'cover',
  },
  loading: {
    opacity: 0,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
}); 