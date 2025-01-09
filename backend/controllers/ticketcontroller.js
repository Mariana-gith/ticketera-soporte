const Ticket = require('../models/Ticket');

// Crear un nuevo ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTicket = new Ticket({ title, description, createdBy: req.user.id });
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Obtener todos los tickets
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('createdBy', 'username');
    console.log("tickets",tickets)
    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tickets' });
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
