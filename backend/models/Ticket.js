const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'closed'],
    default: 'open',
  },
  workMode: {
    type: String,
    enum: ['home', 'presencial'],
    required: true,
  },
  teamViewerID: {
    type: String,
    required: false,
  },
  teamViewerPassword: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
