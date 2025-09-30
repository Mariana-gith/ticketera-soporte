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
app.use(cors())

// 🔑 permitir llamadas desde tu frontend (localhost:5173)
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Rutas
app.use('/api/tickets', tickets);
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventario', inventarioRoutes);



// // if (process.env.NODE_ENV === 'production') {
// //   app.use(express.static(path.join(__dirname, '../client/dist'))); // o ../client/build

// //   app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
// //   });
// // }

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});