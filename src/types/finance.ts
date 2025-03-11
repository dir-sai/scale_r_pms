export type TransactionType = 
  | 'rent_payment'
  | 'security_deposit'
  | 'repair_expense'
  | 'utility_payment'
  | 'tax_payment'
  | 'vendor_payment'
  | 'other_income'
  | 'other_expense';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'voided';

export type PaymentMethod = 
  | 'cash'
  | 'bank_transfer'
  | 'mobile_money'
  | 'card'
  | 'check'
  | 'other';

export type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: Currency;
  exchangeRate?: number; // For multi-currency support
  description: string;
  date: string;
  dueDate?: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  vendorId?: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  attachments?: {
    id: string;
    type: 'invoice' | 'receipt' | 'contract' | 'other';
    url: string;
    fileName: string;
    uploadedAt: string;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityDeposit {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  amount: number;
  currency: Currency;
  interestRate?: number;
  accruedInterest?: number;
  status: 'held' | 'partially_refunded' | 'fully_refunded';
  deductions?: {
    id: string;
    reason: string;
    amount: number;
    date: string;
    attachments?: {
      id: string;
      type: 'image' | 'document';
      url: string;
    }[];
  }[];
  refunds?: {
    id: string;
    amount: number;
    date: string;
    method: PaymentMethod;
    referenceNumber?: string;
  }[];
  receivedAt: string;
  lastInterestCalculation?: string;
  notes?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'income' | 'expense';
  currency: Currency;
  balance: number;
  isSecurityDepositAccount?: boolean;
  description?: string;
  externalId?: string; // For integration with external accounting systems
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
export type PaymentTerms = '0' | '15' | '30' | '45' | '60';

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  totalTax: number;
  total: number;
  paymentTerms: PaymentTerms;
  notes?: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateInvoiceData = Omit<Invoice, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateInvoiceData = Partial<Invoice>;

export type ReportType = 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'accounts_receivable' | 'accounts_payable';
export type DateRange = 'month' | 'quarter' | 'year' | 'custom';

export interface FinancialReportItem {
  category: string;
  amount: number;
  details?: {
    description: string;
    amount: number;
    date?: string;
  }[];
}

export interface FinancialReport {
  type: ReportType;
  startDate: string;
  endDate: string;
  propertyId?: string;
  income: FinancialReportItem[];
  expenses: FinancialReportItem[];
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  // Balance sheet specific fields
  assets?: FinancialReportItem[];
  liabilities?: FinancialReportItem[];
  equity?: FinancialReportItem[];
  // Cash flow specific fields
  operatingActivities?: FinancialReportItem[];
  investingActivities?: FinancialReportItem[];
  financingActivities?: FinancialReportItem[];
  // Accounts receivable/payable specific fields
  accounts?: {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    age: number;
  }[];
}

export interface GenerateReportParams {
  type: ReportType;
  startDate: string;
  endDate: string;
  propertyId?: string;
}

export interface ExternalIntegration {
  id: string;
  type: 'quickbooks' | 'xero';
  status: 'active' | 'inactive' | 'error';
  credentials: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
    companyId?: string;
  };
  settings: {
    autoSync: boolean;
    syncFrequency: 'realtime' | 'daily' | 'weekly';
    lastSyncAt?: string;
    mappings: {
      accounts: { [key: string]: string }; // Local account ID to external account ID
      categories: { [key: string]: string }; // Local category to external category
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  outstandingBalance: number;
  securityDepositsHeld: number;
  upcomingPayments: {
    dueDate: string;
    amount: number;
    type: TransactionType;
    entity: {
      id: string;
      type: 'tenant' | 'vendor';
      name: string;
    };
  }[];
  recentTransactions: Transaction[];
  incomeByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  expensesByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    income: number;
    expenses: number;
    netIncome: number;
  }[];
  occupancyRate: number;
  rentCollectionRate: number;
} 