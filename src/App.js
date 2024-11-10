import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AnimalCatalog from './components/AnimalCatalog';
import AnimalProfile from './components/AnimalProfile';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimalCatalog />} />
        <Route path="/animal/:id" element={<AnimalProfile />} />
        <Route path="/perfil" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
