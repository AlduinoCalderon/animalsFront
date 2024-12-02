// src/config/api.js

const BASE_URL = 'https://animales.onrender.com';

export const getAllPersons = async () => {
    const response = await fetch(`${BASE_URL}/persons`);
    return response.json();
};

export const getPersonById = async (id) => {
    const response = await fetch(`${BASE_URL}/persons/${id}`);
    return response.json();
};

export const getAnimalRelations = async (animalId) => {
    try {
        const response = await fetch(`${BASE_URL}/relations/${animalId}`);
        if (!response.ok) throw new Error('Error al obtener relaciones del animal');
        const data = await response.json();
        return data.data; // Esto devolverá un array de relaciones
    } catch (error) {
        console.error("Error fetching relations:", error);
        return [];
    }
};

export const getPersonRelations = async (personId) => {
    try {
        const response = await fetch(`${BASE_URL}/relations/person/${personId}`);
        if (!response.ok) throw new Error('Error al obtener relaciones de la persona');
        const data = await response.json();
        return data.data; // Esto devolverá un array de relaciones
    } catch (error) {
        console.error("Error fetching relations:", error);
        return [];
    }
};
export const createPerson = async (personData) => {
    const response = await fetch(`${BASE_URL}/persons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData)
    });
    if (!response.ok) {
        throw new Error('Failed to create person');
    }
    return response.json();
};

export const updatePerson = async (id, personData) => {
    const response = await fetch(`${BASE_URL}/persons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData)
    });
    if (!response.ok) {
        throw new Error('Failed to update person');
    }
    return response.json();
};

export const deletePerson = async (id) => {
    const response = await fetch(`${BASE_URL}/persons/${id}`, { method: 'DELETE' });
    return response.json();
};

export const getAllAnimals = async () => {
    const response = await fetch(`${BASE_URL}/animals/`);
    return response.json();
};

export const getAnimalById = async (id) => {
    const response = await fetch(`${BASE_URL}/animals/${id}`);
    return response.json();
};

export const createAnimal = async (animalData) => {
    const response = await fetch(`${BASE_URL}/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData)
    });
    if (!response.ok) {
        throw new Error('Failed to create animal');
    }
    return response.json();
};

export const updateAnimal = async (id, animalData) => {
    const response = await fetch(`${BASE_URL}/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animalData)
    });
    if (!response.ok) {
        throw new Error('Failed to update animal');
    }
    return response.json();
};

export const deleteAnimal = async (id) => {
    const response = await fetch(`${BASE_URL}/animals/${id}`, { method: 'DELETE' });
    return response.json();
};

export const createRelation = async (relationData) => {
    const response = await fetch(`${BASE_URL}/relations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(relationData)
    });
    if (!response.ok) {
        throw new Error('Failed to create relation');
    }
    return response.json();
};

// Nueva función para obtener el número de relaciones de un animal
export const getAnimalRelationsCount = async (animalId) => {
    try {
        const response = await fetch(`${BASE_URL}/count/${animalId}`);
        const data = await response.json();
        if (!data.relationCount) throw new Error('Relations count not found');
        return data.relationCount;
    } catch (error) {
        console.error('Error fetching animal relations count:', error);
        return 0;
    }
};
