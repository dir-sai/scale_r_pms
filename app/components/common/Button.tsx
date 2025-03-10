import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { theme } from '../../theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.medium,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          minWidth: 80,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[8],
          minWidth: 160,
        };
      default: // medium
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[6],
          minWidth: 120,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyles: TextStyle = {
      fontSize: size === 'small' ? theme.typography.sizes.sm : theme.typography.sizes.base,
      fontWeight: theme.typography.weights.medium,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          color: theme.colors.text.inverse,
        };
      case 'secondary':
      case 'outline':
        return {
          ...baseStyles,
          color: theme.colors.primary,
        };
      case 'text':
        return {
          ...baseStyles,
          color: theme.colors.text.primary,
        };
      default:
        return baseStyles;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[getTextStyles(), disabled && styles.disabledText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
}); 