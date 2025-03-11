import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '../types/theme';
import { defaultTheme } from '../theme/default';

export const ThemeContext = createContext<Theme>(defaultTheme);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Theme;
}

export function ThemeProvider({ children, initialTheme = defaultTheme }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const updateTheme = useCallback((newTheme: Partial<Theme>) => {
    setTheme(currentTheme => ({
      ...currentTheme,
      ...newTheme,
    }));
  }, []);

  useEffect(() => {
    if (systemColorScheme === 'dark') {
      updateTheme({
        colors: {
          ...theme.colors,
          background: {
            primary: '#000000',
            secondary: '#1C1C1E',
            tertiary: '#2C2C2E',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#8E8E93',
            tertiary: '#48484A',
            inverse: '#000000',
          },
        },
      });
    } else {
      updateTheme(defaultTheme);
    }
  }, [systemColorScheme, updateTheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
} 