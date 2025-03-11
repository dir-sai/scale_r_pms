import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

export interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  fluid?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  fluid = false,
}) => {
  return (
    <View style={[styles.container, fluid && styles.fluid, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: theme.spacing[4],
  },
  fluid: {
    maxWidth: '100%',
  },
}); 