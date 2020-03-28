const express = require('express');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Database
require('./db');

// Middleware
app.use(express.json());
app.use('/static',
  express.static(process.env.STATIC_PATH || 'static')
);
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/users', require('./routes/users'));

module.exports = app;