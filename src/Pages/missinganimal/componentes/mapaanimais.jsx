import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrige o problema dos ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaAnimais = ({ animais, userLocation }) => {
  return (
    <MapContainer
      center={[userLocation.latitude, userLocation.longitude]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {animais.map(animal => (
        animal.latitude && animal.longitude && (
          <Marker key={animal.id} position={[animal.latitude, animal.longitude]}>
            <Popup>
              <strong>{animal.nome}</strong><br />
              {animal.especie}<br />
              Desaparecido em: {new Date(animal.dataDesaparecimento).toLocaleDateString()}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapaAnimais;
