import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [ticketSummary, setTicketSummary] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });
  const [showAll, setShowAll] = useState(false);
  const [modoSoporte, setModoSoporte] = useState('presencial'); // <-- Nuevo estado
  const [newTicket, setNewTicket] = useState({ title: '', description: '', teamViewerID: '', teamViewerPassword: '' });

  useEffect(() => {
    fetchTickets();
    fetchUser();
  }, []);

  useEffect(() => {
    if (modoSoporte === 'presencial') {
      setNewTicket((prev) => ({
        ...prev,
        teamViewerID: '',
        teamViewerPassword: '',
      }));
    }
  }, [modoSoporte]);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
      updateSummary(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'No se pudieron cargar los tickets.');
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      toast.error('Error al cargar los datos del usuario.');
    }
  };

  const updateSummary = (tickets) => {
    const summary = {
      total: tickets.length,
      open: tickets.filter(ticket => ["abierto", "open"].includes(ticket.status)).length,
      inProgress: tickets.filter(ticket => ["en_progreso", "in_progress", "in process", "en_proceso"].includes(ticket.status)).length,
      closed: tickets.filter(ticket => ["resuelto", "closed"].includes(ticket.status)).length,
    };
    setTicketSummary(summary);
  };
  
  const handleCreateTicket = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tickets', {
        ...newTicket,
        workMode: modoSoporte, // 👈 nuevo campo
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('🎫 Ticket creado con éxito');
      setNewTicket({ title: '', description: '', teamViewerID: '', teamViewerPassword: '' });
      setModoSoporte('presencial');
      fetchTickets();
    } catch (error) {
      toast.error('❌ No se pudo crear el ticket');
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-1/3 bg-white shadow-md p-6 fixed h-full overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-700">👤 Usuario</h2>
        <p className="text-gray-600">Nombre: {user?.username || 'Cargando...'}</p>
        <p className="text-gray-600">Email: {user?.email || '...'}</p>
        <p className="text-gray-600">Total de Tickets Solicitados: {tickets.length}</p>

        <div className="bg-white shadow-lg rounded-lg border border-gray-300 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">➕ Crear Ticket</h2>
          <input type="text" placeholder="Título" value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} className="w-full p-2 border rounded mb-3" />
          <textarea placeholder="Descripción" value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} className="w-full p-2 border rounded mb-3" />

          <label className="block mb-2 font-medium text-gray-700">Modo de Soporte</label>
          <select
            value={modoSoporte}
            onChange={(e) => setModoSoporte(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="presencial">Presencial</option>
            <option value="home">Home</option>
          </select>

          {modoSoporte === 'home' && (
            <>
              <input type="text" placeholder="ID de TeamViewer" value={newTicket.teamViewerID} onChange={(e) => setNewTicket({ ...newTicket, teamViewerID: e.target.value })} className="w-full p-2 border rounded mb-3" />
              <input type="text" placeholder="Contraseña de TeamViewer" value={newTicket.teamViewerPassword} onChange={(e) => setNewTicket({ ...newTicket, teamViewerPassword: e.target.value })} className="w-full p-2 border rounded mb-3" />
            </>
          )}

          <button onClick={handleCreateTicket} className="bg-blue-500 text-white px-4 py-2 rounded">Enviar Ticket</button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 shadow-lg rounded-lg border border-gray-300">
          <h2 className="text-lg font-bold text-gray-700 mb-2">📊 Resumen General</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-700">📌 Total Tickets</h3>
              <p className="text-lg font-bold text-blue-800">{ticketSummary.total}</p>
            </div>
            <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-700">⏳ Abiertos</h3>
              <p className="text-lg font-bold text-yellow-800">{ticketSummary.open}</p>
            </div>
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
              <h3 className="text-sm font-semibold text-green-700">🚧 En Progreso</h3>
              <p className="text-lg font-bold text-green-800">{ticketSummary.inProgress}</p>
            </div>
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <h3 className="text-sm font-semibold text-red-700">✅ Cerrados</h3>
              <p className="text-lg font-bold text-red-800">{ticketSummary.closed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/3 ml-auto overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 Mis Tickets</h2>
        {error && <div className="text-red-500">{error}</div>}
        {tickets.length === 0 ? (
          <p className="text-gray-600">No hay tickets en este momento.</p>
        ) : (
          <div className="space-y-4">
            {(showAll ? tickets : tickets.slice(0, 5)).map((ticket) => (
              <div key={ticket._id} className="bg-white border-l-4 border-blue-500 p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold">📌 {ticket.title}</h3>
                <p className="text-gray-700"><strong>Descripción:</strong> {ticket.description}</p>
                <p className="text-gray-700"><strong>Estado:</strong> {ticket.status}</p>
                <p className="text-gray-700"><strong>Fecha de creación:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                <p className="text-gray-700"><strong>teamViewerID:</strong> {ticket.teamViewerID}</p>
              </div>
            ))}
            {tickets.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showAll ? 'Mostrar menos' : 'Mostrar más'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
