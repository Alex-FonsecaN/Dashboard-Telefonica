//import React from 'react';
import CDRTable from './Pages/CDRTable';
import Index from './Pages/Index';
import NavigationBar from './navigation/NavigationBar';
import SideBar from './navigation/SideBar';
import Register from './authentication/Register';
import RegistroRamal2 from './Pages/RegistroRamal2';
import Painel from './Pages/Painel';
import { Routes, Route } from 'react-router-dom';
import "./App.css"
import PrivateRoute from './authentication/PrivateRoute'



function App() {

  return (
    <>
        <NavigationBar/>
        <div id="main">
          <SideBar />
          <div id="main-child">
            <Routes>

              {/*Navigation bar routes*/}
              <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>}></Route>
              <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>}></Route>
              <Route path="/ramalRegister" element={<PrivateRoute><RegistroRamal2 /></PrivateRoute>}></Route>

              {/*Side bar routes*/}
              <Route path="/cdr" element={<PrivateRoute><CDRTable /></PrivateRoute>}></Route>
              <Route path="/painel" element={<PrivateRoute><Painel /></PrivateRoute>}></Route>
            </Routes>
          </div>
        </div>
    </>
  );
}

export default App;
