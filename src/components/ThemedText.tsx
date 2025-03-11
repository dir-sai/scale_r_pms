import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@/hooks/useTheme';

type TextType = 'title' | 'subtitle' | 'subtitle2' | 'default' | 'defaultSemiBold' | 'link';

interface ThemedTextProps extends TextProps {
  type?: TextType;
  children: React.ReactNode;
}

type StyleMap = Record<TextType, TextStyle>;

export function ThemedText({ type = 'default', style, children, ...props }: ThemedTextProps) {
  const theme = useTheme();

  const styles: StyleMap = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    subtitle2: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    default: {
      fontSize: 16,
      color: theme.colors.text.primary,
    },
    defaultSemiBold: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    link: {
      fontSize: 16,
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
  });

  return (
    <Text style={[styles[type], style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
