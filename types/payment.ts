export type GhanaianPaymentMethod = 
  | 'mtn_momo' 
  | 'vodafone_cash' 
  | 'airtel_tigo_money' 
  | 'bank_transfer' 
  | 'card'
  | 'g_money'  // G-Money
  | 'zeepay'   // Zeepay
  | 'hubtel'
  | 'expresspay'
  | 'slydepay'
  | 'paystack'
  | 'ussd'
  | 'qr_code';

export type MobileMoneyNetwork = 'MTN' | 'Vodafone' | 'AirtelTigo';

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded' | 'cancelled' | 'expired' | 'partially_refunded';

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface RecurringPaymentSchedule {
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  nextPaymentDate: string;
  totalPayments?: number;
  completedPayments: number;
  isActive: boolean;
  customInterval?: number; // Days between payments for custom frequency
  pauseUntil?: string; // Date until which the recurring payment is paused
  failureRetries?: number; // Number of retries on failure
  lastRetryDate?: string;
}

export type GhanaianBank = {
  code: string;
  name: string;
  swiftCode?: string;
  branchCode?: string;
  sortCode?: string;
  supportsDirectDebit?: boolean;
  supportedAccountTypes?: string[];
};

export interface PaymentNotification {
  id: string;
  type: 'payment_initiated' | 'payment_success' | 'payment_failed' | 'payment_reminder' | 'payment_refund' | 'payment_expired' | 'payment_retry' | 'payment_cancelled';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  paymentId?: string;
  additionalData?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
  category?: 'transaction' | 'reminder' | 'security' | 'promotion';
  expiresAt?: string;
}

export interface BasePayment {
  amount: number;
  currency: string;
  description: string;
  reference: string;
  isRecurring?: boolean;
  recurringSchedule?: RecurringPaymentSchedule;
  metadata?: Record<string, any>;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  purpose?: string;
  splitPayments?: {
    recipient: string;
    amount: number;
    description?: string;
  }[];
}

export interface MobileMoneyPayment extends BasePayment {
  type: 'mobile_money';
  network: MobileMoneyNetwork;
  phoneNumber: string;
  accountName: string;
  voucher?: string; // For Vodafone Cash
  channelType?: 'ussd' | 'qr' | 'app';
}

export interface BankTransferPayment extends BasePayment {
  type: 'bank_transfer';
  bank: GhanaianBank;
  accountNumber: string;
  accountName: string;
  accountType?: string;
  branchCode?: string;
  transferType?: 'instant' | 'standard' | 'direct_debit';
}

export interface CardPayment extends BasePayment {
  type: 'card';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCard?: boolean;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  secure3d?: boolean;
}

export interface QRCodePayment extends BasePayment {
  type: 'qr_code';
  qrType: 'gh_qr' | 'merchant_qr';
  merchantId: string;
  terminalId?: string;
  expiresIn?: number; // Seconds
}

export interface USSDPayment extends BasePayment {
  type: 'ussd';
  bankCode: string;
  ussdCode: string;
  sessionId?: string;
  expiresIn?: number; // Seconds
}

export interface SavedCard {
  id: string;
  lastFourDigits: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  cardNetwork: 'visa' | 'mastercard' | 'amex' | 'discover';
  cardLevel?: 'debit' | 'credit' | 'prepaid';
  cardCountry?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export type PaymentRequest = 
  | MobileMoneyPayment 
  | BankTransferPayment 
  | CardPayment 
  | QRCodePayment 
  | USSDPayment;

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: GhanaianPaymentMethod;
  reference: string;
  message: string;
  timestamp: string;
  receipt?: string;
  refundId?: string;
  recurringSchedule?: RecurringPaymentSchedule;
  metadata?: Record<string, any>;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  payments: PaymentHistoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface PaymentHistoryItem {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: GhanaianPaymentMethod;
  status: PaymentStatus;
  description: string;
  reference: string;
  timestamp: string;
  isRecurring: boolean;
  recurringSchedule?: RecurringPaymentSchedule;
  receipt?: string;
  refundId?: string;
}

export interface PaymentValidationRules {
  mobileMoneyPatterns: {
    [key in MobileMoneyNetwork]: RegExp;
  };
  bankAccountPatterns: {
    [key: string]: RegExp;
  };
  cardValidation: {
    numberPattern: RegExp;
    cvvPattern: RegExp;
    expiryPattern: RegExp;
    cardNetworkPatterns: {
      visa: RegExp;
      mastercard: RegExp;
      amex: RegExp;
      discover: RegExp;
    };
    addressValidation: {
      streetPattern: RegExp;
      cityPattern: RegExp;
      statePattern: RegExp;
      postalCodePattern: RegExp;
    };
  };
  general: {
    emailPattern: RegExp;
    phonePattern: RegExp;
    namePattern: RegExp;
    amountPattern: RegExp;
    referencePattern: RegExp;
    purposePattern: RegExp;
    descriptionPattern: RegExp;
  };
  ussd: {
    codePattern: RegExp;
    sessionPattern: RegExp;
    bankCodePattern: RegExp;
    timeoutPattern: RegExp;
  };
  qr: {
    merchantIdPattern: RegExp;
    terminalIdPattern: RegExp;
    ghQrPattern: RegExp;
    expiryPattern: RegExp;
  };
  momo: {
    voucherPattern: RegExp;
    channelPattern: RegExp;
    networkPattern: RegExp;
  };
  recurring: {
    frequencyPattern: RegExp;
    customIntervalPattern: RegExp;
    totalPaymentsPattern: RegExp;
    retriesPattern: RegExp;
  };
  splitPayment: {
    recipientPattern: RegExp;
    minAmount: number;
    maxRecipients: number;
  };
}

export const GHANAIAN_BANKS: GhanaianBank[] = [
  { code: 'GCB', name: 'GCB Bank', swiftCode: 'GHCBGHAC' },
  { code: 'ABSA', name: 'Absa Bank Ghana', swiftCode: 'BARCGHAC' },
  { code: 'ECO', name: 'Ecobank Ghana', swiftCode: 'ECOCGHAC' },
  { code: 'FIDELITY', name: 'Fidelity Bank Ghana', swiftCode: 'FBLIGHAC' },
  { code: 'STANBIC', name: 'Stanbic Bank Ghana', swiftCode: 'SBICGHAC' },
  { code: 'CBG', name: 'Consolidated Bank Ghana', swiftCode: 'CBGHGHAC' },
  { code: 'ADB', name: 'Agricultural Development Bank', swiftCode: 'ADNTGHAC' },
  { code: 'CAL', name: 'CAL Bank', swiftCode: 'CALIGHAC' },
  { code: 'ACCESS', name: 'Access Bank Ghana', swiftCode: 'ABNGGHAC' },
  { code: 'ZENITH', name: 'Zenith Bank Ghana', swiftCode: 'ZEBLGHAC' },
  { code: 'GTB', name: 'Guaranty Trust Bank Ghana', swiftCode: 'GTBIGHAC' },
  { code: 'UBA', name: 'United Bank for Africa Ghana', swiftCode: 'UBAGHAC' },
  { code: 'BOA', name: 'Bank of Africa Ghana', swiftCode: 'AFRIBGHX' },
  { code: 'PRUDENTIAL', name: 'Prudential Bank', swiftCode: 'PUBKGHAC' },
  { code: 'NIB', name: 'National Investment Bank', swiftCode: 'NIBGGHAC' },
];

export const PAYMENT_VALIDATION_RULES: PaymentValidationRules = {
  mobileMoneyPatterns: {
    MTN: /^(?:\+233|0)(24|54|55|59)\d{7}$/,
    Vodafone: /^(?:\+233|0)(20|50)\d{7}$/,
    AirtelTigo: /^(?:\+233|0)(27|57|26|56)\d{7}$/,
  },
  bankAccountPatterns: {
    GCB: /^\d{13}$/,
    ABSA: /^\d{10}$/,
    ECO: /^\d{13}$/,
    FIDELITY: /^\d{10}$/,
    STANBIC: /^\d{13}$/,
    CBG: /^\d{13}$/,
    ADB: /^\d{13}$/,
    CAL: /^\d{10}$/,
    ACCESS: /^\d{10}$/,
    ZENITH: /^\d{10}$/,
    GTB: /^\d{10}$/,
    UBA: /^\d{13}$/,
    BOA: /^\d{10}$/,
    PRUDENTIAL: /^\d{13}$/,
    NIB: /^\d{13}$/,
  },
  cardValidation: {
    numberPattern: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/,
    cvvPattern: /^[0-9]{3,4}$/,
    expiryPattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
    cardNetworkPatterns: {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    },
    addressValidation: {
      streetPattern: /^[A-Za-z0-9\s,.-]{5,100}$/,
      cityPattern: /^[A-Za-z\s]{2,50}$/,
      statePattern: /^[A-Za-z\s]{2,50}$/,
      postalCodePattern: /^[A-Z0-9]{4,8}$/,
    },
  },
  general: {
    emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phonePattern: /^(?:\+233|0)[0-9]{9}$/,
    namePattern: /^[a-zA-Z\s'-]{2,50}$/,
    amountPattern: /^(?!0+\.?0*$)\d+(\.\d{1,2})?$/,
    referencePattern: /^[A-Za-z0-9-]{6,50}$/,
    purposePattern: /^[A-Za-z0-9\s,.-]{5,100}$/,
    descriptionPattern: /^[A-Za-z0-9\s,.-]{5,200}$/,
  },
  ussd: {
    codePattern: /^\*\d{3}\*\d+#$/,
    sessionPattern: /^[A-Za-z0-9-]{8,32}$/,
    bankCodePattern: /^[A-Z0-9]{3,6}$/,
    timeoutPattern: /^[1-9][0-9]{1,3}$/,
  },
  qr: {
    merchantIdPattern: /^[A-Z0-9]{8,16}$/,
    terminalIdPattern: /^[A-Z0-9]{6,12}$/,
    ghQrPattern: /^GH[A-Z0-9]{16,32}$/,
    expiryPattern: /^[1-9][0-9]{1,4}$/,
  },
  momo: {
    voucherPattern: /^[0-9]{6,12}$/,
    channelPattern: /^(ussd|qr|app)$/,
    networkPattern: /^(MTN|Vodafone|AirtelTigo)$/,
  },
  recurring: {
    frequencyPattern: /^(daily|weekly|monthly|quarterly|yearly|custom)$/,
    customIntervalPattern: /^[1-9][0-9]{0,3}$/,
    totalPaymentsPattern: /^[1-9][0-9]{0,2}$/,
    retriesPattern: /^[0-9]$/,
  },
  splitPayment: {
    recipientPattern: /^[A-Za-z0-9-]{4,50}$/,
    minAmount: 1,
    maxRecipients: 5,
  },
}; 