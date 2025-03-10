import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { SecurityService, BackupConfig, MFAConfig } from '../../lib/services/SecurityService';

interface SecuritySettingsProps {
  userId: string;
  isAdmin: boolean;
}

export function SecuritySettings({ userId, isAdmin }: SecuritySettingsProps) {
  // ... existing code ...

  // Update the Select component's onChange handler with proper type annotation
  <Select
    value={mfaConfig.type}
    options={[
      { label: 'Authenticator App', value: 'authenticator' },
      { label: 'SMS', value: 'sms' },
      { label: 'Email', value: 'email' },
    ]}
    onChange={(value: string) => setMfaConfig(prev => ({ ...prev, type: value as MFAConfig['type'] }))}
  />

  // ... rest of the existing code ...
} 