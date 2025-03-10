import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Container } from '../components/Container';
import { Text } from '../components/Text';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../../types/auth';

const ROLES: { label: string; value: UserRole; icon: string }[] = [
  { label: 'Property Manager', value: 'property_manager', icon: 'business' },
  { label: 'Landlord', value: 'landlord', icon: 'home' },
  { label: 'Tenant', value: 'tenant', icon: 'person' },
  { label: 'Maintenance Staff', value: 'maintenance', icon: 'construct' },
];

export default function SignUpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { signUp, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: '' as UserRole,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) errors.role = 'Please select a role';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      const { confirmPassword, ...signUpData } = formData;
      await signUp(signUpData);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.xl,
    },
    card: {
      width: '100%',
      maxWidth: 500,
      alignSelf: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    form: {
      gap: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    roleGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    roleCard: {
      flex: 1,
      minWidth: 150,
      padding: theme.spacing.lg,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.secondary,
    },
    selectedRole: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    roleIcon: {
      marginBottom: theme.spacing.sm,
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
    <Container scrollable style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="h2" weight="bold">
            Create Account
          </Text>
          <Text
            variant="body"
            color={theme.colors.text.secondary}
            style={{ marginTop: theme.spacing.xs }}
          >
            Join Scale-R PMS today
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              error={formErrors.firstName}
              containerStyle={{ flex: 1 }}
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              error={formErrors.lastName}
              containerStyle={{ flex: 1 }}
            />
          </View>

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email || error}
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            error={formErrors.password}
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            error={formErrors.confirmPassword}
          />

          <Text
            variant="small"
            weight="medium"
            style={{ marginTop: theme.spacing.md }}
          >
            Select your role
          </Text>

          <View style={styles.roleGrid}>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role.value}
                onPress={() => setFormData({ ...formData, role: role.value })}
              >
                <Card
                  style={[
                    styles.roleCard,
                    formData.role === role.value && styles.selectedRole,
                  ]}
                >
                  <Ionicons
                    name={role.icon as any}
                    size={32}
                    color={
                      formData.role === role.value
                        ? theme.colors.primary
                        : theme.colors.text.secondary
                    }
                    style={styles.roleIcon}
                  />
                  <Text
                    variant="small"
                    weight="medium"
                    color={
                      formData.role === role.value
                        ? theme.colors.primary
                        : theme.colors.text.primary
                    }
                  >
                    {role.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
          {formErrors.role && (
            <Text variant="small" color={theme.colors.status.error}>
              {formErrors.role}
            </Text>
          )}

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>

        <View style={styles.footer}>
          <Text color={theme.colors.text.secondary}>
            Already have an account?
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