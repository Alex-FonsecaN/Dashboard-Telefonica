const AMIClient = require('asterisk-ami-client');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {systemPool} = require('../config/db');
const { all } = require('../routes/routes');

const jwtSecret = process.env.JWT_LOGIN;

let client = new AMIClient();
let allEntries = [];
let activeCalls = {};

async function connectAndSetUpListeners(io) {
  try {

    //Conecta ao AMI
    await client.connect(process.env.AMI_USER, process.env.AMI_PASSWORD, {
      host: process.env.AMI_HOST,
      port: process.env.AMI_PORT
    });

    client.on('PeerlistComplete', async (event) => {

     //Roda quando todos os registros de ramais forem retornados
    });

    client.on('Dial', event =>{

      //Roda ao receber ligações

    });
    client.on('Hangup', event => {
      //Roda ao encerrar ligações
    });

    console.log("Conectado ao AMI");


  } catch (error) {
    console.error('Erro ao conectar ou recuperar SIP Peers:', error);
    if(error.stack){
      console.error('Detalhes do erro: ',error.stack);
    }
    throw error;
  }
}

async function retrieveSipPeers(userEmail) {
  //Inicia o processo de coletar todos os registros de ramais do servidor
}

function convertTimeStamp(timeStamp){
  const date = new Date(timeStamp);
  return date.toLocaleString();
}


module.exports = {
  connectAndSetUpListeners,
  retrieveSipPeers,
  activeCalls
  
};
