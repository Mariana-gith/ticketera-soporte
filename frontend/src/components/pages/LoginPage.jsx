import React from 'react';
import LoginForm from '../Login.jsx';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
};

export default LoginPage;