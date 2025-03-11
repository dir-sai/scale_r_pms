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
  const theme = useTheme();
  const [mfaConfig, setMfaConfig] = useState<MFAConfig>({
    enabled: false,
    type: 'authenticator',
    verified: false,
  });
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    frequency: 'daily',
    retention: 30,
    encryptionEnabled: true,
  });
  const [backups, setBackups] = useState<Array<{
    id: string;
    timestamp: string;
    size: number;
    status: 'completed' | 'failed';
  }>>([]);
  const [auditLog, setAuditLog] = useState<Array<{
    timestamp: string;
    action: string;
    userId: string;
    resource: string;
    status: 'success' | 'failure';
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [backupsList, auditLogData] = await Promise.all([
        SecurityService.getBackupsList(),
        SecurityService.getSecurityAuditLog(),
      ]);
      setBackups(backupsList);
      setAuditLog(auditLogData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMFAToggle = async () => {
    try {
      if (!mfaConfig.enabled) {
        const result = await SecurityService.setupMFA(mfaConfig.type);
        // Handle MFA setup UI (show QR code, etc.)
      } else {
        // Handle MFA disable flow
      }
      setMfaConfig(prev => ({ ...prev, enabled: !prev.enabled }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBackupConfigSave = async () => {
    try {
      await SecurityService.configureBackups(backupConfig);
      // Show success message
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleManualBackup = async () => {
    try {
      await SecurityService.initiateBackup();
      const backupsList = await SecurityService.getBackupsList();
      setBackups(backupsList);
      // Show success message
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    try {
      await SecurityService.restoreFromBackup(backupId);
      // Show success message
    } catch (err: any) {
      setError(err.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    } as ViewStyle,
    content: {
      padding: theme.spacing.md,
    } as ViewStyle,
    section: {
      marginBottom: theme.spacing.xl,
    } as ViewStyle,
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.semibold as TextStyle['fontWeight'],
      marginBottom: theme.spacing.md,
    } as TextStyle,
    card: {
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    } as ViewStyle,
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    } as ViewStyle,
    label: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium as TextStyle['fontWeight'],
    } as TextStyle,
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    } as TextStyle,
    logEntry: {
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    } as ViewStyle,
    timestamp: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    } as TextStyle,
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading security settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Multi-Factor Authentication</Text>
        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Enable MFA</Text>
            <Switch value={mfaConfig.enabled} onValueChange={handleMFAToggle} />
          </View>
          {mfaConfig.enabled && (
            <Select
              value={mfaConfig.type}
              options={[
                { label: 'Authenticator App', value: 'authenticator' },
                { label: 'SMS', value: 'sms' },
                { label: 'Email', value: 'email' },
              ]}
              onChange={type => setMfaConfig(prev => ({ ...prev, type: type as MFAConfig['type'] }))}
            />
          )}
        </Card>
      </View>

      {isAdmin && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backup Configuration</Text>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Backup Frequency</Text>
                <Select
                  value={backupConfig.frequency}
                  options={[
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                  ]}
                  onChange={frequency =>
                    setBackupConfig(prev => ({
                      ...prev,
                      frequency: frequency as BackupConfig['frequency'],
                    }))
                  }
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Encrypt Backups</Text>
                <Switch
                  value={backupConfig.encryptionEnabled}
                  onValueChange={value =>
                    setBackupConfig(prev => ({ ...prev, encryptionEnabled: value }))
                  }
                />
              </View>
              <Button title="Save Configuration" onPress={handleBackupConfigSave} />
              <Button
                title="Create Manual Backup"
                variant="outline"
                onPress={handleManualBackup}
                style={{ marginTop: theme.spacing.sm }}
              />
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Backup History</Text>
            <Card style={styles.card}>
              {backups.map(backup => (
                <View key={backup.id} style={styles.row}>
                  <View>
                    <Text style={styles.label}>
                      {new Date(backup.timestamp).toLocaleDateString()}
                    </Text>
                    <Text style={styles.timestamp}>
                      Size: {(backup.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </View>
                  <Button
                    title="Restore"
                    variant="outline"
                    size="sm"
                    onPress={() => handleRestoreBackup(backup.id)}
                    disabled={backup.status === 'failed'}
                  />
                </View>
              ))}
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Audit Log</Text>
            <Card style={styles.card}>
              {auditLog.map((entry, index) => (
                <View key={index} style={styles.logEntry}>
                  <Text style={styles.timestamp}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </Text>
                  <Text>
                    {entry.action} - {entry.resource}
                  </Text>
                  <Text
                    style={{
                      color:
                        entry.status === 'success'
                          ? theme.colors.status.success
                          : theme.colors.status.error,
                    }}
                  >
                    {entry.status}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        </>
      )}
    </ScrollView>
  );
} 