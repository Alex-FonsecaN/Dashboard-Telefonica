import {useState, useEffect, useCallback} from 'react';
import './CDRTable.css';
import {faCaretRight, faForwardStep, faCaretLeft, faBackwardStep, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const filtroOptions = ['Origem', 'Destino', 'Duração'];
const serverURL = import.meta.env.VITE_SERVER_URL;

const CDRTable = () => {
  const [cdrData, setCdrData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);
  const [hasMoreRecords, setHasMoreRecords] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filtros, setFiltros] = useState([]);
  const token = localStorage.getItem('');
      const headers = new Headers({
        'Authorization': `Bearer ${token}` // Adicionar o token ao cabeçalho de autorização
      });



  const fetchCDRData = useCallback(async (pageNumber) => {
    const offset = (pageNumber - 1) * recordsPerPage;

    let queryString = `startDate=${startDate}&endDate=${endDate}&limit=${recordsPerPage}&offset=${offset}`;

    

    filtros.forEach(filtro => {
      if (filtro.tipo && filtro.valor) {
        queryString += `&${filtro.tipo}=${encodeURIComponent(filtro.valor)}`;
      }
    });

    
    try {
      const response = await fetch(`${serverURL}/table?${queryString}`, {headers});
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCdrData(data);
      setHasMoreRecords(data.length === recordsPerPage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [startDate, endDate, recordsPerPage, filtros]);

  useEffect(() => {
    fetchCDRData(currentPage);
  }, [currentPage, fetchCDRData]);


  
  const [contagemFiltros, setContagemFiltros] = useState(0);

  //MÉTODOS DE FILTRAGEM
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setCurrentPage(1); // Volta para a primeira página quando a data de início é alterada
    fetchCDRData(1);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setCurrentPage(1); // Volta para a primeira página quando a data de fim é alterada
    fetchCDRData(1);
  };

  const adicionarFiltro = () => {
    setFiltros([...filtros, { tipo: '', valor: '' }]);
    setContagemFiltros( contagemFiltros+ 1);


  };
  const removerFiltro = index => {
    const novosFiltros = [...filtros.slice(0, index), ...filtros.slice(index + 1)];
    setFiltros(novosFiltros);
    setContagemFiltros( contagemFiltros - 1);

  };
  const atualizarFiltro = (index, campo, valor) => {
    const novosFiltros = [...filtros];
    novosFiltros[index][campo] = valor;
    setFiltros(novosFiltros);
  };
  const opcoesDisponiveis = (filtroAtual) => {
    return filtroOptions.filter(opcao => 
      !filtros.find(filtro => filtro.tipo === opcao) || filtroAtual === opcao
    );
  };

  //MÉTODOS DE PAGINAÇÃO
  const handleNextPage = () => {
    if (hasMoreRecords) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1 > 0 ? currentPage - 1 : 1);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  }
  const goToLastPage = async () => {

    let totalRecords = 0;
    let queryString = `startDate=${startDate}&endDate=${endDate}`;

    filtros.forEach(filtro => {
      if (filtro.tipo && filtro.valor) {
        queryString += `&${filtro.tipo}=${encodeURIComponent(filtro.valor)}`;
      }
    });

    console.log(queryString);

    try {
      const response = await fetch(`${serverURL}/table/Registros?${queryString}`, {headers});
        totalRecords = await response.json();
        const lastPage = Math.ceil(totalRecords / recordsPerPage);
        setCurrentPage(lastPage);
    } catch (error) {
        console.error('Error fetching total records:', error);
    }
  }

  const formatDate = (dateString) => {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(dateString).toLocaleDateString('pt-BR',options);
  }
  const formatHour = (dateString) => {
    const options = {hour: 'numeric', minute: '2-digit', second: '2-digit'};
    return new Date(dateString).toLocaleTimeString('pt-BR',options);
  }
  const handleDownloadClick = (filename, event) => {
    event.preventDefault(); // Prevenir o comportamento padrão do link
    if (filename) {
      const downloadUrl = `${serverURL}/cdr/baixar/${encodeURIComponent(filename)}`;
      window.location.href = downloadUrl; // Navegar programaticamente para a URL
    } else {
      alert("Sem arquivo para download");
    }
  };
  const renderTable = () => {
    return (
      <table id="data-table">
        <thead>
          <tr>
            <th><span>Data</span></th>
            <th><span>Hora</span></th>
            <th><span>Origem</span></th>
            <th><span>Destino</span></th>
            <th><span>Duração</span></th>
            <th><span>Status</span></th>
            <th><span>Gravação</span></th>
          </tr>
        </thead>
        <tbody>
          {cdrData.map((row, index) => (
            <tr key={index}>
              <td><span>{formatDate(row.calldate)}</span></td>
              <td><span>{formatHour(row.calldate)}</span></td>
              <td><span>{row.src}</span></td>
              <td><span>{row.dst}</span></td>
              <td><span>{row.duration}</span></td>
              <td><span>{row.disposition}</span></td>
              {row.recordingfile === '' ? (
                <td><span style={{color:'red'}} >Sem arquivo para download</span></td>
                ) : (
                <td><a onClick={(e) => handleDownloadClick(row.recordingfile, e)} href='#'>download</a></td>
               )}
              
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <div>
        <label className='date-label' htmlFor="start-date">Data de Início:</label>
        <input id="start-date" type="date" value={startDate} onChange={handleStartDateChange} />

        <label className='date-label' htmlFor="end-date">Data de Fim:</label>
        <input id="end-date" type="date" value={endDate} onChange={handleEndDateChange} />
        <br />

        {filtros.map((filtro, index) => (
        <div key={index}>
          <select
            value={filtro.tipo}
            onChange={e => atualizarFiltro(index, 'tipo', e.target.value)}
          >
            <option value="">Selecione um Filtro</option>
            {opcoesDisponiveis(filtro.tipo).map(opcao => (
              <option key={opcao} value={opcao}>{opcao}</option>
            ))}
          </select>
          <input
            type="text"
            value={filtro.valor}
            onChange={e => atualizarFiltro(index, 'valor', e.target.value)}
          />
          <button className='btn-delete-filter' onClick={() => removerFiltro(index)} ><FontAwesomeIcon icon={faTrash}/></button>
        </div>
      ))}
        
        <div id="add-filter-div">
          <label>Adicionar Filtro</label>
          <button className="btn-handle-filter" onClick={adicionarFiltro} disabled={contagemFiltros >= 3} ><FontAwesomeIcon icon={faPlus}/></button>
        </div>


      </div>
      {cdrData.length > 0 ? renderTable() : <p>Loading data...</p>}
      <div>
        
        <button className='btn-pagina' onClick={goToFirstPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faBackwardStep} /></button>
        <button className='btn-pagina' onClick={handlePreviousPage} disabled={currentPage === 1}><FontAwesomeIcon icon={faCaretLeft} /></button>
        <span>Página {currentPage}</span>
        <button className='btn-pagina' onClick={handleNextPage} disabled={!hasMoreRecords}><FontAwesomeIcon icon={faCaretRight} /></button>
        <button className='btn-pagina' onClick={goToLastPage} disabled={!hasMoreRecords}><FontAwesomeIcon icon={faForwardStep} /></button>
      </div>
    </div>
  );
}

export default CDRTable;
