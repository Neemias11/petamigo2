import React from 'react';
import { Link } from 'react-router-dom';

function PetDetails({ pet }) {
    const owner = pet.profiles;
    if (!owner) {
        return <div className="pet-page-error">Responsável pelo pet não encontrado.</div>;
    }
    
    const ownerDisplayName = owner.user_type === 'ONG' ? owner.nome_ong : owner.nome_exibicao;

    return (
        <div className="pet-details-card">
            <div className="pet-header">
                <h1 className="pet-name">{pet.name}</h1>
                <div className="pet-tags">
                    <span className="tag">{pet.species}</span>
                    <span className="tag">{pet.race}</span>
                    <span className="tag">{pet.location}</span>
                </div>
            </div>
            <div className="pet-description">
                <h3>Descrição:</h3>
                <p>{pet.description}</p>
            </div>
            <div className="pet-owner-info">
                <h3>Responsável:</h3>
                <Link to={`/profile/${owner.id}`} className="owner-card">
                    <img src={owner.avatar_url} alt={`Foto de ${ownerDisplayName}`} />
                    <span>{ownerDisplayName || 'Nome não disponível'}</span>
                </Link>
            </div>
            <div className="pet-actions">
                <button className="action-button primary">Quero Adotar</button>
                <button className="action-button secondary">Enviar Mensagem</button>
            </div>
        </div>
    );
}

export default PetDetails;