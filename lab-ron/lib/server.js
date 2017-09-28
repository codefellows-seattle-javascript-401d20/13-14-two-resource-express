'use strict';

// required dependencies
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

// connect to DB
mongoose.Promise = Promise;

const app = express();
let isOn = false;
let http = null;

// register middleware

app.use(cors({ origin: process.env.CORS_ORIGIN })); // for browser request support
app.use(morgan('dev')); // morgan logger 

// routes
app.all('*', (req, res) => res.sendStatus(404));

// export interface

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (isOn)
        return reject(new Error('SERVER ERROR: server already running'));
      http = app.listen(process.env.PORT, () => {
        isOn = true;
        console.log('SERVER RUNNING ON', process.env.PORT);
        resolve();
      });
    })

      .then(() => {
        return mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
      });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if (!isOn)
        return reject(new Error('SERVER ERROR: server already off'));
      if (!http)
        return reject(new Error('SERVER ERROR: server does not exist'));
      http.close(() => {
        isOn = false;
        http = null;
        console.log('SERVER OFF');
        resolve();
      });
    })
      .then(() => mongoose.disconnect());

  },
};
