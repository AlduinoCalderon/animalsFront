import React, { useEffect, useState, useRef } from 'react';
import { getAllAnimals, updateAnimal, createAnimal, deleteAnimal } from '../config/api';
import '../styles/styles.css';
import '../styles/profiles.css';
import '../styles/editProfiles.css';

const ManageAnimalCatalog = () => {
    const [animals, setAnimals] = useState([]);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        id: '',
        species: '',
        name: '',
        birth_year: '',
        sterilized: false,
        photo: '',
    });
    const formRef = useRef(null);

    const isEditing = Boolean(selectedAnimal);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const animalData = await getAllAnimals();
                setAnimals(animalData.filter((animal) => !animal.deleted));
            } catch (err) {
                console.error('Error fetching animals:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();
    }, []);

    const handleSelectAnimal = (animal) => {
        setSelectedAnimal(animal);
        setFormData({
            id: animal.id,
            species: animal.species,
            name: animal.name,
            birth_year: animal.birth_year.low || parseInt(animal.birth_year),
            sterilized: animal.sterilized,
            photo: animal.photo,
        });
        console.log(formData);
        formRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.name.trim() || !formData.species.trim()) {
            alert('El nombre y la especie son obligatorios.');
            return;
        }
    
        try {
            if (isEditing) {
                await updateAnimal(formData.id, formData);
            } else {
                await createAnimal(formData);
            }
    
            // Actualizar el catálogo
            const updatedAnimals = await getAllAnimals();
            setAnimals(updatedAnimals);
    
            alert(`Animal ${isEditing ? 'actualizado' : 'creado'} correctamente.`);
            setSelectedAnimal(null);
            setFormData({
                id: '',
                name: '',
                species: '',
                age: '',
                description: '',
                photo: '',
            });
        } catch (err) {
            console.error(`Error ${isEditing ? 'actualizando' : 'creando'} animal:`, err);
            alert('Hubo un error al guardar el animal.');
        }
    };
    

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este animal?');
        if (!confirmDelete) return;

        try {
            await deleteAnimal(id);
            setAnimals((prev) => prev.filter((animal) => animal.id !== id));
            alert('Animal eliminado correctamente.');
        } catch (err) {
            console.error('Error deleting animal:', err);
            alert('Hubo un error al eliminar el animal.');
        }
    };

    if (loading) return <p>Cargando animales...</p>;

    return (
        <div className="mgmt-animal-edit-container">
            
            <h1>Gestión de Animales Registrados</h1>
            <div className="mgmt-animal-list">
                {animals.map((animal) => (
                    <div key={animal.id} className="mgmt-animal-card">
                        <img
                            src={`https://cataas.com/cat?unique=${Date.now() + Math.random()}`}
                            alt={animal.name}
                        />
                        <p>{animal.name}</p>
                        <button onClick={() => handleSelectAnimal(animal)}
                            className="mgmt-button-edit">Editar</button>
                        <button
                            onClick={() => handleDelete(animal.id)}
                            className="mgmt-button-delete"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
            <div ref={formRef} className="mgmt-edit-form-container">
                <h2>{isEditing ? `Editando: ${selectedAnimal.name}` : 'Agregar Nuevo Animal'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="mgmt-label">
                        Nombre:
                        <input
                            className="mgmt-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label className="mgmt-label">
                        Especie:
                        <input
                            className="mgmt-input"
                            type="text"
                            name="species"
                            value={formData.species}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label className="mgmt-label">
                        Año de Nacimiento:
                        <input
                            className="mgmt-input"
                            type="number"
                            name="birth_year"
                            value={parseInt(formData.birth_year)}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label className="mgmt-label">
                        Esterilizado:
                        <input
                            className="mgmt-input"
                            type="checkbox"
                            name="sterilized"
                            checked={formData.sterilized}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="mgmt-label">
                        URL de Foto:
                        <input
                            className="mgmt-input"
                            type="text"
                            name="photo"
                            value={formData.photo}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button className="mgmt-button" type="submit">
                        {isEditing ? 'Guardar Cambios' : 'Crear Animal'}
                    </button>
                    {isEditing && (
                        <button className="mgmt-button" type="button" onClick={() => setSelectedAnimal(null)}>
                            Cancelar
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ManageAnimalCatalog;
