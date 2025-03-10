import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { Grid } from './Grid';

export interface ResponsiveStackProps {
  children: React.ReactNode;
  spacing?: number;
  direction?: {
    xs?: 'row' | 'column';
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
    xl?: 'row' | 'column';
  };
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  wrap?: boolean;
  style?: ViewStyle;
}

export function ResponsiveStack({
  children,
  spacing = 2,
  direction = { xs: 'column', md: 'row' },
  align = 'stretch',
  justify = 'flex-start',
  wrap = true,
  style,
}: ResponsiveStackProps) {
  const { breakpoint } = useResponsive();

  const getDirection = () => {
    const breakpoints: ('xl' | 'lg' | 'md' | 'sm' | 'xs')[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    for (const bp of breakpoints) {
      if (direction[bp] && breakpoints.indexOf(bp) >= breakpoints.indexOf(breakpoint)) {
        return direction[bp];
      }
    }
    return 'column';
  };

  const styles = StyleSheet.create({
    stack: {
      width: '100%',
    } as ViewStyle,
  });

  return (
    <Grid
      container
      direction={getDirection()}
      spacing={spacing}
      align={align}
      justify={justify}
      wrap={wrap}
      style={[styles.stack, style]}
    >
      {React.Children.map(children, (child) => (
        <Grid item xs={getDirection() === 'column' ? 12 : 'auto'}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
} 