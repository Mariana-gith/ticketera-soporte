import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage.jsx';
import RegisterPage from './components/pages/RegisterPage.jsx';
import Dashboard from './components/pages/DashboardPage.jsx';
import TicketPage from './components/pages/TicketPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const App = () => {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: '' });

  const handleLogin = (token, role) => {
    setAuth({ isAuthenticated: true, role });
    localStorage.setItem('token', token); // Opcional, si usas localStorage
  };

  return (
    <Router>
      <Routes>
        {/* Redirección inicial */}
        <Route
          path="/"
          element={<Navigate to={auth.isAuthenticated ? '/dashboard' : '/login'} />}
        />
        {/* Ruta de Login */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        {/* Ruta de Registro */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Ruta protegida para el Dashboard */}
        <Route
          path="/dashboard"
          element={<PrivateRoute auth={auth}><Dashboard /></PrivateRoute>}
        />
        {/* Ruta protegida para Tickets */}
        <Route
          path="/tickets"
          element={<PrivateRoute auth={auth}><TicketPage /></PrivateRoute>}
        />
        {/* Redirección para rutas no válidas */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
