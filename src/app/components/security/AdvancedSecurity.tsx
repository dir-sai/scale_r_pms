import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { Switch } from '../Switch';
import { Select } from '../Select';
import {
  SecurityService,
  WAFConfig,
  WAFRule,
  DDoSConfig,
  CertificateInfo,
  SecurityHeaders,
  MLThreatDetection,
} from '../../lib/services/SecurityService';

interface AdvancedSecurityProps {
  userId: string;
  isAdmin: boolean;
}

export function AdvancedSecurity({ userId, isAdmin }: AdvancedSecurityProps) {
  const theme = useTheme();
  const [wafConfig, setWafConfig] = useState<WAFConfig | null>(null);
  const [ddosConfig, setDdosConfig] = useState<DDoSConfig | null>(null);
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [securityHeaders, setSecurityHeaders] = useState<SecurityHeaders | null>(null);
  const [mlConfig, setMlConfig] = useState<MLThreatDetection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdvancedSecurityData();
  }, []);

  const loadAdvancedSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [waf, ddos, certs, headers, ml] = await Promise.all([
        SecurityService.getWAFConfig(),
        SecurityService.getDDoSConfig(),
        SecurityService.getCertificates(),
        SecurityService.getSecurityHeaders(),
        SecurityService.getMLDetectionConfig(),
      ]);
      setWafConfig(waf);
      setDdosConfig(ddos);
      setCertificates(certs);
      setSecurityHeaders(headers);
      setMlConfig(ml);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWAFRuleUpdate = async (rule: WAFRule) => {
    try {
      await SecurityService.updateWAFRule(rule);
      const updatedConfig = await SecurityService.getWAFConfig();
      setWafConfig(updatedConfig);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDDoSConfigUpdate = async (config: Partial<DDoSConfig>) => {
    try {
      await SecurityService.updateDDoSConfig(config);
      const updatedConfig = await SecurityService.getDDoSConfig();
      setDdosConfig(updatedConfig);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCertificateRenewal = async (id: string) => {
    try {
      await SecurityService.renewCertificate(id);
      const updatedCerts = await SecurityService.getCertificates();
      setCertificates(updatedCerts);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleHeadersUpdate = async (headers: Partial<SecurityHeaders>) => {
    try {
      await SecurityService.updateSecurityHeaders(headers);
      const updatedHeaders = await SecurityService.getSecurityHeaders();
      setSecurityHeaders(updatedHeaders);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMLModelTraining = async (modelId: string) => {
    try {
      await SecurityService.trainMLModel(modelId);
      const updatedConfig = await SecurityService.getMLDetectionConfig();
      setMlConfig(updatedConfig);
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
    certificate: {
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    } as ViewStyle,
    certStatus: {
      fontSize: theme.typography.sizes.small,
      marginTop: theme.spacing.xs,
    } as TextStyle,
    modelMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.sm,
    } as ViewStyle,
    metric: {
      alignItems: 'center',
    } as ViewStyle,
    metricValue: {
      fontSize: theme.typography.sizes.h4,
      fontWeight: theme.typography.weights.bold as TextStyle['fontWeight'],
      color: theme.colors.primary,
    } as TextStyle,
    metricLabel: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    } as TextStyle,
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading advanced security settings...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>You don't have permission to view advanced security settings.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && <Text style={styles.error}>{error}</Text>}

      {wafConfig && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Web Application Firewall</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Enable WAF</Text>
              <Switch
                value={wafConfig.enabled}
                onValueChange={value =>
                  setWafConfig(prev => prev ? { ...prev, enabled: value } : null)
                }
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mode</Text>
              <Select
                value={wafConfig.mode}
                options={[
                  { label: 'Detection', value: 'detection' },
                  { label: 'Prevention', value: 'prevention' },
                ]}
                onChange={value =>
                  setWafConfig(prev => prev ? { ...prev, mode: value as WAFConfig['mode'] } : null)
                }
              />
            </View>
            {wafConfig.rules.map(rule => (
              <View key={rule.id} style={styles.row}>
                <View>
                  <Text style={styles.label}>{rule.name}</Text>
                  <Text style={styles.metricLabel}>{rule.type}</Text>
                </View>
                <Switch
                  value={rule.enabled}
                  onValueChange={value => handleWAFRuleUpdate({ ...rule, enabled: value })}
                />
              </View>
            ))}
          </Card>
        </View>
      )}

      {ddosConfig && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DDoS Protection</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Enable Protection</Text>
              <Switch
                value={ddosConfig.enabled}
                onValueChange={value =>
                  handleDDoSConfigUpdate({ enabled: value })
                }
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Auto-Scale</Text>
              <Switch
                value={ddosConfig.autoScale}
                onValueChange={value =>
                  handleDDoSConfigUpdate({ autoScale: value })
                }
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Request Rate Limit</Text>
              <TextInput
                value={ddosConfig.thresholds.requestRate.toString()}
                onChangeText={value =>
                  handleDDoSConfigUpdate({
                    thresholds: {
                      ...ddosConfig.thresholds,
                      requestRate: parseInt(value) || 0,
                    },
                  })
                }
                keyboardType="numeric"
                style={{ width: 80 }}
              />
            </View>
          </Card>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SSL/TLS Certificates</Text>
        <Card style={styles.card}>
          {certificates.map(cert => (
            <View key={cert.id} style={styles.certificate}>
              <Text style={styles.label}>{cert.domain}</Text>
              <Text
                style={[
                  styles.certStatus,
                  {
                    color:
                      cert.status === 'active'
                        ? theme.colors.status.success
                        : theme.colors.status.error,
                  },
                ]}
              >
                {cert.status.toUpperCase()}
              </Text>
              <Text style={styles.metricLabel}>
                Expires: {new Date(cert.validTo).toLocaleDateString()}
              </Text>
              {cert.status === 'active' && new Date(cert.validTo) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                <Button
                  title="Renew"
                  variant="outline"
                  size="sm"
                  onPress={() => handleCertificateRenewal(cert.id)}
                />
              )}
            </View>
          ))}
        </Card>
      </View>

      {securityHeaders && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Headers</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Content Security Policy</Text>
              <Switch
                value={securityHeaders.csp.enabled}
                onValueChange={value =>
                  handleHeadersUpdate({
                    csp: { ...securityHeaders.csp, enabled: value },
                  })
                }
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>X-Frame-Options</Text>
              <Select
                value={securityHeaders.xFrameOptions}
                options={[
                  { label: 'DENY', value: 'DENY' },
                  { label: 'SAMEORIGIN', value: 'SAMEORIGIN' },
                ]}
                onChange={value =>
                  handleHeadersUpdate({ xFrameOptions: value })
                }
              />
            </View>
          </Card>
        </View>
      )}

      {mlConfig && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ML-Based Threat Detection</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Enable ML Detection</Text>
              <Switch
                value={mlConfig.enabled}
                onValueChange={value =>
                  setMlConfig(prev => prev ? { ...prev, enabled: value } : null)
                }
              />
            </View>
            {mlConfig.models.map(model => (
              <View key={model.id} style={styles.card}>
                <Text style={styles.label}>{model.type} Model</Text>
                <View style={styles.modelMetrics}>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>
                      {(model.performance.accuracy * 100).toFixed(1)}%
                    </Text>
                    <Text style={styles.metricLabel}>Accuracy</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{model.performance.falsePositives}</Text>
                    <Text style={styles.metricLabel}>False Positives</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{model.performance.falseNegatives}</Text>
                    <Text style={styles.metricLabel}>False Negatives</Text>
                  </View>
                </View>
                <Button
                  title="Retrain Model"
                  variant="outline"
                  onPress={() => handleMLModelTraining(model.id)}
                  style={{ marginTop: theme.spacing.sm }}
                />
              </View>
            ))}
          </Card>
        </View>
      )}
    </ScrollView>
  );
} 