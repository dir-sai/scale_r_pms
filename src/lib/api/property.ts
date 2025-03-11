import { apiClient } from './client';
import { API_CONFIG } from '../../config/api';
import {
  Property,
  Unit,
  PropertyPhoto,
  PropertyDocument,
  PropertyAmenity,
} from '../../types/property';
import { AxiosError } from 'axios';

export class PropertyError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'PropertyError';
  }
}

export interface PropertyFilters {
  type?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: string[];
  amenities?: string[];
  city?: string;
  state?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UnitListResponse {
  units: Unit[];
  total: number;
  page: number;
  pageSize: number;
}

export class PropertyService {
  private static handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      throw new PropertyError(message, error.response?.status);
    }
    throw new PropertyError('An unexpected error occurred');
  }

  // Property Management
  static async createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    try {
      const response = await apiClient.post<Property>('/properties', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getProperties(
    page = 1,
    pageSize = 10,
    filters?: PropertyFilters
  ): Promise<PropertyListResponse> {
    try {
      const response = await apiClient.get<PropertyListResponse>('/properties', {
        params: {
          page,
          pageSize,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getProperty(id: string): Promise<Property> {
    try {
      const response = await apiClient.get<Property>(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async updateProperty(
    id: string,
    data: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Property> {
    try {
      const response = await apiClient.put<Property>(`/properties/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async deleteProperty(id: string): Promise<void> {
    try {
      await apiClient.delete(`/properties/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Unit Management
  static async createUnit(propertyId: string, data: Omit<Unit, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
    try {
      const response = await apiClient.post<Unit>(`/properties/${propertyId}/units`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getUnits(
    propertyId: string,
    page = 1,
    pageSize = 10,
    filters?: Partial<Pick<Unit, 'status' | 'type'>>
  ): Promise<UnitListResponse> {
    try {
      const response = await apiClient.get<UnitListResponse>(`/properties/${propertyId}/units`, {
        params: {
          page,
          pageSize,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getUnit(propertyId: string, unitId: string): Promise<Unit> {
    try {
      const response = await apiClient.get<Unit>(`/properties/${propertyId}/units/${unitId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async updateUnit(
    propertyId: string,
    unitId: string,
    data: Partial<Omit<Unit, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Unit> {
    try {
      const response = await apiClient.put<Unit>(`/properties/${propertyId}/units/${unitId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async deleteUnit(propertyId: string, unitId: string): Promise<void> {
    try {
      await apiClient.delete(`/properties/${propertyId}/units/${unitId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Media Management
  static async uploadPropertyPhoto(
    propertyId: string,
    file: File,
    caption?: string
  ): Promise<PropertyPhoto> {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      if (caption) formData.append('caption', caption);

      const response = await apiClient.post<PropertyPhoto>(
        `/properties/${propertyId}/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async uploadPropertyDocument(
    propertyId: string,
    file: File,
    type: PropertyDocument['type'],
    title: string
  ): Promise<PropertyDocument> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', type);
      formData.append('title', title);

      const response = await apiClient.post<PropertyDocument>(
        `/properties/${propertyId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Amenity Management
  static async getAmenities(): Promise<PropertyAmenity[]> {
    try {
      const response = await apiClient.get<PropertyAmenity[]>('/amenities');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Listing Syndication
  static async syndicateProperty(propertyId: string, platforms: string[]): Promise<void> {
    try {
      await apiClient.post(`/properties/${propertyId}/syndicate`, { platforms });
    } catch (error) {
      throw this.handleError(error);
    }
  }
} 