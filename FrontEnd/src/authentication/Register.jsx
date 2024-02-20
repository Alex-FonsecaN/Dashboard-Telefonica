import { useState, useEffect } from 'react';
import style from './Register.module.css';
import { useNavigate } from 'react-router-dom';

const serverURL = import.meta.env.VITE_SERVER_URL;

const Register = () => {

  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {

    const fetchEmpresas = async () => {
      try {
        const response = await fetch(`${serverURL}/enterprises`);
        const data = await response.json();
        if (response.ok) {
          setEmpresas(data); // Armazena as empresas no estado
        } else {
          console.error('Falha ao buscar empresas:', data.message);
        }
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    };

    fetchEmpresas();
  }, [navigate]);


  const [successMessage, setSuccessMessage] = useState(''); // Novo estado para a mensagem de sucesso

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [enderecoEmpresa, setEnderecoEmpresa] = useState('');
  const [isSmallServer, setIsSmallServer] = useState(false);


  const handleRegisterEmpresa = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${serverURL}/registroEmpresa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeEmpresa, enderecoEmpresa, isSmallServer }),
      });
      const data = await response.json();
      if (response.ok) {
        //setSuccessMessage(`Email ${nomeEmpresa} registrada com sucesso!`); // Atualiza a mensagem de sucesso
        console.log('Empresa registrada com sucesso!', data);
      } else {
        console.error('Erro no registro:', data.message);
      }
    } catch (error) {
      console.error('Erro na solicitação:', error);
    }
  };

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeServidor, setNomeServidor] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${serverURL}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nome, senha, nomeServidor }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(`Email ${email} registrado com sucesso!`); // Atualiza a mensagem de sucesso
        console.log('Usuário registrado com sucesso!', data);
      } else {
        console.error('Erro no registro:', data.message);
      }
    } catch (error) {
      console.error('Erro na solicitação:', error);
    }
  };

  const [deleteEmail, setDeleteEmail] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${serverURL}/deletarUsuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: deleteEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setDeleteMessage(`Conta associada ao email ${deleteEmail} deletada com sucesso!`);
        setDeleteEmail(''); // Limpar o campo de email após a deleção
      } else {
        setDeleteMessage('Erro ao deletar a conta.');
      }
    } catch (error) {
      setDeleteMessage('Erro ao deletar a conta.');
    }
  };

  const [deleteEmpresa, setDeleteEmpresa] = useState('');
  const [deleteMessageEmpresa, setDeleteMessageEmpresa] = useState('');

  const handleDeleteEmpresa = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${serverURL}/deletarEmpresa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeEmpresa: deleteEmpresa }),
      });
      const data = await response.json();
      if (response.ok) {
        setDeleteMessageEmpresa(`Conta associada ao email ${deleteEmpresa} deletada com sucesso!`);
        setDeleteEmpresa(''); // Limpar o campo de email após a deleção
      } else {
        setDeleteMessage('Erro ao deletar a empresa.');
      }
    } catch (error) {
      setDeleteMessage('Erro ao deletar a empresa.');
    }
  };
  return (
    <>
    <div id={style.mainAdmin}>
      <h1 id={style.adminTitle}>Painel do administrador</h1>
      <div id={style.configContainers}>
        <div className={style.registerContainer}>
          <div className={style.registerForm}>
            <h1>Nova Conta</h1>
            <form onSubmit={handleRegister}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              <select value={nomeServidor} onChange={(e) => setNomeServidor(e.target.value)} required>
                <option value="">Selecione uma empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.nome}>{empresa.nome}</option>
                ))}
              </select>
              <button type="submit">Registrar</button>
            </form>
            {successMessage && <div className={style.successMessage}>{successMessage}</div>}
          </div>
          <div className={style.deleteAccountContainer}>
            <h1 style={{ color: 'red' }}>Deletar Conta</h1>
            <form onSubmit={handleDelete}>
              <input type="email" placeholder="Email" value={deleteEmail} onChange={(e) => setDeleteEmail(e.target.value)} required />
              <button type="submit">Deletar</button>
            </form>
            {deleteMessage && <div className={style.deleteMessage}>{deleteMessage}</div>}
          </div>

        </div>
        <div id={style.registerEnterprise}>
          <div className={style.registerForm}>
            <h1>Nova Empresa</h1>
            <form onSubmit={handleRegisterEmpresa}>
    <input type="text" placeholder="Nome Empresa" value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} required />
    <input 
        type="text" 
        placeholder="Endereço do Servidor" 
        value={enderecoEmpresa} 
        onChange={(e) => setEnderecoEmpresa(e.target.value)} 
    />
    <div>
        <input 
            type="checkbox" 
            id="smallServer" 
            checked={isSmallServer}
            onChange={(e) => setIsSmallServer(e.target.checked)} 
        />
        <label htmlFor="smallServer">Servidor Small</label>
    </div>
    <button type="submit">Registrar Empresa</button>
</form>
          </div>
          <div className={style.deleteAccountContainer}>
            <h1 style={{ color: 'red' }}>Deletar Empresa</h1>
            <form onSubmit={handleDeleteEmpresa}>
              <input type="text" placeholder="Nome da Empresa" value={deleteEmpresa} onChange={(e) => setDeleteEmpresa(e.target.value)} required />
              <button type="submit">Deletar</button>
            </form>
            {deleteMessageEmpresa && <div className={deleteMessage}>{deleteMessageEmpresa}</div>}
        </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default Register;
