const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const tickets = require('./routes/tickets.js');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js')

dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/tickets', tickets);
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

