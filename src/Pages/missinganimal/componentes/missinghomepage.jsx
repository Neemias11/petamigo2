import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import MissingCard from './missingcard';
import MissingForm from "../Componentes/MissingForm.jsx";
import MissingMap from './missingmap';
import './missing.css';

const MissingHomePage = () => {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    latitude: -23.5505, 
    longitude: -46.6333
  });
  const [showModal, setShowModal] = useState(false);



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



  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando animais desaparecidos...</p>
      </div>
    );
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ padding: 0 }} onClick={e => e.stopPropagation()}>
            {/* Removido o botão X */}
            <MissingForm />
          </div>
        </div>
      )}

  <div className="map-section">
        <div className="map-container">
          <MissingMap
            animais={animais}
            userLocation={userLocation}
            exibirMarcadores={true}
          />
        </div>
      </div>

      <div className="animal-list-section">
        <h2>Últimos Animais Reportados</h2>
        {animais.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum animal desaparecido reportado na sua região ainda.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="submit-button"
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