import React, { useEffect, useState } from 'react';
import { getAllPersons, updatePerson, createPerson, deletePerson } from '../config/api';
import '../styles/styles.css';
import '../styles/editProfiles.css';

const ManagePersonCatalog = () => {
    const [persons, setPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        mother_last_name: '',
        last_name: '',
        address: '',
        phone: '',
        email: '',
        photo: '',
    });

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
            first_name: person.first_name,
            mother_last_name: person.mother_last_name,
            last_name: person.last_name,
            address: person.address,
            phone: person.phone,
            email: person.email,
            photo: person.photo,
        });

        // Desplaza al formulario
        document.querySelector('.mgmt-edit-form-container').scrollIntoView({ behavior: 'smooth' });
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
    
        // Validar datos antes de enviar
        if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.address.trim()) {
            alert('Nombre, apellido y dirección no pueden estar vacíos.');
            return;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('El teléfono debe tener exactamente 10 dígitos numéricos.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('El correo electrónico no tiene un formato válido.');
            return;
        }
    
        try {
            if (isEditing) {
                await updatePerson(formData.id, formData);
            } else {
                await createPerson(formData);
            }
    
            // Actualizar el catálogo con los datos más recientes
            const updatedPersons = await getAllPersons();
            setPersons(updatedPersons.filter((person) => !person.deleted));
    
            alert(`Persona ${isEditing ? 'actualizada' : 'creada'} correctamente.`);
            setSelectedPerson(null);
            setFormData({
                id: '',
                first_name: '',
                mother_last_name: '',
                last_name: '',
                address: '',
                phone: '',
                email: '',
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
        <div className="mgmt-animal-edit-container">
            <h1>Gestión de Personas Registradas</h1>
            <div className="mgmt-animal-list">
                {persons.map((person) => (
                    <div key={person.id} className="mgmt-animal-card">
                        <img src={`https://thispersondoesnotexist.com/?unique=${Date.now() + Math.random()}`} alt={person.first_name} />
                        <p>{`${person.first_name} ${person.mother_last_name} ${person.last_name}`}</p>
                        <button onClick={() => handleSelectPerson(person)} className="mgmt-button-edit">Editar</button>
                        <button onClick={() => handleDelete(person.id)} className="mgmt-button-delete">Eliminar</button>
                    </div>
                ))}
            </div>
            <div className="mgmt-edit-form-container">
                <h2>{isEditing ? 'Editar Persona' : 'Agregar Nueva Persona'}</h2>
                <form onSubmit={handleSubmit}>
                    <label className="mgmt-label">Nombre:</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="mgmt-input" required />

                    <label className="mgmt-label">Apellido Materno:</label>
                    <input type="text" name="mother_last_name" value={formData.mother_last_name} onChange={handleInputChange} className="mgmt-input" required />

                    <label className="mgmt-label">Apellido Paterno:</label>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="mgmt-input" required />

                    <label className="mgmt-label">Dirección:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="mgmt-input" required />

                    <label className="mgmt-label">Teléfono:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="mgmt-input" required />

                    <label className="mgmt-label">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mgmt-input" required />

                    <label className="mgmt-label">URL de Foto:</label>
                    <input type="text" name="photo" value={formData.photo} onChange={handleInputChange} className="mgmt-input" />

                    <button type="submit" className="mgmt-button">{isEditing ? 'Guardar Cambios' : 'Crear Persona'}</button>
                    {isEditing && <button type="button" className="mgmt-button" onClick={() => setSelectedPerson(null)}>Cancelar</button>}
                </form>
            </div>
        </div>
    );
};

export default ManagePersonCatalog;
