const express = require('express');
const passport = require('passport');

const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();

// Database
require('./config/db');

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(process.env.STATIC_PATH || 'static'));
app.use(passport.initialize({}));
app.use(helmet());
app.use(compression());
app.use(fileUpload({}));

if (process.env.NODE_ENV.toLowerCase() === 'development') {
  app.use(morgan('dev'));
}

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/users', require('./routes/users'));
app.use('/files', require('./routes/files'));

module.exports = app;