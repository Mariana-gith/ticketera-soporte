import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage.jsx';
import RegisterPage from './components/pages/RegisterPage.jsx';
import Dashboard from './components/pages/DashboardPage.jsx';
import TicketPage from './components/pages/TicketPage.jsx';

const App = () => {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: '' });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={setAuth} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            auth.isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/tickets"
          element={
            auth.isAuthenticated ? <TicketPage /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
