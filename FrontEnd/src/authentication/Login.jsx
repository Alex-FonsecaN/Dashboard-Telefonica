import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios'
import { AuthContext } from '../contexts/AuthContext';

const serverURL = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarMe, setLembrarMe] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`${serverURL}/auth`, { email, senha, lembrarMe });
      localStorage.setItem('', data.token);
      authContext.updateAuthState(data.token, data.accountType); // Atualizar o estado do contexto

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Erro de login', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          <div id='lembrarMe-div'>
            <label id='lembrarMe-label' htmlFor="lembrarMe">Lembrar-me</label>
            <input type="checkbox" id="lembrarMe" name="lembrarMe" value={lembrarMe} onChange={(e) => setLembrarMe(e.target.value)} />
          </div>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};



export default Login;
