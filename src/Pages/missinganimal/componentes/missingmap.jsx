import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrige o problema comum de ícones no Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// Novo: exibe marcadores de animais se prop for passada
// Modificação: busca endereço ao clicar no mapa e envia para o callback
const LocationMarker = ({ position, setPosition, exibirMarcadores, animais, onLocationSelect }) => {
  const map = useMapEvents({
    async click(e) {
      if (!exibirMarcadores && e.latlng && typeof e.latlng.lat === 'number' && typeof e.latlng.lng === 'number') {
        setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        map.flyTo(e.latlng, map.getZoom());
        // Busca endereço usando Nominatim
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
          const data = await response.json();
          if (onLocationSelect) {
            onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address: data.display_name || '' });
          }
        } catch (err) {
          if (onLocationSelect) {
            onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng, address: '' });
          }
        }
      }
    },
  });

  if (exibirMarcadores && Array.isArray(animais)) {
    return <>
      {animais.map(animal => (
        animal.latitude && animal.longitude && (
          <Marker key={animal.id} position={[animal.latitude, animal.longitude]}>
            <Popup>
              <strong>{animal.nome}</strong><br />
              {animal.especie}<br />
              Desaparecido em: {animal.dataDesaparecimento ? new Date(animal.dataDesaparecimento).toLocaleDateString() : ''}
            </Popup>
          </Marker>
        )
      ))}
    </>;
  }

  if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') return null;
  return (
    <Marker position={[position.lat, position.lng]}>
      <Popup>Última localização vista aqui</Popup>
    </Marker>
  );
};

// Modificação: prop onLocationSelect agora pode receber objeto com address
const MissingMap = ({ onLocationSelect, initialPosition, animais, userLocation, exibirMarcadores }) => {
  const mapRef = useRef(null);
  const [position, setPosition] = React.useState(
    initialPosition && typeof initialPosition.lat === 'number' && typeof initialPosition.lng === 'number'
      ? { lat: initialPosition.lat, lng: initialPosition.lng }
      : userLocation && userLocation.latitude && userLocation.longitude
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : { lat: -23.5505, lng: -46.6333 }
  );

  useEffect(() => {
    if (!exibirMarcadores && position && typeof position.lat === 'number' && typeof position.lng === 'number' && onLocationSelect) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect, exibirMarcadores]);

  const center = exibirMarcadores && userLocation && userLocation.latitude && userLocation.longitude
    ? [userLocation.latitude, userLocation.longitude]
    : [position.lat, position.lng];

  return (
    <div className="missing-map-container">
      <MapContainer
        center={center}
        zoom={13}
        ref={mapRef}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          exibirMarcadores={exibirMarcadores}
          animais={animais}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

export default MissingMap;