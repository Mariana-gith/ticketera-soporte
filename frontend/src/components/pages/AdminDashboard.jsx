import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [error, setError] = useState('');
  const [ticketSummary, setTicketSummary] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  useEffect(() => {
    fetchTickets();
    fetchAdminInfo();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tickets/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 Tickets recibidos:", response.data);
      setTickets(response.data);

      // 📌 Calcular resumen de estados
      const summary = {
        total: response.data.length,
        open: response.data.filter(ticket => ["abierto", "open"].includes(ticket.status)).length,
        inProgress: response.data.filter(ticket => ["en_progreso", "in_progress", "in process", "en_proceso"].includes(ticket.status)).length,
        closed: response.data.filter(ticket => ["resuelto", "closed"].includes(ticket.status)).length,
      };
      setTicketSummary(summary);

    } catch (error) {
      console.error('❌ Error al obtener tickets:', error.response ? error.response.data : error);
      setError('No se pudieron cargar los tickets.');
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token enviado:", token);
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📌 Info del técnico recibida:", response.data);
      setAdminInfo(response.data);
    } catch (error) {
      console.error('❌ Error al obtener datos del técnico:', error.response ? error.response.data : error);
      setError('No se pudieron cargar los datos del técnico.');
    }
  };

  const handleStatusChange = async (ticketId, nuevoEstado) => {
    console.log(`🔄 Enviando actualización para ticket ${ticketId} con status: ${nuevoEstado}`);

    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: nuevoEstado })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Estado actualizado correctamente en la base de datos:', data);

      window.dispatchEvent(new Event("ticketsActualizados"));

      fetchTickets();
    } catch (error) {
      console.error('❌ Error al cambiar el estado:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 📌 Panel izquierdo - Datos del técnico + Resumen */}
      <div className="w-1/3 bg-white shadow-md p-6 fixed h-full overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-700">👨‍🔧 Técnico</h2>
        <p className="text-gray-600">Nombre: {adminInfo?.username || 'Cargando...'}</p>
        <p className="text-gray-600">Email: {adminInfo?.email || '...'}</p>
        <p className="text-gray-600">Rol: Técnico</p>
        <p className="text-gray-600">Total de Tickets Asignados: {tickets.length}</p>

        {/* 📊 Resumen General */}
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

      {/* 📌 Panel derecho - Lista de tickets */}
      <div className="w-2/3 ml-auto overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 Tickets Pendientes</h2>
        {error && <div className="text-red-500">{error}</div>}

        {tickets.length === 0 ? (
          <p className="text-gray-600">No hay tickets en este momento.</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold">📌 {ticket.title}</h3>
                <p className="text-gray-700"><strong>Descripción:</strong> {ticket.description}</p>
                <p className="text-gray-700"><strong>Creado por:</strong> {ticket.createdBy?.username || 'Desconocido'}</p>
                <p className="text-gray-700"><strong>Fecha de creación:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>

                {/* Nuevo campo: Lugar de trabajo */}
                <p className="text-gray-700"><strong>Lugar de trabajo:</strong> {ticket.workMode === 'home' ? 'Home' : 'Presencial'}</p>

                {/* Mostrar solo si es home */}
                {ticket.workMode === 'home' && ticket.teamViewerID && (
                  <p className="text-gray-700"><strong>TeamViewer ID:</strong> {ticket.teamViewerID}</p>
                )}
                {ticket.workMode === 'home' && ticket.teamViewerPassword && (
                  <p className="text-gray-700"><strong>Contraseña TeamViewer:</strong> {ticket.teamViewerPassword}</p>
                )}

                {/* Selector de estado */}
                <label className="block mt-2 text-gray-700 font-semibold">Cambiar estado:</label>
                <select
                  className="mt-1 p-2 bg-white border rounded w-full"
                  onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                  defaultValue={ticket.status}
                >
                  <option value="abierto">Abierto</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>
            ))}          
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
