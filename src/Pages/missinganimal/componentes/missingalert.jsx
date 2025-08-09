import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import './missing.css';

// Configuração dos ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone personalizado para animais desaparecidos
const missingPetIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/194/194279.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MissingAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    species: '',
    location: '',
    date: '',
    status: 'active'
  });
  const [mapCenter, setMapCenter] = useState([-23.5505, -46.6333]); // Centro inicial (ex: São Paulo)
  const [selectedAlert, setSelectedAlert] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/missing-pets', {
        params: filters,
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setAlerts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar alertas. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setMapCenter([alert.latitude, alert.longitude]);
    
    // Scroll suave para o mapa
    document.querySelector('.alerts-map').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getSpeciesLabel = (species) => {
    switch(species) {
      case 'dog': return 'Cachorro';
      case 'cat': return 'Gato';
      case 'bird': return 'Pássaro';
      default: return 'Outro';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': 
        return <span className="status-badge active">Ativo</span>;
      case 'found':
        return <span className="status-badge found">Encontrado</span>;
      default:
        return <span className="status-badge inactive">Inativo</span>;
    }
  };

  return (
    <div className="missing-alert-container">
      <div className="alert-header">
        <h2 className="alert-title">Alertas de Animais Desaparecidos</h2>
        <p className="alert-subtitle">Ajude a encontrar animais perdidos na sua região</p>
      </div>
      
      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="species-filter">Espécie</label>
          <select 
            id="species-filter" 
            name="species"
            value={filters.species}
            onChange={handleFilterChange}
          >
            <option value="">Todas</option>
            <option value="dog">Cachorro</option>
            <option value="cat">Gato</option>
            <option value="bird">Pássaro</option>
            <option value="other">Outro</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="location-filter">Localização</label>
          <input 
            type="text" 
            id="location-filter" 
            name="location"
            placeholder="Cidade ou bairro"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="date-filter">Data</label>
          <input 
            type="date" 
            id="date-filter" 
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select 
            id="status-filter" 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="active">Ativos</option>
            <option value="found">Encontrados</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="alert-content">
        {/* Lista de Alertas */}
        <div className="alerts-list">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando alertas...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchAlerts} className="retry-button">
                Tentar novamente
              </button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="no-results">
              <p>Nenhum animal encontrado com esses filtros</p>
              <button 
                onClick={() => setFilters({
                  species: '',
                  location: '',
                  date: '',
                  status: 'active'
                })} 
                className="clear-filters"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`alert-card ${selectedAlert?.id === alert.id ? 'selected' : ''}`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="alert-image">
                  {alert.photos[0] && (
                    <img src={alert.photos[0].url} alt={alert.petName} />
                  )}
                </div>
                <div className="alert-info">
                  <div className="alert-header">
                    <h3>{alert.petName}</h3>
                    {getStatusBadge(alert.status)}
                  </div>
                  
                  <div className="alert-details">
                    <p><strong>Espécie:</strong> {getSpeciesLabel(alert.species)}</p>
                    <p><strong>Raça:</strong> {alert.breed || 'Não informada'}</p>
                    <p><strong>Desaparecido em:</strong> {formatDate(alert.lastSeenDate)}</p>
                    <p><strong>Local:</strong> {alert.lastSeenAddress}</p>
                  </div>
                  
                  <div className="alert-footer">
                    <p className="contact-info">Contato: {alert.contactPhone}</p>
                    {alert.reward && (
                      <p className="reward">Recompensa: {alert.reward}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Mapa */}
        <div className="alerts-map">
          <h3 className="map-title">Localização no Mapa</h3>
          
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {alerts.map(alert => (
              <Marker 
                key={alert.id} 
                position={[alert.latitude, alert.longitude]}
                icon={missingPetIcon}
                eventHandlers={{
                  click: () => handleAlertClick(alert)
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <div className="popup-image">
                      {alert.photos[0] && (
                        <img src={alert.photos[0].url} alt={alert.petName} />
                      )}
                    </div>
                    <h4>{alert.petName}</h4>
                    <p>Desaparecido em: {formatDate(alert.lastSeenDate)}</p>
                    <p>Status: {getStatusBadge(alert.status)}</p>
                    <Link 
                      to={`/missing-details/${alert.id}`} 
                      className="popup-link"
                    >
                      Ver detalhes completos
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {selectedAlert && (
            <div className="selected-alert-info">
              <h4>{selectedAlert.petName} - {getSpeciesLabel(selectedAlert.species)}</h4>
              <p><strong>Última localização:</strong> {selectedAlert.lastSeenAddress}</p>
              <p><strong>Data do desaparecimento:</strong> {formatDate(selectedAlert.lastSeenDate)}</p>
              <Link 
                to={`/missing-details/${selectedAlert.id}`} 
                className="details-button"
              >
                Ver detalhes completos
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Botão para reportar novo desaparecimento */}
      <div className="report-section">
        <p>Seu animal desapareceu?</p>
        <Link to="/missinganimal" className="report-button">
          Reportar desaparecimento
        </Link>
      </div>
    </div>
  );
};

export default MissingAlert;