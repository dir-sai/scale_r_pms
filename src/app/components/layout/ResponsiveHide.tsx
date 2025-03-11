import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { Breakpoint } from '../../lib/utils/responsive';

export interface ResponsiveHideProps {
  children: React.ReactNode;
  breakpoint: Breakpoint;
  direction?: 'up' | 'down';
  style?: ViewStyle;
}

export function ResponsiveHide({
  children,
  breakpoint,
  direction = 'up',
  style,
}: ResponsiveHideProps) {
  const { breakpoint: currentBreakpoint } = useResponsive();
  
  const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpoints.indexOf(currentBreakpoint);
  const targetIndex = breakpoints.indexOf(breakpoint);
  
  const shouldHide = direction === 'up' 
    ? currentIndex >= targetIndex
    : currentIndex <= targetIndex;

  if (shouldHide) {
    return null;
  }

  return <View style={style}>{children}</View>;
} 