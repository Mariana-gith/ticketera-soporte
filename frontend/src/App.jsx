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
        <Route path="/" element={<Navigate to={auth.isAuthenticated ? '/dashboard' : '/login'} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tickets" element={<PrivateRoute auth={auth}><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute auth={auth}><TicketPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
