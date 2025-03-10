import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { QRCodePayment } from '../../../types/payment';
import { paymentService } from '../../../lib/services/PaymentService';

interface QRCodeFormProps {
  amount: number;
  description: string;
  onSubmit: (payment: QRCodePayment) => Promise<void>;
  onCancel: () => void;
}

export function QRCodeForm({ amount, description, onSubmit, onCancel }: QRCodeFormProps) {
  const theme = useTheme();
  const [qrType, setQRType] = useState<'gh_qr' | 'merchant_qr'>('gh_qr');
  const [merchantId, setMerchantId] = useState('');
  const [terminalId, setTerminalId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const qrTypes = [
    { label: 'Ghana QR', value: 'gh_qr' },
    { label: 'Merchant QR', value: 'merchant_qr' },
  ];

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      const paymentData: QRCodePayment = {
        type: 'qr_code',
        qrType,
        merchantId,
        terminalId: terminalId || undefined,
        amount,
        currency: 'GHS',
        description,
        reference: paymentService.generatePaymentReference(),
        expiresIn: 300, // 5 minutes
      };

      await onSubmit(paymentData);
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    qrTypeSelect: {
      marginBottom: theme.spacing.md,
    },
    input: {
      marginBottom: theme.spacing.md,
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
      <Select
        label="QR Code Type"
        value={qrType}
        onValueChange={setQRType}
        items={qrTypes}
        style={styles.qrTypeSelect}
      />

      <Input
        label="Merchant ID"
        value={merchantId}
        onChangeText={setMerchantId}
        placeholder="Enter merchant ID"
        leftIcon={<Ionicons name="business" size={20} color={theme.colors.text.secondary} />}
        style={styles.input}
      />

      {qrType === 'merchant_qr' && (
        <Input
          label="Terminal ID"
          value={terminalId}
          onChangeText={setTerminalId}
          placeholder="Enter terminal ID (optional)"
          leftIcon={<Ionicons name="hardware-chip" size={20} color={theme.colors.text.secondary} />}
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
          title="Generate QR"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
} 