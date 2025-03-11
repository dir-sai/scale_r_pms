export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: {
      primary: string;
      secondary: string;
    };
    text: {
      primary: string;
      secondary: string;
      light: string;
    };
    status: {
      success: string;
      error: string;
      warning: string;
      info: string;
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
      light: string;
      regular: string;
      medium: string;
      bold: string;
    };
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
    round: number;
  };
} 