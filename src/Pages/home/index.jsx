// home/index.jsx
import React, { useState, useEffect } from "react";
import "./home.css";
import Top from "./components/top.jsx";
import Carousel from "./components/carousel.jsx";
import Catalog from "./components/catalog.jsx";
import Categories from "./components/categories.jsx";
import FilterSidebar from "./components/FilterSidebar.jsx"; // Importando o novo componente
import { supabase } from "../../supabaseClient";

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Novo estado para a barra lateral

  useEffect(() => {
    // ... sua lógica de busca que já está funcionando ...
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: animaisData, error: animaisError } = searchTerm
          ? await supabase.rpc('search_animais', { search_term: searchTerm })
          : await supabase.from('Animais').select('*');

        if (animaisError) {
          console.error('Erro na busca de animais:', animaisError);
          setLoading(false);
          return;
        }

        if (animaisData.length === 0) {
          setAnimais([]);
          setLoading(false);
          return;
        }

        const animaisComFotos = await Promise.all(animaisData.map(async (animal) => {
          const { data: fotoData } = await supabase
            .from('pet_photos')
            .select('url')
            .eq('animal_id', animal.id)
            .eq('is_primary', true)
            .maybeSingle();
          return {
            ...animal,
            url_photo: fotoData ? fotoData.url : null,
          };
        }));
        
        setAnimais(animaisComFotos);

      } catch (err) {
        console.error('Erro inesperado:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchTerm]);

  return (
    <div className="home-page">
      {/* Passando uma prop para o Top abrir a sidebar */}
      <Top searchTerm={searchTerm} setSearchTerm={setSearchTerm} onOpenSidebar={() => setIsSidebarOpen(true)} />
      <Carousel />
      <Categories />
      <Catalog animais={animais} loading={loading} searchTerm={searchTerm} />
      {/* Renderizando a barra lateral. Ela está "escondida" por padrão pelo CSS */}
      <FilterSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}

export default Home;