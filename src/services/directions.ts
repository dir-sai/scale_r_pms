export class DirectionsService {
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4CAF50',
        strokeWeight: 5,
      }
    });
  }

  async getDirections(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ): Promise<google.maps.DirectionsResult> {
    const request: google.maps.DirectionsRequest = {
      origin,
      destination,
      travelMode,
    };

    try {
      const result = await this.directionsService.route(request);
      this.directionsRenderer.setDirections(result);
      return result;
    } catch (error) {
      console.error('Error getting directions:', error);
      throw error;
    }
  }

  clearDirections() {
    this.directionsRenderer.setDirections({ routes: [] });
  }
}