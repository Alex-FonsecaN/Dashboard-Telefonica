import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './authentication/Login';
import App from './App';
import { AuthContext } from './contexts/AuthContext';

const isAuthenticated = () => {
    const isAuth = !!localStorage.getItem('');
    console.log('Authenticated: ', isAuth);
    return isAuth;
};

const MainComponent = () => {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={isAuthenticated() ? <App /> : <App />} />
            </Routes>

    );
};

export default MainComponent;
