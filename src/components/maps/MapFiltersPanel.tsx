import { useState } from 'react';
import { MapFilters } from '@/types/maps';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface MapFiltersPanelProps {
  filters: MapFilters;
  onChange: (filters: MapFilters) => void;
  className?: string;
}

const PROPERTY_TYPES = ['apartment', 'house', 'land', 'commercial'];
const AMENITIES = ['school', 'hospital', 'market', 'transport', 'restaurant'];

export function MapFiltersPanel({ filters, onChange, className }: MapFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePropertyTypeChange = (type: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onChange({ ...filters, propertyType: newTypes });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onChange({
      ...filters,
      priceRange: { min: values[0], max: values[1] }
    });
  };

  const handleRadiusChange = (value: number) => {
    onChange({ ...filters, radius: value });
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Property Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map(type => (
                <div key={type} className="flex items-center">
                  <Checkbox
                    id={type}
                    checked={(filters.propertyType || []).includes(type)}
                    onCheckedChange={() => handlePropertyTypeChange(type)}
                  />
                  <label htmlFor={type} className="ml-2 capitalize">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <Slider
              defaultValue={[0, 1000000]}
              min={0}
              max={1000000}
              step={10000}
              value={[
                filters.priceRange?.min || 0,
                filters.priceRange?.max || 1000000
              ]}
              onValueChange={handlePriceRangeChange}
            />
            <div className="flex justify-between mt-2">
              <span>₵{filters.priceRange?.min || 0}</span>
              <span>₵{filters.priceRange?.max || 1000000}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Search Radius (km)</h4>
            <Slider
              defaultValue={[5]}
              min={1}
              max={50}
              step={1}
              value={[filters.radius || 5]}
              onValueChange={([value]) => handleRadiusChange(value)}
            />
            <div className="text-center mt-2">
              {filters.radius || 5} km
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Show Nearby</h4>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <Checkbox
                    id={amenity}
                    checked={(filters.amenities || []).includes(amenity)}
                    onCheckedChange={() => {
                      const current = filters.amenities || [];
                      const updated = current.includes(amenity)
                        ? current.filter(a => a !== amenity)
                        : [...current, amenity];
                      onChange({ ...filters, amenities: updated });
                    }}
                  />
                  <label htmlFor={amenity} className="ml-2 capitalize">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onChange({})}
            >
              Reset
            </Button>
            <Button
              variant="default"
              onClick={() => setIsExpanded(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}