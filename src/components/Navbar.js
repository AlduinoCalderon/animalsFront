import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css'; // Crea estilos para la barra de navegación

const Navbar = () => {
    const location = useLocation();

    // Lista de rutas en las que no queremos mostrar la Navbar
    const hideNavbarOnRoutes = ['/perfil'];

    // Oculta la barra si estamos en alguna de las rutas prohibidas
    if (hideNavbarOnRoutes.includes(location.pathname)) return null;

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/">Catálogo de Animales</Link>
                </li>
                <li>
                    <Link to="/gestionar-animales">Gestionar Animales</Link>
                </li>
                <li>
                    <Link to="/gestionar-personas">Gestionar Personas</Link>
                </li>
                
            </ul>
        </nav>
    );
};

export default Navbar;
