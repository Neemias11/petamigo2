import React from 'react';
import { supabase } from '../../supabaseClient';
// Função para calcular distância entre dois pontos (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Função para alertar usuários próximos
async function alertNearbyUsers(animal) {
  // 1. Buscar todos usuários do banco
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) return;

  // 2. Filtrar usuários próximos (exemplo: raio de 10km)
  const nearbyUsers = users.filter(user => {
    if (!user.latitude || !user.longitude) return false;
    const dist = getDistance(
      animal.coordinates.lat,
      animal.coordinates.lng,
      user.latitude,
      user.longitude
    );
    return dist <= 10; // raio de 10km
  });

  // 3. Criar alerta para cada usuário próximo
  for (const user of nearbyUsers) {
    await supabase.from('alerts').insert([
      {
        user_id: user.id,
        animal_id: animal.id,
        message: `Animal desaparecido perto de você: ${animal.petName}`,
        read: false
      }
    ]);
  }
}
import MissingHomePage from './componentes/missinghomepage';
import MissingForm from "./componentes/missingform.jsx";
import "./componentes/missing.css";




const MissingAnimalPage = () => {
  // Exemplo de uso: após cadastrar animal, chame alertNearbyUsers(animal)
  // Passe a função para o formulário se quiser usar como callback
  return (
    <div className="missing-animal-page">
      <MissingHomePage />
    </div>
  );
};

export default MissingAnimalPage;