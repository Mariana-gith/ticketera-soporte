import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketForm from '../TicketForm.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState(null);
  const [ticketSummary, setTicketSummary] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);

        const summary = {
          total: response.data.length,
          open: response.data.filter(ticket => ticket.status === 'open').length,
          inProgress: response.data.filter(ticket => ticket.status === 'in progress').length,
          closed: response.data.filter(ticket => ticket.status === 'closed').length,
        };
        setTicketSummary(summary);
      } catch (error) {
        toast.error('❌ Error al obtener tickets');
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('⚠️ No hay token disponible');
          return;
        }
    
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log('✅ Usuario recibido:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('❌ Error al obtener los datos del usuario:', error.response?.data || error.message);
      }
    };

    fetchTickets();
    fetchUser();
  }, []);

  return (
    <div className="flex gap-4 p-4">
      <ToastContainer />

      {/* 📌 Formulario y Mini Dashboard a la izquierda */}
      <div className="w-1/3 fixed left-4 top-24 bottom-4 overflow-y-auto z-10 flex flex-col gap-4">
        {/* 📝 Formulario Fijo */}
        <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Crear Ticket</h2>
          <TicketForm />
        </div>

        {/* 📊 Mini Dashboard con colores pastel */}
        <div className="p-4 bg-gray-100 shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold text-gray-700 mb-2">📊 Resumen General</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Usuario */}
            {user && (
              <div className="p-3 bg-purple-100 border border-purple-300 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-700">👤 Usuario</h3>
                <p className="text-xs text-gray-700"><strong>Nombre:</strong> {user.username}</p>
                <p className="text-xs text-gray-700"><strong>Email:</strong> {user.email}</p>
              </div>
            )}

            {/* Total Tickets */}
            <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-700">📌 Total Tickets</h3>
              <p className="text-lg font-bold text-blue-800">{ticketSummary.total}</p>
            </div>

            {/* Abiertos */}
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-700">⏳ Abiertos</h3>
              <p className="text-lg font-bold text-yellow-800">{ticketSummary.open}</p>
            </div>

            {/* En Progreso */}
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-sm font-semibold text-green-700">🚧 En Progreso</h3>
              <p className="text-lg font-bold text-green-800">{ticketSummary.inProgress}</p>
            </div>

            {/* Cerrados */}
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <h3 className="text-sm font-semibold text-red-700">✅ Cerrados</h3>
              <p className="text-lg font-bold text-red-800">{ticketSummary.closed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📌 Lista de Tickets a la derecha */}
      <div className="w-2/3 p-4 bg-white shadow rounded ml-auto mt-16">
        <h2 className="text-xl font-bold mb-4">Tickets</h2>

        {tickets.length === 0 ? (
          <p className="text-gray-500">No hay tickets disponibles</p>
        ) : (
          <>
            {/* 🟢 Último ticket creado */}
            <div className="p-4 border rounded bg-green-100 mb-4">
              <h3 className="text-lg font-bold">{tickets[tickets.length - 1].title}</h3>
              <p>{tickets[tickets.length - 1].description}</p>
              <p className="text-sm text-gray-600">Estado: {tickets[tickets.length - 1].status}</p>
            </div>

            {/* 🔘 Botón para alternar entre mostrar todos o solo el último */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Mostrar menos' : 'Mostrar todos'}
            </button>

            {/* 📌 Lista completa de tickets (oculta por defecto) */}
            {showAll && (
              <div className="mt-4">
                {tickets.slice(0, -1).map((ticket) => (
                  <div key={ticket._id} className="p-3 border rounded bg-gray-50 mb-2">
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <p>{ticket.description}</p>
                    <p className="text-sm text-gray-600">Estado: {ticket.status}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
