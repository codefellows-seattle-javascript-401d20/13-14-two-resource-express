'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

//connect to database
mongoose.Promise = Promise;

// express is a factory function
const app = express();
let isOn = false;
let http = null;

// register appwide middleware
app.use(cors({ origin: process.env.ORIGIN_URL })); // browser request support
app.use(morgan('dev')); // logger middleware

// register resource routes
app.use(require('../route/book-router.js'));

// register a 404 route
app.all('*', (req, res) => res.sendStatus(404));

// error middleware
app.use(require('./error-middleware.js'));

// export interface
module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(isOn)
        return reject(new Error('__SERVER_ERROR__ server is already on'));
      http = app.listen(process.env.PORT, () => {
        isOn = true;
        console.log('__SERVER_ON__', process.env.PORT);
        resolve();
      });
    })
    .then(() => {
      return mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
    });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(!isOn)
        return reject(new Error('__SERVER_ERROR__ server is already off'));
      if(!http)
        return reject(new Error('__SERVER_ERROR__ server does not exist'));
      http.close(() => {
        isOn = false;
        http = null;
        console.log('__SERVER_OFF__');
        resolve();
      });
    })
    .then(() => mongoose.disconnect());
  },
};
