import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ auth, children }) => {
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default PrivateRoute;
