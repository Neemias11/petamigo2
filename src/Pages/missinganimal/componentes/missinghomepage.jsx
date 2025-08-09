import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import MissingCard from './missingcard';
import MissingForm from "../Componentes/MissingForm.jsx";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './missing.css';

const MissingHomePage = () => {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    latitude: -23.5505, 
    longitude: -46.6333
  });
  const [showModal, setShowModal] = useState(false);

  // Depuração: mostrar array de animais sempre que renderizar
  console.log('Animais renderizados:', animais);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => console.log('Permissão de localização negada')
      );
    }
    // Busca animais do Supabase
    const fetchAnimais = async () => {
      const { data, error } = await supabase.from('missing_animals').select('*');
      if (!error) setAnimais(data || []);
      setLoading(false);
    };
    fetchAnimais();
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!loading) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      const map = L.map('map-container').setView([userLocation.latitude, userLocation.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      animais.forEach(animal => {
        if (animal.latitude && animal.longitude) {
          L.marker([animal.latitude, animal.longitude])
            .addTo(map)
            .bindPopup(`
              <strong>${animal.nome}</strong><br>
              ${animal.especie}<br>
              Desaparecido em: ${new Date(animal.dataDesaparecimento).toLocaleDateString()}
            `);
        }
      });
      return () => {
        map.remove();
      };
    }
  }, [loading, animais, userLocation]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando animais desaparecidos...</p>
      </div>
    );
  // Depuração: mostrar array de animais sempre que renderizar
  console.log('Animais renderizados:', animais);
  }

  return (
    <div className="missing-home-container">
      <div className="header-section">
        <h1>Animais Desaparecidos na Sua Região</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-report"
        >
          <i className="icon-plus"></i> Reportar Desaparecimento
        </button>
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)} />
            <MissingForm 
              // Cadastro agora é feito direto no Supabase pelo MissingForm
            />
          </div>
        </div>
      )}

      <div className="map-section">
        <div className="map-container">
          <div id="map-container" style={{ height: '400px', borderRadius: '8px' }}></div>
          <div className="map-legend">
            <span><div className="legend-icon"></div> Localização de animais desaparecidos</span>
          </div>
        </div>
      </div>

      <div className="animal-list-section">
        <h2>Últimos Animais Reportados</h2>
        {animais.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum animal desaparecido reportado na sua região ainda.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-report"
            >
              Seja o primeiro a reportar
            </button>
          </div>
        ) : (
          <div className="animal-cards-grid">
            {animais.map(animal => (
              <MissingCard 
                key={animal.id}
                animal={animal}
                onInfoClick={a => alert(`Informações de contato: ${a.contato}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissingHomePage;