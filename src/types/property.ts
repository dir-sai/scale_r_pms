export type PropertyType = 'apartment' | 'house' | 'condo' | 'commercial' | 'office';

export type PropertyAmenity = {
  id: string;
  name: string;
  category: 'general' | 'security' | 'recreational' | 'utility';
  icon?: string;
};

export type PropertyPhoto = {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  createdAt: string;
};

export type PropertyDocument = {
  id: string;
  title: string;
  url: string;
  type: 'floor_plan' | 'certificate' | 'permit' | 'other';
  createdAt: string;
};

export type Property = {
  id: string;
  name: string;
  type: PropertyType;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  totalUnits: number;
  amenities: PropertyAmenity[];
  photos: PropertyPhoto[];
  documents: PropertyDocument[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isActive: boolean;
};

export type UnitStatus = 'vacant' | 'occupied' | 'maintenance' | 'reserved';

export type UnitType = 'studio' | '1br' | '2br' | '3br' | '4br+' | 'commercial';

export type Unit = {
  id: string;
  propertyId: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
  floorNumber: number;
  size: {
    value: number;
    unit: 'sqft' | 'sqm';
  };
  rent: {
    amount: number;
    currency: string;
    period: 'monthly' | 'yearly';
  };
  bedrooms: number;
  bathrooms: number;
  photos: PropertyPhoto[];
  documents: PropertyDocument[];
  amenities: PropertyAmenity[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastMaintenanceDate?: string;
  nextInspectionDate?: string;
};

export interface PropertyFilters {
  type?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: UnitStatus[];
  amenities?: string[];
  city?: string;
  state?: string;
} 