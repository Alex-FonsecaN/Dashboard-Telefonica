import './Painel.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPhoneSquare } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import socketClient from 'socket.io-client';

const serverURL = import.meta.env.VITE_SERVER_URL;

const Painel = () => {
    const [ramais, setRamais] = useState([]);
    const [showRamais, setShowRamais] = useState(false);
    const [userEmpresa, setUserEmpresa] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const callTimers = useRef({});

    const updateOrCreateRamal = (currentRamais, newRamalData, defaultFields = {}) => {
      const existingRamalIndex = currentRamais.findIndex(ramal => ramal.extension === newRamalData.extension);
      if (existingRamalIndex >= 0) {
        return currentRamais.map((ramal, index) => 
          index === existingRamalIndex ? { ...ramal, ...newRamalData } : ramal
        );
      } else {
        return [...currentRamais, { ...defaultFields, ...newRamalData }];
      }
    };
    const updateRamal = (currentRamais, ramalDataToUpdate) => {
      return currentRamais.map(ramal => {
        if (ramal.extension === ramalDataToUpdate.extension) {
          // Atualiza o ramal existente com os novos dados
          return { ...ramal, ...ramalDataToUpdate };
        }
        return ramal; // Retorna o ramal inalterado se não for o que estamos atualizando
      });
    };

    useEffect(() => {

        const socket = socketClient(serverURL);
    
        socket.on('connect', () => {
          console.log('Conectado ao servidor via socket');
        });
    
        // Conectar-se ao socket e ouvir o evento 'updateRamais'
        socket.on('updateRamais', (allEntries) => {
          setRamais(currentRamais => {
            return allEntries.reduce((updatedRamais, entry) => {
              const newRamalData = {
                extension: entry.ObjectName,
                ipAddress: entry.IPaddress,
                status: entry.Status,
                // Outros campos que você deseja atualizar
              };
              setShowRamais(true);
              return updateRamal(updatedRamais, newRamalData);
            }, currentRamais);
          });
        });


    socket.on('callStarted', (callData) => {
      
      const callId = callData.idCall;

      if (callTimers.current[callId]) {
        clearInterval(callTimers.current[callId]);
      }

      let ramalIdentifier;
      if(callData.subEvent === 'End')
      {
        const matches = callData.channel.match(/\/(\d+)-/);
        if(matches) {
          ramalIdentifier = matches[1];
        }
      }
      else{
        ramalIdentifier = callData.callerId;
      }
      
      console.log(ramalIdentifier);
      // Iniciar um novo temporizador
      callTimers.current[callId] = setInterval(() => {
        setRamais(ramais => ramais.map(ramal => {
          if (ramal.extension === ramalIdentifier) {
            return { ...ramal, CallTime: (ramal.CallTime || 0) + 1 };
          }
          return ramal;
        }));
      }, 1000);
    
      // Iniciar a contagem do tempo de chamada
      setRamais(currentRamais => currentRamais.map(ramal => {
        if (ramal.extension === ramalIdentifier) {
          return { ...ramal, CallTime: 0 };
        }
        return ramal;
      }));

    });
    
    socket.on('callEnded', (callData) => {
      const callId = callData.idCall;

      if (callTimers.current[callId]) {
        clearInterval(callTimers.current[callId]);
        delete callTimers.current[callId];
      }
    
      setRamais(currentRamais => currentRamais.map(ramal => {
        if (ramal.extension === callData.callerId) {
          return { ...ramal, CallTime: null };
        }
        return ramal;
      }));
    });

    const token = localStorage.getItem('')
        // Chama a rota /retrieveSipPeers ao carregar a página
        fetch(`${serverURL}/retrieveSipPeers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
  .then(response => {
    if(!response.ok)
      throw new Error('Falha na resposta do servidor: ' + response.statusText)

    return response.json()
  })
  .then(data => {
    if (!data.users || !Array.isArray(data.users)) {
      throw new Error("Formato inválido dos dados recebidos");
    }


    setUserEmpresa(data.systemUser.nomeEmpresa);
    console.log("Empresa da conta atual: " + data.systemUser.nomeEmpresa);


    setRamais(currentRamais => {
      return data.users.reduce((updatedRamais, userData) => {
        const currentTime = Date.now();
        const initialCallTime = userData.startTime ? Math.floor((currentTime - new Date(userData.startTime).getTime()) / 1000) : null;
        
        
        const ramalData = {
          extension: userData.extension,
          name: userData.name,
          callStatus: userData.callStatus || 'Desconhecido',
          startTime: userData.startTime || null,
          destination: userData.destination || 'Indisponível',
          CallTime: initialCallTime
        };
        if (initialCallTime !== null && !callTimers.current[userData.extension]) {
          callTimers.current[userData.extension] = setInterval(() => {
            setRamais(ramais => ramais.map(r => {
              if (r.extension === userData.extension) {
                return { ...r, CallTime: (r.CallTime || 0) + 1 };
              }
              return r;
            }));
          }, 1000);
        }

        return updateOrCreateRamal(updatedRamais, ramalData);
      }, currentRamais);
    });
  })
  .catch(error => console.error('Erro ao solicitar SIP Peers:', error));
    
  return () => {
    Object.values(callTimers.current).forEach(clearInterval);
    socket.disconnect();
  };
      }, []);


      const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    

  return (
    <div id="main-div-painel">
      
        <div id='painel-geral'>
            <h1>Painel PABX</h1>
            <div id="painel-ramais">
                     {!showRamais && <div id="loading-div">Carregando...</div>}
                <div id="grid-ramais">
                {showRamais && ramais.map((ramal, index) => (

                      <div key={index} onMouseLeave={() => setHoveredIndex(null)} className={`div-ramal ${ramal.status && ramal.status.includes("OK") ? 'div-ramal-ok' : 'div-ramal-not-ok'}`}>

                      <div className='ramal-info' onMouseEnter={() => setHoveredIndex(index)}>
                        <FontAwesomeIcon icon={faInfoCircle}/> 
                        </div>
                        {hoveredIndex === index &&
                         <div className='extra-info-div'> 
                         <span>{ramal.extension}: {ramal.name} ({ramal.ipAddress})</span>
                         </div>
                         }
                      <div className='ramal-activity'>
                        <span><b>{ramal.extension}: </b>{ramal.name}</span>
                        {ramal.CallTime !== null && (
                          <span className='span-timer'> Tempo de Chamada: {formatTime(ramal.CallTime)}</span>
                        )}
                      </div>
                      <div className='ramal-icon'><FontAwesomeIcon icon={faPhoneSquare}/></div>
                    </div>

                ))}

                </div>
                
                
            </div>
            
        </div>
    </div>
  );
};

export default Painel;
