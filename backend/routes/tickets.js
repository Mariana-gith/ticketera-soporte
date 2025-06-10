const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketcontroller'); // 🔥 Verifica esta ruta
const authMiddleware = require('../middleware/authMiddleware'); // 🔥 Verifica esta ruta

// ✅ Obtener todos los tickets
router.get('/', authMiddleware, ticketController.getTickets);

// ✅ Obtener tickets de un usuario
router.get('/user', authMiddleware, ticketController.getUserTickets);

// ✅ Crear un ticket
router.post('/', authMiddleware, ticketController.createTicket);

// ✅ Actualizar un ticket
router.put('/:id', authMiddleware, ticketController.updateTicket);

// ✅ Eliminar un ticket
router.delete('/:id', authMiddleware, ticketController.deleteTicket);

// ✅ Obtener resumen de tickets
router.get('/summary', authMiddleware, ticketController.getTicketSummary);

// ✅ Cambiar estado de un ticket
router.put('/:id/status', authMiddleware, ticketController.cambiarEstadoTicket);

module.exports = router;
