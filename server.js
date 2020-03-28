const express = require('express');
const passport = require('passport');

const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Database
require('./db');

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use('/static',
  express.static(process.env.STATIC_PATH || 'static')
);
app.use(passport.initialize());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/users', require('./routes/users'));

module.exports = app;