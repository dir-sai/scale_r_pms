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

export default function SignInScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signIn, googleSignIn, facebookSignIn, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    await signIn({ email, password });
  };

  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  const handleFacebookSignIn = async () => {
    await facebookSignIn();
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
    form: {
      gap: theme.spacing.md,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: theme.spacing.xs,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.secondary,
    },
    dividerText: {
      marginHorizontal: theme.spacing.md,
    },
    socialButtons: {
      gap: theme.spacing.md,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    socialIcon: {
      marginRight: theme.spacing.sm,
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
            name="business"
            size={48}
            color={theme.colors.primary}
          />
          <Text
            variant="h2"
            weight="bold"
            style={{ marginTop: theme.spacing.md }}
          >
            Welcome Back
          </Text>
          <Text
            variant="body"
            color={theme.colors.text.secondary}
            style={{ marginTop: theme.spacing.xs }}
          >
            Sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push('/forgot-password')}
          >
            <Text
              variant="small"
              color={theme.colors.primary}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text
            variant="small"
            color={theme.colors.text.secondary}
            style={styles.dividerText}
          >
            or continue with
          </Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Ionicons
              name="logo-google"
              size={24}
              color={theme.colors.text.primary}
              style={styles.socialIcon}
            />
            <Text>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleFacebookSignIn}
            disabled={isLoading}
          >
            <Ionicons
              name="logo-facebook"
              size={24}
              color="#1877F2"
              style={styles.socialIcon}
            />
            <Text>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text color={theme.colors.text.secondary}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/sign-up')}
          >
            <Text
              color={theme.colors.primary}
              weight="medium"
              style={styles.footerLink}
            >
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Container>
  );
} 