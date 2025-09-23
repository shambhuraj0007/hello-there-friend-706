// LocationPicker.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";

// custom marker icon (Leaflet requires manual handling of icon paths)
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationPicker({ reportData, setReportData }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!currentLocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation([latitude, longitude]);
        setReportData((prev) => ({ ...prev, locationCoords: [latitude, longitude] }));
      });
    }
  }, [currentLocation, setReportData]);

  function LocationMarker() {
    const map = useMapEvents({});

    return currentLocation ? (
      <Marker
        position={reportData.locationCoords || currentLocation}
        draggable
        icon={customIcon}
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            const distance = map.distance(currentLocation, [lat, lng]);

            if (distance <= 1000) {
              setReportData((prev) => ({ ...prev, locationCoords: [lat, lng] }));
            } else {
              e.target.setLatLng(reportData.locationCoords || currentLocation);
              alert("You can only move the pin within 1 km radius of detected location.");
            }
          },
        }}
      />
    ) : null;
  }

  return currentLocation ? (
    <div className="h-64 w-full rounded-lg overflow-hidden">
      <MapContainer center={currentLocation} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        />
        {/* 1 km circle */}
        <Circle center={currentLocation} radius={1000} color="blue" />
        <LocationMarker />
      </MapContainer>
    </div>
  ) : null;
}
// Note: Ensure to install react-leaflet and leaflet packages