const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {systemPool, asteriskPoolBase, asteriskPool} = require('../config/db');
const amiService = require('../services/asteriskAmiService');
require('dotenv').config();
const jwtSecret = process.env.JWT_LOGIN;

router.get('/infosPabx', async (req, res) => {
   //Rota em desenvolvimento
});



module.exports = router;