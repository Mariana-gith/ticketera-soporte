import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  // Obtener el token del almacenamiento local
  const token = localStorage.getItem('token');
  console.log(token)

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para obtener los tickets del backend
  const fetchTickets = async () => {
    try {
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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tickets', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets([...tickets, response.data]);
      setFormData({ title: '', description: '' });
    } catch (error) {
      setError('Error creating ticket');
    }
  };

  // Obtener los tickets cuando el componente se monta
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Ticket
        </button>
      </form>

      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {ticket.title}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {ticket.description}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {new Date(ticket.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketPage;
