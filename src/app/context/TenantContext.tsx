import React, { createContext, useContext, useState, useCallback } from 'react';
import { Tenant, LeaseAgreement, Payment, BackgroundCheck } from '../../types/tenant';
import { apiClient } from '../../lib/api/client';
import * as DocumentPicker from 'expo-document-picker';

export interface TenantContextType {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  leases: LeaseAgreement[];
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  filters: {
    status?: string[];
    search?: string;
    propertyId?: string;
    unitId?: string;
  };
  // Tenant Actions
  loadTenants: (page?: number, newFilters?: TenantContextType['filters']) => Promise<void>;
  getTenant: (id: string) => Promise<void>;
  createTenant: (data: Partial<Tenant>) => Promise<Tenant>;
  updateTenant: (id: string, data: Partial<Tenant>) => Promise<Tenant>;
  deleteTenant: (id: string) => Promise<void>;
  // Lease Actions
  loadLeases: (tenantId: string) => Promise<void>;
  createLease: (data: Partial<LeaseAgreement>) => Promise<LeaseAgreement>;
  updateLease: (id: string, data: Partial<LeaseAgreement>) => Promise<LeaseAgreement>;
  terminateLease: (id: string, reason: string) => Promise<void>;
  // Payment Actions
  recordPayment: (data: Partial<Payment>) => Promise<Payment>;
  generateInvoice: (leaseId: string, month: string) => Promise<string>;
  calculateLateFees: (leaseId: string) => Promise<number>;
  // Background Check Actions
  initiateBackgroundCheck: (tenantId: string, type: BackgroundCheck['type']) => Promise<BackgroundCheck>;
  getBackgroundCheckStatus: (checkId: string) => Promise<BackgroundCheck>;
  // Communication Actions
  sendReminder: (tenantId: string, type: 'rent' | 'lease_expiry' | 'custom', message?: string) => Promise<void>;
  // Document Actions
  uploadDocument: (tenantId: string, file: DocumentPicker.DocumentPickerSuccessResult) => Promise<void>;
  downloadDocument: (documentId: string) => Promise<string>;
  verifyDocument: (documentId: string) => Promise<void>;
  // Filter Actions
  setFilters: (filters: TenantContextType['filters']) => void;
}

export const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [leases, setLeases] = useState<LeaseAgreement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TenantContextType['filters']>({});

  const loadTenants = useCallback(async (newPage = 1, newFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/tenants', {
        params: {
          page: newPage,
          pageSize,
          ...newFilters,
        },
      });
      setTenants(response.data.tenants);
      setTotal(response.data.total);
      setPage(newPage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, filters]);

  const getTenant = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/tenants/${id}`);
      setSelectedTenant(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTenant = useCallback(async (data: Partial<Tenant>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/tenants', data);
      setTenants(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTenant = useCallback(async (id: string, data: Partial<Tenant>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/tenants/${id}`, data);
      setTenants(prev => prev.map(t => t.id === id ? response.data : t));
      if (selectedTenant?.id === id) {
        setSelectedTenant(response.data);
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTenant]);

  const deleteTenant = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/tenants/${id}`);
      setTenants(prev => prev.filter(t => t.id !== id));
      if (selectedTenant?.id === id) {
        setSelectedTenant(null);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTenant]);

  const loadLeases = useCallback(async (tenantId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/tenants/${tenantId}/leases`);
      setLeases(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLease = useCallback(async (data: Partial<LeaseAgreement>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/leases', data);
      setLeases(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLease = useCallback(async (id: string, data: Partial<LeaseAgreement>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.put(`/leases/${id}`, data);
      setLeases(prev => prev.map(l => l.id === id ? response.data : l));
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const terminateLease = useCallback(async (id: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/leases/${id}/terminate`, { reason });
      setLeases(prev => prev.map(l => l.id === id ? { ...l, status: 'terminated' } : l));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordPayment = useCallback(async (data: Partial<Payment>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/payments', data);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateInvoice = useCallback(async (leaseId: string, month: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/leases/${leaseId}/invoice`, { month });
      return response.data.url;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateLateFees = useCallback(async (leaseId: string) => {
    try {
      const response = await apiClient.get(`/leases/${leaseId}/late-fees`);
      return response.data.amount;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const initiateBackgroundCheck = useCallback(async (tenantId: string, type: BackgroundCheck['type']) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/tenants/${tenantId}/background-check`, { type });
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBackgroundCheckStatus = useCallback(async (checkId: string) => {
    try {
      const response = await apiClient.get(`/background-checks/${checkId}`);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const sendReminder = useCallback(async (tenantId: string, type: 'rent' | 'lease_expiry' | 'custom', message?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/tenants/${tenantId}/reminders`, { type, message });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (tenantId: string, file: DocumentPicker.DocumentPickerSuccessResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.assets[0].uri,
        name: file.assets[0].name,
        type: file.assets[0].mimeType,
      } as any);

      await apiClient.post(`/tenants/${tenantId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadDocument = useCallback(async (documentId: string): Promise<string> => {
    try {
      const response = await apiClient.get(`/documents/${documentId}/download`);
      return response.data.downloadUrl;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const verifyDocument = useCallback(async (documentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post(`/documents/${documentId}/verify`);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    tenants,
    selectedTenant,
    leases,
    isLoading,
    error,
    page,
    pageSize,
    total,
    filters,
    loadTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    loadLeases,
    createLease,
    updateLease,
    terminateLease,
    recordPayment,
    generateInvoice,
    calculateLateFees,
    initiateBackgroundCheck,
    getBackgroundCheckStatus,
    sendReminder,
    uploadDocument,
    downloadDocument,
    verifyDocument,
    setFilters,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
} 