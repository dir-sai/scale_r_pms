import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { DatePicker } from '../DatePicker';
import { financeService } from '../../../lib/services/FinanceService';
import {
  Invoice,
  InvoiceLineItem,
  PaymentTerms,
  CreateInvoiceData,
  UpdateInvoiceData,
} from '../../../types/finance';

interface InvoiceFormProps {
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  onSubmit: () => void;
  onCancel: () => void;
  initialData?: Invoice;
}

interface SelectItem {
  label: string;
  value: string;
}

export function InvoiceForm({
  propertyId,
  unitId,
  tenantId,
  onSubmit,
  onCancel,
  initialData,
}: InvoiceFormProps) {
  const theme = useTheme();
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || '');
  const [issueDate, setIssueDate] = useState(initialData?.issueDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>(initialData?.lineItems || []);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>(initialData?.paymentTerms || '30');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentTermsOptions: SelectItem[] = [
    { label: 'Due on Receipt', value: '0' },
    { label: 'Net 15', value: '15' },
    { label: 'Net 30', value: '30' },
    { label: 'Net 45', value: '45' },
    { label: 'Net 60', value: '60' },
  ];

  const handlePaymentTermsChange = (value: string) => {
    if (value === '0' || value === '15' || value === '30' || value === '45' || value === '60') {
      setPaymentTerms(value);
    }
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const handleUpdateLineItem = (index: number, field: keyof InvoiceLineItem, value: string) => {
    const updatedItems = [...lineItems];
    const item = { ...updatedItems[index] };

    switch (field) {
      case 'quantity':
      case 'unitPrice':
      case 'tax':
        item[field] = parseFloat(value) || 0;
        break;
      case 'description':
        item.description = value;
        break;
    }

    // Recalculate total
    item.total = item.quantity * item.unitPrice * (1 + item.tax / 100);
    updatedItems[index] = item;
    setLineItems(updatedItems);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotalTax = () => {
    return lineItems.reduce((sum, item) => {
      const itemTax = (item.quantity * item.unitPrice * item.tax) / 100;
      return sum + itemTax;
    }, 0);
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      if (!invoiceNumber.trim()) {
        throw new Error('Please enter an invoice number');
      }

      if (lineItems.length === 0) {
        throw new Error('Please add at least one line item');
      }

      if (!dueDate) {
        throw new Error('Please select a due date');
      }

      const invoiceData: CreateInvoiceData = {
        invoiceNumber,
        propertyId,
        unitId,
        tenantId,
        issueDate,
        dueDate,
        lineItems,
        subtotal: calculateSubtotal(),
        totalTax: calculateTotalTax(),
        total: calculateTotal(),
        paymentTerms,
        notes: notes.trim() || undefined,
      };

      if (initialData?.id) {
        const updateData: UpdateInvoiceData = {
          ...invoiceData,
          id: initialData.id,
        };
        await financeService.updateInvoice(initialData.id, updateData);
      } else {
        await financeService.createInvoice(invoiceData);
      }

      onSubmit();
    } catch (err: any) {
      setError(err.message || 'Failed to save invoice');
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
    lineItem: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginBottom: theme.spacing.sm,
    },
    totals: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.background.dark,
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    totalLabel: {
      fontWeight: theme.typography.weights.bold,
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
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Details</Text>
          <Input
            label="Invoice Number"
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="Enter invoice number"
            style={styles.input}
          />

          <View style={styles.row}>
            <DatePicker
              label="Issue Date"
              value={issueDate}
              onChange={setIssueDate}
              style={[styles.input, styles.halfWidth]}
            />
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              style={[styles.input, styles.halfWidth]}
            />
          </View>

          <Select
            label="Payment Terms"
            value={paymentTerms}
            onValueChange={handlePaymentTermsChange}
            items={paymentTermsOptions}
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line Items</Text>
          {lineItems.map((item, index) => (
            <View key={index} style={styles.lineItem}>
              <Input
                label="Description"
                value={item.description}
                onChangeText={(value) => handleUpdateLineItem(index, 'description', value)}
                placeholder="Enter item description"
                style={styles.input}
              />
              <View style={styles.row}>
                <Input
                  label="Quantity"
                  value={item.quantity.toString()}
                  onChangeText={(value) => handleUpdateLineItem(index, 'quantity', value)}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfWidth]}
                />
                <Input
                  label="Unit Price"
                  value={item.unitPrice.toString()}
                  onChangeText={(value) => handleUpdateLineItem(index, 'unitPrice', value)}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfWidth]}
                />
              </View>
              <View style={styles.row}>
                <Input
                  label="Tax (%)"
                  value={item.tax.toString()}
                  onChangeText={(value) => handleUpdateLineItem(index, 'tax', value)}
                  keyboardType="numeric"
                  style={[styles.input, styles.halfWidth]}
                />
                <Input
                  label="Total"
                  value={item.total.toFixed(2)}
                  editable={false}
                  style={[styles.input, styles.halfWidth]}
                />
              </View>
              <Button
                title="Remove Item"
                onPress={() => handleRemoveLineItem(index)}
                variant="outline"
                size="sm"
              />
            </View>
          ))}
          <Button
            title="Add Line Item"
            onPress={handleAddLineItem}
            variant="outline"
            leftIcon="add"
            style={styles.input}
          />

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text>{calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Tax:</Text>
              <Text>{calculateTotalTax().toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text>{calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>

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
            title={initialData?.id ? 'Update Invoice' : 'Create Invoice'}
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