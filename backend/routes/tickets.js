const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketcontroller.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/', authMiddleware, ticketController.createTicket);
router.get('/api/tickets', authMiddleware, ticketController.getTickets);
router.put('/:id', authMiddleware, ticketController.updateTicket);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

module.exports = router;
