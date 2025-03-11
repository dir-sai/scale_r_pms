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
  NetworkPolicy,
  IPWhitelistEntry,
  RateLimitPolicy,
} from '../../lib/services/SecurityService';

interface NetworkSecurityProps {
  userId: string;
  isAdmin: boolean;
}

export function NetworkSecurity({ userId, isAdmin }: NetworkSecurityProps) {
  const theme = useTheme();
  const [networkPolicy, setNetworkPolicy] = useState<NetworkPolicy | null>(null);
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelistEntry[]>([]);
  const [threatIntel, setThreatIntel] = useState<{
    knownThreats: Array<{
      type: string;
      indicator: string;
      confidence: number;
      lastSeen: string;
    }>;
    activeBlocks: Array<{
      ip: string;
      reason: string;
      blockedSince: string;
    }>;
    recentAttacks: Array<{
      timestamp: string;
      type: string;
      source: string;
      target: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newIpEntry, setNewIpEntry] = useState({
    ipAddress: '',
    description: '',
    expiresAt: '',
  });

  useEffect(() => {
    loadNetworkSecurityData();
  }, []);

  const loadNetworkSecurityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [policy, whitelist, intel] = await Promise.all([
        SecurityService.getSecurityPolicy(),
        SecurityService.getIPWhitelist(),
        SecurityService.getThreatIntelligence(),
      ]);
      setNetworkPolicy(policy.networkPolicy);
      setIpWhitelist(whitelist);
      setThreatIntel(intel);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIPToWhitelist = async () => {
    try {
      const entry = await SecurityService.addIPToWhitelist(newIpEntry);
      setIpWhitelist(prev => [entry, ...prev]);
      setNewIpEntry({ ipAddress: '', description: '', expiresAt: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveIPFromWhitelist = async (id: string) => {
    try {
      await SecurityService.removeIPFromWhitelist(id);
      setIpWhitelist(prev => prev.filter(entry => entry.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUnblockIP = async (ip: string) => {
    try {
      await SecurityService.unblockIP(ip);
      setThreatIntel(prev => prev ? {
        ...prev,
        activeBlocks: prev.activeBlocks.filter(block => block.ip !== ip),
      } : null);
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
    input: {
      flex: 1,
      marginLeft: theme.spacing.md,
    } as ViewStyle,
    threatEntry: {
      padding: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    } as ViewStyle,
    threatType: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.sizes.small,
    } as TextStyle,
    confidence: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.status.success,
    } as TextStyle,
    timestamp: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    } as TextStyle,
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading network security settings...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>You don't have permission to view network security settings.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error && <Text style={styles.error}>{error}</Text>}

      {networkPolicy && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IP Whitelisting</Text>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Enable IP Whitelisting</Text>
                <Switch
                  value={networkPolicy.ipWhitelisting.enabled}
                  onValueChange={value =>
                    setNetworkPolicy(prev => prev ? {
                      ...prev,
                      ipWhitelisting: {
                        ...prev.ipWhitelisting,
                        enabled: value,
                      },
                    } : null)
                  }
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Allow Default Access</Text>
                <Switch
                  value={networkPolicy.ipWhitelisting.allowDefaultAccess}
                  onValueChange={value =>
                    setNetworkPolicy(prev => prev ? {
                      ...prev,
                      ipWhitelisting: {
                        ...prev.ipWhitelisting,
                        allowDefaultAccess: value,
                      },
                    } : null)
                  }
                />
              </View>

              <View style={{ marginTop: theme.spacing.md }}>
                <Text style={styles.label}>Add IP to Whitelist</Text>
                <View style={styles.row}>
                  <TextInput
                    placeholder="IP Address"
                    value={newIpEntry.ipAddress}
                    onChangeText={value =>
                      setNewIpEntry(prev => ({ ...prev, ipAddress: value }))
                    }
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Description"
                    value={newIpEntry.description}
                    onChangeText={value =>
                      setNewIpEntry(prev => ({ ...prev, description: value }))
                    }
                    style={styles.input}
                  />
                  <Button
                    title="Add"
                    onPress={handleAddIPToWhitelist}
                    disabled={!newIpEntry.ipAddress || !newIpEntry.description}
                  />
                </View>
              </View>

              {ipWhitelist.map(entry => (
                <View key={entry.id} style={styles.row}>
                  <View>
                    <Text>{entry.ipAddress}</Text>
                    <Text style={styles.threatType}>{entry.description}</Text>
                    {entry.expiresAt && (
                      <Text style={styles.timestamp}>
                        Expires: {new Date(entry.expiresAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  <Button
                    title="Remove"
                    variant="outline"
                    size="sm"
                    onPress={() => handleRemoveIPFromWhitelist(entry.id)}
                  />
                </View>
              ))}
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate Limiting</Text>
            <Card style={styles.card}>
              {Object.entries(networkPolicy.rateLimiting).map(([type, policy]) => (
                <View key={type} style={{ marginBottom: theme.spacing.lg }}>
                  <Text style={[styles.label, { marginBottom: theme.spacing.sm }]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Rate Limiting
                  </Text>
                  <View style={styles.row}>
                    <Text>Enable</Text>
                    <Switch
                      value={policy.enabled}
                      onValueChange={value =>
                        setNetworkPolicy(prev => prev ? {
                          ...prev,
                          rateLimiting: {
                            ...prev.rateLimiting,
                            [type]: {
                              ...prev.rateLimiting[type as keyof NetworkPolicy['rateLimiting']],
                              enabled: value,
                            },
                          },
                        } : null)
                      }
                    />
                  </View>
                  {policy.enabled && (
                    <>
                      <View style={styles.row}>
                        <Text>Max Attempts</Text>
                        <TextInput
                          value={policy.maxAttempts.toString()}
                          onChangeText={value =>
                            setNetworkPolicy(prev => prev ? {
                              ...prev,
                              rateLimiting: {
                                ...prev.rateLimiting,
                                [type]: {
                                  ...prev.rateLimiting[type as keyof NetworkPolicy['rateLimiting']],
                                  maxAttempts: parseInt(value) || 0,
                                },
                              },
                            } : null)
                          }
                          keyboardType="numeric"
                          style={{ width: 80 }}
                        />
                      </View>
                      <View style={styles.row}>
                        <Text>Time Window (minutes)</Text>
                        <TextInput
                          value={policy.timeWindow.toString()}
                          onChangeText={value =>
                            setNetworkPolicy(prev => prev ? {
                              ...prev,
                              rateLimiting: {
                                ...prev.rateLimiting,
                                [type]: {
                                  ...prev.rateLimiting[type as keyof NetworkPolicy['rateLimiting']],
                                  timeWindow: parseInt(value) || 0,
                                },
                              },
                            } : null)
                          }
                          keyboardType="numeric"
                          style={{ width: 80 }}
                        />
                      </View>
                    </>
                  )}
                </View>
              ))}
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Geofencing</Text>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Enable Geofencing</Text>
                <Switch
                  value={networkPolicy.geofencing.enabled}
                  onValueChange={value =>
                    setNetworkPolicy(prev => prev ? {
                      ...prev,
                      geofencing: {
                        ...prev.geofencing,
                        enabled: value,
                      },
                    } : null)
                  }
                />
              </View>
              {networkPolicy.geofencing.enabled && (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Block Tor Nodes</Text>
                    <Switch
                      value={networkPolicy.geofencing.blockTorNodes}
                      onValueChange={value =>
                        setNetworkPolicy(prev => prev ? {
                          ...prev,
                          geofencing: {
                            ...prev.geofencing,
                            blockTorNodes: value,
                          },
                        } : null)
                      }
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Block VPNs</Text>
                    <Switch
                      value={networkPolicy.geofencing.blockVPNs}
                      onValueChange={value =>
                        setNetworkPolicy(prev => prev ? {
                          ...prev,
                          geofencing: {
                            ...prev.geofencing,
                            blockVPNs: value,
                          },
                        } : null)
                      }
                    />
                  </View>
                </>
              )}
            </Card>
          </View>
        </>
      )}

      {threatIntel && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Threat Intelligence</Text>
          <Card style={styles.card}>
            <Text style={[styles.label, { marginBottom: theme.spacing.md }]}>
              Active Blocks
            </Text>
            {threatIntel.activeBlocks.map((block, index) => (
              <View key={index} style={styles.threatEntry}>
                <View style={styles.row}>
                  <View>
                    <Text>{block.ip}</Text>
                    <Text style={styles.threatType}>{block.reason}</Text>
                    <Text style={styles.timestamp}>
                      Blocked since: {new Date(block.blockedSince).toLocaleString()}
                    </Text>
                  </View>
                  <Button
                    title="Unblock"
                    variant="outline"
                    size="sm"
                    onPress={() => handleUnblockIP(block.ip)}
                  />
                </View>
              </View>
            ))}

            <Text style={[styles.label, { margin: theme.spacing.md }]}>
              Recent Attacks
            </Text>
            {threatIntel.recentAttacks.map((attack, index) => (
              <View key={index} style={styles.threatEntry}>
                <Text style={styles.threatType}>{attack.type}</Text>
                <Text>
                  From: {attack.source} To: {attack.target}
                </Text>
                <Text style={styles.timestamp}>
                  {new Date(attack.timestamp).toLocaleString()}
                </Text>
              </View>
            ))}

            <Text style={[styles.label, { margin: theme.spacing.md }]}>
              Known Threats
            </Text>
            {threatIntel.knownThreats.map((threat, index) => (
              <View key={index} style={styles.threatEntry}>
                <Text style={styles.threatType}>{threat.type}</Text>
                <Text>{threat.indicator}</Text>
                <View style={styles.row}>
                  <Text style={styles.confidence}>
                    Confidence: {(threat.confidence * 100).toFixed(1)}%
                  </Text>
                  <Text style={styles.timestamp}>
                    Last seen: {new Date(threat.lastSeen).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </View>
      )}
    </ScrollView>
  );
} 