const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Logging
app.use(morgan('dev'));

// MIDDLEWEARES
app.use(express.json());
app.use(cookieParser());

// routers
app.use('/', require('./router/userRouter'));

module.exports = app;
