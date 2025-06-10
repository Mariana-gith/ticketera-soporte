const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario'); // debes crear este modelo

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const updated = await Inventario.findOneAndUpdate(
      { nombrePC: data.nombrePC },
      { $set: data },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error('Error guardando inventario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
