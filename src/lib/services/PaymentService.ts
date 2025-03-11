import { apiClient } from '../api/client';
import {
  PaymentRequest,
  PaymentResponse,
  MobileMoneyPayment,
  BankTransferPayment,
  CardPayment,
  GhanaianBank,
  GHANAIAN_BANKS,
  PaymentHistory,
  PaymentHistoryItem,
  PaymentNotification,
  RecurringPaymentSchedule,
  PAYMENT_VALIDATION_RULES,
  SavedCard,
  QRCodePayment,
  USSDPayment,
  BasePayment,
} from '../../types/payment';

class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Payment Processing Methods
  async initiateMobileMoneyPayment(data: MobileMoneyPayment): Promise<PaymentResponse> {
    try {
      if (!this.validateMobileMoneyPayment(data)) {
        throw new Error('Invalid mobile money payment details');
      }
      const response = await apiClient.post('/payments/mobile-money', data);
      await this.createPaymentNotification('payment_initiated', response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initiate mobile money payment');
    }
  }

  async initiateQRCodePayment(data: QRCodePayment): Promise<PaymentResponse> {
    try {
      if (!this.validateQRPayment(data)) {
        throw new Error('Invalid QR code payment details');
      }
      const response = await apiClient.post('/payments/qr-code', data);
      await this.createPaymentNotification('payment_initiated', response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initiate QR code payment');
    }
  }

  async initiateUSSDPayment(data: USSDPayment): Promise<PaymentResponse> {
    try {
      if (!this.validateUSSDPayment(data)) {
        throw new Error('Invalid USSD payment details');
      }
      const response = await apiClient.post('/payments/ussd', data);
      await this.createPaymentNotification('payment_initiated', response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to process card payment');
    }
  }

  // Payment History Methods
  async getPaymentHistory(
    page: number = 1,
    limit: number = 10,
    filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      paymentMethod?: string;
    }
  ): Promise<PaymentHistory> {
    try {
      const response = await apiClient.get('/payments/history', {
        params: { page, limit, ...filters },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch payment history');
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentHistoryItem> {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch payment details');
    }
  }

  // Recurring Payment Methods
  async setupRecurringPayment(
    paymentRequest: PaymentRequest,
    schedule: RecurringPaymentSchedule
  ): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post('/payments/recurring/setup', {
        payment: paymentRequest,
        schedule,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to setup recurring payment');
    }
  }

  async cancelRecurringPayment(paymentId: string): Promise<void> {
    try {
      await apiClient.post(`/payments/recurring/${paymentId}/cancel`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel recurring payment');
    }
  }

  async updateRecurringPayment(
    paymentId: string,
    updates: Partial<RecurringPaymentSchedule>
  ): Promise<PaymentResponse> {
    try {
      const response = await apiClient.put(`/payments/recurring/${paymentId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update recurring payment');
    }
  }

  // Notification Methods
  async getNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: PaymentNotification[]; unreadCount: number }> {
    try {
      const response = await apiClient.get('/payments/notifications', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch notifications');
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.put(`/payments/notifications/${notificationId}/read`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  }

  private async createPaymentNotification(
    type: PaymentNotification['type'],
    payment: PaymentResponse
  ): Promise<void> {
    try {
      await apiClient.post('/payments/notifications', {
        type,
        paymentId: payment.id,
        title: this.getNotificationTitle(type),
        message: this.getNotificationMessage(type, payment),
      });
    } catch (error: any) {
      console.error('Failed to create payment notification:', error);
    }
  }

  // Card Management Methods
  async saveCard(data: CardPayment): Promise<SavedCard> {
    try {
      const response = await apiClient.post('/payments/cards', {
        cardNumber: data.cardNumber,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to save card');
    }
  }

  async getSavedCards(): Promise<SavedCard[]> {
    try {
      const response = await apiClient.get('/payments/cards');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch saved cards');
    }
  }

  async deleteCard(cardId: string): Promise<void> {
    try {
      await apiClient.delete(`/payments/cards/${cardId}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete card');
    }
  }

  // Validation Methods
  validateMobileMoneyPayment(data: MobileMoneyPayment): boolean {
    const { phoneNumber, network, accountName } = data;
    const { mobileMoneyPatterns, general } = PAYMENT_VALIDATION_RULES;

    return (
      mobileMoneyPatterns[network].test(phoneNumber) &&
      general.namePattern.test(accountName) &&
      this.validateBasePayment(data)
    );
  }

  validateQRPayment(data: QRCodePayment): boolean {
    const { merchantId, terminalId } = data;
    const { qr } = PAYMENT_VALIDATION_RULES;

    return (
      qr.merchantIdPattern.test(merchantId) &&
      (!terminalId || qr.terminalIdPattern.test(terminalId)) &&
      this.validateBasePayment(data)
    );
  }

  validateUSSDPayment(data: USSDPayment): boolean {
    const { ussdCode, sessionId } = data;
    const { ussd } = PAYMENT_VALIDATION_RULES;

    return (
      ussd.codePattern.test(ussdCode) &&
      (!sessionId || ussd.sessionPattern.test(sessionId)) &&
      this.validateBasePayment(data)
    );
  }

  private validateBasePayment(data: BasePayment): boolean {
    const { amount, currency, description, reference, customerEmail, customerPhone, customerName } = data;
    const { general } = PAYMENT_VALIDATION_RULES;

    const isValidAmount = general.amountPattern.test(amount.toString());
    const isValidReference = general.referencePattern.test(reference);
    const isValidEmail = !customerEmail || general.emailPattern.test(customerEmail);
    const isValidPhone = !customerPhone || general.phonePattern.test(customerPhone);
    const isValidName = !customerName || general.namePattern.test(customerName);

    return (
      isValidAmount &&
      isValidReference &&
      isValidEmail &&
      isValidPhone &&
      isValidName &&
      description.length > 0 &&
      currency === 'GHS' // Only supporting GHS for now
    );
  }

  validateBankAccount(bankCode: string, accountNumber: string): boolean {
    const pattern = PAYMENT_VALIDATION_RULES.bankAccountPatterns[bankCode];
    return pattern ? pattern.test(accountNumber) : false;
  }

  validateCardDetails(data: CardPayment): boolean {
    const { cardNumber, cvv, expiryMonth, expiryYear } = data;
    const { numberPattern, cvvPattern, expiryPattern } = PAYMENT_VALIDATION_RULES.cardValidation;

    const expiryDate = `${expiryMonth}/${expiryYear}`;
    
    return (
      numberPattern.test(cardNumber.replace(/\s/g, '')) &&
      cvvPattern.test(cvv) &&
      expiryPattern.test(expiryDate) &&
      this.isValidExpiryDate(expiryMonth, expiryYear)
    );
  }

  // Utility Methods
  generatePaymentReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `PAY-${timestamp}-${random}`;
  }

  formatMobileNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '+233' + cleaned.substring(1);
    }
    if (cleaned.startsWith('233')) {
      return '+' + cleaned;
    }
    return phoneNumber;
  }

  private isValidExpiryDate(month: string, year: string): boolean {
    const currentDate = new Date();
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expiryDate > currentDate;
  }

  private getNotificationTitle(type: PaymentNotification['type']): string {
    const titles = {
      payment_initiated: 'Payment Initiated',
      payment_success: 'Payment Successful',
      payment_failed: 'Payment Failed',
      payment_reminder: 'Payment Reminder',
      payment_refund: 'Payment Refunded',
      payment_expired: 'Payment Expired',
      payment_retry: 'Payment Retry',
      payment_cancelled: 'Payment Cancelled',
    };
    return titles[type];
  }

  private getNotificationMessage(
    type: PaymentNotification['type'],
    payment: PaymentResponse
  ): string {
    const amount = `${payment.currency} ${payment.amount.toFixed(2)}`;
    const messages = {
      payment_initiated: `Payment of ${amount} has been initiated.`,
      payment_success: `Payment of ${amount} was successful.`,
      payment_failed: `Payment of ${amount} failed. Please try again.`,
      payment_reminder: `Upcoming payment of ${amount} is due soon.`,
      payment_refund: `Payment of ${amount} has been refunded.`,
      payment_expired: `Payment of ${amount} has expired.`,
      payment_retry: `Retrying payment of ${amount}.`,
      payment_cancelled: `Payment of ${amount} has been cancelled.`,
    };
    return messages[type];
  }
}

export const paymentService = PaymentService.getInstance(); 