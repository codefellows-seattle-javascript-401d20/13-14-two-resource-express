'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const app = express();
let isOn = false;
let http = null;

app.use(cors({ origin: process.env.ORIGIN_URL }));
app.use(morgan('dev'));

app.use(require('../route/sandwich-router.js'));
app.use(require('../route/menu-router.js'));

app.all('*', (req, res) => res.sendStatus(404));
app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (isOn)
        return reject(new Error('::SERVER_ERROR:: server is allready on'));
      http = app.listen(process.env.PORT, () => {
        isOn = true;
        console.log('::SERVER_ON::', process.env.PORT);
        resolve();
      });
    })
    .then(() => {
      return mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
    });
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if (!isOn)
        return reject(new Error('::SERVER_ERROR:: server is allready off'));
      if (!http)
        return reject(new Error('::SERVER_ERROR:: server does not exist'));
      http.close(() => {
        isOn = false;
        http = null;
        console.log('::SERVER_OFF::');
        resolve();
      });
    })
    .then(() => mongoose.disconnect());
  }
}
