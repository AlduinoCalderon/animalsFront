import React, { useEffect, useState } from 'react';
import { getAllAnimals, getAnimalRelations } from '../config/api';
import '../styles/styles.css';

const relationStyles = {
    ADOPTED: { text: "Adoptante 🏠", color: "#4caf50" },
    SPONSORED: { text: "Padrino 💸", color: "#2196f3" },
    VETERINARIAN: { text: "Médico Veterinario 🩺", color: "#ff9800" },
    TEMPORARY_CARE: { text: "Cuidador Temporal 🛏️", color: "#9c27b0" },
    RESCUED: { text: "Rescatado 🚑", color: "#ff5722" }
};

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
                        const enrichedRelations = relations.map((relation) => ({
                            ...relation,
                            person: {
                                ...relation.person,
                                photo: `https://thispersondoesnotexist.com?unique=${Date.now() + Math.random()}`
                            }
                        }));
                        return { ...animal, relations: enrichedRelations, relationsCount: relations.length };
                    })
                );

                // Ordenar por número de relaciones de menor a mayor
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
                   <p>Edad:  {currentYear - (animal.birth_year.low 
                        ? parseInt(animal.birth_year.low) 
                        : parseInt(animal.birth_year)) === 0 
                        ? "Cachorro" 
                        : `${currentYear - (animal.birth_year.low 
                            ? parseInt(animal.birth_year.low) 
                            : parseInt(animal.birth_year))} años`}
                   </p>


                   <div className="badges">
                       {animal.relations.length > 0 ? (
                           animal.relations.map((relation, index) => {
                               const style = relationStyles[relation.relationType];
                               return (
                                   <a
                                       key={index}
                                       href={`/perfil/${relation.person.id}`}
                                       className="badge"
                                       style={{
                                           backgroundColor: style?.color || '#9e9e9e',
                                           textDecoration: 'none', // Elimina subrayado del enlace
                                           color: 'white', // Asegura legibilidad
                                           display: 'block', // Asegura que el área completa de la badge sea clicable
                                       }}
                                   >
                                       {style?.text || "Relación Desconocida"}
                                       <div className="badge-details">
                                           <img src={relation.person.photo} alt="User" />
                                           <p>{relation.person.first_name + " " + relation.person.last_name}</p>
                                       </div>
                                   </a>
                               );
                           })
                       ) : (
                           <p>😿 Nadie me ha ayudado aún.</p>
                       )}
                   </div>
               </div>
               
                ))}
            </div>
        </div>
    );
};

export default AnimalCatalog;
