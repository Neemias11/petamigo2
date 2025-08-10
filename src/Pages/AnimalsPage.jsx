import React, { useState, useEffect } from "react";
import Top from "@/components/Top.jsx";
import FilterSidebar from "@/components/FilterSidebar.jsx";
import AnimalCard from "@/components/AnimalCard.jsx";
import { supabase } from "@/services/supabaseClient.js";
import "./home.css"; // Certifique-se de criar este CSS


function AnimalsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    const [availableFilters, setAvailableFilters] = useState({
        species: [],
        race: [],
        location: []
    });

    const [appliedFilters, setAppliedFilters] = useState({
        species: "",
        race: "",
        location: ""
    });

    // Buscar animais com filtros e busca
    useEffect(() => {
        async function fetchAnimals() {
            setLoading(true);

            let query = supabase.from("animais").select("*");

            // Aplicar busca por nome
            if (searchTerm.trim() !== "") {
                query = query.ilike("name", `%${searchTerm.trim()}%`);
            }

            // Aplicar filtros
            if (appliedFilters.species) {
                query = query.eq("species", appliedFilters.species);
            }

            if (appliedFilters.race) {
                query = query.eq("race", appliedFilters.race);
            }

            if (appliedFilters.location) {
                query = query.eq("location", appliedFilters.location);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Erro ao buscar animais:", error);
            } else {
                setAnimals(data);
            }

            setLoading(false);
        }

        fetchAnimals();
    }, [searchTerm, appliedFilters]);

    // Buscar valores únicos para montar os filtros
    useEffect(() => {
        async function fetchFilterOptions() {
            const { data, error } = await supabase
                .from("animais")
                .select("species, race, location");

            if (error) {
                console.error("Erro ao buscar filtros:", error);
                return;
            }

            const unique = (arr) => [...new Set(arr.filter(Boolean))];

            setAvailableFilters({
                species: unique(data.map((a) => a.species)),
                race: unique(data.map((a) => a.race)),
                location: unique(data.map((a) => a.location))
            });
        }

        fetchFilterOptions();
    }, []);

    return (
        <div className="animals-page">
            <Top
                onSearchChange={(text) => setSearchTerm(text)}
                onFilterClick={() => setShowFilterSidebar(true)}
            />

            <FilterSidebar
                isOpen={showFilterSidebar}
                onClose={() => setShowFilterSidebar(false)}
                filters={availableFilters}
                onApplyFilters={(selected) => setAppliedFilters(selected)}
            />

            <div className="animal-list">
                {loading ? (
                    <p>Carregando animais...</p>
                ) : animals.length === 0 ? (
                    <p>Nenhum animal encontrado.</p>
                ) : (
                    animals.map((animal) => (
                        <AnimalCard key={animal.id} animal={animal} />
                    ))
                )}
            </div>
        </div>
    );
}

export default AnimalsPage;
