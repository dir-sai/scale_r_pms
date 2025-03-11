import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Select } from '../Select';
import { MobileMoneyNetwork, MobileMoneyPayment } from '../../../types/payment';
import { paymentService } from '../../../lib/services/PaymentService';

interface MobileMoneyFormProps {
  amount: number;
  description: string;
  onSubmit: (payment: MobileMoneyPayment) => Promise<void>;
  onCancel: () => void;
}

export function MobileMoneyForm({ amount, description, onSubmit, onCancel }: MobileMoneyFormProps) {
  const theme = useTheme();
  const [network, setNetwork] = useState<MobileMoneyNetwork>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [voucher, setVoucher] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const networks: { label: string; value: MobileMoneyNetwork }[] = [
    { label: 'MTN Mobile Money', value: 'MTN' },
    { label: 'Vodafone Cash', value: 'Vodafone' },
    { label: 'AirtelTigo Money', value: 'AirtelTigo' },
  ];

  const handleSubmit = async () => {
    try {
      setError('');
      setIsLoading(true);

      const paymentData: MobileMoneyPayment = {
        type: 'mobile_money',
        network,
        phoneNumber: paymentService.formatMobileNumber(phoneNumber),
        accountName,
        amount,
        currency: 'GHS',
        description,
        reference: paymentService.generatePaymentReference(),
        voucher: network === 'Vodafone' ? voucher : undefined,
      };

      await onSubmit(paymentData);
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    networkSelect: {
      marginBottom: theme.spacing.md,
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    error: {
      color: theme.colors.error,
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
        label="Select Network"
        value={network}
        onValueChange={setNetwork}
        items={networks}
        style={styles.networkSelect}
      />

      <Input
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter mobile money number"
        leftIcon={<Ionicons name="phone-portrait" size={20} color={theme.colors.text.secondary} />}
        style={styles.input}
      />

      <Input
        label="Account Name"
        value={accountName}
        onChangeText={setAccountName}
        placeholder="Enter account name"
        leftIcon={<Ionicons name="person" size={20} color={theme.colors.text.secondary} />}
        style={styles.input}
      />

      {network === 'Vodafone' && (
        <Input
          label="Voucher Code"
          value={voucher}
          onChangeText={setVoucher}
          placeholder="Enter voucher code"
          leftIcon={<Ionicons name="ticket" size={20} color={theme.colors.text.secondary} />}
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
          title="Pay Now"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
} 