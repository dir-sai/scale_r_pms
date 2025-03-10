export type TenantStatus = 'active' | 'inactive' | 'pending' | 'blacklisted';

export type PaymentMethod = 'bank_transfer' | 'card' | 'mobile_money' | 'cash';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Contact {
  type: 'phone' | 'email';
  value: string;
  isPrimary: boolean;
}

export interface Document {
  id: string;
  type: 'id_card' | 'passport' | 'drivers_license' | 'proof_of_income' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  verifiedAt?: string;
}

export interface CommunicationLog {
  id: string;
  type: 'email' | 'sms' | 'in_app' | 'phone_call';
  subject: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface BackgroundCheck {
  id: string;
  type: 'credit' | 'criminal' | 'rental_history' | 'employment';
  status: 'pending' | 'completed' | 'failed';
  provider: string;
  score?: number;
  report?: string;
  completedAt?: string;
  validUntil?: string;
}

export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  currency: string;
  type: 'rent' | 'security_deposit' | 'late_fee' | 'other';
  method: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  transactionId?: string;
  receipt?: string;
  notes?: string;
}

export interface LeaseAgreement {
  id: string;
  propertyId: string;
  unitId: string;
  tenantIds: string[];
  type: 'residential' | 'commercial';
  startDate: string;
  endDate?: string;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  rent: {
    amount: number;
    currency: string;
    frequency: 'monthly' | 'weekly' | 'yearly';
    dueDay: number;
  };
  securityDeposit: {
    amount: number;
    currency: string;
    paid: boolean;
    paidAt?: string;
  };
  utilities: {
    included: string[];
    notIncluded: string[];
  };
  terms: {
    petPolicy?: string;
    maintenancePolicy?: string;
    noisePolicy?: string;
    guestPolicy?: string;
  };
  documents: {
    id: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  signatures: {
    tenantId: string;
    signedAt: string;
    ipAddress: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  categories: {
    [categoryId: string]: {
      enabled: boolean;
      types: {
        [typeId: string]: {
          email: boolean;
          push: boolean;
          sms: boolean;
          frequency?: 'immediate' | 'daily' | 'weekly';
          quiet_hours?: {
            enabled: boolean;
            start: string;
            end: string;
          };
        };
      };
    };
  };
}

export interface Tenant {
  id: string;
  status: TenantStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  idNumber: string;
  photo?: string;
  contacts: Contact[];
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }[];
  documents: Document[];
  communicationLogs: CommunicationLog[];
  backgroundChecks?: BackgroundCheck[];
  occupation?: {
    employer: string;
    position: string;
    income: number;
    currency: string;
    period: 'monthly' | 'yearly';
    startDate: string;
    contactPerson?: {
      name: string;
      phone: string;
      email: string;
    };
  };
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode?: string;
  };
  leases: {
    id: string;
    propertyId: string;
    unitId: string;
    startDate: string;
    endDate?: string;
    status: LeaseAgreement['status'];
  }[];
  payments: Payment[];
  preferences: {
    communicationChannel: 'email' | 'sms' | 'both';
    language: string;
    reminderDays: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  notificationPreferences: NotificationPreferences;
} 