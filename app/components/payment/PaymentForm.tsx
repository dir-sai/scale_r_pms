import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Card } from '../Card';
import { paymentService } from '../../../lib/services/PaymentService';
import {
  GhanaianPaymentMethod,
  MobileMoneyNetwork,
  PaymentResponse,
  GHANAIAN_BANKS,
} from '../../../types/payment';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  description: string;
  onPaymentComplete: (response: PaymentResponse) => void;
  onError: (error: Error) => void;
}

export function PaymentForm({
  amount,
  currency = 'GHS',
  description,
  onPaymentComplete,
  onError,
}: PaymentFormProps) {
  const theme = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<GhanaianPaymentMethod>();
  const [selectedNetwork, setSelectedNetwork] = useState<MobileMoneyNetwork>();
  const [selectedBank, setSelectedBank] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      marginBottom: theme.spacing.md,
    },
    methodsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    methodCard: {
      width: '48%',
      padding: theme.spacing.md,
      alignItems: 'center',
    } as ViewStyle,
    selectedMethod: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    } as ViewStyle,
    networkGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    networkButton: {
      flex: 1,
    } as ViewStyle,
    selectedNetwork: {
      backgroundColor: theme.colors.primary,
    } as ViewStyle,
    selectedNetworkText: {
      color: theme.colors.text.light,
    } as TextStyle,
    error: {
      color: theme.colors.status.error,
      marginTop: theme.spacing.xs,
    },
    amountText: {
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    cardRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    expiryInput: {
      flex: 1,
    } as ViewStyle,
    cvvInput: {
      flex: 1,
    } as ViewStyle,
  });

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      const reference = paymentService.generatePaymentReference();

      let response: PaymentResponse;

      switch (selectedMethod) {
        case 'mtn_momo':
        case 'vodafone_cash':
        case 'airtel_tigo_money':
          if (!selectedNetwork || !phoneNumber) {
            throw new Error('Please provide all required mobile money details');
          }

          if (!paymentService.validateMobileMoneyNumber(selectedNetwork, phoneNumber)) {
            throw new Error('Invalid mobile money number');
          }

          response = await paymentService.initiateMobileMoneyPayment({
            type: 'mobile_money',
            network: selectedNetwork,
            phoneNumber: paymentService.formatMobileNumber(phoneNumber),
            accountName,
            amount,
            currency,
            description,
            reference,
          });
          break;

        case 'bank_transfer':
          if (!selectedBank || !accountNumber || !accountName) {
            throw new Error('Please provide all required bank details');
          }

          if (!paymentService.validateBankAccount(selectedBank, accountNumber)) {
            throw new Error('Invalid bank account number');
          }

          const bank = GHANAIAN_BANKS.find(b => b.code === selectedBank);
          if (!bank) {
            throw new Error('Invalid bank selected');
          }

          response = await paymentService.initiateBankTransfer({
            type: 'bank_transfer',
            bank,
            accountNumber,
            accountName,
            amount,
            currency,
            description,
            reference,
          });
          break;

        case 'card':
          if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
            throw new Error('Please provide all card details');
          }

          response = await paymentService.processCardPayment({
            type: 'card',
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiryMonth,
            expiryYear,
            cvv,
            amount,
            currency,
            description,
            reference,
          });
          break;

        default:
          throw new Error('Please select a payment method');
      }

      onPaymentComplete(response);
    } catch (err: any) {
      setError(err.message);
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentMethod = (
    method: GhanaianPaymentMethod,
    icon: keyof typeof Ionicons.glyphMap,
    label: string
  ) => (
    <Pressable onPress={() => setSelectedMethod(method)}>
      <Card
        style={{
          ...styles.methodCard,
          ...(selectedMethod === method ? styles.selectedMethod : {}),
        }}
      >
        <Ionicons
          name={icon}
          size={32}
          color={
            selectedMethod === method
              ? theme.colors.primary
              : theme.colors.text.secondary
          }
        />
        <Text
          variant="small"
          weight="medium"
          style={{ marginTop: theme.spacing.sm }}
        >
          {label}
        </Text>
      </Card>
    </Pressable>
  );

  const renderMobileMoneyForm = () => (
    <>
      <View style={styles.networkGrid}>
        <Button
          title="MTN Mobile Money"
          variant="outline"
          style={{
            ...styles.networkButton,
            ...(selectedNetwork === 'MTN' ? styles.selectedNetwork : {}),
          }}
          textStyle={selectedNetwork === 'MTN' ? styles.selectedNetworkText : undefined}
          onPress={() => setSelectedNetwork('MTN')}
        />
        <Button
          title="Vodafone Cash"
          variant="outline"
          style={{
            ...styles.networkButton,
            ...(selectedNetwork === 'Vodafone' ? styles.selectedNetwork : {}),
          }}
          textStyle={selectedNetwork === 'Vodafone' ? styles.selectedNetworkText : undefined}
          onPress={() => setSelectedNetwork('Vodafone')}
        />
        <Button
          title="AirtelTigo Money"
          variant="outline"
          style={{
            ...styles.networkButton,
            ...(selectedNetwork === 'AirtelTigo' ? styles.selectedNetwork : {}),
          }}
          textStyle={selectedNetwork === 'AirtelTigo' ? styles.selectedNetworkText : undefined}
          onPress={() => setSelectedNetwork('AirtelTigo')}
        />
      </View>

      <Input
        label="Phone Number"
        placeholder="Enter mobile money number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        leftIcon="call"
      />

      <Input
        label="Account Name"
        placeholder="Enter account name"
        value={accountName}
        onChangeText={setAccountName}
        leftIcon="person"
      />
    </>
  );

  const renderBankTransferForm = () => (
    <>
      <View style={styles.section}>
        <Text variant="small" weight="medium" style={styles.sectionTitle}>
          Select Bank
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.networkGrid}>
            {GHANAIAN_BANKS.map(bank => (
              <Button
                key={bank.code}
                title={bank.name}
                variant="outline"
                style={{
                  ...styles.networkButton,
                  ...(selectedBank === bank.code ? styles.selectedNetwork : {}),
                }}
                textStyle={selectedBank === bank.code ? styles.selectedNetworkText : undefined}
                onPress={() => setSelectedBank(bank.code)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <Input
        label="Account Number"
        placeholder="Enter bank account number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="numeric"
        leftIcon="card"
      />

      <Input
        label="Account Name"
        placeholder="Enter account name"
        value={accountName}
        onChangeText={setAccountName}
        leftIcon="person"
      />
    </>
  );

  const renderCardForm = () => (
    <>
      <Input
        label="Card Number"
        placeholder="Enter card number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        leftIcon="card"
      />

      <View style={styles.cardRow}>
        <Input
          label="Expiry Month"
          placeholder="MM"
          value={expiryMonth}
          onChangeText={setExpiryMonth}
          keyboardType="numeric"
          maxLength={2}
          style={styles.expiryInput}
        />
        <Input
          label="Expiry Year"
          placeholder="YY"
          value={expiryYear}
          onChangeText={setExpiryYear}
          keyboardType="numeric"
          maxLength={2}
          style={styles.expiryInput}
        />
        <Input
          label="CVV"
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          maxLength={4}
          style={styles.cvvInput}
          secureTextEntry
        />
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <Text variant="h2" weight="bold" style={styles.amountText}>
        {currency} {amount.toFixed(2)}
      </Text>

      <View style={styles.section}>
        <Text variant="h3" weight="bold" style={styles.sectionTitle}>
          Select Payment Method
        </Text>
        <View style={styles.methodsGrid}>
          {renderPaymentMethod('mtn_momo', 'call', 'Mobile Money')}
          {renderPaymentMethod('bank_transfer', 'card', 'Bank Transfer')}
          {renderPaymentMethod('card', 'card-outline', 'Card Payment')}
        </View>
      </View>

      {selectedMethod && (
        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Payment Details
          </Text>

          {selectedMethod === 'mtn_momo' && renderMobileMoneyForm()}
          {selectedMethod === 'vodafone_cash' && renderMobileMoneyForm()}
          {selectedMethod === 'airtel_tigo_money' && renderMobileMoneyForm()}
          {selectedMethod === 'bank_transfer' && renderBankTransferForm()}
          {selectedMethod === 'card' && renderCardForm()}

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title={isLoading ? 'Processing...' : 'Pay Now'}
            onPress={handlePayment}
            disabled={isLoading}
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      )}
    </ScrollView>
  );
} 