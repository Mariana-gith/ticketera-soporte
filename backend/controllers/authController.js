const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../config/nodemailer');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('📥 Datos recibidos en register:', req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Usuario registrado con éxito. Verifica tu email.' });
  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('🔍 Token recibido en verifyEmail:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verificado con éxito' });
  } catch (error) {
    console.error('❌ Error en verifyEmail:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('📥 Datos recibidos en login:', req.body);

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Verifica tu email antes de iniciar sesión' });
    }

    // Generar token con datos adicionales
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ Usuario autenticado:', { id: user._id, role: user.role, username: user.username });

    // Enviar username al frontend para mostrarlo en la UI
    res.json({ token, role: user.role, username: user.username });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};
