import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';




const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('');
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // tempo atual em segundos

      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
      } else {
        // Token expirado, limpe o token do localStorage
        localStorage.removeItem('');
      }
    } catch (error) {
      // Se houver um erro na decodificação, considere o token inválido
      localStorage.removeItem('');
    }
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
