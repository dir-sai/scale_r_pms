import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { TextInput } from '../TextInput';
import { SecurityService, SecurityPolicy } from '../../lib/services/SecurityService';

interface SecurityPoliciesProps {
  userId: string;
  isAdmin: boolean;
}

export function SecurityPolicies({ userId, isAdmin }: SecurityPoliciesProps) {
  const theme = useTheme();
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [metrics, setMetrics] = useState<{
    failedLoginAttempts: number;
    mfaAdoption: number;
    averagePasswordStrength: number;
    activeSessionsCount: number;
    incidentCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadPolicyAndMetrics();
  }, []);

  const loadPolicyAndMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [policyData, metricsData] = await Promise.all([
        SecurityService.getSecurityPolicy(),
        SecurityService.getSecurityMetrics(),
      ]);
      setPolicy(policyData);
      setMetrics(metricsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePolicyUpdate = async () => {
    if (!policy) return;
    try {
      setSaving(true);
      setError(null);
      await SecurityService.updateSecurityPolicy(policy);
      // Show success message
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = async (type: 'gdpr' | 'hipaa' | 'sox') => {
    try {
      setGeneratingReport(true);
      setError(null);
      const report = await SecurityService.generateComplianceReport(type);
      // Open report URL
      window.open(report.url, '_blank');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGeneratingReport(false);
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
    metric: {
      alignItems: 'center',
      padding: theme.spacing.md,
    } as ViewStyle,
    metricValue: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold as TextStyle['fontWeight'],
      color: theme.colors.primary,
    } as TextStyle,
    metricLabel: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    } as TextStyle,
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading security policies...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>You don't have permission to view security policies.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Metrics</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -theme.spacing.xs }}>
          {metrics && (
            <>
              <Card style={[styles.metric, { flex: 1, margin: theme.spacing.xs }]}>
                <Text style={styles.metricValue}>{metrics.mfaAdoption}%</Text>
                <Text style={styles.metricLabel}>MFA Adoption</Text>
              </Card>
              <Card style={[styles.metric, { flex: 1, margin: theme.spacing.xs }]}>
                <Text style={styles.metricValue}>{metrics.activeSessionsCount}</Text>
                <Text style={styles.metricLabel}>Active Sessions</Text>
              </Card>
              <Card style={[styles.metric, { flex: 1, margin: theme.spacing.xs }]}>
                <Text style={styles.metricValue}>{metrics.failedLoginAttempts}</Text>
                <Text style={styles.metricLabel}>Failed Logins (24h)</Text>
              </Card>
              <Card style={[styles.metric, { flex: 1, margin: theme.spacing.xs }]}>
                <Text style={styles.metricValue}>{metrics.incidentCount}</Text>
                <Text style={styles.metricLabel}>Security Incidents</Text>
              </Card>
            </>
          )}
        </View>
      </View>

      {policy && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Password Policy</Text>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Minimum Length</Text>
                <TextInput
                  value={policy.passwordPolicy.minLength.toString()}
                  onChangeText={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      passwordPolicy: {
                        ...prev!.passwordPolicy,
                        minLength: parseInt(value) || 0,
                      },
                    }))
                  }
                  keyboardType="numeric"
                  style={{ width: 80 }}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Require Uppercase</Text>
                <Switch
                  value={policy.passwordPolicy.requireUppercase}
                  onValueChange={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      passwordPolicy: {
                        ...prev!.passwordPolicy,
                        requireUppercase: value,
                      },
                    }))
                  }
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Password Age (days)</Text>
                <TextInput
                  value={policy.passwordPolicy.maxAge.toString()}
                  onChangeText={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      passwordPolicy: {
                        ...prev!.passwordPolicy,
                        maxAge: parseInt(value) || 0,
                      },
                    }))
                  }
                  keyboardType="numeric"
                  style={{ width: 80 }}
                />
              </View>
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Policy</Text>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Max Duration (minutes)</Text>
                <TextInput
                  value={policy.sessionPolicy.maxDuration.toString()}
                  onChangeText={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      sessionPolicy: {
                        ...prev!.sessionPolicy,
                        maxDuration: parseInt(value) || 0,
                      },
                    }))
                  }
                  keyboardType="numeric"
                  style={{ width: 80 }}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Inactivity Timeout (minutes)</Text>
                <TextInput
                  value={policy.sessionPolicy.inactivityTimeout.toString()}
                  onChangeText={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      sessionPolicy: {
                        ...prev!.sessionPolicy,
                        inactivityTimeout: parseInt(value) || 0,
                      },
                    }))
                  }
                  keyboardType="numeric"
                  style={{ width: 80 }}
                />
              </View>
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MFA Policy</Text>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Require MFA</Text>
                <Switch
                  value={policy.mfaPolicy.required}
                  onValueChange={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      mfaPolicy: {
                        ...prev!.mfaPolicy,
                        required: value,
                      },
                    }))
                  }
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Remember Device (days)</Text>
                <TextInput
                  value={policy.mfaPolicy.rememberDuration.toString()}
                  onChangeText={value =>
                    setPolicy(prev => ({
                      ...prev!,
                      mfaPolicy: {
                        ...prev!.mfaPolicy,
                        rememberDuration: parseInt(value) || 0,
                      },
                    }))
                  }
                  keyboardType="numeric"
                  style={{ width: 80 }}
                />
              </View>
            </Card>
          </View>

          <Button
            title="Save Policy Changes"
            onPress={handlePolicyUpdate}
            loading={saving}
            style={{ marginBottom: theme.spacing.lg }}
          />
        </>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compliance Reports</Text>
        <Card style={styles.card}>
          <View style={{ gap: theme.spacing.sm }}>
            <Button
              title="Generate GDPR Report"
              variant="outline"
              onPress={() => handleGenerateReport('gdpr')}
              loading={generatingReport}
            />
            <Button
              title="Generate HIPAA Report"
              variant="outline"
              onPress={() => handleGenerateReport('hipaa')}
              loading={generatingReport}
            />
            <Button
              title="Generate SOX Report"
              variant="outline"
              onPress={() => handleGenerateReport('sox')}
              loading={generatingReport}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
} 