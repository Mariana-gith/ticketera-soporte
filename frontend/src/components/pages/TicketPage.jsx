import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketsForm from '../TicketForm';
import TicketsList from '../TicketList';

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token'); // Obtener el token desde localStorage

  // Obtener tickets desde el backend
  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`, // Asegúrate de que el token es válido
        },
      });
      console.log('Tickets obtenidos:', response.data); // Verifica los datos
      setTickets(response.data);
    } catch (error) {
      setError('Error fetching tickets');
      console.error('Error en fetchTickets:', error.response || error.message); // Verifica el error exacto
    }
  };
  
  

  // Manejar la creación de un nuevo ticket
  const addTicket = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets([...tickets, response.data]); // Añadir el nuevo ticket al estado
    } catch (err) {
      setError('Error creating ticket');
      console.error(err);
    }
  };

  // Obtener los tickets al cargar el componente
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ticket Management</h1>
      {error && <p className="text-red-500">{error}</p>}
      <TicketsForm onAddTicket={addTicket} />
      <TicketsList tickets={tickets} />
    </div>
  );
};

export default TicketPage;
