import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Card } from '../Card';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'staff' | 'manager';
  phone?: string;
  avatar?: string;
  department?: string;
  jobTitle?: string;
  dateJoined: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  password?: string;
  currentPassword?: string;
}

interface AccountManagementProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => Promise<void>;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
}

export function AccountManagement({
  userProfile,
  onUpdate,
  onLogout,
  onDeleteAccount,
}: AccountManagementProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      await onUpdate(profile);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onUpdate({ password: newPassword, currentPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError('');
              await onDeleteAccount();
            } catch (err: any) {
              setError(err.message || 'Failed to delete account');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    column: {
      flex: 1,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    value: {
      fontSize: theme.typography.sizes.body,
      color: theme.colors.text.primary,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    dangerZone: {
      borderColor: theme.colors.status.error,
      borderWidth: 1,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    dangerTitle: {
      color: theme.colors.status.error,
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
  });

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
  ];

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Account Settings</Text>
          {!isEditing && (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="outline"
              leftIcon="edit"
            />
          )}
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Input
                label="First Name"
                value={profile.firstName}
                onChangeText={(value) => setProfile({ ...profile, firstName: value })}
                readOnly={!isEditing}
                style={styles.column}
              />
              <Input
                label="Last Name"
                value={profile.lastName}
                onChangeText={(value) => setProfile({ ...profile, lastName: value })}
                readOnly={!isEditing}
                style={styles.column}
              />
            </View>
            <Input
              label="Email"
              value={profile.email}
              onChangeText={(value) => setProfile({ ...profile, email: value })}
              readOnly={!isEditing}
              keyboardType="email-address"
            />
            <Input
              label="Phone"
              value={profile.phone}
              onChangeText={(value) => setProfile({ ...profile, phone: value })}
              readOnly={!isEditing}
              keyboardType="phone-pad"
            />
            <View style={styles.row}>
              <Input
                label="Department"
                value={profile.department}
                onChangeText={(value) => setProfile({ ...profile, department: value })}
                readOnly={!isEditing}
                style={styles.column}
              />
              <Input
                label="Job Title"
                value={profile.jobTitle}
                onChangeText={(value) => setProfile({ ...profile, jobTitle: value })}
                readOnly={!isEditing}
                style={styles.column}
              />
            </View>
            {isEditing && (
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    setProfile(userProfile);
                  }}
                  variant="outline"
                  style={styles.column}
                />
                <Button
                  title="Save Changes"
                  onPress={handleUpdateProfile}
                  loading={loading}
                  disabled={loading}
                  style={styles.column}
                />
              </View>
            )}
          </Card>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Two-Factor Authentication</Text>
                <Button
                  title={profile.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  onPress={() =>
                    setProfile({ ...profile, twoFactorEnabled: !profile.twoFactorEnabled })
                  }
                  variant={profile.twoFactorEnabled ? 'outline' : 'primary'}
                />
              </View>
            </View>
            <View style={[styles.row, { marginTop: theme.spacing.md }]}>
              <Input
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={styles.column}
              />
            </View>
            <View style={styles.row}>
              <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.column}
              />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.column}
              />
            </View>
            <Button
              title="Change Password"
              onPress={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            />
          </Card>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Select
                label="Language"
                value={profile.language}
                onValueChange={(value) => setProfile({ ...profile, language: value })}
                items={languageOptions}
                style={styles.column}
              />
              <Select
                label="Theme"
                value={profile.theme}
                onValueChange={(value) =>
                  setProfile({ ...profile, theme: value as 'light' | 'dark' | 'system' })
                }
                items={themeOptions}
                style={styles.column}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Notification Preferences</Text>
                <View style={{ gap: theme.spacing.sm }}>
                  <Button
                    title="Email Notifications"
                    onPress={() =>
                      setProfile({
                        ...profile,
                        notificationPreferences: {
                          ...profile.notificationPreferences,
                          email: !profile.notificationPreferences.email,
                        },
                      })
                    }
                    variant={profile.notificationPreferences.email ? 'primary' : 'outline'}
                    leftIcon="mail"
                  />
                  <Button
                    title="Push Notifications"
                    onPress={() =>
                      setProfile({
                        ...profile,
                        notificationPreferences: {
                          ...profile.notificationPreferences,
                          push: !profile.notificationPreferences.push,
                        },
                      })
                    }
                    variant={profile.notificationPreferences.push ? 'primary' : 'outline'}
                    leftIcon="notifications"
                  />
                  <Button
                    title="SMS Notifications"
                    onPress={() =>
                      setProfile({
                        ...profile,
                        notificationPreferences: {
                          ...profile.notificationPreferences,
                          sms: !profile.notificationPreferences.sms,
                        },
                      })
                    }
                    variant={profile.notificationPreferences.sms ? 'primary' : 'outline'}
                    leftIcon="chatbubble"
                  />
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Date Joined</Text>
                <Text style={styles.value}>{new Date(profile.dateJoined).toLocaleDateString()}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Last Login</Text>
                <Text style={styles.value}>{new Date(profile.lastLogin).toLocaleDateString()}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Session Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Management</Text>
          <Card style={styles.card}>
            <Button
              title="Sign Out"
              onPress={onLogout}
              variant="outline"
              leftIcon="log-out"
            />
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Text style={[styles.label, { marginBottom: theme.spacing.md }]}>
            Once you delete your account, there is no going back. Please be certain.
          </Text>
          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            variant="outline"
            leftIcon="trash"
            style={{ borderColor: theme.colors.status.error, borderWidth: 1 }}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </View>
  );
} 