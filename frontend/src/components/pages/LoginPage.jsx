import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../Login.jsx';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    navigate('/'); // Redirecciona a la página principal o la que prefieras
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
        </div>
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
