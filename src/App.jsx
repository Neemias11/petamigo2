import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LayoutNav from './Layout/LayoutNav.jsx';

import LandingPage from './Pages/landingPage/landing.jsx';
import Auth from './Pages/auth/auth.jsx';
import Home from './Pages/home/index.jsx';
import Profile from './Pages/profile/profile.jsx';
import BadRequest from './Pages/badRequest/error.jsx';
<<<<<<< HEAD
import MissingAnimalPage from './Pages/missinganimal/missinganimal.jsx';

=======
import PetPage from './Pages/pet-page/PetPage.jsx'; 
>>>>>>> 211164f73a89cf339c32546ff6e3c770a9aa0566

function App() {
  return (
    <Routes>
      {/* Grupo de Rotas 1: Páginas SEM a Navbar */}
      <Route path="/" element={<Auth />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="*" element={<BadRequest />} />

      {/* Grupo de Rotas 2: Páginas COM a Navbar */}  
      <Route element={<LayoutNav />}>
        <Route path="/home" element={<Home />} />
        <Route path="/pet/:petId" element={<PetPage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/missinganimal" element={<MissingAnimalPage />} />
      </Route>

    </Routes>
  );
}

export default App;
