import React, { useEffect, useState } from 'react';
import { getAllAnimals, getAnimalRelations } from '../config/api';
import '../styles/styles.css';

const AnimalCatalog = () => {
    const [animals, setAnimals] = useState([]);
    const [animalImages, setAnimalImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const animalData = await getAllAnimals();
                const animalsWithDetails = await Promise.all(
                    animalData.map(async (animal) => {
                        const relations = await getAnimalRelations(animal.id);
                        return { ...animal, relations, relationsCount: relations.length };
                    })
                );

                // Ordenar por número de relaciones
                animalsWithDetails.sort((a, b) => a.relationsCount - b.relationsCount);

                setAnimals(animalsWithDetails);

                // Generar URLs únicas para las imágenes
                const images = animalsWithDetails.map(() => ({
                    url: `https://cataas.com/cat?unique=${Date.now() + Math.random()}`
                }));
                setAnimalImages(images);
            } catch (error) {
                console.error('Error fetching animals:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    if (loading) return <p>Cargando catálogo...</p>;

    const currentYear = new Date().getFullYear();

    return (
        <div className="container">
            <nav className="navbar">
                <a href="/" className="nav-link">Catálogo de Animales</a>
                <a href="/perfil" className="nav-link">Tu Perfil</a>
            </nav>
            <h1>Animales que necesitan ayuda</h1>
            <div className="animals-grid">
                {animals.map((animal, index) => (
                    <div key={animal.id} className="animal-card">
                        {/* Cargar URL única para cada imagen */}
                        <img
                            src={animalImages[index]?.url || 'default-photo.jpg'}
                            alt={animal.name}
                        />
                        <h3>{animal.name}</h3>
                        <p>Edad: {currentYear - parseInt(animal.birth_year.low)} años</p>
                        <div className="sterilized-badge">
                            {animal.sterilized ? (
                                <span className="badge badge-sterilized">Esterilizado</span>
                            ) : (
                                <span className="badge badge-not-sterilized">No Esterilizado</span>
                            )}
                        </div>
                        <div className="badges">
                            {animal.relations.length > 0 ? (
                                animal.relations.map((relation, index) => (
                                    <a
                                        key={index}
                                        href={`/perfil/${relation.person.id}`}
                                        className="badge"
                                    >
                                        {relation.relationType}
                                    </a>
                                ))
                            ) : (
                                <p>😿 Nadie me ha ayudado aún.</p>
                            )}
                        </div>
                        <div className="animal-links">
                            <a href={`/animal/${animal.id}`} className="know-button">
                                Conoce a {animal.name}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimalCatalog;
