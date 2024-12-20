import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const token = localStorage.getItem('token');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? ( // Si hay un token en el localStorage, renderiza el componente
          children
        ) : ( // Si no hay token, redirige al login
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }, // Guarda la ubicación para redirigir después del login
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
