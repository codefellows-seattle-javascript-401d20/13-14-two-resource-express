'use strict';

// cross-site origin resource scripting
// Access-Control-Allow-Origin: http://codefellows.com
// Access-Control-Allow-Headers: X-Slugram-Token, Content-Type
// Access-Control-Allow-Credentials: Cookies
// Access-Control-Allow-Methods: HEAD, PUT
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

//tell mongoose to support promises
mongoose.Promise = Promise;

// express is a factory function
const app = express();
let server = null;

// register appwide middleware
app.use(cors({ origin: process.env.ORIGIN_URL })); // browser request support
app.use(morgan('dev')); // logger middleware

// register resource routes
app.use(require('../route/book-router.js'));
app.use(require('../route/review-router.js'));

// register a 404 route
app.all('*', (req, res) => res.sendStatus(404));

// error middleware
app.use(require('./error-middleware.js'));

// export interface
module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(server)
        return reject(new Error('__SERVER_ERROR__ server is already on'));
      server = app.listen(process.env.PORT, () => {
        console.log('__SERVER_ON__', process.env.PORT);
        resolve();
      });
    })
    .then(() => mongoose.connect(process.env.MONGODB_URI));
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!server)
        return reject(new Error('__SERVER_ERROR__ server is already off'));
      server.close(() => {
        server = null;
        console.log('__SERVER_OFF__');
        resolve();
      });
    })
    .then(() => mongoose.disconnect());
  },
};
