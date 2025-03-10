import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Card } from '../Card';
import { paymentService } from '../../../lib/services/PaymentService';
import { PaymentNotification } from '../../../types/payment';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsScreenProps {
  onNotificationPress?: (notification: PaymentNotification) => void;
}

export function NotificationsScreen({ onNotificationPress }: NotificationsScreenProps) {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      padding: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    unreadCount: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.round,
    },
    unreadCountText: {
      color: theme.colors.text.light,
      fontWeight: theme.typography.weights.bold,
    },
    notificationCard: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      opacity: 1,
    },
    readNotification: {
      opacity: 0.7,
    },
    notificationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    notificationTitle: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      marginBottom: theme.spacing.xs,
    },
    notificationMessage: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
    },
    notificationTime: {
      fontSize: theme.typography.sizes.small,
      color: theme.colors.text.secondary,
    },
    notificationIcon: {
      marginRight: theme.spacing.sm,
    },
    error: {
      color: theme.colors.status.error,
      textAlign: 'center',
      padding: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    loadingMore: {
      padding: theme.spacing.md,
    },
  });

  const loadNotifications = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await paymentService.getNotifications(page);
      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      setUnreadCount(response.unreadCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleNotificationPress = async (notification: PaymentNotification) => {
    if (!notification.isRead) {
      try {
        await paymentService.markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    onNotificationPress?.(notification);
  };

  const getNotificationIcon = (type: PaymentNotification['type']): keyof typeof Ionicons.glyphMap => {
    const icons: Record<PaymentNotification['type'], keyof typeof Ionicons.glyphMap> = {
      payment_initiated: 'timer-outline',
      payment_success: 'checkmark-circle-outline',
      payment_failed: 'alert-circle-outline',
      payment_reminder: 'notifications-outline',
      payment_refund: 'refresh-circle-outline',
    };
    return icons[type] || 'information-circle-outline';
  };

  const getNotificationIconColor = (type: PaymentNotification['type']) => {
    const colors = {
      payment_initiated: theme.colors.status.info,
      payment_success: theme.colors.status.success,
      payment_failed: theme.colors.status.error,
      payment_reminder: theme.colors.status.warning,
      payment_refund: theme.colors.primary,
    };
    return colors[type] || theme.colors.text.secondary;
  };

  const renderNotification = ({ item }: { item: PaymentNotification }) => (
    <Pressable onPress={() => handleNotificationPress(item)}>
      <Card
        style={[
          styles.notificationCard,
          item.isRead && styles.readNotification,
        ]}
      >
        <View style={styles.notificationHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name={getNotificationIcon(item.type)}
              size={24}
              color={getNotificationIconColor(item.type)}
              style={styles.notificationIcon}
            />
            <View>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
            </View>
          </View>
          {!item.isRead && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
              }}
            />
          )}
        </View>
        <Text style={styles.notificationTime}>
          {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
        </Text>
      </Card>
    </Pressable>
  );

  if (loading && currentPage === 1) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.bold }}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <View style={styles.unreadCount}>
            <Text style={styles.unreadCountText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.text.secondary }}>
            No notifications
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          onRefresh={() => loadNotifications(1)}
          refreshing={loading && currentPage === 1}
          onEndReached={() => {
            if (!loading) {
              setCurrentPage(p => p + 1);
              loadNotifications(currentPage + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && currentPage > 1 ? (
              <ActivityIndicator
                style={styles.loadingMore}
                color={theme.colors.primary}
              />
            ) : null
          }
        />
      )}
    </View>
  );
} 