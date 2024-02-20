const express = require('express');
const router = express.Router();
const {systemPool} = require('../config/db');
const path = require('path');
const jwt = require('jsonwebtoken');
const {NodeSSH} = require('node-ssh');
ssh = new NodeSSH();
require('dotenv').config();
const jwtSecret = process.env.JWT_LOGIN
// Importações adicionais (SSH, etc.)

router.get('/', async (req, res) => {
   
   //Gera a lista de empresas

});
router.get('/deletarRamal', async (req, res) => {
   //Deleta um ramal em especifico do banco de dados (Esses ramais não são os do asterisk, são do próprio sistema, ficam no banco de dados para filtrar os ramais das empresas)
});





module.exports = router;
