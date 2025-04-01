export interface PropertyLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  title: string;
  price: number;
  propertyType: 'apartment' | 'house' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  status: 'available' | 'sold' | 'rented';
}

export interface MapFilters {
  propertyType?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  bedrooms?: number;
  amenities?: string[];
  radius?: number; // in kilometers
}

export interface NearbyAmenity {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'market' | 'transport' | 'restaurant';
  latitude: number;
  longitude: number;
  distance: number; // in meters
}