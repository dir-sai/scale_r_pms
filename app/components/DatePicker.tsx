import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Text';
import { format } from 'date-fns';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
}

export function DatePicker({ value, onChange, placeholder, error }: DatePickerProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    } as ViewStyle,
    button: {
      borderWidth: 1,
      borderColor: error ? theme.colors.status.error : theme.colors.border.primary,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.primary,
    } as ViewStyle,
    text: {
      fontSize: theme.typography.sizes.body,
      color: value ? theme.colors.text.primary : theme.colors.text.secondary,
    } as TextStyle,
    error: {
      color: theme.colors.status.error,
      fontSize: theme.typography.sizes.small,
      marginTop: theme.spacing.xs,
    } as TextStyle,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Text style={styles.text}>
          {value ? format(value, 'MMM d, yyyy') : placeholder || 'Select date'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
} 