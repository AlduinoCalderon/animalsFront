import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnimalCatalog from './components/AnimalCatalog';
import AnimalProfile from './components/AnimalProfile';
import UserProfile from './components/UserProfile';
import Profile from './components/Profile';
import ManageAnimalCatalog from './components/ManageAnimalCatalog';
import ManagePersonCatalog from './components/ManagePersonCatalog';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <Navbar />  {/* Navbar fuera de las rutas para que sea global */}
      <Routes>
        <Route path="/" element={<AnimalCatalog />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/animal/:id" element={<AnimalProfile />} />
        <Route path="/perfil/:id" element={<UserProfile />} />
        <Route path="/gestionar-animales" element={<ManageAnimalCatalog />} />
        <Route path="/gestionar-personas" element={<ManagePersonCatalog />} />
      </Routes>
    </Router>
  );
}

export default App;
