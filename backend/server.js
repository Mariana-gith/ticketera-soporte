const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const tickets = require('./routes/tickets.js');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const inventarioRoutes = require('./routes/inventario');

dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Rutas bien definidas
app.use('/api/tickets', tickets);
app.use('/api', authRoutes);
app.use('/api/users', userRoutes); // <- Esta era probablemente la ruta correcta
app.use('/api/inventario', inventarioRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
