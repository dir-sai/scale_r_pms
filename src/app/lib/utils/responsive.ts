import { Dimensions, Platform, ScaledSize } from 'react-native';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveConfig {
  breakpoints: Record<Breakpoint, number>;
  columns: number;
  gutterWidth: number;
  containerPadding: number;
}

const defaultConfig: ResponsiveConfig = {
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  columns: 12,
  gutterWidth: 16,
  containerPadding: 16,
};

export class ResponsiveUtils {
  private static config: ResponsiveConfig = defaultConfig;
  private static currentBreakpoint: Breakpoint = 'xs';
  private static isPortrait: boolean = true;
  private static windowDimensions: ScaledSize = Dimensions.get('window');

  static initialize(config?: Partial<ResponsiveConfig>) {
    this.config = { ...defaultConfig, ...config };
    this.updateDimensions();
  }

  static updateDimensions() {
    this.windowDimensions = Dimensions.get('window');
    this.isPortrait = this.windowDimensions.height > this.windowDimensions.width;
    this.currentBreakpoint = this.getCurrentBreakpoint();
  }

  static getCurrentBreakpoint(): Breakpoint {
    const width = this.windowDimensions.width;
    const breakpoints = Object.entries(this.config.breakpoints)
      .sort(([, a], [, b]) => b - a);

    for (const [breakpoint, minWidth] of breakpoints) {
      if (width >= minWidth) {
        return breakpoint as Breakpoint;
      }
    }
    return 'xs';
  }

  static get breakpoint(): Breakpoint {
    return this.currentBreakpoint;
  }

  static get isPortraitMode(): boolean {
    return this.isPortrait;
  }

  static get screenWidth(): number {
    return this.windowDimensions.width;
  }

  static get screenHeight(): number {
    return this.windowDimensions.height;
  }

  static get isSmallScreen(): boolean {
    return ['xs', 'sm'].includes(this.currentBreakpoint);
  }

  static get isMobileDevice(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }

  static get isTabletDevice(): boolean {
    const { width, height } = this.windowDimensions;
    const aspectRatio = height / width;
    return (
      (Platform.OS === 'ios' || Platform.OS === 'android') &&
      Math.max(width, height) >= 768 &&
      aspectRatio >= 0.7 &&
      aspectRatio <= 1.3
    );
  }

  static getColumnWidth(span: number = 1): number {
    const { columns, gutterWidth, containerPadding } = this.config;
    const availableWidth = this.screenWidth - (containerPadding * 2);
    const totalGutterWidth = gutterWidth * (columns - 1);
    const columnWidth = (availableWidth - totalGutterWidth) / columns;
    return columnWidth * span + (span - 1) * gutterWidth;
  }

  static getFontScale(): number {
    const baseScale = this.isSmallScreen ? 0.9 : 1;
    return baseScale * (this.isMobileDevice ? 0.95 : 1);
  }

  static getSpacing(multiplier: number = 1): number {
    const baseSpacing = this.isSmallScreen ? 8 : 16;
    return baseSpacing * multiplier;
  }

  static getResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
    const currentBreakpoint = this.getCurrentBreakpoint();
    const breakpoints: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    
    for (const breakpoint of breakpoints) {
      if (breakpoint === currentBreakpoint && values[breakpoint] !== undefined) {
        return values[breakpoint]!;
      }
    }
    
    return defaultValue;
  }

  static getGridColumns(): number {
    return this.getResponsiveValue(
      {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 12,
        xl: 12,
      },
      12
    );
  }

  static getContainerMaxWidth(): number {
    const breakpoint = this.getCurrentBreakpoint();
    return this.config.breakpoints[breakpoint];
  }

  static isMobile(): boolean {
    return this.getCurrentBreakpoint() === 'xs';
  }

  static isTablet(): boolean {
    const breakpoint = this.getCurrentBreakpoint();
    return breakpoint === 'sm' || breakpoint === 'md';
  }
} 