import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ auth, children, roleRequired }) => {
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (roleRequired && auth.role !== roleRequired) {
    return <Navigate to="/dashboard" />; // Redirección para usuarios con roles no permitidos
  }
  return children;
};

export default PrivateRoute;
