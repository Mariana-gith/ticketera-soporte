import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/api/tickets',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('✅ Ticket creado con éxito', {
        position: 'top-right',
        autoClose: 3000, // Se cierra en 3 segundos
      });

      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('❌ Error al crear el ticket', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4">Crear Ticket</h2>
      <ToastContainer /> {/* Contenedor de notificaciones */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Crear Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
