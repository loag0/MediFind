import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (latlng: { lat: number; lng: number }) => void;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  function MarkerUpdater() {
    useMapEvents({
      click(e) {
        onChange(e.latlng);
      },
    });
    return value ? <Marker position={value} /> : null;
  }

  return (
    <div className="map-section">
      <label>Select Location on Map:</label>
      <MapContainer
        center={value || { lat: -24.6581, lng: 25.9122 }}
        zoom={13}
        style={{ height: '400px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerUpdater />
      </MapContainer>

      <p style={{ marginTop: '10px', color: 'black' }}>
        Selected: {value?.lat?.toFixed(6)}, {value?.lng?.toFixed(6)}
      </p>
    </div>
  );
}
