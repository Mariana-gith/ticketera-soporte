const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const tickets = require('./routes/tickets.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const inventarioRoutes = require('./routes/inventario');

dotenv.config();
connectDB();

const app = express();

// Configurar CORS para local y producción
const allowedOrigins = [
  'http://localhost:5173',
  'http://ticketera-soporte-git-test-mariana-giths-projects.vercel.app']

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rutas
app.use('/api/tickets', tickets);
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventario', inventarioRoutes);

// Ruta de prueba
app.get('/healthz', (req, res) => res.send('OK'));
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend funcionando 👌');
});

app.get('/healthz', (req, res) => {
  res.send('OK');
});
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist'))); // o ../client/build

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}
