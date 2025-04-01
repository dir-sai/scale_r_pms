import { Button } from '@/components/ui/button';
import { MapIcon, LocationIcon, LayersIcon } from '@/components/ui/icons';

interface MapControlsProps {
  onMyLocationClick: () => void;
  onLayerChange?: (layer: string) => void;
}

export function MapControls({ onMyLocationClick, onLayerChange }: MapControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={onMyLocationClick}
        title="My Location"
      >
        <LocationIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="secondary"
        size="icon"
        onClick={() => onLayerChange?.('satellite')}
        title="Change Map Layer"
      >
        <LayersIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}