const AmiClient = require('asterisk-ami-client');
const app = require('../../app'); // Importa a configuração do Express de app.js
const {systemPool, asteriskPoolBase, asteriskPool} = require('../config/db');
//const {coonectAndRetrievePeers, getSipPeers} = require('./asteriskAmiService')
require('dotenv').config();
const amiService = require('./asteriskAmiService');
const { stringify, parse } = require('flatted');
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = ['http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"]
  }
});

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_LOGIN;

const port = process.env.PORT;
const host = process.env.SERVER_HOST;


amiService.connectAndSetUpListeners(io);


io.on('connection', (socket) => {
 //Conecta ao socket.io
  
});


server.listen(port, () => {
  console.log(`Servidor rodando em ${host}${port}`);
  //amiService.connectAndRetrievePeers(io)
});

app.get('/retrieveSipPeers', async (req, res) => {
 //Faz muita coisa, roda a função do asterisk de ver registros, coleta dados do banco de dados do asterisk,
 //tudo para retornar ao front-end e unir as informações para ter um painel muito informativo
});




process.on('SIGINT', () => {
  // Fecha a conexão do pool do banco de dados asterisk
  asteriskPool.end(err => {
    if (err) {
      console.error('Erro ao fechar a conexão com o banco de dados Asterisk:', err);
    } else {
      console.log('Conexão com o banco de dados Asterisk fechada');
    }
  });

  // Fecha a conexão do pool do banco de dados system
  systemPool.end(err => {
    if (err) {
      console.error('Erro ao fechar a conexão com o banco de dados System:', err);
    } else {
      console.log('Conexão com o banco de dados System fechada');
    }
  });

  process.exit(0);
});