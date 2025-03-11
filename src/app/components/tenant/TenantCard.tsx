import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Tenant } from '../../../types/tenant';
import { Text } from '../Text';
import { Card } from '../Card';
import { useTheme } from '../../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: theme.spacing.md,
    },
    info: {
      flex: 1,
    },
    status: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
    },
    details: {
      marginTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.secondary,
      paddingTop: theme.spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    detailIcon: {
      marginRight: theme.spacing.sm,
      width: 20,
    },
    leaseInfo: {
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
  });

  const getStatusColor = (status: Tenant['status']) => {
    switch (status) {
      case 'active':
        return theme.colors.status.success;
      case 'inactive':
        return theme.colors.status.error;
      case 'pending':
        return theme.colors.status.warning;
      case 'blacklisted':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const handlePress = () => {
    router.push(`/tenants/${tenant.id}`);
  };

  const activeLease = tenant.leases.find(lease => lease.status === 'active');

  return (
    <Pressable onPress={handlePress}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={{ uri: tenant.photo || 'https://via.placeholder.com/60' }}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text variant="h3" weight="bold">
                {tenant.firstName} {tenant.lastName}
              </Text>
              <View
                style={[
                  styles.status,
                  { backgroundColor: getStatusColor(tenant.status) },
                ]}
              >
                <Text variant="small" color={theme.colors.text.light}>
                  {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="mail"
                  size={16}
                  color={theme.colors.text.secondary}
                />
              </View>
              <Text variant="body" color={theme.colors.text.secondary}>
                {tenant.email}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="call"
                  size={16}
                  color={theme.colors.text.secondary}
                />
              </View>
              <Text variant="body" color={theme.colors.text.secondary}>
                {tenant.phone}
              </Text>
            </View>

            {activeLease && (
              <View style={styles.leaseInfo}>
                <Text variant="small" weight="bold">
                  Current Lease
                </Text>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons
                      name="business"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                  </View>
                  <Text variant="small" color={theme.colors.text.secondary}>
                    Unit {activeLease.unitId}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={theme.colors.text.secondary}
                    />
                  </View>
                  <Text variant="small" color={theme.colors.text.secondary}>
                    {new Date(activeLease.startDate).toLocaleDateString()} -{' '}
                    {activeLease.endDate
                      ? new Date(activeLease.endDate).toLocaleDateString()
                      : 'Month-to-Month'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
} 