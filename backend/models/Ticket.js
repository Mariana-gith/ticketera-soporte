const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed', 'in progress'],
    default: 'open'
  },
  // Otros campos que sean necesarios
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
