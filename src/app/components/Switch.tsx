import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface SwitchProps extends Omit<RNSwitchProps, 'trackColor' | 'thumbColor'> {
  size?: 'sm' | 'md' | 'lg';
}

export function Switch({ size = 'md', style, ...props }: SwitchProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    switch: {
      transform: [
        { scale: size === 'sm' ? 0.8 : size === 'lg' ? 1.2 : 1 },
      ],
    } as ViewStyle,
  });

  return (
    <RNSwitch
      style={[styles.switch, style]}
      trackColor={{
        false: theme.colors.background.secondary,
        true: theme.colors.primary,
      }}
      thumbColor={props.value ? theme.colors.background.primary : theme.colors.background.primary}
      ios_backgroundColor={theme.colors.background.secondary}
      {...props}
    />
  );
} 