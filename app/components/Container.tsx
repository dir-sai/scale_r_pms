import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  padded?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  scrollable = false,
  padded = true,
  safeArea = true,
  backgroundColor,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor || theme.colors.background.primary,
    },
    content: {
      flex: 1,
      padding: padded ? theme.spacing.lg : 0,
    },
  });

  const content = (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );

  const mainContent = scrollable ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={padded && { padding: theme.spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    content
  );

  if (safeArea) {
    return (
      <SafeAreaView style={styles.container}>
        {mainContent}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {mainContent}
    </View>
  );
}; 