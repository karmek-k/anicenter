const express = require('express');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const app = express();

// Database
const db = require('./db');

// Middleware
app.use(express.json());
app.use('/static',
  express.static(process.env.STATIC_PATH || 'static')
);

module.exports = app;