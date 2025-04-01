import { NearbyAmenity } from '@/types/maps';

export class AmenitiesService {
  private placesService: google.maps.places.PlacesService;

  constructor(map: google.maps.Map) {
    this.placesService = new google.maps.places.PlacesService(map);
  }

  async searchNearbyAmenities(
    location: google.maps.LatLngLiteral,
    types: string[],
    radius: number
  ): Promise<NearbyAmenity[]> {
    const amenities: NearbyAmenity[] = [];

    for (const type of types) {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: type as google.maps.places.PlaceType
      };

      try {
        const results = await this.searchPlaces(request);
        const mappedAmenities = results.map(place => ({
          id: place.place_id!,
          name: place.name!,
          type: type as NearbyAmenity['type'],
          latitude: place.geometry!.location!.lat(),
          longitude: place.geometry!.location!.lng(),
          distance: google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(location.lat, location.lng),
            place.geometry!.location!
          )
        }));
        amenities.push(...mappedAmenities);
      } catch (error) {
        console.error(`Error fetching ${type} amenities:`, error);
      }
    }

    return amenities;
  }

  private searchPlaces(request: google.maps.places.PlaceSearchRequest): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve, reject) => {
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places API returned status: ${status}`));
        }
      });
    });
  }
}