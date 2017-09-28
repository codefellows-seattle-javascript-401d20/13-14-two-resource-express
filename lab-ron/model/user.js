'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: true },
  fullname: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  city: { type: String },
  state: { type: String },
  about: { type: String, require: false },
  timestamp: { type: Date, default: () => new Date() },
});


module.exports = mongoose.model('user', userSchema);