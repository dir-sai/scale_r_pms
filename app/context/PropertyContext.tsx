import React, { createContext, useContext, useState, useCallback } from 'react';
import { Property, Unit, PropertyFilters } from '../../types/property';
import { PropertyService } from '../../lib/api/property';

interface PropertyContextType {
  properties: Property[];
  selectedProperty: Property | null;
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  filters: PropertyFilters;
  // Property Methods
  loadProperties: (page?: number, filters?: PropertyFilters) => Promise<void>;
  getProperty: (id: string) => Promise<void>;
  createProperty: (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: string, data: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  // Unit Methods
  loadUnits: (propertyId: string, page?: number) => Promise<void>;
  createUnit: (propertyId: string, data: Omit<Unit, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUnit: (propertyId: string, unitId: string, data: Partial<Unit>) => Promise<void>;
  deleteUnit: (propertyId: string, unitId: string) => Promise<void>;
  // Media Methods
  uploadPhoto: (propertyId: string, file: File, caption?: string) => Promise<void>;
  uploadDocument: (propertyId: string, file: File, type: string, title: string) => Promise<void>;
  // Syndication
  syndicateProperty: (propertyId: string, platforms: string[]) => Promise<void>;
  // State Management
  setFilters: (filters: PropertyFilters) => void;
  clearSelectedProperty: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PropertyFilters>({});

  const loadProperties = useCallback(async (newPage = 1, newFilters?: PropertyFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await PropertyService.getProperties(
        newPage,
        pageSize,
        newFilters || filters
      );
      setProperties(response.properties);
      setTotal(response.total);
      setPage(response.page);
      if (newFilters) setFilters(newFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, filters]);

  const getProperty = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const property = await PropertyService.getProperty(id);
      setSelectedProperty(property);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProperty = useCallback(async (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const property = await PropertyService.createProperty(data);
      setProperties(prev => [property, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProperty = useCallback(async (id: string, data: Partial<Property>) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await PropertyService.updateProperty(id, data);
      setProperties(prev => prev.map(p => p.id === id ? updated : p));
      if (selectedProperty?.id === id) {
        setSelectedProperty(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProperty]);

  const deleteProperty = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await PropertyService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProperty]);

  const loadUnits = useCallback(async (propertyId: string, newPage = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await PropertyService.getUnits(propertyId, newPage, pageSize);
      setUnits(response.units);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load units');
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  const createUnit = useCallback(async (
    propertyId: string,
    data: Omit<Unit, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const unit = await PropertyService.createUnit(propertyId, data);
      setUnits(prev => [unit, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create unit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUnit = useCallback(async (
    propertyId: string,
    unitId: string,
    data: Partial<Unit>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await PropertyService.updateUnit(propertyId, unitId, data);
      setUnits(prev => prev.map(u => u.id === unitId ? updated : u));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update unit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUnit = useCallback(async (propertyId: string, unitId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await PropertyService.deleteUnit(propertyId, unitId);
      setUnits(prev => prev.filter(u => u.id !== unitId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete unit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadPhoto = useCallback(async (
    propertyId: string,
    file: File,
    caption?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const photo = await PropertyService.uploadPropertyPhoto(propertyId, file, caption);
      if (selectedProperty && selectedProperty.id === propertyId) {
        setSelectedProperty({
          ...selectedProperty,
          photos: [photo, ...selectedProperty.photos],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProperty]);

  const uploadDocument = useCallback(async (
    propertyId: string,
    file: File,
    type: string,
    title: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const document = await PropertyService.uploadPropertyDocument(
        propertyId,
        file,
        type as any,
        title
      );
      if (selectedProperty && selectedProperty.id === propertyId) {
        setSelectedProperty({
          ...selectedProperty,
          documents: [document, ...selectedProperty.documents],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProperty]);

  const syndicateProperty = useCallback(async (propertyId: string, platforms: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      await PropertyService.syndicateProperty(propertyId, platforms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to syndicate property');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSelectedProperty = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  const value = {
    properties,
    selectedProperty,
    units,
    isLoading,
    error,
    total,
    page,
    pageSize,
    filters,
    loadProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    loadUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    uploadPhoto,
    uploadDocument,
    syndicateProperty,
    setFilters,
    clearSelectedProperty,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
} 