import { IntegrationService } from '../integrations/IntegrationService';

export interface PropertyListing {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  features: string[];
  amenities: string[];
  images: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
  videos?: Array<{
    url: string;
    thumbnail?: string;
    title?: string;
  }>;
  location: {
    address: string;
    city: string;
    region: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  availability: {
    status: 'available' | 'pending' | 'rented';
    availableFrom: Date;
    minimumStay?: number;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  leads: number;
}

export interface Lead {
  id: string;
  listingId: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredViewingDates?: Date[];
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'lost';
  source: 'website' | 'mobile_app' | 'referral' | 'social_media' | 'other';
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

export interface PropertyShowing {
  id: string;
  listingId: string;
  leadId: string;
  scheduledFor: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  attendees: Array<{
    name: string;
    email: string;
    phone?: string;
    role: 'agent' | 'prospect' | 'owner';
  }>;
  notes?: string;
  feedback?: {
    rating: number;
    comments: string;
    interestedIn: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class MarketingService extends IntegrationService {
  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid marketing service configuration');
    }
  }

  validateConfig(): boolean {
    return true;
  }

  async createListing(data: Omit<PropertyListing, 'id' | 'views' | 'leads' | 'createdAt' | 'updatedAt'>): Promise<PropertyListing> {
    return this.handleRequest(
      (async () => {
        const listing: PropertyListing = {
          id: `listing_${Date.now()}`,
          views: 0,
          leads: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return listing;
      })(),
      'Failed to create property listing'
    );
  }

  async updateListing(id: string, data: Partial<PropertyListing>): Promise<PropertyListing> {
    return this.handleRequest(
      (async () => {
        const listing: PropertyListing = {
          id,
          updatedAt: new Date(),
          ...data,
        } as PropertyListing;
        return listing;
      })(),
      'Failed to update property listing'
    );
  }

  async createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    return this.handleRequest(
      (async () => {
        const lead: Lead = {
          id: `lead_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return lead;
      })(),
      'Failed to create lead'
    );
  }

  async updateLeadStatus(id: string, status: Lead['status'], notes?: string): Promise<Lead> {
    return this.handleRequest(
      (async () => {
        const lead: Lead = {
          id,
          status,
          notes,
          updatedAt: new Date(),
          lastContactedAt: new Date(),
        } as Lead;
        return lead;
      })(),
      'Failed to update lead status'
    );
  }

  async scheduleShowing(data: Omit<PropertyShowing, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyShowing> {
    return this.handleRequest(
      (async () => {
        const showing: PropertyShowing = {
          id: `showing_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return showing;
      })(),
      'Failed to schedule property showing'
    );
  }

  async updateShowingStatus(
    id: string,
    status: PropertyShowing['status'],
    feedback?: PropertyShowing['feedback']
  ): Promise<PropertyShowing> {
    return this.handleRequest(
      (async () => {
        const showing: PropertyShowing = {
          id,
          status,
          feedback,
          updatedAt: new Date(),
        } as PropertyShowing;
        return showing;
      })(),
      'Failed to update showing status'
    );
  }

  async getListingAnalytics(listingId: string): Promise<{
    views: number;
    leads: number;
    showings: number;
    conversionRate: number;
  }> {
    return this.handleRequest(
      (async () => {
        return {
          views: 0,
          leads: 0,
          showings: 0,
          conversionRate: 0,
        };
      })(),
      'Failed to get listing analytics'
    );
  }
} 