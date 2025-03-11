import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { FileUpload } from '../FileUpload';
import {
  Transaction,
  TransactionType,
  PaymentMethod,
  Currency,
} from '../../../types/finance';
import { financeService } from '../../../lib/services/FinanceService';

interface SplitPayment {
  amount: number;
  dueDate: string;
  notes?: string;
}

interface RecurringConfig {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  endDate?: string;
  maxOccurrences?: number;
}

interface TransactionFormProps {
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  vendorId?: string;
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Partial<Transaction>;
}

export function TransactionForm({
  propertyId,
  unitId,
  tenantId,
  vendorId,
  onSubmit,
  onCancel,
  initialData,
}: TransactionFormProps) {
  const theme = useTheme();
  const [type, setType] = useState<TransactionType>(initialData?.type || 'rent_payment');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || 'GHS');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || 'cash');
  const [referenceNumber, setReferenceNumber] = useState(initialData?.referenceNumber || '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // New state for enhanced features
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringConfig, setRecurringConfig] = useState<RecurringConfig>({
    frequency: 'monthly',
    interval: 1,
  });
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [exchangeRate, setExchangeRate] = useState(initialData?.exchangeRate?.toString() || '');

  const transactionTypes = [
    { label: 'Rent Payment', value: 'rent_payment' },
    { label: 'Security Deposit', value: 'security_deposit' },
    { label: 'Repair Expense', value: 'repair_expense' },
    { label: 'Utility Payment', value: 'utility_payment' },
    { label: 'Tax Payment', value: 'tax_payment' },
    { label: 'Vendor Payment', value: 'vendor_payment' },
    { label: 'Other Income', value: 'other_income' },
    { label: 'Other Expense', value: 'other_expense' },
  ];

  const paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Mobile Money', value: 'mobile_money' },
    { label: 'Card', value: 'card' },
    { label: 'Check', value: 'check' },
    { label: 'Other', value: 'other' },
  ];

  const currencies = [
    { label: 'GHS', value: 'GHS' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
  ];

  const frequencyOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Quarterly', value: 'quarterly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  const handleAddSplitPayment = () => {
    if (!amount) {
      setError('Please enter the total amount first');
      return;
    }

    const totalAmount = parseFloat(amount);
    const currentTotal = splitPayments.reduce((sum, payment) => sum + payment.amount, 0);

    if (currentTotal >= totalAmount) {
      setError('Split payments total cannot exceed the transaction amount');
      return;
    }

    setSplitPayments([
      ...splitPayments,
      {
        amount: totalAmount - currentTotal,
        dueDate: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const handleUpdateSplitPayment = (index: number, field: keyof SplitPayment, value: string) => {
    const updatedPayments = [...splitPayments];
    if (field === 'amount') {
      updatedPayments[index].amount = parseFloat(value) || 0;
    } else if (field === 'dueDate') {
      updatedPayments[index].dueDate = value;
    } else {
      updatedPayments[index].notes = value;
    }
    setSplitPayments(updatedPayments);
  };

  const handleRemoveSplitPayment = (index: number) => {
    setSplitPayments(splitPayments.filter((_, i) => i !== index));
  };

  const validateSplitPayments = () => {
    if (!isSplitPayment) return true;

    const totalAmount = parseFloat(amount);
    const splitTotal = splitPayments.reduce((sum, payment) => sum + payment.amount, 0);

    if (Math.abs(totalAmount - splitTotal) > 0.01) {
      setError('Split payments total must equal the transaction amount');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!amount || isNaN(parseFloat(amount))) {
        throw new Error('Please enter a valid amount');
      }

      if (!description.trim()) {
        throw new Error('Please enter a description');
      }

      if (!validateSplitPayments()) {
        return;
      }

      const transactionData = {
        type,
        amount: parseFloat(amount),
        currency,
        exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
        description,
        date,
        dueDate: dueDate || undefined,
        propertyId,
        unitId,
        tenantId,
        vendorId,
        paymentMethod,
        referenceNumber: referenceNumber || undefined,
        notes: notes || undefined,
        recurring: isRecurring ? recurringConfig : undefined,
        splitPayments: isSplitPayment ? splitPayments : undefined,
      };

      if (initialData?.id) {
        await financeService.updateTransaction(initialData.id, transactionData);
      } else {
        await financeService.createTransaction(transactionData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
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
    input: {
      marginBottom: theme.spacing.md,
    },
    description: {
      height: 80,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },
    halfWidth: {
      flex: 1,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    switchLabel: {
      flex: 1,
    },
    splitPaymentItem: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <Select
            label="Type"
            value={type}
            onValueChange={(value) => setType(value as TransactionType)}
            items={transactionTypes}
            style={styles.input}
          />

          <View style={styles.row}>
            <Input
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              leftIcon="cash"
              style={[styles.input, styles.halfWidth]}
            />
            <Select
              label="Currency"
              value={currency}
              onValueChange={(value) => setCurrency(value as Currency)}
              items={currencies}
              style={[styles.input, styles.halfWidth]}
            />
          </View>

          {currency !== 'GHS' && (
            <Input
              label="Exchange Rate (GHS)"
              value={exchangeRate}
              onChangeText={setExchangeRate}
              placeholder="Enter exchange rate"
              keyboardType="numeric"
              leftIcon="trending-up"
              style={styles.input}
            />
          )}

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.description]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <DatePicker
              label="Date"
              value={date}
              onChange={setDate}
              style={[styles.input, styles.halfWidth]}
            />
            <DatePicker
              label="Due Date (Optional)"
              value={dueDate}
              onChange={setDueDate}
              style={[styles.input, styles.halfWidth]}
            />
          </View>

          <Select
            label="Payment Method"
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            items={paymentMethods}
            style={styles.input}
          />

          <Input
            label="Reference Number (Optional)"
            value={referenceNumber}
            onChangeText={setReferenceNumber}
            placeholder="Enter reference number"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Schedule</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Recurring Payment</Text>
            <Switch value={isRecurring} onValueChange={setIsRecurring} />
          </View>

          {isRecurring && (
            <>
              <Select
                label="Frequency"
                value={recurringConfig.frequency}
                onValueChange={(value) =>
                  setRecurringConfig({ ...recurringConfig, frequency: value as RecurringConfig['frequency'] })
                }
                items={frequencyOptions}
                style={styles.input}
              />

              <Input
                label="Interval"
                value={recurringConfig.interval.toString()}
                onChangeText={(value) =>
                  setRecurringConfig({ ...recurringConfig, interval: parseInt(value) || 1 })
                }
                placeholder="Enter interval"
                keyboardType="numeric"
                style={styles.input}
              />

              <DatePicker
                label="End Date (Optional)"
                value={recurringConfig.endDate || ''}
                onChange={(value) => setRecurringConfig({ ...recurringConfig, endDate: value })}
                style={styles.input}
              />

              <Input
                label="Max Occurrences (Optional)"
                value={recurringConfig.maxOccurrences?.toString() || ''}
                onChangeText={(value) =>
                  setRecurringConfig({ ...recurringConfig, maxOccurrences: parseInt(value) || undefined })
                }
                placeholder="Enter max occurrences"
                keyboardType="numeric"
                style={styles.input}
              />
            </>
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Split Payment</Text>
            <Switch value={isSplitPayment} onValueChange={setIsSplitPayment} />
          </View>

          {isSplitPayment && (
            <>
              {splitPayments.map((payment, index) => (
                <View key={index} style={styles.splitPaymentItem}>
                  <View style={styles.row}>
                    <Input
                      label="Amount"
                      value={payment.amount.toString()}
                      onChangeText={(value) => handleUpdateSplitPayment(index, 'amount', value)}
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      style={[styles.input, styles.halfWidth]}
                    />
                    <DatePicker
                      label="Due Date"
                      value={payment.dueDate}
                      onChange={(value) => handleUpdateSplitPayment(index, 'dueDate', value)}
                      style={[styles.input, styles.halfWidth]}
                    />
                  </View>
                  <Input
                    label="Notes (Optional)"
                    value={payment.notes || ''}
                    onChangeText={(value) => handleUpdateSplitPayment(index, 'notes', value)}
                    placeholder="Enter notes"
                    style={styles.input}
                  />
                  <Button
                    title="Remove Split"
                    onPress={() => handleRemoveSplitPayment(index)}
                    variant="outline"
                    size="sm"
                  />
                </View>
              ))}
              <Button
                title="Add Split Payment"
                onPress={handleAddSplitPayment}
                variant="outline"
                leftIcon="add"
                style={styles.input}
              />
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <FileUpload
            label="Attachments"
            onFileSelect={(files: File[]) => setAttachments(files)}
            accept="image/*,application/pdf"
            multiple
            style={styles.input}
          />

          <Input
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter additional notes"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.description]}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title={initialData?.id ? 'Update Transaction' : 'Create Transaction'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
} 