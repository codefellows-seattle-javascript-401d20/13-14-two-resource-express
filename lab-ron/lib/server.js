'use strict';

// required dependencies
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

// connect to DB
mongoose.Promise = Promise;

const app = express();
let server = null;

// register middleware

app.use(cors({ origin: process.env.CORS_ORIGIN })); // for browser request support
app.use(morgan('dev')); // morgan logger 

// routes
app.use(require('../route/user-route.js'));
app.use(require('../route/blog-route.js'));
// 404s
app.all('*', (req, res) => res.sendStatus(404));
// error
app.use(require('./error-middleware'));

// export interface
module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (server)
        return reject(new Error('SERVER ERROR: server already running'));
      server = app.listen(process.env.PORT, () => {
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
      if (!server)
        return reject(new Error('SERVER ERROR: server already off'));
      server.close(() => {
        server = null;
        console.log('SERVER OFF');
        resolve();
      });
    })
      .then(() => mongoose.disconnect());
  },
};
