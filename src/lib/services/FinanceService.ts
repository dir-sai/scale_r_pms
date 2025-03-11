import { apiClient } from '../api/client';
import {
  Transaction,
  SecurityDeposit,
  Account,
  Invoice,
  FinancialReport,
  ExternalIntegration,
  FinancialStats,
  TransactionType,
  Currency,
  CreateInvoiceData,
  UpdateInvoiceData,
  GenerateReportParams,
} from '../../types/finance';

export class FinanceService {
  private static instance: FinanceService;

  private constructor() {}

  static getInstance(): FinanceService {
    if (!FinanceService.instance) {
      FinanceService.instance = new FinanceService();
    }
    return FinanceService.instance;
  }

  private handleError(error: any): never {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred while processing your request');
  }

  // Transaction Methods
  async createTransaction(data: Omit<Transaction, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    try {
      const response = await apiClient.post('/finance/transactions', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create transaction');
    }
  }

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await apiClient.put(`/finance/transactions/${transactionId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update transaction');
    }
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const response = await apiClient.get(`/finance/transactions/${transactionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch transaction');
    }
  }

  async getTransactions(filters?: {
    propertyId?: string;
    unitId?: string;
    tenantId?: string;
    vendorId?: string;
    type?: TransactionType[];
    startDate?: string;
    endDate?: string;
    currency?: Currency;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      const response = await apiClient.get('/finance/transactions', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch transactions');
    }
  }

  // Security Deposit Methods
  async createSecurityDeposit(data: Omit<SecurityDeposit, 'id' | 'status' | 'accruedInterest'>): Promise<SecurityDeposit> {
    try {
      const response = await apiClient.post('/finance/security-deposits', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create security deposit');
    }
  }

  async updateSecurityDeposit(depositId: string, updates: Partial<SecurityDeposit>): Promise<SecurityDeposit> {
    try {
      const response = await apiClient.put(`/finance/security-deposits/${depositId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update security deposit');
    }
  }

  async calculateSecurityDepositInterest(depositId: string): Promise<SecurityDeposit> {
    try {
      const response = await apiClient.post(`/finance/security-deposits/${depositId}/calculate-interest`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to calculate security deposit interest');
    }
  }

  async processSecurityDepositRefund(depositId: string, data: {
    amount: number;
    method: string;
    referenceNumber?: string;
    deductions?: {
      reason: string;
      amount: number;
      attachments?: File[];
    }[];
  }): Promise<SecurityDeposit> {
    try {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('method', data.method);
      if (data.referenceNumber) formData.append('referenceNumber', data.referenceNumber);
      if (data.deductions) {
        data.deductions.forEach((deduction, index) => {
          formData.append(`deductions[${index}][reason]`, deduction.reason);
          formData.append(`deductions[${index}][amount]`, deduction.amount.toString());
          if (deduction.attachments) {
            deduction.attachments.forEach((file, fileIndex) => {
              formData.append(`deductions[${index}][attachments][${fileIndex}]`, file);
            });
          }
        });
      }

      const response = await apiClient.post(`/finance/security-deposits/${depositId}/refund`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to process security deposit refund');
    }
  }

  // Invoice Methods
  async createInvoice(data: Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    try {
      const response = await apiClient.post('/finance/invoices', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create invoice');
    }
  }

  async updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await apiClient.put(`/finance/invoices/${invoiceId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update invoice');
    }
  }

  async sendInvoice(invoiceId: string, data: { email: string; message?: string }): Promise<Invoice> {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/send`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send invoice');
    }
  }

  async recordInvoicePayment(invoiceId: string, data: {
    amount: number;
    date: string;
    method: string;
    referenceNumber?: string;
  }): Promise<Invoice> {
    try {
      const response = await apiClient.post(`/finance/invoices/${invoiceId}/payments`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to record invoice payment');
    }
  }

  // Report Methods
  async generateFinancialReport(data: {
    type: 'profit_loss' | 'cash_flow' | 'balance_sheet' | 'tax_summary';
    propertyId?: string;
    startDate: string;
    endDate: string;
    currency: Currency;
  }): Promise<FinancialReport> {
    try {
      const response = await apiClient.post('/finance/reports/generate', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate financial report');
    }
  }

  async getFinancialStats(filters?: {
    propertyId?: string;
    startDate?: string;
    endDate?: string;
    currency?: Currency;
  }): Promise<FinancialStats> {
    try {
      const response = await apiClient.get('/finance/stats', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch financial statistics');
    }
  }

  async getFinancialReport(params: GenerateReportParams): Promise<FinancialReport> {
    try {
      const response = await apiClient.get('/api/finance/reports', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // External Integration Methods
  async setupExternalIntegration(data: {
    type: 'quickbooks' | 'xero';
    credentials: {
      accessToken: string;
      refreshToken: string;
      companyId: string;
    };
    settings: {
      autoSync: boolean;
      syncFrequency: 'realtime' | 'daily' | 'weekly';
      mappings: {
        accounts: { [key: string]: string };
        categories: { [key: string]: string };
      };
    };
  }): Promise<ExternalIntegration> {
    try {
      const response = await apiClient.post('/finance/integrations', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to setup external integration');
    }
  }

  async syncWithExternalSystem(integrationType: 'quickbooks' | 'xero'): Promise<void> {
    try {
      await apiClient.post(`/finance/integrations/${integrationType}/sync`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sync with external system');
    }
  }

  // Account Methods
  async createAccount(data: Omit<Account, 'id' | 'balance' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    try {
      const response = await apiClient.post('/finance/accounts', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  async updateAccount(accountId: string, updates: Partial<Account>): Promise<Account> {
    try {
      const response = await apiClient.put(`/finance/accounts/${accountId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update account');
    }
  }

  async getAccountTransactions(accountId: string, filters?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: Transaction[]; balance: number }> {
    try {
      const response = await apiClient.get(`/finance/accounts/${accountId}/transactions`, { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch account transactions');
    }
  }
}

export const financeService = FinanceService.getInstance(); 