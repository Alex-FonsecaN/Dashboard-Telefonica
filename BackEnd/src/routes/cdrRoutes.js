const express = require('express');
const router = express.Router();
const {asteriskPool, systemPool, asteriskPoolBase} = require('../config/db');
const path = require('path');
const jwt = require('jsonwebtoken');
const {NodeSSH} = require('node-ssh');
ssh = new NodeSSH();
require('dotenv').config();
const jwtSecret = process.env.JWT_LOGIN
// Importações adicionais (SSH, etc.)

router.get('/', async (req, res) => {
    //Retorna os registros de ligação do asterisk com filtros
});


router.get('/Registros', async (req, res) => {
    //Mesma coisa que a rota / mas retorna o total de registros para que seja feito o controle de páginas
});


router.get('/baixar/:filepath', async (req, res) => {
    //Faz o download dos arquivos de gravação das chamadas
});



module.exports = router;
