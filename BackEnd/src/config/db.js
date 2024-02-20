const mysql = require('mysql2/promise');
require('dotenv').config();

//Configura as pools de conexão com o banco de dados
const User = "";
const Pass = "";

const HostAsterisk = process.env.AMI_HOST
const dbNameAsterisk = "";
const dbNameAsteriskBase = ""

const HostSystem = process.env.DB_HOST;
const dbNameSystem = ""

const asteriskPool = mysql.createPool({
    host: HostAsterisk,
    user: User,
    password: Pass,
    database: dbNameAsterisk
});
const asteriskPoolBase = mysql.createPool({
    host: HostAsterisk,
    user: User,
    password: Pass,
    database: dbNameAsteriskBase
});

const systemPool = mysql.createPool({
    host: HostSystem,
    user: User,
    password: Pass,
    database: dbNameSystem
});


module.exports = {asteriskPool, systemPool, asteriskPoolBase};