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

// Update Input props to use readOnly instead of disabled
<Input
  label="First Name"
  value={profile.firstName}
  onChangeText={(value) => setProfile({ ...profile, firstName: value })}
  readOnly={!isEditing}
  style={styles.column}
/>

// Update the Delete Account button variant
<Button
  title="Delete Account"
  onPress={handleDeleteAccount}
  variant="outline"
  leftIcon="trash"
  style={{ borderColor: theme.colors.status.error, borderWidth: 1 }}
/> 