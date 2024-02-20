import {Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPhone, faSolarPanel, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import "./SideBar.css"


function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <div 
        id="sidebar" 
        className={isExpanded ? 'expanded' : 'collapsed'}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <Link to='/' id="sidebar-title"><FontAwesomeIcon icon={faPhone}/> Pabx</Link>
        {isExpanded ? (
          <>
            {/* Renderização dos links com texto */}
            <Link to="/painel">Painel de Ramal</Link>
            <Link to="/cdr">Registros de gravações</Link>
          </>
        ) : (
          <>
            {/* Renderização dos links somente com ícones */}
            <Link to="/painel"><FontAwesomeIcon icon={faSolarPanel} /></Link>
            <Link to="/cdr"><FontAwesomeIcon icon={faPhoneVolume} /></Link>
          </>
        )}
      </div>
    </>
  );
}


export default SideBar;
