import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { FileUpload } from '../FileUpload';
import { financeService } from '../../../lib/services/FinanceService';
import { SecurityDeposit, Currency, PaymentMethod } from '../../../types/finance';

interface SecurityDepositFormProps {
  propertyId: string;
  unitId: string;
  tenantId: string;
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: SecurityDeposit;
}

interface Deduction {
  reason: string;
  amount: number;
  attachments?: File[];
}

interface SelectItem {
  label: string;
  value: string;
}

export function SecurityDepositForm({
  propertyId,
  unitId,
  tenantId,
  onSubmit,
  onCancel,
  initialData,
}: SecurityDepositFormProps) {
  const theme = useTheme();
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [currency, setCurrency] = useState<Currency>(initialData?.currency || 'GHS');
  const [interestRate, setInterestRate] = useState(initialData?.interestRate?.toString() || '');
  const [receivedDate, setReceivedDate] = useState(initialData?.receivedAt || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [deductions, setDeductions] = useState<Deduction[]>(
    initialData?.deductions?.map(d => ({
      reason: d.reason,
      amount: d.amount,
      attachments: [],
    })) || []
  );
  const [refundAmount, setRefundAmount] = useState('');
  const [refundMethod, setRefundMethod] = useState<PaymentMethod>('bank_transfer');
  const [refundReference, setRefundReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accruedInterest, setAccruedInterest] = useState(initialData?.accruedInterest || 0);

  const currencyOptions: SelectItem[] = [
    { label: 'GHS', value: 'GHS' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
  ];

  const paymentMethodOptions: SelectItem[] = [
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Cash', value: 'cash' },
    { label: 'Mobile Money', value: 'mobile_money' },
    { label: 'Card', value: 'card' },
    { label: 'Check', value: 'check' },
  ];

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as Currency);
  };

  const handlePaymentMethodChange = (value: string) => {
    setRefundMethod(value as PaymentMethod);
  };

  const handleAddDeduction = () => {
    setDeductions([
      ...deductions,
      {
        reason: '',
        amount: 0,
        attachments: [],
      },
    ]);
  };

  const handleUpdateDeduction = (index: number, field: keyof Deduction, value: string | File[]) => {
    const updatedDeductions = [...deductions];
    const deduction = { ...updatedDeductions[index] };

    if (field === 'amount') {
      deduction.amount = parseFloat(value as string) || 0;
    } else if (field === 'reason') {
      deduction.reason = value as string;
    } else if (field === 'attachments') {
      deduction.attachments = value as File[];
    }

    updatedDeductions[index] = deduction;
    setDeductions(updatedDeductions);
  };

  const handleRemoveDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const calculateTotalDeductions = () => {
    return deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  };

  const calculateRefundableAmount = () => {
    const depositAmount = parseFloat(amount) || 0;
    const totalDeductions = calculateTotalDeductions();
    return depositAmount + accruedInterest - totalDeductions;
  };

  const handleCalculateInterest = async () => {
    if (!initialData?.id) return;

    try {
      setError('');
      setIsLoading(true);
      const updatedDeposit = await financeService.calculateSecurityDepositInterest(initialData.id);
      setAccruedInterest(updatedDeposit.accruedInterest || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate interest');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!amount || isNaN(parseFloat(amount))) {
        throw new Error('Please enter a valid amount');
      }

      if (initialData?.id) {
        // Process refund if refund amount is specified
        if (refundAmount && parseFloat(refundAmount) > 0) {
          await financeService.processSecurityDepositRefund(initialData.id, {
            amount: parseFloat(refundAmount),
            method: refundMethod,
            referenceNumber: refundReference || undefined,
            deductions: deductions.map(d => ({
              reason: d.reason,
              amount: d.amount,
              attachments: d.attachments,
            })),
          });
        } else {
          // Update existing deposit
          await financeService.updateSecurityDeposit(initialData.id, {
            interestRate: interestRate ? parseFloat(interestRate) : undefined,
            notes,
          });
        }
      } else {
        // Create new deposit
        await financeService.createSecurityDeposit({
          propertyId,
          unitId,
          tenantId,
          amount: parseFloat(amount),
          currency,
          interestRate: interestRate ? parseFloat(interestRate) : undefined,
          receivedAt: receivedDate,
          notes: notes || undefined,
        });
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save security deposit');
    } finally {
      setIsLoading(false);
    }
  };

  const ReadOnlySelect = ({ label, value, items, style }: { 
    label: string;
    value: string;
    items: SelectItem[];
    style?: any;
  }) => {
    const selectedItem = items.find(item => item.value === value);
    return (
      <View style={[styles.input, styles.readOnlyContainer, style]}>
        <Text style={styles.readOnlyLabel}>{label}</Text>
        <Text style={styles.readOnlyValue}>{selectedItem?.label || value}</Text>
      </View>
    );
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
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    halfWidth: {
      flex: 1,
    },
    readOnlyLabel: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.sizes.small,
      marginBottom: theme.spacing.xs,
    },
    readOnlyValue: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
    },
    readOnlyContainer: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    deduction: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
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
      alignItems: 'center',
    },
    summaryLabel: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.sizes.small,
    },
    summaryValue: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.text.primary,
    },
    deductionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    deductionTitle: {
      fontSize: theme.typography.sizes.body,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.text.primary,
    },
    attachmentsList: {
      marginTop: theme.spacing.xs,
    },
    attachmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
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
    refundSection: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
    },
    refundHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    refundForm: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.md,
    },
    warningText: {
      color: theme.colors.status.warning,
      fontSize: theme.typography.sizes.small,
      marginTop: theme.spacing.xs,
    },
    successText: {
      color: theme.colors.status.success,
      fontSize: theme.typography.sizes.small,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deposit Details</Text>
          <View style={styles.row}>
            <Input
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              style={[styles.input, styles.halfWidth]}
              editable={!initialData}
            />
            <View style={[styles.halfWidth]}>
              {initialData ? (
                <ReadOnlySelect
                  label="Currency"
                  value={currency}
                  items={currencyOptions}
                  style={styles.input}
                />
              ) : (
                <Select
                  label="Currency"
                  value={currency}
                  onValueChange={handleCurrencyChange}
                  items={currencyOptions}
                  style={styles.input}
                />
              )}
            </View>
          </View>

          {initialData ? (
            <ReadOnlySelect
              label="Interest Rate (%)"
              value={interestRate || 'Not set'}
              items={[]}
              style={styles.input}
            />
          ) : (
            <Input
              label="Interest Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              placeholder="Enter interest rate"
              keyboardType="numeric"
              style={styles.input}
            />
          )}

          {initialData ? (
            <ReadOnlySelect
              label="Received Date"
              value={new Date(receivedDate).toLocaleDateString()}
              items={[]}
              style={styles.input}
            />
          ) : (
            <DatePicker
              label="Received Date"
              value={receivedDate}
              onChange={setReceivedDate}
              style={styles.input}
            />
          )}
        </View>

        {initialData && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interest Calculation</Text>
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Original Deposit</Text>
                  <Text style={styles.summaryValue}>{parseFloat(amount).toFixed(2)} {currency}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Interest Rate</Text>
                  <Text style={styles.summaryValue}>{interestRate || '0'}%</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Accrued Interest</Text>
                  <Text style={styles.summaryValue}>{accruedInterest.toFixed(2)} {currency}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Amount</Text>
                  <Text style={styles.summaryValue}>
                    {(parseFloat(amount) + accruedInterest).toFixed(2)} {currency}
                  </Text>
                </View>
                <Button
                  title="Recalculate Interest"
                  onPress={handleCalculateInterest}
                  variant="outline"
                  loading={isLoading}
                  leftIcon="refresh"
                  style={{ marginTop: theme.spacing.md }}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.deductionHeader}>
                <Text style={styles.sectionTitle}>Deductions</Text>
                <Button
                  title="Add Deduction"
                  onPress={handleAddDeduction}
                  variant="outline"
                  leftIcon="add"
                  size="sm"
                />
              </View>
              {deductions.map((deduction, index) => (
                <View key={index} style={styles.deduction}>
                  <View style={styles.deductionHeader}>
                    <Text style={styles.deductionTitle}>Deduction #{index + 1}</Text>
                    <Button
                      title="Remove"
                      onPress={() => handleRemoveDeduction(index)}
                      variant="outline"
                      size="sm"
                      leftIcon="trash"
                    />
                  </View>
                  <Input
                    label="Reason"
                    value={deduction.reason}
                    onChangeText={(value) => handleUpdateDeduction(index, 'reason', value)}
                    placeholder="Enter deduction reason"
                    style={styles.input}
                  />
                  <Input
                    label="Amount"
                    value={deduction.amount.toString()}
                    onChangeText={(value) => handleUpdateDeduction(index, 'amount', value)}
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  <FileUpload
                    label="Attachments"
                    onFileSelect={(files) => handleUpdateDeduction(index, 'attachments', files)}
                    accept="image/*,application/pdf"
                    multiple
                    style={styles.input}
                  />
                  {deduction.attachments && deduction.attachments.length > 0 && (
                    <View style={styles.attachmentsList}>
                      {deduction.attachments.map((file, fileIndex) => (
                        <View key={fileIndex} style={styles.attachmentItem}>
                          <Text style={styles.readOnlyLabel}>{file.name}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
              {deductions.length === 0 && (
                <Text style={[styles.readOnlyLabel, { textAlign: 'center', marginTop: theme.spacing.md }]}>
                  No deductions added yet
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.refundSection}>
                <View style={styles.refundHeader}>
                  <Text style={styles.sectionTitle}>Refund Details</Text>
                  <Text style={[
                    styles.summaryValue,
                    { color: calculateRefundableAmount() <= 0 ? theme.colors.status.error : theme.colors.status.success }
                  ]}>
                    Available: {calculateRefundableAmount().toFixed(2)} {currency}
                  </Text>
                </View>

                <View style={styles.summary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Original Deposit</Text>
                    <Text style={styles.summaryValue}>{parseFloat(amount).toFixed(2)} {currency}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Accrued Interest</Text>
                    <Text style={styles.summaryValue}>{accruedInterest.toFixed(2)} {currency}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Deductions</Text>
                    <Text style={styles.summaryValue}>{calculateTotalDeductions().toFixed(2)} {currency}</Text>
                  </View>
                  <View style={[styles.summaryRow, { 
                    marginTop: theme.spacing.sm, 
                    paddingTop: theme.spacing.sm, 
                    borderTopWidth: 1, 
                    borderTopColor: theme.colors.text.secondary 
                  }]}>
                    <Text style={[styles.summaryLabel, { fontSize: theme.typography.sizes.body, fontWeight: theme.typography.weights.medium }]}>
                      Refundable Amount
                    </Text>
                    <Text style={[styles.summaryValue, { fontSize: theme.typography.sizes.h3 }]}>
                      {calculateRefundableAmount().toFixed(2)} {currency}
                    </Text>
                  </View>
                </View>

                <View style={styles.refundForm}>
                  <Input
                    label="Refund Amount"
                    value={refundAmount}
                    onChangeText={(value) => {
                      setRefundAmount(value);
                      setError('');
                    }}
                    placeholder={`Enter amount (max: ${calculateRefundableAmount().toFixed(2)})`}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                  {parseFloat(refundAmount) > calculateRefundableAmount() && (
                    <Text style={styles.warningText}>
                      Amount exceeds available refundable amount
                    </Text>
                  )}
                  {parseFloat(refundAmount) > 0 && parseFloat(refundAmount) <= calculateRefundableAmount() && (
                    <Text style={styles.successText}>
                      Valid refund amount
                    </Text>
                  )}

                  <Select
                    label="Payment Method"
                    value={refundMethod}
                    onValueChange={handlePaymentMethodChange}
                    items={paymentMethodOptions}
                    style={styles.input}
                  />

                  {(refundMethod === 'bank_transfer' || refundMethod === 'check' || refundMethod === 'mobile_money') && (
                    <Input
                      label={refundMethod === 'bank_transfer' ? 'Bank Reference' : 
                            refundMethod === 'check' ? 'Check Number' : 
                            'Mobile Money Reference'}
                      value={refundReference}
                      onChangeText={setRefundReference}
                      placeholder={`Enter ${refundMethod === 'bank_transfer' ? 'bank reference' : 
                                          refundMethod === 'check' ? 'check number' : 
                                          'mobile money reference'}`}
                      style={styles.input}
                    />
                  )}

                  <Button
                    title="Process Refund"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading || !refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > calculateRefundableAmount()}
                    variant="primary"
                    leftIcon="cash"
                    style={{ marginTop: theme.spacing.sm }}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter additional notes"
            multiline
            numberOfLines={3}
            style={styles.input}
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
            title={initialData ? 'Update Deposit' : 'Create Deposit'}
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