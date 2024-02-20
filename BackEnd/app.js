const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const routes = require('./src/routes/routes');
const cdrRoutes = require('./src/routes/cdrRoutes');
const ramaisRoutes = require('./src/routes/ramaisRoutes');
const logsRoutes = require('./src/routes/logsRoutes');
const dotenv = require('dotenv').config();


const app = express();



// Middlewares
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/', routes);
app.use('/table', cdrRoutes);
app.use('/admin', ramaisRoutes);
app.use('/dashboard', logsRoutes);

// Exportando o app para ser utilizado pelo server.js
module.exports = app;
