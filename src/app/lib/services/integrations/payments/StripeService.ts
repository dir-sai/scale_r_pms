import Stripe from 'stripe';
import { PaymentService, CreatePaymentIntent, PaymentResult, PaymentAmount } from './PaymentService';
import { IntegrationConfig } from '../IntegrationService';

interface StripeConfig extends IntegrationConfig {
  webhookSecret: string;
}

export class StripeService extends PaymentService {
  private stripe: Stripe;

  constructor(config: StripeConfig) {
    super(config);
    this.stripe = new Stripe(config.apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid Stripe configuration');
    }
  }

  validateConfig(): boolean {
    const config = this.config as StripeConfig;
    return !!(config.apiKey && config.webhookSecret);
  }

  private mapToStripeAmount(amount: PaymentAmount): number {
    // Stripe expects amounts in smallest currency unit (cents)
    return Math.round(amount.amount * 100);
  }

  private mapFromStripeAmount(amount: number, currency: string): PaymentAmount {
    return {
      amount: amount / 100,
      currency,
    };
  }

  private mapToPaymentResult(intent: Stripe.PaymentIntent): PaymentResult {
    return {
      id: intent.id,
      status: this.mapStripeStatus(intent.status),
      amount: this.mapFromStripeAmount(intent.amount, intent.currency),
      customer: {
        id: intent.customer as string,
        email: intent.receipt_email || '',
      },
      createdAt: new Date(intent.created * 1000),
      updatedAt: new Date(),
      metadata: intent.metadata,
    };
  }

  private mapStripeStatus(status: Stripe.PaymentIntent.Status): PaymentResult['status'] {
    const statusMap: Record<Stripe.PaymentIntent.Status, PaymentResult['status']> = {
      requires_payment_method: 'pending',
      requires_confirmation: 'pending',
      requires_action: 'processing',
      processing: 'processing',
      succeeded: 'succeeded',
      canceled: 'cancelled',
      requires_capture: 'processing',
    };
    return statusMap[status] || 'failed';
  }

  async createPaymentIntent(data: CreatePaymentIntent): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const intent = await this.stripe.paymentIntents.create({
          amount: this.mapToStripeAmount(data.amount),
          currency: data.amount.currency,
          customer: data.customer.id,
          receipt_email: data.customer.email,
          description: data.description,
          metadata: data.metadata,
        });
        return this.mapToPaymentResult(intent);
      })(),
      'Failed to create payment intent'
    );
  }

  async confirmPayment(paymentId: string): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const intent = await this.stripe.paymentIntents.confirm(paymentId);
        return this.mapToPaymentResult(intent);
      })(),
      'Failed to confirm payment'
    );
  }

  async cancelPayment(paymentId: string): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const intent = await this.stripe.paymentIntents.cancel(paymentId);
        return this.mapToPaymentResult(intent);
      })(),
      'Failed to cancel payment'
    );
  }

  async getPayment(paymentId: string): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const intent = await this.stripe.paymentIntents.retrieve(paymentId);
        return this.mapToPaymentResult(intent);
      })(),
      'Failed to retrieve payment'
    );
  }

  async refundPayment(paymentId: string, amount?: PaymentAmount): Promise<PaymentResult> {
    return this.handleRequest(
      (async () => {
        const refund = await this.stripe.refunds.create({
          payment_intent: paymentId,
          ...(amount && { amount: this.mapToStripeAmount(amount) }),
        });
        const intent = await this.stripe.paymentIntents.retrieve(paymentId);
        return this.mapToPaymentResult(intent);
      })(),
      'Failed to refund payment'
    );
  }
} 