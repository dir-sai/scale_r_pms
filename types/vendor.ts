import { WorkOrder } from './maintenance';

export type VendorSpecialty = 
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'carpentry'
  | 'painting'
  | 'landscaping'
  | 'cleaning'
  | 'security'
  | 'general';

export type VendorStatus = 'active' | 'inactive' | 'pending' | 'blacklisted';

export interface VendorRating {
  workOrderId: string;
  rating: number;
  feedback: string;
  createdAt: string;
  createdBy: string;
}

export interface VendorPerformanceMetrics {
  averageRating: number;
  totalWorkOrders: number;
  completedOnTime: number;
  averageResponseTime: number; // in hours
  averageCompletionTime: number; // in hours
  totalSpent: number;
}

export interface VendorContact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface ServiceRate {
  specialty: VendorSpecialty;
  rate: number;
  rateType: 'hourly' | 'fixed' | 'variable';
  currency: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  businessType: 'individual' | 'company';
  taxId?: string;
  registrationNumber?: string;
  specialties: VendorSpecialty[];
  status: VendorStatus;
  contacts: VendorContact[];
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  serviceRates: ServiceRate[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverageAmount: number;
  };
  documents?: {
    id: string;
    type: 'license' | 'insurance' | 'contract' | 'certification' | 'other';
    name: string;
    url: string;
    expiryDate?: string;
  }[];
  bankInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
  };
  performanceMetrics: VendorPerformanceMetrics;
  ratings: VendorRating[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorData extends Omit<Vendor, 
  'id' | 'performanceMetrics' | 'ratings' | 'createdAt' | 'updatedAt'
> {}

export interface UpdateVendorData extends Partial<CreateVendorData> {} 