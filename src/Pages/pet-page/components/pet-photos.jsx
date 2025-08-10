import React, { useState, useEffect } from 'react';

function PetPhotos({ pet }) {
    console.log("Dados recebidos no PetPhotos:", pet);

    const [mainPhoto, setMainPhoto] = useState('');

    // Agora recebemos um array de objetos de foto
    const photos = pet.pet_photos || [];

    useEffect(() => {
        if (photos.length > 0) {
            // Procura pela foto marcada como 'is_cover'
            const coverPhoto = photos.find(p => p.is_cover);
            // Se encontrar, define como principal. Se não, usa a primeira da lista.
            setMainPhoto(coverPhoto ? coverPhoto.url : photos[0].url);
        }
    }, [photos]);

    const handleThumbnailClick = (photoUrl) => {
        setMainPhoto(photoUrl);
    };

    return (
        <section className="pet-photos">
            <div className="main-photo-container">
                {mainPhoto ? (
                    <img src={mainPhoto} alt={`Foto principal de ${pet.name}`} className="main-photo" />
                ) : (
                    <div className="main-photo-placeholder">Sem imagem</div>
                )}
            </div>
            
            <div className="photo-thumbnails">
                {/* O map agora itera sobre os objetos e usa 'photo.url' */}
                {photos.map((photo) => (
                    <img
                        key={photo.id}
                        src={photo.url}
                        alt={`Miniatura de ${pet.name}`}
                        className={mainPhoto === photo.url ? 'active' : ''}
                        onClick={() => handleThumbnailClick(photo.url)}
                    />
                ))}
            </div>
        </section>
    );
}

export default PetPhotos;