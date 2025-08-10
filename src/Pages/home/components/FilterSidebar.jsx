// home/components/FilterSidebar.jsx
import React from "react";
import "./FilterSidebar.css";

function FilterSidebar({ isOpen, onClose }) {
    // Usando uma classe CSS para animar a entrada e saída
    const sidebarClass = isOpen ? "filter-sidebar is-open" : "filter-sidebar";

    return (
        <>
            {/* O overlay que aparece quando a barra está aberta */}
            {isOpen && <div className="filter-overlay" onClick={onClose}></div>}
            <div className={sidebarClass}>
                <button className="close-button" onClick={onClose}>Fechar</button>
                <h3>Filtrar por:</h3>

                <div className="filter-group">
                    <label htmlFor="species-filter">Espécie:</label>
                    <select id="species-filter">
                        <option value="">Todas</option>
                        <option>Cachorro</option>
                        <option>Gato</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="race-filter">Raça:</label>
                    <select id="race-filter">
                        <option value="">Todas</option>
                        <option>Viralata</option>
                        <option>Golden Retriever</option>
                        <option>Pug</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label htmlFor="age-filter">Idade:</label>
                    <select id="age-filter">
                        <option value="">Todas</option>
                        <option>Filhote</option>
                        <option>Adulto</option>
                        <option>Idoso</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="location-filter">Localização:</label>
                    <select id="location-filter">
                        <option value="">Todas</option>
                        <option>Rio de Janeiro, RJ</option>
                        <option>São Paulo, SP</option>
                    </select>
                </div>
            </div>
        </>
    );
}

export default FilterSidebar;