// home/components/animalcard.jsx
import React from 'react';
import { IoLocationSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import DefaultPetImage from '@/assets/error-image.png'; // 1. Crie uma imagem padrão

function AnimalCard({ animal }) {
    // 2. LÓGICA PARA ENCONTRAR A FOTO DE CAPA
    const photos = animal.pet_photos || [];
    let photoUrl = DefaultPetImage; // Começa com a imagem padrão

    if (photos.length > 0) {
        // Procura pela foto marcada como 'is_cover'
        const coverPhoto = photos.find(p => p.is_cover === true);
        // Se encontrar, usa a URL dela. Se não, usa a URL da primeira foto da lista.
        photoUrl = coverPhoto ? coverPhoto.url : photos[0].url;
    }

    return (
        <Link to={`/pet/${animal.id}`} className="animal-card">
            {/* 3. Usa a URL da foto encontrada */}
            <img src={photoUrl} alt={`Foto do ${animal.name}`} />
            <div className="animal-info">
                <h3>{animal.name}</h3>
                <p className="animal-breed">{animal.race} • {animal.species}</p>
                {animal.location && (
                    <p className="animal-location">
                        <IoLocationSharp />
                        {animal.location}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default AnimalCard;