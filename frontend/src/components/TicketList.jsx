import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch tickets.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/tickets',
        { title: newTicket.title, description: newTicket.description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets([...tickets, response.data]);
      setNewTicket({ title: '', description: '' }); // Limpia el formulario
      setError(''); // Limpia cualquier error previo
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create ticket.');
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Tickets</h2>
      {/* Lista de tickets */}
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id} style={{ marginBottom: '10px' }}>
            <p><strong>Title:</strong> {ticket.title}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Created By:</strong> {ticket.createdBy?.username || 'Unknown'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;
