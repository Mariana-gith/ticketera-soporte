import React from 'react';
import LoginForm from '../Login.jsx';

const LoginPage = ({ onLogin }) => {
  const handleLoginSuccess = (token, role) => {
    onLogin(token, role);
  };

  return <LoginForm onLogin={handleLoginSuccess} />;
};

export default LoginPage;


