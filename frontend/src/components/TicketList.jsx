import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

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
      }
    };

    fetchTickets();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Tickets</h2>
      <ul>
        {tickets.map((ticket, index) => (
          <li key={index}>
            <p><strong>Username:</strong> {ticket.createdBy.username || 'Unknown'}</p>
            <p><strong>Title:</strong> {ticket.title}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketList;
