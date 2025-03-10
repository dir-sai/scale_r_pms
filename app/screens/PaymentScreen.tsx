import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { PaymentForm } from '../components/payment/PaymentForm';
import { PaymentHistory } from '../components/payment/PaymentHistory';
import { NotificationsScreen } from '../components/payment/NotificationsScreen';
import { RecurringPaymentForm } from '../components/payment/RecurringPaymentForm';
import { PaymentHistoryItem, PaymentResponse, PaymentNotification } from '../../types/payment';
import { paymentService } from '../../lib/services/PaymentService';

type PaymentTab = 'payment' | 'history' | 'notifications' | 'recurring';

export function PaymentScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<PaymentTab>('payment');
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistoryItem>();
  const [showRecurringSetup, setShowRecurringSetup] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      padding: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.secondary,
    },
    title: {
      fontSize: theme.typography.sizes.h2,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.sm,
    },
    tabsContainer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
    },
    tab: {
      flex: 1,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background.primary,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      textAlign: 'center',
      color: theme.colors.text.primary,
    },
    activeTabText: {
      color: theme.colors.text.light,
    },
    content: {
      flex: 1,
    },
    paymentDetails: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      margin: theme.spacing.md,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    detailLabel: {
      color: theme.colors.text.secondary,
    },
    detailValue: {
      fontWeight: theme.typography.weights.medium,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
    },
  });

  const handlePaymentComplete = async (response: PaymentResponse) => {
    // Handle successful payment
    console.log('Payment completed:', response);
    // Refresh payment history if needed
    if (activeTab === 'history') {
      setActiveTab('history');
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
  };

  const handlePaymentSelect = (payment: PaymentHistoryItem) => {
    setSelectedPayment(payment);
  };

  const handleNotificationPress = (notification: PaymentNotification) => {
    // If notification is related to a payment, show payment details
    if (notification.paymentId) {
      paymentService.getPaymentDetails(notification.paymentId)
        .then(payment => setSelectedPayment(payment))
        .catch(console.error);
    }
  };

  const renderTab = (tab: PaymentTab, label: string) => (
    <Pressable
      style={[styles.tab, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderPaymentDetails = () => (
    <View style={styles.paymentDetails}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Amount</Text>
        <Text style={styles.detailValue}>
          {selectedPayment?.currency} {selectedPayment?.amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Status</Text>
        <Text style={styles.detailValue}>
          {selectedPayment?.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Reference</Text>
        <Text style={styles.detailValue}>{selectedPayment?.reference}</Text>
      </View>
      <View style={styles.actionButtons}>
        {selectedPayment?.receipt && (
          <Button
            title="View Receipt"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => {
              // Handle receipt viewing
            }}
          />
        )}
        {selectedPayment?.isRecurring && (
          <Button
            title="Manage Recurring"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => setShowRecurringSetup(true)}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payments</Text>
      </View>

      <View style={styles.tabsContainer}>
        {renderTab('payment', 'Pay')}
        {renderTab('history', 'History')}
        {renderTab('notifications', 'Notifications')}
        {renderTab('recurring', 'Recurring')}
      </View>

      <View style={styles.content}>
        {selectedPayment && renderPaymentDetails()}

        {activeTab === 'payment' && (
          <PaymentForm
            amount={1000} // Example amount
            description="Payment for services"
            onPaymentComplete={handlePaymentComplete}
            onError={handlePaymentError}
          />
        )}

        {activeTab === 'history' && (
          <PaymentHistory onPaymentSelect={handlePaymentSelect} />
        )}

        {activeTab === 'notifications' && (
          <NotificationsScreen onNotificationPress={handleNotificationPress} />
        )}

        {activeTab === 'recurring' && showRecurringSetup && selectedPayment ? (
          <RecurringPaymentForm
            paymentRequest={{
              ...selectedPayment,
              type: selectedPayment.paymentMethod as any,
            }}
            onComplete={handlePaymentComplete}
            onCancel={() => setShowRecurringSetup(false)}
          />
        ) : (
          <View style={{ padding: theme.spacing.md }}>
            <Text style={{ color: theme.colors.text.secondary }}>
              Select a payment from history to set up recurring payments
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 