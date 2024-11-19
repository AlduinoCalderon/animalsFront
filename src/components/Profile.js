import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPersonById, getPersonRelations } from '../config/api';
import '../styles/styles.css';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [relations, setRelations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getPersonById(id);
                const userRelations = await getPersonRelations(id);

                setUser(userData);
                setRelations(userRelations);
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) return <p>Cargando perfil...</p>;
    if (!id) return <div>
        <nav className="navbar">
        <a href="/" className="nav-link">Catálogo de Animales</a>
        </nav>  En construcción.</div>; 

    return (
        <div className="user-profile-container">
            <nav className="navbar">
                <a href="/" className="nav-link">Catálogo de Animales</a>
                <a href="/perfil" className="nav-link">Tu Perfil</a>
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
                            <a href={`/animal/${relation.animal.id}`}>
                                {relation.animal.name}
                            </a>
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
