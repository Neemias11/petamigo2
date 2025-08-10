import React from "react";
import { FaShieldDog } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext.jsx";

// O componente recebe o 'profile' a ser exibido como uma prop
function ProfileData({ profile }) {
    // Usamos o useAuth apenas para saber quem é o usuário logado
    const { user: currentUser } = useAuth();

    // Verificamos se o perfil visualizado é o do próprio usuário logado
    const isOwnProfile = currentUser && currentUser.id === profile.id;

    // As variáveis agora usam o 'profile' recebido via props
    const displayName = profile.user_type === 'ONG' ? profile.nome_ong : profile.nome_exibicao;
    const fullName = profile.user_type === 'PESSOA' ? profile.nome_completo : profile.nome_responsavel;
    const avatarUrl = profile.avatar_url;
    const coverUrl = "https://api.duniagames.co.id/api/content/upload/file/11105134861635414697.jpg";

    return (
        <div className="profile-data-container">
            <div className="profile-banner" style={{ backgroundImage: `url(${coverUrl})` }}></div>
            <div className="profile-content">
                <div className="profile-header">
                    <img className="profilepage-picture" src={avatarUrl} alt={`Foto de perfil de ${displayName}`} />
                    
                    <div className="profile-details">
                        <div className="profile-name-badge">
                            <h1 className="profile-name">{displayName}</h1>
                            {profile.user_type === 'ONG' ? (
                                <div className="user-badge ong-badge">
                                    <FaShieldDog />
                                    <span>ONG</span>
                                </div>
                            ) : (
                                <div className="user-badge person-badge">
                                    <FaUserAlt />
                                    <span>Usuário</span>
                                </div>
                            )}
                        </div>

                        {fullName && <h3 className="profile-fullname">{fullName}</h3>}

                        <div className="profile-bio-section">
                            <p className="profile-bio">
                                {profile.description}
                            </p>
                        </div>
                        
                        <div className="profile-actions">
                            {isOwnProfile ? (
                                <button className="follow-button">Editar Perfil</button>
                            ) : (
                                <>
                                    <button className="message-button">Mensagem</button>
                                    <button className="follow-button">Seguir</button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ESTATÍSTICAS ESTÁTICAS RESTAURADAS */}
                    <ul className="profile-stats">
                        <li>Seguidores<span>2,345</span></li>
                        <li>Seguindo<span>1,275</span></li>
                        <li>Curtidas<span>443</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
 
export default ProfileData;