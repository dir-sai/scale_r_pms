import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleSheet,
  StyleProp,
  TextProps as RNTextProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'tiny';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  style?: StyleProp<TextStyle>;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function Text({ style, variant = 'body', weight = 'regular', color, ...props }: TextProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    text: {
      fontSize: theme.typography.sizes[variant],
      fontWeight: theme.typography.weights[weight] as TextStyle['fontWeight'],
      color: color || theme.colors.text.primary,
    } as TextStyle,
  });

  return <RNText style={[styles.text, style]} {...props} />;
}

// Convenience components for common text variants
export const H1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="h1" weight="bold" />
);

export const H2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="h2" weight="bold" />
);

export const H3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="h3" weight="semibold" />
);

export const Body: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="body" />
);

export const Small: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="small" />
);

export const Tiny: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text {...props} variant="tiny" />
); 