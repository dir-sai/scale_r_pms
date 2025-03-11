import React, { useState } from 'react';
import { View, StyleSheet, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { USSDPayment } from '../../../types/payment';
import { GHANAIAN_BANKS } from '../../../types/payment';
import { paymentService } from '../../../lib/services/PaymentService';

interface USSDFormProps {
  amount: number;
  description: string;
  onSubmit: (payment: USSDPayment) => Promise<void>;
  onCancel: () => void;
}

export function USSDForm({ amount, description, onSubmit, onCancel }: USSDFormProps) {
  const theme = useTheme();
  const [bankCode, setBankCode] = useState('');
  const [ussdCode, setUssdCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const bankOptions = GHANAIAN_BANKS.map(bank => ({
    label: bank.name,
    value: bank.code,
  }));

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      const paymentData: USSDPayment = {
        type: 'ussd',
        bankCode,
        ussdCode,
        amount,
        currency: 'GHS',
        description,
        reference: paymentService.generatePaymentReference(),
        expiresIn: 300, // 5 minutes
      };

      await onSubmit(paymentData);
    } catch (err: any) {
      setError(err.message || 'Failed to generate USSD code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      Clipboard.setString(generatedCode);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    bankSelect: {
      marginBottom: theme.spacing.md,
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    error: {
      color: theme.colors.status.error,
      marginBottom: theme.spacing.md,
    },
    generatedCode: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    codeText: {
      fontSize: theme.typography.sizes.h3,
      fontWeight: theme.typography.weights.bold,
      textAlign: 'center',
      color: theme.colors.text.primary,
    },
    instructions: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <Select
        label="Select Bank"
        value={bankCode}
        onValueChange={setBankCode}
        items={bankOptions}
        style={styles.bankSelect}
      />

      {generatedCode ? (
        <View style={styles.generatedCode}>
          <Text style={styles.codeText}>{generatedCode}</Text>
          <Text style={styles.instructions}>
            Dial this code on your phone to complete the payment
          </Text>
          <Button
            title="Copy Code"
            onPress={handleCopyCode}
            leftIcon={<Ionicons name="copy" size={20} color={theme.colors.text.light} />}
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      ) : (
        <Input
          label="USSD Code"
          value={ussdCode}
          onChangeText={setUssdCode}
          placeholder="Enter USSD code format"
          leftIcon={<Ionicons name="keypad" size={20} color={theme.colors.text.secondary} />}
          style={styles.input}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title={generatedCode ? 'Generate New Code' : 'Generate USSD Code'}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
} 