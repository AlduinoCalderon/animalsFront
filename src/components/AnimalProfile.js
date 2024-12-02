import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimalById, getAnimalRelations } from '../config/api';
import '../styles/styles.css'; // Mantiene estilos generales
import '../styles/profiles.css'; // Estilos específicos de perfiles

const AnimalProfile = () => {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnimalData = async () => {
            try {
                const animalData = await getAnimalById(id);
                const relationsData = await getAnimalRelations(id);
                setAnimal({
                    ...animalData,
                    relations: relationsData,
                    relationsCount: relationsData.length,
                });
            } catch (err) {
                console.error('Error fetching animal data:', err);
                setError('No se pudo cargar la información del animal.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnimalData();
    }, [id]);

    if (loading) return <p>Cargando información...</p>;
    if (error) return <p>{error}</p>;
    if (!animal) return <p>Animal no encontrado.</p>;

    const currentYear = new Date().getFullYear();

    return (
        <div className="profile-container">
            <nav className="navbar">
                <a href="/" className="nav-link">Catálogo de Animales</a>
                <a href="/perfil" className="nav-link">Tu Perfil</a>
            </nav>
            <div className="profile-header">
                <div className="profile-photo-circle">
                    <img
                        src={animal.photo || 'default-animal.jpg'}
                        alt={animal.name}
                    />
                </div>
                <h1>Conoce a {animal.name}</h1>
            </div>
            <div className="animal-details">
                <p><strong>Especie:</strong> {animal.species}</p>
                <p><strong>Edad:</strong> {currentYear - parseInt(animal.birth_year.low)} años</p>
                <p><strong>Esterilizado:</strong> {animal.sterilized ? 'Sí' : 'No'}</p>
                <p><strong>Relaciones:</strong> {animal.relationsCount}</p>
            </div>
            <div className="relations-section">
                <h2>Relaciones</h2>
                {animal.relations.length > 0 ? (
                    animal.relations.map((relation, index) => (
                        <div key={index} className="relation-card">
                            <p><strong>Tipo:</strong> {relation.relationType}</p>
                            <p><strong>Detalles:</strong> {relation.relationData.contribution || 'Sin detalles'}</p>
                            <Link to={`/perfil/${relation.person.id}`} className="relation-link">
                                Ver perfil de {relation.person.first_name} {relation.person.last_name}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>😿 Nadie ha ayudado a {animal.name} aún.</p>
                )}
            </div>
        </div>
    );
};

export default AnimalProfile;
