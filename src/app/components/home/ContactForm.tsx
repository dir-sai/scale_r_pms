import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme/theme';
import { Button } from '../common/Button';

interface FormField {
  value: string;
  isFocused: boolean;
}

export const ContactForm: React.FC = () => {
  const [fields, setFields] = useState<{
    name: FormField;
    email: FormField;
    phone: FormField;
    message: FormField;
  }>({
    name: { value: '', isFocused: false },
    email: { value: '', isFocused: false },
    phone: { value: '', isFocused: false },
    message: { value: '', isFocused: false },
  });

  const animations = {
    name: new Animated.Value(0),
    email: new Animated.Value(0),
    phone: new Animated.Value(0),
    message: new Animated.Value(0),
  };

  const animateLabel = (fieldName: keyof typeof fields, toValue: number) => {
    Animated.timing(animations[fieldName], {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = (fieldName: keyof typeof fields) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], isFocused: true },
    }));
    animateLabel(fieldName, 1);
  };

  const handleBlur = (fieldName: keyof typeof fields) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], isFocused: false },
    }));
    if (!fields[fieldName].value) {
      animateLabel(fieldName, 0);
    }
  };

  const handleChange = (fieldName: keyof typeof fields, value: string) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], value },
    }));
  };

  const renderField = (
    fieldName: keyof typeof fields,
    label: string,
    isMultiline: boolean = false
  ) => {
    const labelStyle = {
      transform: [
        {
          translateY: animations[fieldName].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20],
          }),
        },
      ],
      fontSize: animations[fieldName].interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      color: animations[fieldName].interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.text.secondary, theme.colors.primary],
      }),
    };

    return (
      <View style={styles.inputContainer}>
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
        <TextInput
          style={[
            styles.input,
            isMultiline && styles.multilineInput,
            fields[fieldName].isFocused && styles.focusedInput,
          ]}
          value={fields[fieldName].value}
          onFocus={() => handleFocus(fieldName)}
          onBlur={() => handleBlur(fieldName)}
          onChangeText={(value) => handleChange(fieldName, value)}
          multiline={isMultiline}
          numberOfLines={isMultiline ? 4 : 1}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get in Touch</Text>
      <Text style={styles.subtitle}>
        Have questions about Scale-R PMS? We're here to help!
      </Text>
      {renderField('name', 'Full Name')}
      {renderField('email', 'Email Address')}
      {renderField('phone', 'Phone Number')}
      {renderField('message', 'Your Message', true)}
      <Button
        title="Send Message"
        onPress={() => {}}
        variant="primary"
        size="large"
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[8],
    width: '100%',
    maxWidth: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontFamily: theme.typography.fonts.heading,
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[6],
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: theme.spacing[4],
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: theme.spacing[4],
    top: theme.spacing[4],
    fontFamily: theme.typography.fonts.body,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 56,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.typography.fonts.body,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },
  multilineInput: {
    height: 120,
    paddingTop: theme.spacing[6],
    textAlignVertical: 'top',
  },
  focusedInput: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  submitButton: {
    marginTop: theme.spacing[6],
  },
}); 