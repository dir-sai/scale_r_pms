import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { PropertyLocation, MapFilters, NearbyAmenity } from '@/types/maps';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { MapControls } from './MapControls';
import { MapFiltersPanel } from './MapFiltersPanel';
import { AmenitiesService } from '@/services/amenities';
import { DirectionsService } from '@/services/directions';
import { MARKER_ICONS } from './markers';

const DEFAULT_CENTER = {
  lat: 5.6037, // Accra coordinates
  lng: -0.1870
};

const DEFAULT_ZOOM = 12;

interface PropertyMapProps {
  properties: PropertyLocation[];
  onPropertySelect?: (property: PropertyLocation) => void;
  height?: string;
  width?: string;
}

export function PropertyMap({
  properties,
  onPropertySelect,
  height = '600px',
  width = '100%'
}: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyLocation | null>(null);
  const [filters, setFilters] = useState<MapFilters>({});
  const [amenities, setAmenities] = useState<NearbyAmenity[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<DirectionsService | null>(null);
  const [amenitiesService, setAmenitiesService] = useState<AmenitiesService | null>(null);

  const mapContainerStyle = {
    width,
    height,
  };

  const options: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
      // Custom map styles for Ghana context
      // Will add specific styling here
    ],
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      setDirectionsService(new DirectionsService(mapRef.current));
      setAmenitiesService(new AmenitiesService(mapRef.current));
    }
  }, [mapRef.current]);

  const filteredProperties = properties.filter((property) => {
    // Implement filtering logic based on filters state
    return true; // Placeholder
  });

  const handleMarkerClick = (property: PropertyLocation) => {
    setSelectedProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }
  };

  const handleGetDirections = async (property: PropertyLocation) => {
    if (!userLocation || !directionsService) return;

    try {
      await directionsService.getDirections(
        userLocation,
        { lat: property.latitude, lng: property.longitude }
      );
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };

  const handleFetchAmenities = async (property: PropertyLocation) => {
    if (!amenitiesService || !filters.amenities?.length) return;

    try {
      const nearby = await amenitiesService.searchNearbyAmenities(
        { lat: property.latitude, lng: property.longitude },
        filters.amenities,
        (filters.radius || 5) * 1000 // Convert km to meters
      );
      setAmenities(nearby);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          options={options}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {filteredProperties.map((property) => (
            <Marker
              key={property.id}
              position={{
                lat: property.latitude,
                lng: property.longitude,
              }}
              onClick={() => handleMarkerClick(property)}
              icon={MARKER_ICONS[property.propertyType]}
            />
          ))}

          {amenities.map((amenity) => (
            <Marker
              key={amenity.id}
              position={{
                lat: amenity.latitude,
                lng: amenity.longitude,
              }}
              icon={{
                url: `/markers/amenities/${amenity.type}.svg`,
                scaledSize: new google.maps.Size(24, 24),
              }}
            />
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.latitude,
                lng: selectedProperty.longitude,
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div className="property-card-container">
                <PropertyCard property={selectedProperty} compact />
                <button
                  className="get-directions-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGetDirections(selectedProperty);
                  }}
                  disabled={!userLocation}
                >
                  {!userLocation ? 'Location access needed' : 'Get Directions'}
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <MapControls
        onMyLocationClick={() => {
          if (userLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
          }
        }}
      />

      <MapFiltersPanel
        filters={filters}
        onChange={setFilters}
        className="absolute top-4 left-4 bg-white rounded-lg shadow-lg"
      />
    </div>
  );
}


