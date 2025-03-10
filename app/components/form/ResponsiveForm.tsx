import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Grid } from '../layout/Grid';
import { Container } from '../layout/Container';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';

export interface ResponsiveFormProps {
  children: React.ReactNode;
  spacing?: number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export function ResponsiveForm({
  children,
  spacing = 2,
  maxWidth = 'md',
  style,
}: ResponsiveFormProps) {
  const { isMobile } = useResponsive();
  const theme = useTheme();

  const styles = StyleSheet.create({
    form: {
      width: '100%',
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.md,
      ...(!isMobile && {
        shadowColor: theme.colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }),
    } as ViewStyle,
  });

  return (
    <Container maxWidth={maxWidth}>
      <View style={[styles.form, style]}>
        <Grid container spacing={spacing}>
          {children}
        </Grid>
      </View>
    </Container>
  );
} 