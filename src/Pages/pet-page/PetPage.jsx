import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

import PetPhotos from './components/pet-photos';
import PetDetails from './components/pet-details';
import './PetPage.css';

function PetPage() {
    const { petId } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPet = async () => {
            if (!petId) return; 
            setLoading(true);
            
            // CORREÇÃO: A consulta agora busca o pet, seu perfil E suas fotos da nova tabela
            const { data, error } = await supabase
                .from('Animais')
                .select(`
                    *,
                    profiles (*),
                    pet_photos (*)
                `)
                .eq('id', petId)
                .single();

            if (error) {
                console.error("Erro ao buscar dados do pet:", error);
            } else {
                setPet(data);
            }
            setLoading(false);
        };

        fetchPet();
    }, [petId]);

    if (loading) {
        return <div className="pet-page-loading">Carregando informações do pet...</div>;
    }

    

    if (!pet) {
        return <div className="pet-page-error">Pet não encontrado.</div>;
    }

    return (
        <div className="pet-page-container">
            {/* Os componentes filhos recebem os dados do pet normalmente */}
            <PetPhotos pet={pet} />
            <PetDetails pet={pet} />
        </div>
    );
}

export default PetPage;