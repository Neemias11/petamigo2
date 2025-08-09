import React, { useState, useEffect } from "react";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom"; 
import { supabase } from "../../supabaseClient";
import { TbSettingsFilled, TbMoonFilled, TbSunFilled } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { HiVideoCamera } from "react-icons/hi";
import { GoHomeFill } from "react-icons/go";
import { LuLogOut } from "react-icons/lu";
import { MdError } from "react-icons/md";
import logo from "@/assets/logo.png";


// A lógica getInitialTheme e useEffect para o tema permanecem as mesmas
const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs === 'dark';
        }
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return true;
        }
    }
    return false;
};

function Navbar() {
    const [isNightMode, setIsNightMode] = useState(getInitialTheme);
    const navigate = useNavigate();

    useEffect(() => {
        if (isNightMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            window.localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            window.localStorage.setItem('theme', 'light');
        }
    }, [isNightMode]);

    const toggleNightMode = () => {
        setIsNightMode(prevMode => !prevMode);
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Erro ao fazer logout:', error);
        } else {
            navigate('/'); 
        }
    };

    return (
        <nav className="sidebar">
            <ul>
                <li className="sidebar-item-logo">
                    <NavLink to="/home" className="sidebar-logo" end>
                        <span className="sidebar-icon">
                            <img src={logo} alt="petamigologo" />
                        </span>
                        <h3 className="sidebar-text-logo">Pet Amigo</h3>
                    </NavLink>
                </li>
                
                <li className="sidebar-item">
                    <NavLink to="/home" end>
                        <span className="sidebar-icon"><GoHomeFill /></span>
                        <span className="sidebar-text">Início</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/feed">
                        <span className="sidebar-icon"><HiVideoCamera /></span>
                        <span className="sidebar-text">Feed</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/chat">
                        <span className="sidebar-icon"><IoChatbubbleEllipses /></span>
                        <span className="sidebar-text">Comunidade</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                   <NavLink to="/missinganimal">
                       <span className="sidebar-icon"><MdError /></span>
                       <span className="sidebar-text">Desaparecidos</span>
                   </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/profile">
                        <span className="sidebar-icon"><FaUser /></span>
                        <span className="sidebar-text">Perfil</span>
                    </NavLink>
                </li>

                <li className="sidebar-item sidebar-item-push-to-bottom">
                    <NavLink to="/settings">
                        <span className="sidebar-icon"><TbSettingsFilled /></span>
                        <span className="sidebar-text">Settings</span>
                    </NavLink>
                </li>
                
                <li className="sidebar-item night-mode-item" onClick={toggleNightMode}>
                    <span className="sidebar-icon">{isNightMode ? <TbSunFilled /> : <TbMoonFilled />}</span>
                    <span className="sidebar-text">Modo Noturno</span>
                    <label className="switch" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isNightMode} onChange={toggleNightMode} id="night-mode-toggle" name="nightMode" />
                        <span className="slider"></span>
                    </label>
                </li>
                
                {/* CORREÇÃO: Adicionada a classe .sidebar-item ao <li> pai do botão */}
                <li className="sidebar-item">
                    <button onClick={handleSignOut} className="logout-button">
                        <span className="sidebar-icon">
                            <LuLogOut />
                        </span>
                        <span className="sidebar-text">Logout</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;