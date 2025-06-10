const Ticket = require('../models/Ticket');

// Crear un nuevo ticket
exports.createTicket = async (req, res) => {
  console.log('📥 Datos recibidos en backend:', req.body);
  console.log('🛑 Usuario autenticado:', req.user);

  try {
    const {
      title,
      description,
      teamViewerID,
      teamViewerPassword,
      workMode // ✅ Asegúrate de que este campo venga del frontend
    } = req.body;

    // Validaciones mínimas
    if (!title || !description || !workMode) {
      return res.status(400).json({
        message: 'Title, description y workMode son obligatorios'
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    // Crear el ticket
    const newTicket = new Ticket({
      title,
      description,
      workMode, // ✅ Agregado aquí
      createdBy: req.user._id,
      teamViewerID,
      teamViewerPassword,
    });

    await newTicket.save();

    console.log('✅ Ticket creado:', newTicket);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error('❌ Error en backend:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

  


// Obtener todos los tickets
exports.getTickets = async (req, res) => {
  try {
    console.log('Recibiendo solicitud para obtener tickets...');

    // 🔥 Usa `.populate()` pero con control de errores
    const tickets = await Ticket.find().populate({
      path: 'createdBy',
      select: 'username',
      options: { strictPopulate: false } // ✅ Esto evita el error de población
    });

    console.log('Tickets obtenidos:', tickets);
    res.status(200).json(tickets);
  } catch (err) {
    console.error('❌ Error en getTickets:', err);
    res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
  }
};


// Actualizar un ticket
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true } // Devolver el documento actualizado
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Eliminar un ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Obtener un resumen de los tickets

exports.getTicketSummary = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'open' });
    const inProgress = await Ticket.countDocuments({ status: 'in_progress' });
    const closed = await Ticket.countDocuments({ status: 'closed' });

    res.json({ total, open, inProgress, closed });
  } catch (error) {
    console.error('❌ Error al obtener el resumen de tickets:', error);
    res.status(500).json({ message: 'Error al obtener el resumen de tickets', error });
  }
};

exports.cambiarEstadoTicket = async (req, res) => {
  try {
    const { status } = req.body;  // ⬅️ Debe coincidir con lo que envía el frontend
    const ticketId = req.params.id;

    console.log(`🛠️ Intentando actualizar el ticket ${ticketId} a status: ${status}`);

    const ticketActualizado = await Ticket.findByIdAndUpdate(
        ticketId,
        { status },  // ⬅️ Asegúrate de que usa "status" y no "estado"
        { new: true }
    );

    if (!ticketActualizado) {
        return res.status(404).json({ mensaje: "❌ Ticket no encontrado" });
    }

    console.log("✅ Ticket actualizado en la base de datos:", ticketActualizado);
    res.json(ticketActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar ticket:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id; // Asegúrate de que req.user existe
    const tickets = await Ticket.find({ user: userId });

    if (!tickets.length) {
      return res.status(404).json({ message: 'No tienes tickets.' });
    }

    res.json(tickets);
  } catch (error) {
    console.error('❌ Error al obtener tickets:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
