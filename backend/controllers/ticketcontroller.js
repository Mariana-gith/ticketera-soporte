const Ticket = require('../models/Ticket');

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

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate('createdBy', 'username email');
    res.status(200).json(tickets);
    console.log('Solicitud recibida en /api/tickets');
    res.send('Esta es una prueba');
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

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
