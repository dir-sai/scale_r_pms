import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    primary: '#F2B238',
    primaryDark: '#D99B20', // Darker shade for hover states
    secondary: '#2C3E50',
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#E9ECEF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4A5568',
      tertiary: '#718096',
      inverse: '#FFFFFF',
    },
    status: {
      success: '#48BB78',
      warning: '#F6AD55',
      error: '#F56565',
      info: '#4299E1',
    },
    border: {
      light: '#E2E8F0',
      medium: '#CBD5E0',
      dark: '#A0AEC0',
    },
  },
  typography: {
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },
  borderRadius: {
    none: 0,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    full: 9999,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    default: '0.3s ease-in-out',
    fast: '0.15s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  grid: {
    columns: 12,
    gutter: 24,
    margin: 16,
  },
  icons: {
    size: {
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48,
    },
  },
} as const;

export type Theme = typeof theme;
export type ThemeColor = keyof typeof theme.colors;
export type ThemeSize = keyof typeof theme.typography.sizes;
export type ThemeWeight = keyof typeof theme.typography.weights;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeBreakpoint = keyof typeof theme.breakpoints;

// Common style mixins
export const mixins = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  section: {
    padding: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}; 