import axios, { AxiosInstance } from 'axios';
import { PaymentService, CreatePaymentIntent, PaymentResult, PaymentAmount } from './PaymentService';
import { IntegrationConfig } from '../IntegrationService';

interface PaystackConfig extends IntegrationConfig {
  publicKey: string;
}

interface PaystackTransaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
  customer: {
    id: number;
    email: string;
    customer_code: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  metadata: Record<string, any>;
}

export class PaystackService extends PaymentService {
  private client: AxiosInstance;

  constructor(config: PaystackConfig) {
    super(config);
    this.client = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid Paystack configuration');
    }
  }

  validateConfig(): boolean {
    const config = this.config as PaystackConfig;
    return !!(config.apiKey && config.publicKey);
  }

  private mapToPaystackAmount(amount: PaymentAmount): number {
    // Paystack expects amounts in kobo (smallest currency unit)
    return Math.round(amount.amount * 100);
  }

  private mapFromPaystackAmount(amount: number, currency: string): PaymentAmount {
    return {
      amount: amount / 100,
      currency,
    };
  }

  private mapToPaymentResult(transaction: PaystackTransaction): PaymentResult {
    return {
      id: transaction.reference,
      status: this.mapPaystackStatus(transaction.status),
      amount: this.mapFromPaystackAmount(transaction.amount, transaction.currency),
      customer: {
        id: transaction.customer.customer_code,
        email: transaction.customer.email,
        name: transaction.customer.first_name 
          ? `${transaction.customer.first_name} ${transaction.customer.last_name || ''}`
          : undefined,
        phone: transaction.customer.phone,
      },
      createdAt: new Date(transaction.created_at),
      updatedAt: transaction.paid_at ? new Date(transaction.paid_at) : new Date(transaction.created_at),
      metadata: transaction.metadata,
    };
  }

  private mapPaystackStatus(status: string): PaymentResult['status'] {
    const statusMap: Record<string, PaymentResult['status']> = {
      pending: 'pending',
      success: 'succeeded',
      failed: 'failed',
      abandoned: 'cancelled',
    };
    return statusMap[status.toLowerCase()] || 'failed';
  }

  async createPaymentIntent(data: CreatePaymentIntent): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const response = await this.client.post('/transaction/initialize', {
          amount: this.mapToPaystackAmount(data.amount),
          currency: data.amount.currency,
          email: data.customer.email,
          metadata: {
            ...data.metadata,
            customer_name: data.customer.name,
            customer_phone: data.customer.phone,
          },
        });

        const transaction = await this.getPayment(response.data.data.reference);
        return transaction;
      })(),
      'Failed to create payment intent'
    );
  }

  async confirmPayment(paymentId: string): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const response = await this.client.get(`/transaction/verify/${paymentId}`);
        return this.mapToPaymentResult(response.data.data);
      })(),
      'Failed to confirm payment'
    );
  }

  async cancelPayment(paymentId: string): Promise<PaymentResult> {
    // Paystack doesn't support canceling transactions directly
    // We'll mark it as abandoned by checking its status
    return this.getPayment(paymentId);
  }

  async getPayment(paymentId: string): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const response = await this.client.get(`/transaction/verify/${paymentId}`);
        return this.mapToPaymentResult(response.data.data);
      })(),
      'Failed to retrieve payment'
    );
  }

  async refundPayment(paymentId: string, amount?: PaymentAmount): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const response = await this.client.post('/refund', {
          transaction: paymentId,
          ...(amount && { amount: this.mapToPaystackAmount(amount) }),
        });
        return this.getPayment(paymentId);
      })(),
      'Failed to refund payment'
    );
  }
} 