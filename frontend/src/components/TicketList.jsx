import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({ title: '', description: '' });

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
        setError('Failed to fetch tickets.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/tickets',
        {
          title: newTicket.title,
          description: newTicket.description,
          createdBy: 'ObjectId_of_an_existing_user', // Reemplaza esto dinámicamente
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets([...tickets, response.data]);
      setNewTicket({ title: '', description: '' }); // Limpia el formulario
    } catch (error) {
      setError('Failed to create ticket.');
      console.error(error);
    }
  };

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <p>Title: {ticket.title}</p>
            <p>Description: {ticket.description}</p>
            <p>Created By: {ticket.createdBy?.username || 'Unknown'}</p>
          </li>
        ))}
      </ul>
      <h3>Create a New Ticket</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTicket();
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newTicket.description}
          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
          required
        ></textarea>
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};

export default TicketList;
