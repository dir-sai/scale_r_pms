export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      light: string;
    };
    background: {
      primary: string;
      secondary: string;
      dark: string;
    };
    status: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    border: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
    full: number;
  };
  typography: {
    sizes: {
      tiny: number;
      small: number;
      body: number;
      h1: number;
      h2: number;
      h3: number;
      h4: number;
    };
    weights: {
      light: string;
      regular: string;
      medium: string;
      bold: string;
    };
  };
} 