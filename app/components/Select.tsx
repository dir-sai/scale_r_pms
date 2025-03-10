import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string | string[];
  options: SelectOption[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  error?: string;
}

export function Select({ value, options, onChange, placeholder, multiple, error }: SelectProps) {
  const theme = useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const getSelectedLabels = () => {
    if (multiple && Array.isArray(value)) {
      return value
        .map(v => options.find(o => o.value === v)?.label)
        .filter(Boolean)
        .join(', ');
    }
    return options.find(o => o.value === value)?.label;
  };

  const handleSelect = (option: SelectOption) => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      const index = values.indexOf(option.value);
      if (index === -1) {
        onChange([...values, option.value]);
      } else {
        onChange(values.filter(v => v !== option.value));
      }
    } else {
      onChange(option.value);
      setShowOptions(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    } as ViewStyle,
    button: {
      borderWidth: 1,
      borderColor: error ? theme.colors.status.error : theme.colors.border.primary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    text: {
      fontSize: theme.typography.sizes.body,
      color: value ? theme.colors.text.primary : theme.colors.text.secondary,
      flex: 1,
      marginRight: theme.spacing.sm,
    } as TextStyle,
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.md,
    } as ViewStyle,
    optionsContainer: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      width: '100%',
      maxHeight: '80%',
    } as ViewStyle,
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    } as ViewStyle,
    optionText: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text.primary,
      flex: 1,
    } as TextStyle,
    selectedOption: {
      backgroundColor: theme.colors.background.secondary,
    } as ViewStyle,
    error: {
      color: theme.colors.status.error,
      fontSize: theme.typography.sizes.small,
      marginTop: theme.spacing.xs,
    } as TextStyle,
  });

  const isSelected = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setShowOptions(true)}>
        <Text style={styles.text} numberOfLines={1}>
          {getSelectedLabels() || placeholder || 'Select an option'}
        </Text>
        <Ionicons
          name={showOptions ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsContainer}>
            <ScrollView>
              {options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    isSelected(option.value) && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                  {isSelected(option.value) && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
} 