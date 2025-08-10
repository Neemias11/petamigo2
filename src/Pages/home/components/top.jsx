// home/components/top.jsx
import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaFilter } from "react-icons/fa6";
import { RiHeart3Fill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import DefaultAvatar from "@/assets/default-avatar.png";
import { useAuth } from "@/context/AuthContext.jsx";

// 1. Adicionando onOpenSidebar como prop
function Top({ searchTerm, setSearchTerm, onOpenSidebar }) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="top-container">
                <div className="search-bar-container-placeholder"></div>
                <div className="top-actions-placeholder"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="top-container">
                {/* ... */}
            </div>
        );
    }

    const displayName = profile.user_type === 'ONG' ? profile.nome_ong : profile.nome_exibicao || profile.nome_completo;
    const avatarUrl = profile.avatar_url || DefaultAvatar;

    return (
        <div className="top-container">
            <Link to="/auth" className="top-logo">
                <img src={logo} alt="" />
            </Link>
            <div className="search-bar-container">
                <CiSearch className="search-icon" />
                <input
                    id="animal-search"
                    name="search_query"
                    className="search-input"
                    type="text"
                    placeholder="Pesquisar animal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* 2. Adicionando o evento onClick para abrir a sidebar */}
                <button className="filter-button" onClick={onOpenSidebar}>
                    <FaFilter className="filter-icon" />
                </button>
            </div>
            <div className="top-actions">
                <button className="like-button">
                    <RiHeart3Fill />
                </button>
                <button className="notification-button">
                    <IoNotifications />
                </button>
                <Link to="/profile" className="profile-box">
                    <img src={avatarUrl} alt="foto de perfil" />
                    <div>
                        <h3>{displayName}</h3>
                        <span>{user.email}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Top;