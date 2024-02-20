//import React from 'react';
import "./NavigationBar.css"
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from 'axios';
import  {useState, useEffect} from 'react';


const apiURL = import.meta.env.VITE_SERVER_URL;

const NavigationBar = () => {
  const {logout} = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('');
    axios.get(`${apiURL}/user-data`, { 
      headers: { Authorization: `Bearer ${token}` } 
  }).then(response => {
            setIsAdmin(response.data.isAdmin);
            setUsername(response.data.userName);
        }).catch(error => {
            console.error('Erro ao verificar status de administrador', error);
        });
}, []);


  const navigate = useNavigate();
  const [selection, setSelection] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    setSelection(value);
    navigate(value); 
  };


  return (
    <>
        <nav>
            <div id="nav-left" className="nav-divs">
                <Link to='/'>{username}</Link>

            </div>
            {console.log(isAdmin)}
            {isAdmin && (
              <div id="nav-middle" className="nav-divs">
              <span><FontAwesomeIcon icon={faUser} />Admin: </span>
              <select onChange={handleChange} value={selection}>
                <option value="/">Selecione...</option>
                <option value="/register">Registro</option>
                <option value="/ramalRegister">Cadastro Ramais</option>
              </select>
            </div>
            )}

            <div id="nav-right" className="nav-divs">
            <button id="btn-logout" onClick={logout}>Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>
            </div>
        </nav>
    </>
  );
}



export default NavigationBar;
