import { Cache } from '../utils/cache';

interface MapsConfig {
  apiKey: string;
  maxCacheAge: number; // in milliseconds
  maxCacheSize: number; // number of items
}

export class MapsService {
  private static instance: MapsService;
  private cache: Cache;
  private apiKey: string;

  private constructor(config: MapsConfig) {
    this.apiKey = config.apiKey;
    this.cache = new Cache({
      maxAge: config.maxCacheAge,
      maxSize: config.maxCacheSize
    });
  }

  public static getInstance(config: MapsConfig): MapsService {
    if (!MapsService.instance) {
      MapsService.instance = new MapsService(config);
    }
    return MapsService.instance;
  }

  async getNearbyPlaces(
    location: { lat: number; lng: number },
    type: string,
    radius: number
  ): Promise<any[]> {
    const cacheKey = `places-${location.lat}-${location.lng}-${type}-${radius}`;
    
    try {
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;

      const response = await fetch(`/api/maps/places/nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, type, radius })
      });

      if (!response.ok) {
        throw new Error(`Maps API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Maps service error:', error);
      throw error;
    }
  }

  // Add monitoring
  private async logApiUsage(endpoint: string, success: boolean) {
    try {
      await fetch('/api/monitoring/maps-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint,
          success,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log Maps API usage:', error);
    }
  }
}