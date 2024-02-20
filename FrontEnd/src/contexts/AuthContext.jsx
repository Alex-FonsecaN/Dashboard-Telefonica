// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    accountType: null // 'User' ou 'Admin'
  });
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    // Aqui você pode verificar o token e definir o estado inicial
    const token = localStorage.getItem('');
    const accountType = localStorage.getItem('');
    if (token) {
      setAuthState({ isAuthenticated: true, accountType });
    }

    setLoading(false);
  }, []);


  const updateAuthState = (token, accountType) => {
    setAuthState({ isAuthenticated: !!token, accountType });
  };

  const logout = () => {
    localStorage.removeItem('');
    localStorage.removeItem('');
    navigate('/login'); 
    setAuthState({ isAuthenticated: false, accountType: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, updateAuthState, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
