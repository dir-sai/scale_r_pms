import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export interface TextInputProps extends RNTextInputProps {
  error?: string;
}

export function TextInput({ style, error, ...props }: TextInputProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: error ? theme.colors.status.error : theme.colors.border.primary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.primary,
    } as TextStyle,
  });

  return (
    <RNTextInput
      style={[styles.input, style]}
      placeholderTextColor={theme.colors.text.secondary}
      {...props}
    />
  );
} 