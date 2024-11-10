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
                        // Obtener relaciones adicionales desde el backend
                        const relations = await getAnimalRelations(animal.id);
                        return { ...animal, relations };
                    })
                );
                setAnimals(animalsWithDetails);
            } catch (error) {
                console.error("Error fetching animals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container">
            <h1>Animales que necesitan ayuda</h1>
            <div className="help-section">
                <h2>Posibles animales a los que puedes ayudar</h2>
                <div className="animals-grid">
                    {animals.map((animal) => (
                        <div key={animal.id} className="animal-card">
                            <img src={animal.photoUrl || 'default-photo.jpg'} alt={animal.name} />
                            <h3>{animal.name}</h3>
                            
                            {/* Mostrar las badges de las relaciones del animal */}
                            <div className="badges">
                                {animal.relations.map((relation, index) => {
                                    // Se verifica el tipo de relación para asignar las badges adecuadas
                                    let badgeClass = '';
                                    switch (relation.relationType) {
                                        case 'adopted':
                                            badgeClass = 'badge adopted';
                                            break;
                                        case 'rescued':
                                            badgeClass = 'badge rescued';
                                            break;
                                        case 'vet':
                                            badgeClass = 'badge vet';
                                            break;
                                        case 'donated':
                                            badgeClass = 'badge donated';
                                            break;
                                        case 'temp-shelter':
                                            badgeClass = 'badge temp-shelter';
                                            break;
                                        default:
                                            badgeClass = 'badge'; // Default badge class
                                            break;
                                    }

                                    return (
                                        <span key={index} className={badgeClass}>
                                            {relation.relationData.details}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Si no hay relaciones, muestra mensaje */}
                            {animal.relations.length === 0 && (
                                <p>Nadie me ha ayudado aún. <br /> ¡Sé el primero en cambiar mi vida!</p>
                            )}

                            <p>{animal.description}</p>
                            <button className="help-button">Ayudar a {animal.name}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimalCatalog;
