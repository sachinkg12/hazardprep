'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface HazardMapProps {
  latitude: number;
  longitude: number;
  address: string;
  overallScore: number;
  overallLevel: string;
}

// Leaflet must be loaded client-side only
function MapInner({ latitude, longitude, address, overallScore, overallLevel }: HazardMapProps) {
  const [ready, setReady] = useState(false);
  const [L, setL] = useState<typeof import('leaflet') | null>(null);
  const [RL, setRL] = useState<typeof import('react-leaflet') | null>(null);

  useEffect(() => {
    Promise.all([import('leaflet'), import('react-leaflet')]).then(([leaflet, reactLeaflet]) => {
      // Fix default marker icon
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setL(leaflet);
      setRL(reactLeaflet);
      setReady(true);
    });
  }, []);

  if (!ready || !RL) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        Loading map...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Circle } = RL;

  const riskColor =
    overallLevel === 'very_high' || overallLevel === 'high'
      ? '#ef4444'
      : overallLevel === 'moderate'
        ? '#eab308'
        : '#22c55e';

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <strong>{address}</strong>
            <br />
            Risk Score: {overallScore}/100
          </Popup>
        </Marker>
        <Circle
          center={[latitude, longitude]}
          radius={15000}
          pathOptions={{
            color: riskColor,
            fillColor: riskColor,
            fillOpacity: 0.1,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
}

// Prevent SSR for the map
export const HazardMap = dynamic(() => Promise.resolve(MapInner), { ssr: false });
