import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Navigation } from './Navigation';
import { Container } from './Container';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const window = Dimensions.get('window');
  const isDesktop = window.width >= 1024;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: isDesktop ? 'row' : 'column',
      backgroundColor: theme.colors.background.secondary,
    },
    navigation: {
      flex: isDesktop ? undefined : 0,
      width: isDesktop ? 280 : '100%',
      zIndex: 1,
    },
    content: {
      flex: 1,
    },
    contentInner: {
      maxWidth: isDesktop ? 1200 : undefined,
      width: '100%',
      alignSelf: 'center',
    },
  });

  const content = (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <Navigation />
      </View>
      <View style={styles.content}>
        <Container scrollable>
          <View style={styles.contentInner}>{children}</View>
        </Container>
      </View>
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
}; 