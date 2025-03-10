import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Text as CustomText } from './Text';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const theme = useTheme();

  const getFontSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return theme.typography.sizes.small;
      case 'lg':
        return theme.typography.sizes.h3;
      default:
        return theme.typography.sizes.body;
    }
  };

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      opacity: disabled ? 0.5 : 1,
      padding: size === 'sm' ? theme.spacing.sm : size === 'lg' ? theme.spacing.lg : theme.spacing.md,
      backgroundColor:
        variant === 'primary'
          ? theme.colors.primary
          : variant === 'outline'
          ? 'transparent'
          : 'transparent',
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: theme.colors.primary,
    },
    text: {
      color:
        variant === 'primary'
          ? theme.colors.text.light
          : variant === 'outline'
          ? theme.colors.primary
          : theme.colors.primary,
      fontSize: getFontSize(size),
      fontWeight: theme.typography.weights.medium,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.text.light : theme.colors.primary}
          size={size === 'sm' ? 'small' : 'small'}
        />
      ) : (
        <>
          {leftIcon}
          <CustomText style={styles.text}>{title}</CustomText>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
} 