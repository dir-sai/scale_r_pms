import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { Button } from '../Button';
import { Select } from '../Select';
import { useTenant } from '../../../hooks/useTenant';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  types: {
    id: string;
    title: string;
    description: string;
  }[];
}

interface NotificationPreferences {
  categories: {
    [categoryId: string]: {
      enabled: boolean;
      types: {
        [typeId: string]: {
          email: boolean;
          push: boolean;
          sms: boolean;
          frequency?: 'immediate' | 'daily' | 'weekly';
          quiet_hours?: {
            enabled: boolean;
            start: string;
            end: string;
          };
        };
      };
    };
  };
}

const defaultCategories: NotificationCategory[] = [
  {
    id: 'payments',
    title: 'Payments',
    description: 'Notifications related to rent payments, invoices, and receipts',
    types: [
      {
        id: 'payment_due',
        title: 'Payment Due',
        description: 'Reminders when rent or other payments are due',
      },
      {
        id: 'payment_confirmation',
        title: 'Payment Confirmation',
        description: 'Confirmations when payments are processed',
      },
      {
        id: 'payment_failed',
        title: 'Payment Failed',
        description: 'Alerts when payments fail or are declined',
      },
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'Updates about maintenance requests and scheduled work',
    types: [
      {
        id: 'maintenance_request',
        title: 'Request Updates',
        description: 'Status updates for maintenance requests',
      },
      {
        id: 'maintenance_scheduled',
        title: 'Scheduled Maintenance',
        description: 'Notifications about upcoming maintenance work',
      },
    ],
  },
  {
    id: 'lease',
    title: 'Lease',
    description: 'Important information about your lease agreement',
    types: [
      {
        id: 'lease_expiry',
        title: 'Lease Expiration',
        description: 'Reminders about lease expiration and renewal',
      },
      {
        id: 'lease_updates',
        title: 'Lease Updates',
        description: 'Changes or updates to your lease agreement',
      },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Notifications about document uploads and updates',
    types: [
      {
        id: 'document_shared',
        title: 'Shared Documents',
        description: 'When new documents are shared with you',
      },
      {
        id: 'document_expiring',
        title: 'Document Expiration',
        description: 'Reminders about expiring documents',
      },
    ],
  },
];

export function NotificationPreferences() {
  const theme = useTheme();
  const { selectedTenant, updateTenant } = useTenant();
  const [preferences, setPreferences] = useState<NotificationPreferences>({ categories: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    card: {
      marginBottom: theme.spacing.md,
    },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    categoryTitle: {
      fontSize: theme.typography.sizes.h4,
      fontWeight: theme.typography.weights.medium,
    },
    description: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    typeContainer: {
      marginLeft: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    typeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    typeTitle: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
    },
    channelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    channelLabel: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    frequencyContainer: {
      marginTop: theme.spacing.sm,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
  });

  useEffect(() => {
    if (selectedTenant?.notificationPreferences) {
      setPreferences(selectedTenant.notificationPreferences);
    } else {
      // Initialize default preferences
      const defaultPrefs: NotificationPreferences = { categories: {} };
      defaultCategories.forEach(category => {
        defaultPrefs.categories[category.id] = {
          enabled: true,
          types: {},
        };
        category.types.forEach(type => {
          defaultPrefs.categories[category.id].types[type.id] = {
            email: true,
            push: true,
            sms: false,
            frequency: 'immediate',
          };
        });
      });
      setPreferences(defaultPrefs);
    }
  }, [selectedTenant]);

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setPreferences(prev => ({
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          enabled,
        },
      },
    }));
  };

  const handleTypeChannelToggle = (
    categoryId: string,
    typeId: string,
    channel: 'email' | 'push' | 'sms',
    enabled: boolean
  ) => {
    setPreferences(prev => ({
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          types: {
            ...prev.categories[categoryId].types,
            [typeId]: {
              ...prev.categories[categoryId].types[typeId],
              [channel]: enabled,
            },
          },
        },
      },
    }));
  };

  const handleFrequencyChange = (
    categoryId: string,
    typeId: string,
    frequency: 'immediate' | 'daily' | 'weekly'
  ) => {
    setPreferences(prev => ({
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          types: {
            ...prev.categories[categoryId].types,
            [typeId]: {
              ...prev.categories[categoryId].types[typeId],
              frequency,
            },
          },
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedTenant) return;
    
    setLoading(true);
    setError(undefined);
    
    try {
      await updateTenant(selectedTenant.id, {
        notificationPreferences: preferences,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}

      {defaultCategories.map(category => (
        <Card key={category.id} style={styles.card}>
          <View style={styles.categoryHeader}>
            <View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.description}>{category.description}</Text>
            </View>
            <Switch
              value={preferences.categories[category.id]?.enabled ?? true}
              onValueChange={(enabled) => handleCategoryToggle(category.id, enabled)}
            />
          </View>

          {preferences.categories[category.id]?.enabled && category.types.map(type => (
            <View key={type.id} style={styles.typeContainer}>
              <View style={styles.typeHeader}>
                <Text style={styles.typeTitle}>{type.title}</Text>
              </View>
              <Text style={styles.description}>{type.description}</Text>

              <View style={styles.channelContainer}>
                <Switch
                  value={preferences.categories[category.id]?.types[type.id]?.email ?? true}
                  onValueChange={(enabled) => 
                    handleTypeChannelToggle(category.id, type.id, 'email', enabled)
                  }
                />
                <Text style={styles.channelLabel}>Email</Text>
              </View>

              <View style={styles.channelContainer}>
                <Switch
                  value={preferences.categories[category.id]?.types[type.id]?.push ?? true}
                  onValueChange={(enabled) =>
                    handleTypeChannelToggle(category.id, type.id, 'push', enabled)
                  }
                />
                <Text style={styles.channelLabel}>Push Notifications</Text>
              </View>

              <View style={styles.channelContainer}>
                <Switch
                  value={preferences.categories[category.id]?.types[type.id]?.sms ?? false}
                  onValueChange={(enabled) =>
                    handleTypeChannelToggle(category.id, type.id, 'sms', enabled)
                  }
                />
                <Text style={styles.channelLabel}>SMS</Text>
              </View>

              <View style={styles.frequencyContainer}>
                <Select
                  label="Frequency"
                  value={preferences.categories[category.id]?.types[type.id]?.frequency ?? 'immediate'}
                  onValueChange={(value) =>
                    handleFrequencyChange(category.id, type.id, value as 'immediate' | 'daily' | 'weekly')
                  }
                  items={[
                    { label: 'Immediate', value: 'immediate' },
                    { label: 'Daily Summary', value: 'daily' },
                    { label: 'Weekly Summary', value: 'weekly' },
                  ]}
                />
              </View>
            </View>
          ))}
        </Card>
      ))}

      <Button
        title={loading ? 'Saving...' : 'Save Preferences'}
        onPress={handleSave}
        disabled={loading}
        style={{ marginBottom: theme.spacing.xl }}
      />
    </ScrollView>
  );
} 