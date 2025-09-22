import { useState, useEffect } from 'react';
import { MapPin, Navigation, List, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Issue } from './IssueCard';
import { cn } from '@/lib/utils';

interface MapViewProps {
  issues: Issue[];
  onIssueSelect: (issue: Issue) => void;
  showList: boolean;
  onToggleView: () => void;
}

interface MapMarker extends Issue {
  lat: number;
  lng: number;
}

export const MapView = ({ issues, onIssueSelect, showList, onToggleView }: MapViewProps) => {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock map markers with coordinates
  const mapMarkers: MapMarker[] = issues.map((issue, index) => ({
    ...issue,
    lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Mumbai area with random offset
    lng: 72.8777 + (Math.random() - 0.5) * 0.1,
  }));

  const getMarkerColor = (status: Issue['status']) => {
    switch (status) {
      case 'resolved': return 'bg-success';
      case 'in_progress': return 'bg-primary';
      case 'rejected': return 'bg-destructive';
      default: return 'bg-warning';
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleCurrentLocation = () => {
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
  };

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Mock street lines */}
              <path d="M0,100 L400,120" stroke="#666" strokeWidth="2" opacity="0.3" />
              <path d="M0,200 L400,180" stroke="#666" strokeWidth="2" opacity="0.3" />
              <path d="M100,0 L120,300" stroke="#666" strokeWidth="2" opacity="0.3" />
              <path d="M300,0 L280,300" stroke="#666" strokeWidth="2" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Issue Markers */}
        {mapMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${((marker.lng - 72.8) / 0.2) * 100}%`,
              top: `${((19.15 - marker.lat) / 0.15) * 100}%`,
            }}
            onClick={() => handleMarkerClick(marker)}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
              getMarkerColor(marker.status),
              selectedMarker?.id === marker.id && "scale-125"
            )}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </div>
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${((userLocation.lng - 72.8) / 0.2) * 100}%`,
              top: `${((19.15 - userLocation.lat) / 0.15) * 100}%`,
            }}
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="shadow-lg"
          onClick={onToggleView}
        >
          {showList ? <MapIcon className="h-4 w-4" /> : <List className="h-4 w-4" />}
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          className="shadow-lg"
          onClick={handleCurrentLocation}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Marker Popup */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-4 shadow-lg animate-slide-up">
            <div className="flex gap-3">
              {selectedMarker.image && (
                <img
                  src={selectedMarker.image}
                  alt={selectedMarker.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-foreground truncate">
                    {selectedMarker.title}
                  </h3>
                  <Badge className={cn("flex-shrink-0 text-xs", getMarkerColor(selectedMarker.status))}>
                    {selectedMarker.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {selectedMarker.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {selectedMarker.location}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onIssueSelect(selectedMarker)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setSelectedMarker(null)}
            >
              ×
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};