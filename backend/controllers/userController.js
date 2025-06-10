const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    console.log('📌 Usuario autenticado:', req.user); // Depuración

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const user = await User.findById(req.user.id).select('-password'); // Excluye la contraseña

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('❌ Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
