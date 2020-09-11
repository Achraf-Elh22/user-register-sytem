const express = require('express');
const morgan = require('morgan');

const app = express();

// Logging
app.use(morgan('dev'));

// routers
app.use('/', require('./router/userRouter'));

module.exports = app;
