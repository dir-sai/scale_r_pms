import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { Input } from '../Input';
import { paymentService } from '../../../lib/services/PaymentService';
import { PaymentHistoryItem, PaymentStatus } from '../../../types/payment';
import { format } from 'date-fns';

interface PaymentHistoryProps {
  onPaymentSelect?: (payment: PaymentHistoryItem) => void;
}

export function PaymentHistory({ onPaymentSelect }: PaymentHistoryProps) {
  const theme = useTheme();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    paymentMethod: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    filtersContainer: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    filterRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    filterInput: {
      flex: 1,
    },
    paymentCard: {
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
    },
    paymentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    paymentAmount: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
    },
    paymentMethod: {
      color: theme.colors.text.secondary,
    },
    paymentDetails: {
      marginTop: theme.spacing.sm,
    },
    paymentStatus: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
    },
    pageInfo: {
      color: theme.colors.text.secondary,
    },
    error: {
      color: theme.colors.status.error,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
  });

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await paymentService.getPaymentHistory(currentPage, 10, filters);
      setPayments(response.payments);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [currentPage, filters]);

  const getStatusColor = (status: PaymentStatus) => {
    const colors = {
      pending: theme.colors.status.warning,
      processing: theme.colors.status.info,
      success: theme.colors.status.success,
      failed: theme.colors.status.error,
      refunded: theme.colors.status.warning,
      cancelled: theme.colors.text.secondary,
    };
    return colors[status] || theme.colors.text.secondary;
  };

  const renderPaymentCard = ({ item }: { item: PaymentHistoryItem }) => (
    <Card
      style={styles.paymentCard}
      onPress={() => onPaymentSelect?.(item)}
    >
      <View style={styles.paymentHeader}>
        <View>
          <Text style={styles.paymentAmount}>
            {item.currency} {item.amount.toFixed(2)}
          </Text>
          <Text style={styles.paymentMethod}>
            {item.paymentMethod.replace(/_/g, ' ').toUpperCase()}
          </Text>
        </View>
        <Text>
          {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
        </Text>
      </View>

      <View style={styles.paymentDetails}>
        <Text>{item.description}</Text>
        {item.isRecurring && (
          <Text style={{ color: theme.colors.text.secondary }}>
            Recurring Payment
          </Text>
        )}
        <View
          style={[
            styles.paymentStatus,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text
            style={{
              color: getStatusColor(item.status),
              fontWeight: theme.typography.weights.medium,
            }}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </Card>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <Input
          placeholder="Start Date"
          value={filters.startDate}
          onChangeText={(text) => setFilters({ ...filters, startDate: text })}
          style={styles.filterInput}
          leftIcon="calendar"
        />
        <Input
          placeholder="End Date"
          value={filters.endDate}
          onChangeText={(text) => setFilters({ ...filters, endDate: text })}
          style={styles.filterInput}
          leftIcon="calendar"
        />
      </View>
      <View style={styles.filterRow}>
        <Input
          placeholder="Status"
          value={filters.status}
          onChangeText={(text) => setFilters({ ...filters, status: text })}
          style={styles.filterInput}
          leftIcon="filter"
        />
        <Input
          placeholder="Payment Method"
          value={filters.paymentMethod}
          onChangeText={(text) => setFilters({ ...filters, paymentMethod: text })}
          style={styles.filterInput}
          leftIcon="card"
        />
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <Button
        title="Previous"
        onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        variant="outline"
      />
      <Text style={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </Text>
      <Button
        title="Next"
        onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        variant="outline"
      />
    </View>
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
      {renderFilters()}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : payments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.colors.text.secondary }}>
            No payments found
          </Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: theme.spacing.md }}
          onRefresh={loadPayments}
          refreshing={loading}
        />
      )}

      {payments.length > 0 && renderPagination()}
    </View>
  );
} 