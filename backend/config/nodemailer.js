const nodemailer = require('nodemailer');

// Configura el transportador de nodemailer con los detalles del servidor SMTP de la empresa
const transporter = nodemailer.createTransport({
  host: 'smtp.alcanzo.com.ar', // Cambia esto por el host del servidor SMTP de la empresa
  port: 587, // El puerto puede variar, 587 y 465 son comunes para SMTP
  secure: false, // true para el puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico en el dominio de la empresa
    pass: process.env.EMAIL_PASS, // La contraseña para tu correo electrónico
  },
  tls: {
    rejectUnauthorized: false // Esto es opcional, permite conexiones TLS auto-firmadas
  }
});

const sendVerificationEmail = (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Cambia esto por tu correo electrónico en el dominio de la empresa
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: http://localhost:5000/api/verify/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};


module.exports = sendVerificationEmail;
