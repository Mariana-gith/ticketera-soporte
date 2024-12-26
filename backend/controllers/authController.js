const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../config/nodemailer');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('Received data verifyEmail register:', req.body);
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    sendVerificationEmail(email, token);
    res.status(201).json({ message: 'User registered successfully, please check your email to verify your account' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Received data verifyEmail:', req.body);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // Descomentar estas líneas para definir username y password
    console.log('Received data:', req.body);
    console.log('Username:', username);
    console.log('Password:', password);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
