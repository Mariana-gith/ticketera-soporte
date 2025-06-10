const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
  fecha: String,
  nombrePC: String,
  usuarioActual: String,
  ip: String,
  teamViewerID: String,
  sistemaOperativo: String,
  cpu: String,
  ram_GB: String,
  disco: String,
  perifericoUSB: String,
}, { timestamps: true });

module.exports = mongoose.model('Inventario', InventarioSchema);
