import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPersonById, getPersonRelations } from '../config/api';
import '../styles/styles.css';
import '../styles/profiles.css';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getPersonById(id);
                const userRelations = await getPersonRelations(id);

                setUser(userData);
                setRelations(userRelations);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('No se pudo cargar el perfil del usuario.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>Usuario no encontrado.</p>;

    return (
        <div className="user-profile-container">
            <nav className="navbar">
                <Link to="/" className="nav-link">Catálogo de Animales</Link>
                <Link to="/perfil" className="nav-link">Tu Perfil</Link>
            </nav>
            <div className="profile-header">
                <div className="profile-photo-circle">
                    <img
                        src={user.photo || 'default-user.jpg'}
                        alt={`${user.first_name} ${user.last_name}`}
                    />
                </div>
                <h1>{user.first_name} {user.last_name}</h1>
            </div>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.phone}</p>
            <div className="user-relations">
                <h2>Animales con los que ha interactuado</h2>
                {relations.length > 0 ? (
                    relations.map((relation, index) => (
                        <div key={index} className="animal-relation">
                            {relation.animal ? (
                                <Link to={`/animal/${relation.animal.id_animal}`} className="relation-link">
                                    {relation.animal.name}
                                </Link>
                            ) : (
                                <p>Información del animal no disponible.</p>
                            )}
                            <span>{relation.relationType}</span>
                        </div>
                    ))
                ) : (
                    <p>No ha interactuado con ningún animal aún.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
