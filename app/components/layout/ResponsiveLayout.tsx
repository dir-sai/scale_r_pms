import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { Container } from './Container';
import { Grid } from './Grid';
import { useTheme } from '../../hooks/useTheme';

export interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  spacing?: number;
  style?: ViewStyle;
}

export function ResponsiveLayout({
  children,
  sidebarContent,
  headerContent,
  footerContent,
  maxWidth = 'lg',
  spacing = 2,
  style,
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet, orientation } = useResponsive();
  const theme = useTheme();

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
    } as ViewStyle,
    content: {
      flex: 1,
      minHeight: 0,
    } as ViewStyle,
    header: {
      width: '100%',
      backgroundColor: theme.colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
      padding: theme.spacing.md,
    } as ViewStyle,
    footer: {
      width: '100%',
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
      padding: theme.spacing.md,
    } as ViewStyle,
    sidebar: {
      backgroundColor: theme.colors.background.primary,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border.light,
      width: isMobile ? '100%' : isTablet ? 280 : 320,
      ...(isMobile && orientation === 'landscape' && {
        width: '50%',
      }),
    } as ViewStyle,
  });

  const renderContent = () => {
    if (isMobile) {
      return (
        <Grid container direction="column" spacing={0}>
          {headerContent && <View style={styles.header}>{headerContent}</View>}
          {sidebarContent && <View style={styles.sidebar}>{sidebarContent}</View>}
          <View style={styles.content}>
            <Container maxWidth={maxWidth} style={{ flex: 1 }}>
              <Grid container spacing={spacing}>
                {children}
              </Grid>
            </Container>
          </View>
          {footerContent && <View style={styles.footer}>{footerContent}</View>}
        </Grid>
      );
    }

    return (
      <Grid container direction="column" spacing={0}>
        {headerContent && <View style={styles.header}>{headerContent}</View>}
        <Grid container direction="row" spacing={0} style={styles.content}>
          {sidebarContent && <View style={styles.sidebar}>{sidebarContent}</View>}
          <Container maxWidth={maxWidth} style={{ flex: 1 }}>
            <Grid container spacing={spacing}>
              {children}
            </Grid>
          </Container>
        </Grid>
        {footerContent && <View style={styles.footer}>{footerContent}</View>}
      </Grid>
    );
  };

  return <View style={[styles.root, style]}>{renderContent()}</View>;
} 