import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 1. Importe useParams
import { useAuth } from "@/context/AuthContext";   // Importe useAuth
import { supabase } from "../../supabaseClient";    // Importe Supabase

import "./profile.css";

import ProfileData from "./components/profileData.jsx";
import Gallery from "./components/gallery.jsx";
import Pets from "./components/pets.jsx";
import Adoptions from "./components/adoptions.jsx";
import Likes from "./components/likes.jsx";
import FloatingActionButton from "./components/FloatingActionButton.jsx"; // Importe o botão flutuante

function Profile() {
    const [activeTab, setActiveTab] = useState('galeria');
    
    // 2. Estados para guardar o perfil que está sendo visualizado
    const [viewedProfile, setViewedProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    const { userId } = useParams(); // Pega o ':userId' da URL
    const { user: currentUser } = useAuth(); // Pega o usuário logado

    // 3. Efeito que busca os dados do perfil com base na URL
    useEffect(() => {
        const fetchProfile = async () => {
            setLoadingProfile(true);

            const profileIdToFetch = userId || currentUser?.id;

            if (!profileIdToFetch) {
                setLoadingProfile(false);
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*') // Busca todas as colunas, incluindo a 'bio'
                .eq('id', profileIdToFetch)
                .single();

            if (error) {
                console.error("Erro ao buscar perfil:", error);
                setViewedProfile(null);
            } else {
                setViewedProfile(data);
            }
            setLoadingProfile(false);
        };

        fetchProfile();
    }, [userId, currentUser]); // Roda sempre que a URL ou o usuário logado mudar

    const renderActiveComponent = () => {
        if (!viewedProfile) return null;
        switch (activeTab) {
            case 'galeria': return <Gallery userId={viewedProfile.id} />;
            case 'pets': return <Pets userId={viewedProfile.id} />;
            case 'adocao': return <Adoptions userId={viewedProfile.id} />;
            case 'curtidas': return <Likes userId={viewedProfile.id} />;
            default: return <Gallery userId={viewedProfile.id} />;
        }
    };
    
    if (loadingProfile) {
        return <div className="profile-loading">Carregando perfil...</div>;
    }
    if (!viewedProfile) {
        return <div className="profile-error">Este perfil não foi encontrado.</div>;
    }

    const isOwnProfile = currentUser && currentUser.id === viewedProfile.id;

    return (
        <div className="profile-container">
            {/* 4. Passa o perfil encontrado como prop para o ProfileData */}
            <ProfileData profile={viewedProfile} />

            <section className="profile-section">
                <nav className="profile-nav">
                    <ul>
                        <li className={activeTab === 'galeria' ? 'active' : ''} onClick={() => setActiveTab('galeria')}>Galeria</li>
                        <li className={activeTab === 'pets' ? 'active' : ''} onClick={() => setActiveTab('pets')}>Pets</li>
                        <li className={activeTab === 'adocao' ? 'active' : ''} onClick={() => setActiveTab('adocao')}>Adoção</li>
                        <li className={activeTab === 'curtidas' ? 'active' : ''} onClick={() => setActiveTab('curtidas')}>Curtidas</li>
                    </ul>
                </nav>
                <div className="profile-grid">
                    {renderActiveComponent()}
                </div>
            </section>
            <FloatingActionButton isOwnProfile={isOwnProfile} />
        </div>
    );
}

export default Profile;