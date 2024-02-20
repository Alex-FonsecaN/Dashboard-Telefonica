import { useState, useEffect } from 'react';
import './RegistroRamal2.css';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL;

const RegistroRamal2 = () => {
    const [empresas, setEmpresas] = useState([]);
    const [message, setMessage] = useState({}); 
    const [filtro, setFiltro] = useState('');
    const [filtroRamais, setFiltroRamais] = useState({});


  
    useEffect(() => {
      const fetchEmpresas = async () => {
        try {
          const response = await axios.get(`${serverURL}/admin`);
          const empresasComRamais = response.data.map(empresa => ({
            ...empresa,
            ramaisInput: [''],
            error: '' // Adiciona um campo para erros de validação por empresa
          }));
          setEmpresas(empresasComRamais);
        } catch (error) {
          console.error('Erro ao buscar empresas:', error);
        }
      };
  
      fetchEmpresas();
    }, []);

    const handleAddRamal = (empresaId) => {
        // Simplesmente adiciona um novo campo sem verificar por duplicatas
        setEmpresas(empresas.map(empresa => {
            if (empresa.id === empresaId) {
                return { ...empresa, ramaisInput: [...empresa.ramaisInput, ''], error: '' }; // Limpa qualquer mensagem de erro anterior
            }
            return empresa;
        }));
    };

    const handleRemoveRamal = (empresaId) => {
        // Atualiza o estado para remover o último campo de ramal da empresa específica
        setEmpresas(empresas.map(empresa => {
            if (empresa.id === empresaId && empresa.ramaisInput.length > 1) {
                return { ...empresa, ramaisInput: empresa.ramaisInput.slice(0, -1) };
            }
            return empresa;
        }));
    };

    const handleRamalChange = (empresaId, index, value) => {
        setEmpresas(empresas.map(empresa =>
          empresa.id === empresaId ? {...empresa, ramaisInput: empresa.ramaisInput.map((ramal, i) => i === index ? value : ramal), error: ''} : empresa
        ));
    };

    const handleRegisterRamal = async (e, empresaId) => { 
        e.preventDefault();
        const empresa = empresas.find(emp => emp.id === empresaId);
        // Filtra espaços vazios e remove duplicatas no input atual antes de verificar com os já salvos
        const ramaisInputFiltrados = empresa.ramaisInput.filter(ramal => ramal.trim() !== '');
        const ramaisUnicos = [...new Set(ramaisInputFiltrados)];
    
        // Verifica duplicidade apenas com ramais não vazios
        const ramaisExistentes = empresa.ramais.split(',').filter(ramal => ramal.trim() !== '');
        const ramalDuplicado = ramaisUnicos.some(ramal => ramaisExistentes.includes(ramal));
        
        if (ramalDuplicado) {
            // Atualiza a mensagem de erro para esta empresa específica indicando duplicidade
            setMessage(prev => ({ ...prev, [empresaId]: 'Um ou mais ramais já existem na empresa.' }));
            return;
        }
    
        try {
            const dadosParaEnviar = {
                nomeEmpresa: empresa.nome,
                ramais: ramaisUnicos
            };
            const resposta = await axios.post(`${serverURL}/registraRamais`, dadosParaEnviar, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
    
            if (resposta.status === 200) {
                // Atualiza a mensagem de sucesso
                setMessage(prev => ({ ...prev, [empresaId]: 'Ramais adicionados com sucesso!' }));
                // Limpa os inputs e a mensagem de erro após o sucesso
                setEmpresas(empresas.map(emp => 
                    emp.id === empresaId ? { ...emp, ramaisInput: [''], error: '' } : emp
                ));
            }
        } catch (error) {
            // Atualiza a mensagem de erro no caso de falha na requisição
            setMessage(prev => ({ ...prev, [empresaId]: 'Erro ao adicionar ramais.' }));
        }
    };

    const handleDeleteRamal = async (nomeEmpresa, ramal) => {
        try {
            const response = await axios.get(`${serverURL}/admin/deletarRamal`, {
                headers: {
                    nomeempresa: nomeEmpresa,
                    ramal: ramal
                }
            });
            if (response.status === 200) {
                // Atualize o estado das empresas para refletir a remoção do ramal
                setEmpresas(empresas.map(empresa => {
                    if (empresa.nome === nomeEmpresa) {
                        return {
                            ...empresa,
                            ramais: empresa.ramais.split(',').filter(r => r !== ramal).join(',')
                        };
                    }
                    return empresa;
                }));
                //alert('Ramal deletado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao deletar ramal:', error);
            alert('Erro ao deletar ramal.');
        }
    };
  
    return (
        <>
            <div id="main-ramais">
            <input id='filter-input'
                type='text' 
                placeholder='Pesquisa por empresa'
                onChange={(e) => setFiltro(e.target.value)}
            />

                {empresas.filter(empresa => empresa.nome.toLowerCase().includes(filtro.toLowerCase())).map((empresa) => (
                    <div className='empresa-container' key={empresa.id}>
                        <div className='empresa-navbar'>
                            <div className='empresa-title'><h2>{empresa.nome}</h2></div>
                            <div className='ramais-filters'>
                            <input
                                type='number'
                                placeholder='Pesquisar ramais'
                                onChange={(e) => setFiltroRamais({...filtroRamais, [empresa.id]: e.target.value})}
                            />

                            </div>
                        </div>
                        <div className='empresa-bottom'>
                            <div className='empresa-sidebar'>
                                <div className="register-form">
                                    <h1>Novos Ramais</h1>
                                    <form onSubmit={(e) => handleRegisterRamal(e, empresa.id)}>
                                        <div className='ramais-container'>
                                            {empresa.ramaisInput.map((ramal, index) => (
                                                <input 
                                                    key={index}
                                                    type="text" 
                                                    placeholder="Ramal" 
                                                    value={ramal} 
                                                    onChange={(e) => handleRamalChange(empresa.id, index, e.target.value)} 
                                                    required
                                                />
                                            ))}
                                            {empresa.ramaisInput.length > 1 && (
                                                <button type="button" className='btn-delete' onClick={() => handleRemoveRamal(empresa.id)}>
                                                    <FontAwesomeIcon icon={faMinus}/>
                                                </button>
                                            )}
                                            <button type="button" className='btn-add' onClick={() => handleAddRamal(empresa.id, '')}>
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </button>
                                        </div>
                                        <button className='btn-add-ramais' type="submit">Adicionar Ramais</button>
                                        {message[empresa.id] && <div className="success-message">{message[empresa.id]}</div>}
                                    </form>
                                </div>
                            </div>
                            <div className='empresa-ramais-parent'>
                                <div className='empresa-ramais'>
                                {empresa.ramais && empresa.ramais.split(',')
                                    .filter(ramal => !filtroRamais[empresa.id] || ramal.includes(filtroRamais[empresa.id]))
                                    .sort((a, b) => a - b)
                                    .map((ramal, index) => (
                                        <div className='ramal-numero' key={index}>
                                            <span>{ramal} </span>
                                            <button onClick={() => handleDeleteRamal(empresa.nome, ramal)} className='btn-trash'>
                                                <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                        </div>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default RegistroRamal2;
