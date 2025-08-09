import React from 'react';
import { IoLocationSharp } from "react-icons/io5";

function MissingCard({ animal, onInfoClick }) {
  return (
    <div className="animal-card">
      <img src={animal.foto} alt={`Foto do ${animal.petName || animal.nome}`} />
      <div className="animal-info">
        <h3>{animal.petName || animal.nome || 'Animal Desconhecido'}</h3>
        <p className="animal-breed">{animal.breed || animal.raca || 'Desconhecida'} • {animal.species || animal.especie}</p>
        {(animal.lastSeenAddress || animal.ultimaLocalizacao) && (
          <p className="animal-location">
            <IoLocationSharp /> <strong>Última localização:</strong> {animal.lastSeenAddress || animal.ultimaLocalizacao}
          </p>
        )}
        {(animal.lastSeenDate || animal.dataDesaparecimento) && (
          <p className="animal-date">
            <strong>Desaparecido em:</strong> {new Date(animal.lastSeenDate || animal.dataDesaparecimento).toLocaleDateString()}
          </p>
        )}
        <button 
          className="btn-alert" 
          onClick={() => onInfoClick(animal)}
        >
          Tenho informações
        </button>
      </div>
    </div>
  );
}

export default MissingCard;
