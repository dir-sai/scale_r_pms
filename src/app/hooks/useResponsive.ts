import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { ResponsiveUtils } from '../lib/utils/responsive';

export interface ResponsiveInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function useResponsive(): ResponsiveInfo {
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const orientation = dimensions.width > dimensions.height ? 'landscape' : 'portrait';
  const isMobile = ResponsiveUtils.isMobile();
  const isTablet = ResponsiveUtils.isTablet();
  const isDesktop = !isMobile && !isTablet;
  const breakpoint = ResponsiveUtils.getCurrentBreakpoint();

  return {
    isMobile,
    isTablet,
    isDesktop,
    orientation,
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
    breakpoint,
  };
} 