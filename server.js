const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use('/static',
  express.static(process.env.STATIC_PATH || 'static')
);

module.exports = app;