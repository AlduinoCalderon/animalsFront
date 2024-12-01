import React, { useEffect, useState } from 'react';
import { getAllAnimals, getAnimalRelations } from '../config/api';
import '../styles/styles.css';

const AnimalCatalog = () => {
    const [animals, setAnimals] = useState([]);
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
                <a href="/" className="nav-link">Catálogo</a>
                <a href="/perfil" className="nav-link">Perfil</a>
            </nav>
            <h1>Animales que necesitan ayuda</h1>
            <div className="animals-grid">
                {animals.map((animal) => (
                    <div
                        key={animal.id}
                        className="animal-card"
                        onClick={() => window.location.href = `/animal/${animal.id}`}
                    >
                        <img
                            src={`https://cataas.com/cat?unique=${Date.now() + Math.random()}`}
                            alt={animal.name}
                        />
                        <h3>{animal.name}</h3>
                        <p>Edad: {currentYear - parseInt(animal.birth_year.low)} años</p>
                        <div className="badges">
                            {animal.relations.length > 0 ? (
                                animal.relations.map((relation, index) => (
                                    <div key={index} className={`badge ${relation.relationType.toLowerCase()}`}>
                                        {relation.relationType}
                                        <div className="badge-details">
                                            <img src={relation.person.photo || 'default-photo.jpg'} alt="User" />
                                            <p>{relation.person.first_name}</p>
                                        </div>
                                    </div>
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
