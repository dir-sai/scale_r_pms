import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ResponsiveUtils, Breakpoint } from '../../lib/utils/responsive';

export interface GridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number | 'auto';
  sm?: number | 'auto';
  md?: number | 'auto';
  lg?: number | 'auto';
  xl?: number | 'auto';
  spacing?: number;
  direction?: 'row' | 'column';
  wrap?: boolean;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  style?: ViewStyle;
}

export function Grid({
  children,
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 2,
  direction = 'row',
  wrap = true,
  justify = 'flex-start',
  align = 'stretch',
  style,
}: GridProps) {
  const getColumnSize = () => {
    const sizes: Partial<Record<Breakpoint, number | 'auto'>> = {
      xs,
      sm,
      md,
      lg,
      xl,
    };
    const value = ResponsiveUtils.getResponsiveValue(sizes, 12);
    return typeof value === 'string' && value === 'auto' ? undefined : value;
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: direction,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      justifyContent: justify,
      alignItems: align,
      margin: container ? -ResponsiveUtils.getSpacing(spacing / 2) : undefined,
      maxWidth: container ? ResponsiveUtils.getContainerMaxWidth() : undefined,
      alignSelf: container ? 'center' : undefined,
      width: container ? '100%' : undefined,
    } as ViewStyle,
    item: {
      padding: ResponsiveUtils.getSpacing(spacing / 2),
      flexBasis: item ? `${(getColumnSize() || 12) * (100 / 12)}%` : undefined,
      flexGrow: item && getColumnSize() === 'auto' ? 1 : undefined,
      maxWidth: item ? `${(getColumnSize() || 12) * (100 / 12)}%` : undefined,
    } as ViewStyle,
  });

  return (
    <View style={[container && styles.container, item && styles.item, style]}>
      {children}
    </View>
  );
} 