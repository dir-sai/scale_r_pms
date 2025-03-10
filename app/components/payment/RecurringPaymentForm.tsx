import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Card } from '../Card';
import { paymentService } from '../../../lib/services/PaymentService';
import {
  PaymentRequest,
  RecurringFrequency,
  RecurringPaymentSchedule,
  PaymentResponse,
} from '../../../types/payment';
import { optimizeAsset } from '../../../lib/utils/optimizeAsset';
import { generatePropertySlug } from '../../../lib/utils/generatePropertySlug';
import { SEO } from '../../../components/SEO';

interface RecurringPaymentFormProps {
  paymentRequest: PaymentRequest;
  onComplete: (response: PaymentResponse) => void;
  onCancel: () => void;
}

export function RecurringPaymentForm({
  paymentRequest,
  onComplete,
  onCancel,
}: RecurringPaymentFormProps) {
  const theme = useTheme();
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPayments, setTotalPayments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
    },
    frequencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    frequencyCard: {
      width: '48%',
      padding: theme.spacing.md,
    },
    selectedFrequency: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    frequencyTitle: {
      textAlign: 'center',
      fontWeight: theme.typography.weights.medium,
    },
    selectedFrequencyTitle: {
      color: theme.colors.primary,
    },
    dateRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    dateInput: {
      flex: 1,
    },
    error: {
      color: theme.colors.status.error,
      marginTop: theme.spacing.sm,
    },
    summary: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      color: theme.colors.text.secondary,
    },
    summaryValue: {
      fontWeight: theme.typography.weights.medium,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
  });

  const frequencies: { value: RecurringFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(undefined);

      if (!startDate) {
        throw new Error('Please select a start date');
      }

      const schedule: RecurringPaymentSchedule = {
        frequency,
        startDate,
        endDate: endDate || undefined,
        nextPaymentDate: startDate,
        totalPayments: totalPayments ? parseInt(totalPayments, 10) : undefined,
        completedPayments: 0,
        isActive: true,
      };

      const response = await paymentService.setupRecurringPayment(
        paymentRequest,
        schedule
      );

      onComplete(response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const optimizedUrl = optimizeAsset('/path/to/asset.js', {
    compression: true,
    cacheControl: 'public, max-age=31536000'
  });

  const propertySlug = generatePropertySlug(
    { city: 'Accra', neighborhood: 'East Legon' },
    { title: 'Modern 2BR Apartment', bedrooms: 2, propertyType: 'Apartment' }
  );

  return (
    <View style={styles.container}>
      <SEO
        title="Modern 2BR Apartment in Accra"
        description="Luxurious 2-bedroom apartment in East Legon, Accra. Features modern amenities, 24/7 security, and a prime location."
        keywords={['apartment', 'Accra', 'East Legon', '2 bedroom']}
        type="property"
      />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>
              {formatAmount(paymentRequest.amount, paymentRequest.currency)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Description</Text>
            <Text style={styles.summaryValue}>{paymentRequest.description}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Frequency</Text>
        <View style={styles.frequencyGrid}>
          {frequencies.map(({ value, label }) => (
            <Pressable
              key={value}
              onPress={() => setFrequency(value)}
            >
              <Card
                style={[
                  styles.frequencyCard,
                  frequency === value && styles.selectedFrequency,
                ]}
              >
                <Text
                  style={[
                    styles.frequencyTitle,
                    frequency === value && styles.selectedFrequencyTitle,
                  ]}
                >
                  {label}
                </Text>
              </Card>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule Details</Text>
        <View style={styles.dateRow}>
          <Input
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
            style={styles.dateInput}
            leftIcon="calendar-outline"
          />
          <Input
            label="End Date (Optional)"
            placeholder="YYYY-MM-DD"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.dateInput}
            leftIcon="calendar-outline"
          />
        </View>

        <Input
          label="Number of Payments (Optional)"
          placeholder="Enter total number of payments"
          value={totalPayments}
          onChangeText={setTotalPayments}
          keyboardType="numeric"
          leftIcon="calculator-outline"
          style={{ marginTop: theme.spacing.md }}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title={loading ? 'Setting up...' : 'Confirm Schedule'}
          onPress={handleSubmit}
          disabled={loading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}