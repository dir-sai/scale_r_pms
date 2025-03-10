import { TextStyle } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    border: {
      primary: string;
      secondary: string;
    };
  };
  typography: {
    sizes: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      body: number;
      small: number;
      tiny: number;
    };
    weights: {
      light: TextStyle['fontWeight'];
      regular: TextStyle['fontWeight'];
      medium: TextStyle['fontWeight'];
      semibold: TextStyle['fontWeight'];
      bold: TextStyle['fontWeight'];
    };
    lineHeights: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      body: number;
      small: number;
      tiny: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: {
        width: number;
        height: number;
      };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
} 