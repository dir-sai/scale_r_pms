import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ResponsiveUtils } from '../../lib/utils/responsive';
import { useTheme } from '../../hooks/useTheme';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disableGutters?: boolean;
  fixed?: boolean;
  style?: ViewStyle;
}

export function Container({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  fixed = false,
  style,
}: ContainerProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    root: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: disableGutters ? 0 : ResponsiveUtils.getSpacing(2),
      paddingRight: disableGutters ? 0 : ResponsiveUtils.getSpacing(2),
      maxWidth: maxWidth === 'full' ? '100%' : ResponsiveUtils.getContainerMaxWidth(),
    } as ViewStyle,
    fixed: {
      flex: fixed ? 1 : undefined,
    } as ViewStyle,
  });

  return (
    <View style={[styles.root, styles.fixed, style]}>
      {children}
    </View>
  );
} 