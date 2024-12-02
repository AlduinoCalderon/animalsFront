import React, { useEffect, useState, useRef } from 'react';
import { getAllPersons, createPerson, updatePerson, deletePerson } from '../config/api';
import '../styles/styles.css';
import '../styles/profiles.css';
import '../styles/editProfiles.css';

const ManagePersonCatalog = () => {
    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        photo: '',
    });
    const formRef = useRef(null);

    const isEditing = Boolean(selectedPerson);

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const personData = await getAllPersons();
                setPersons(personData.filter((person) => !person.deleted));
            } catch (err) {
                console.error('Error fetching persons:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPersons();
    }, []);

    const handleSelectPerson = (person) => {
        setSelectedPerson(person);
        setFormData({
            id: person.id,
            name: person.name,
            email: person.email,
            phone: person.phone,
            address: person.address,
            photo: person.photo,
        });
        formRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updatePerson(formData.id, formData);
                setPersons((prev) =>
                    prev.map((person) =>
                        person.id === formData.id ? { ...person, ...formData } : person
                    )
                );
            } else {
                const newPerson = await createPerson(formData);
                setPersons((prev) => [...prev, newPerson]);
            }
            alert(`Persona ${isEditing ? 'actualizada' : 'creada'} correctamente.`);
            setSelectedPerson(null);
            setFormData({
                id: '',
                name: '',
                email: '',
                phone: '',
                address: '',
                photo: '',
            });
        } catch (err) {
            console.error(`Error ${isEditing ? 'actualizando' : 'creando'} persona:`, err);
            alert('Hubo un error al guardar la persona.');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta persona?');
        if (!confirmDelete) return;

        try {
            await deletePerson(id);
            setPersons((prev) => prev.filter((person) => person.id !== id));
            alert('Persona eliminada correctamente.');
        } catch (err) {
            console.error('Error deleting person:', err);
            alert('Hubo un error al eliminar la persona.');
        }
    };

    if (loading) return <p>Cargando personas...</p>;

    return (
        <div className="mgmt-person-edit-container">
            <nav className="navbar">
                <a href="/" className="nav-link">Catálogo de Animales</a>
                <a href="/perfil" className="nav-link">Tu Perfil</a>
                <a href="/gestionar-personas" className="nav-link">Gestionar Personas</a>
            </nav>
            <h1>Gestión de Personas Registradas</h1>
            <div className="mgmt-person-list">
                {persons.map((person) => (
                    <div key={person.id} className="mgmt-person-card">
                        <img
                            src={person.photo || `https://cataas.com/cat?unique=${Date.now() + Math.random()}`}
                            alt={person.name}
                        />
                        <p>{person.name}</p>
                        <button onClick={() => handleSelectPerson(person)} className="mgmt-button-edit">Editar</button>
                        <button onClick={() => handleDelete(person.id)} className="mgmt-button-delete">
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
            <div ref={formRef} className="mgmt-edit-form-container">
                <h2>{isEditing ? `Editando: ${selectedPerson.name}` : 'Agregar Nueva Persona'}</h2>
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
                        Email:
                        <input
                            className="mgmt-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label className="mgmt-label">
                        Teléfono:
                        <input
                            className="mgmt-input"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label className="mgmt-label">
                        Dirección:
                        <input
                            className="mgmt-input"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
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
                        {isEditing ? 'Guardar Cambios' : 'Crear Persona'}
                    </button>
                    {isEditing && (
                        <button className="mgmt-button" type="button" onClick={() => setSelectedPerson(null)}>
                            Cancelar
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ManagePersonCatalog;
