import { apiClient } from '../apiClient';
import {
  Vendor,
  CreateVendorData,
  UpdateVendorData,
  VendorRating,
  VendorSpecialty,
} from '../../types/vendor';
import { WorkOrder } from '../../types/maintenance';

class VendorService {
  private static instance: VendorService;
  private constructor() {}

  static getInstance(): VendorService {
    if (!VendorService.instance) {
      VendorService.instance = new VendorService();
    }
    return VendorService.instance;
  }

  async getVendors(filters?: {
    status?: string;
    specialty?: VendorSpecialty;
    search?: string;
  }): Promise<Vendor[]> {
    try {
      const response = await apiClient.get('/api/vendors', { params: filters });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getVendor(id: string): Promise<Vendor> {
    try {
      const response = await apiClient.get(`/api/vendors/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createVendor(data: CreateVendorData): Promise<Vendor> {
    try {
      const response = await apiClient.post('/api/vendors', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateVendor(id: string, data: UpdateVendorData): Promise<Vendor> {
    try {
      const response = await apiClient.put(`/api/vendors/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteVendor(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/vendors/${id}`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async addVendorRating(vendorId: string, rating: Omit<VendorRating, 'createdAt'>): Promise<Vendor> {
    try {
      const response = await apiClient.post(`/api/vendors/${vendorId}/ratings`, rating);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async uploadVendorDocument(vendorId: string, file: File, type: string): Promise<Vendor> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await apiClient.post(
        `/api/vendors/${vendorId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getVendorServiceHistory(vendorId: string, filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<WorkOrder[]> {
    try {
      const response = await apiClient.get(`/api/vendors/${vendorId}/service-history`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  private handleError(error: any): void {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred while processing your request');
  }
}

export const vendorService = VendorService.getInstance(); 