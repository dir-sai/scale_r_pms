import { IntegrationService, IntegrationConfig } from '../IntegrationService';

export interface PaymentAmount {
  amount: number;
  currency: string;
}

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'mobile_money';
  details: Record<string, any>;
}

export interface PaymentCustomer {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface CreatePaymentIntent {
  amount: PaymentAmount;
  customer: PaymentCustomer;
  paymentMethod?: PaymentMethod;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  amount: PaymentAmount;
  customer: PaymentCustomer;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, string>;
}

export abstract class PaymentService extends IntegrationService {
  abstract createPaymentIntent(data: CreatePaymentIntent): Promise<PaymentResult>;
  abstract confirmPayment(paymentId: string): Promise<PaymentResult>;
  abstract cancelPayment(paymentId: string): Promise<PaymentResult>;
  abstract getPayment(paymentId: string): Promise<PaymentResult>;
  abstract refundPayment(paymentId: string, amount?: PaymentAmount): Promise<PaymentResult>;
} 