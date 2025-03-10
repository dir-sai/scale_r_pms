import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: InputProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      marginBottom: theme.spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? theme.colors.status.error : theme.colors.secondary,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing.sm,
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.text.primary,
      fontSize: theme.typography.sizes.body,
    },
    error: {
      marginTop: theme.spacing.xs,
      color: theme.colors.status.error,
    },
    icon: {
      marginHorizontal: theme.spacing.xs,
      color: theme.colors.text.secondary,
    },
    rightIcon: {
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="small" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={theme.colors.text.secondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={theme.colors.text.secondary}
          {...props}
        />
        {rightIcon && (
          <Ionicons
            name={rightIcon as any}
            size={20}
            color={theme.colors.text.secondary}
            style={[styles.icon, styles.rightIcon]}
            onPress={onRightIconPress}
          />
        )}
      </View>
      {error && (
        <Text variant="small" style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
} 