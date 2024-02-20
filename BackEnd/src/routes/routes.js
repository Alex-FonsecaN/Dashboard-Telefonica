const express = require('express');
const {systemPool} = require('../config/db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const jwtSecret = process.env.JWT_LOGIN;




router.get('/enterprises', async (req, res) => {
  //Retorna a lista de todas as empresas
});


// Dentro do seu arquivo de rotas (por exemplo, routes.js)

router.post('/auth', async (req, res) => {
 //Realiza o login no sistema
});


const isUserAdmin = async (userEmail) => {
  // Verifica se o usuário é administrador
};

router.get('/user-data', async (req, res) => {
  //Pega as informações do usuário e invoca a função isUserAdmin
});


router.post('/registro', async (req, res) => {
  //Registra um novo usuário
});

  router.post('/registroEmpresa', async (req, res) => {
    // Registra uma nova empresa
  });

  // Dentro de seu arquivo de rotas (por exemplo, routes.js)

router.post('/deletarUsuario', async (req, res) => {
 //Deleta um usuário
});
router.post('/deletarEmpresa', async (req, res) => {
 //Deleta uma empresa
});
router.post('/registraRamais', async (req, res) => {
  //Registra um novo ramal ou vários no banco de dados, relacionado à uma empresa
});


module.exports = router;
