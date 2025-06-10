import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './components/pages/LoginPage.jsx';
import RegisterPage from './components/pages/RegisterPage.jsx';
import UserDashboard from './components/pages/UserDashboard.jsx';
import AdminDashboard from './components/pages/AdminDashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Header from './components/Header.jsx';

const App = () => {
  const [auth, setAuth] = useState({ isAuthenticated: null, role: '' });

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token || !role) {
        setAuth({ isAuthenticated: false, role: '' });
        return;
      }

      try {
        await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuth({ isAuthenticated: true, role });
      } catch (error) {
        console.error('Error verificando el usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth({ isAuthenticated: false, role: '' });
      }
    };

    verifyToken();
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setAuth({ isAuthenticated: true, role });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth({ isAuthenticated: false, role: '' });
  };

  if (auth.isAuthenticated === null) return <p>Verificando sesión...</p>;

  return (
    <Router>
      <Header auth={auth} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/user-dashboard" element={
          <PrivateRoute auth={auth} requiredRole="user">
            <UserDashboard />
          </PrivateRoute>
        } />

        <Route path="/admin-dashboard" element={
          <PrivateRoute auth={auth} requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to={auth.role === 'admin' ? "/admin-dashboard" : "/user-dashboard"} />} />
      </Routes>
    </Router>
  );
};

export default App;
