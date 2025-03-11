import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Container } from '../components/Container';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { resetPassword, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async () => {
    await resetPassword({ email });
    setIsSubmitted(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    card: {
      width: '100%',
      maxWidth: 400,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    icon: {
      marginBottom: theme.spacing.md,
    },
    form: {
      gap: theme.spacing.md,
    },
    successMessage: {
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.lg,
    },
    footerLink: {
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <Container style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Ionicons
            name={isSubmitted ? 'mail' : 'lock-closed'}
            size={48}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <Text variant="h2" weight="bold">
            {isSubmitted ? 'Check Your Email' : 'Reset Password'}
          </Text>
          <Text
            variant="body"
            color={theme.colors.text.secondary}
            style={{ marginTop: theme.spacing.xs }}
          >
            {isSubmitted
              ? 'We have sent password reset instructions to your email'
              : 'Enter your email to receive password reset instructions'}
          </Text>
        </View>

        {!isSubmitted ? (
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleResetPassword}
              loading={isLoading}
            />
          </View>
        ) : (
          <Text
            variant="body"
            color={theme.colors.text.secondary}
            style={styles.successMessage}
          >
            If an account exists for {email}, you will receive password reset
            instructions shortly.
          </Text>
        )}

        <View style={styles.footer}>
          <Text color={theme.colors.text.secondary}>
            Remember your password?
          </Text>
          <TouchableOpacity onPress={() => router.push('/sign-in')}>
            <Text
              color={theme.colors.primary}
              weight="medium"
              style={styles.footerLink}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Container>
  );
} 