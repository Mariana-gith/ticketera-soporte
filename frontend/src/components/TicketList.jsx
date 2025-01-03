import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        setError('Error fetching tickets');
        console.error(error); // Para más detalles sobre el error
      } finally {
        setLoading(false); // Al finalizar la carga, cambia el estado de carga
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p>Loading tickets...</p>; // Mensaje de carga
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Mensaje de error en rojo
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets available.</p> // Mensaje si no hay tickets
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="p-4 border rounded-lg shadow-sm">
              <p><strong>Username:</strong> {ticket.createdBy.username || 'Unknown'}</p>
              <p><strong>Title:</strong> {ticket.title}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList;
